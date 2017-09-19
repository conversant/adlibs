/** @module reportData */

'use strict';

var measurePerformance = require('./measurePerformance'),
        canHas = require('./canHas'),
        has = canHas.has,
        forIn = canHas.forIn,
        browser = require('./detect/browser'),
        parse = require('./url/parse');

/*
 * Safari can't use tracking pixels on unload, but xhr is said to work. Caveat is it's a sync call so it hangs the browser a split second.
 * @param {String} trackURL
 * @returns {String}
 */
var xhrTrack = function (trackURL) {
    var xhr = new XMLHttpRequest({timeout: 500});
    xhr.open('GET', trackURL, false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState >= has('OPENED', xhr)) {
            xhr.abort();
        }
    };
    try {
        xhr.send();
    } catch (e) {
    }
    return trackURL;
};

/*
 * This method makes a call to a url but does not actually draw a pixel to a page in any way.
 * The image will be cleaned up by the browser easily because it's not referenced again past this point.
 * @param {String} trackURL
 * returns {String}
 */
var imgTrack = function (trackURL) {
    new Image().src = trackURL;
    return trackURL;
};

/*
 * Iterate over an object literal's properties and convert those to a string to be appended to a url
 * @param params {Object} key/value pairs to convert into a query string
 * @returns {String}
 */
var objectToQueryString = function (params) {
    var paramList = [];

    forIn(params, function (name, value) {
        paramList.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
    });

    return paramList.join('&');
};

/**
 * Prepare the URL supplied for query string params to be added to it without doing too much.
 * @private
 * @param {String} url
 * @returns {String}
 */
var prepareURL = function (url) {
    if (/\?/.test(url)) {
        if (url.charAt(url.length - 1) !== '&') {
            url += '&';
        }
    } else {
        url += '?';
    }
    return url;
};

/**
 * Utility function to determine if sendBeacon is natively supprted
 * @returns {Boolean}
 */
var isSendBeaconAvailable = function() {
    return typeof window.navigator === 'object' && typeof window.navigator.sendBeacon === 'function';
};

/**
 * Sends data utilizing sendBeacon if selected and available
 * @param {String} [url]
 * @param {Boolean} [isUnloadEvent]
 * @param {String} [sendBeaconJsonString] Json formated string of data to send
 * @returns {*}
 */
var sendReport = function (url, isUnloadEvent, sendBeaconJsonString) {
    if (typeof sendBeaconJsonString === 'string' && isSendBeaconAvailable()) {
        window.navigator.sendBeacon(url, sendBeaconJsonString);
    }
    else {
        if (isUnloadEvent && browser.detect().name === 'Safari') {
            xhrTrack(url);
        } else {
            imgTrack(url);
        }
    }

    return url;
};

/*
 * Adding registry objects for managing instances between modules in a safely package scoped way.
 */
var instanceRegistry = {};

var ReportData;

var reportDataFactory = function (baseURL, measurePerformanceInstance) {
    var mp = measurePerformanceInstance || measurePerformance.factory();
    return new ReportData(baseURL, mp);
};


var reportDataProvider = function (packageName) {
    if (!instanceRegistry[packageName]) {
        instanceRegistry[packageName] = new ReportData(null, measurePerformance.provider(packageName));
    }
    return instanceRegistry[packageName];
};

/**
 * ReportData object will send calls to report in a standard way for all subsequent calls to its instance.
 * @private
 * @param {String} [baseURL]
 * @param {MeasurePerformance} [mp]
 * @constructor
 */
ReportData = function (baseURL, mp) {

    var self = this,
            queue = [];

    /**
     * Creates an object from the url/baseURL using the query parameters and appends data from the eventData as a property
     * @param {Object} [eventData] Array of event data to append
     * @param {String} [url]
     * @returns {String} JSON formatted stringified object
     */
    var appendQueueDataToUrlParamData = function (eventData, url) {
        var sendBeaconObj,
                trackUrl;

        if (url) {
            url = prepareURL(url);
        }

        trackUrl = (url || baseURL);
        sendBeaconObj = parse(trackUrl).query;
        sendBeaconObj.eventData = eventData;

        return sendBeaconObj;
    };

    /**
     * If no url is supplied when logging, events can queue up. This clears and reports the data in the queue.
     * @param {Boolean} [useSendBeaconIfSupported]
     */
    self.runQueue = function (url, useSendBeaconIfSupported) {
        var queryObject = queue.shift(),
                eventData = [],
                sendBeaconObj;

        if (useSendBeaconIfSupported === true && isSendBeaconAvailable()) {
            while (queryObject) {
                eventData.push(queryObject);
                queryObject = queue.shift();
            }
            // Only send data if the queue has items in it
            if (eventData.length > 0) {
                sendBeaconObj= appendQueueDataToUrlParamData(eventData, url);
                sendReport(url, null, JSON.stringify(sendBeaconObj));
            }
        } else {
            while (queryObject) {
                sendReport(url + objectToQueryString(queryObject));
                queryObject = queue.shift();
            }
        }
    };

    /**
     * @instance
     * Determines whether to queue data from tracked event or to immediately report
     * @param {Object} params - Object literal containing key value pairs to encode as query string params on the end of the url.
     * @param {Boolean} [isUnloadEvent]
     * @param {String} [url] Optional runtime url if you want to call to a different base url
     * @param {Boolean} [useSendBeaconIfSupported]
     * @returns {String} returns the path that was called via logging
     */
    self.log = function (params, isUnloadEvent, url, useSendBeaconIfSupported) {
        var qs = objectToQueryString(params),
            trackURL,
            eventData = [],
            sendBeaconObj;
        if (!baseURL && !url) {
            queue.push(params);
            return qs;
        } else {
            if (url) {
                url = prepareURL(url);
            }
            if (useSendBeaconIfSupported === true && isSendBeaconAvailable()) {
                trackURL = (url || baseURL);
                eventData.push(params);
                sendBeaconObj = appendQueueDataToUrlParamData(eventData, trackURL);

                return sendReport(trackURL, isUnloadEvent, JSON.stringify(sendBeaconObj));
            } else {
                trackURL = (url || baseURL) + qs;

                return sendReport(trackURL, isUnloadEvent);
            }
        }
    };

    /**
     * @instance
     * Track an event, adding an object of key value pairs to data from query string params.
     * @param {Object} params - Object literal cocntaining key value pairs to encode as query string params on the end of the url.
     * @param {Boolean} [isUnloadEvent]
     * @param {String} [url] Optional runtime url if you want to call to a different base url.
     * @param {Boolean} [useSendBeaconIfSupported]
     * @returns {string} returns the path that was called via logging
     */
    self.logWithElapsedTime = function (params, isUnloadEvent, url, useSendBeaconIfSupported) {
        params.vtime = mp.now() - mp.startTime;
        return self.log(params, isUnloadEvent, url, useSendBeaconIfSupported);
    };

    /**
     * Set the base url and empties the queue if events have been stored up
     * @instance
     * @param {String} url
     * @param {Boolean} [useSendBeaconIfSupported]
     */
    self._setBaseUrl = function (url, useSendBeaconIfSupported) {
        if (has('console') && console.info) {
            console.info('You\'ve changed the url for this singleton instance from ', baseURL, ' to ', url);
        }
        baseURL = prepareURL(url);
        self.runQueue(baseURL, useSendBeaconIfSupported);
    };

    /** @deprecated We should consistently ignore cap case Asap, for consistency reasons. */
    self._setBaseURL = self._setBaseUrl;

    if (!!baseURL) {
        baseURL = prepareURL(baseURL);
    }
};

module.exports = {
    /**
     * @desc Create a new instance of the reportData module.
     * @static
     * @param {String} [baseURL] Base url for reporting pixel info.
     * @param {MeasurePerformance} [measurePerformanceInstance] Performance instance to provide measurement timestamps.
     * @returns {ReportData}
     */
    factory: reportDataFactory,

    /**
     * @desc Tie into an existing instance of the reportData module.
     * @static
     * @param packageName
     * @returns {ReportData}
     */
    provider: reportDataProvider
};
