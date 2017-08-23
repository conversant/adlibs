/* globals require, module, console */
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
 * @param trackURL
 * @returns {string}
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
 * @param {string} trackURL
 * returns {string}
 */
var imgTrack = function (trackURL) {
    new Image().src = trackURL;
    return trackURL;
};

/*
 * Iterate over an object literal's properties and convert those to a string to be appended to a url
 * @param params {Object} key/value pairs to convert into a query string
 * @returns {string}
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

var isSendBeaconAvailable = function() {
    return typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function');
}

/**
 *
 * @param url
 * @param isUnloadEvent
 * @param {Boolean} [isSendBeacon]
 * @param {Object} [sendBeaconObj]
 * @returns {*}
 */
var sendReport = function (url, isUnloadEvent, sendBeaconObj) {
    var sendBeaconJsonString;

    if (typeof sendBeaconObj === 'string' || isSendBeaconAvailable()) {
        if (sendBeaconObj === 'object`') {
            sendBeaconJsonString = JSON.stringify(sendBeaconObj);
        }
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
 * ReportData object will send calls to report pixels in a standard way for all subsequent calls to its instance.
 * @private
 * @param {String|null} [baseURL]
 * @param {MeasurePerformance} [mp]
 * @constructor
 */
ReportData = function (baseURL, mp) {

    var self = this;
    var queue = [];

    /**
     * Creates an object from the url/baseURL using the query parameters and appends data from the eventData as another component
     * @param eventData {object} [eventData] An array of values to append
     * @param url {String} [url] Optional runtime url if you want to call to a different base url
     * @returns {sendBeaconObj} Object with paramters from the url/baseURL's query string and any eventData passed in
     */
    var appendQueueDataToUrlData = function (eventData, url) {
        var sendBeaconObj = {},
            trackURL,
            paramKeyValuePair;

        if (url) {
            url = prepareURL(url);
        }

        trackURL = (url || baseURL);
        sendBeaconObj = parse(trackURL);
        sendBeaconObj.eventData = eventData;

        return sendBeaconObj;
    };

    /**
     * If no baseUrl is supplied, events can queue up. When the baseUrl is finally supplied, the queue is cleared and all urls called.
     * @param isSendBeacon [isSendBeacon]
     */
    var runQueue = function (isSendBeacon) {
        var queryString,
            eventData = [],
            sendBeaconObj;

        queryString = queue.shift();

        if (isSendBeacon === true && isSendBeaconAvailable()) {
            while (queryString) {
                eventData.push(queryString);
                queryString = queue.shift();
            }

            sendBeaconObj = appendQueueDataToUrlData(eventData);
            sendReport(baseURL + queryString, null, JSON.stringify(sendBeaconObj));
        } else {
            while (queryString) {
                sendReport(baseURL + queryString);
                queryString = queue.shift();
            }
        }
    };

    /**
     * If navigator.sendBeacon is available, create an object from data in the queue to send.
     * @instance
     * @param {Object} params - Object literal containing key value pairs to encode as query string params on the end of the url.
     * @param {Boolean} [isUnloadEvent]
     * @param {String} [url] Optional runtime url if you want to call to a different base url
     * @param {Boolean} [isSendBeacon] attempt to use the sendBeacon function
     * @returns {String} returns the path that was called via logging
     */
    self.log = function (params, isUnloadEvent, url, isSendBeacon) {
        var qs = objectToQueryString(params),
            trackURL,
            eventData,
            sendBeaconObj;

        if (!baseURL && !url) {
            queue.push(qs);
            return qs;
        } else {
            if (url) {
                url = prepareURL(url);
            }
            trackURL = (url || baseURL) + qs;
            eventData = [];

            if(isSendBeacon === true && (typeof window.navigator === 'object') && (typeof window.navigator.sendBeacon === 'function')) {
                eventData.push(qs);
                sendBeaconObj = appendQueueDataToUrlData(eventData, url);
                return sendReport(trackURL, isUnloadEvent, sendBeaconObj);
            } else {
                return sendReport(trackURL, isUnloadEvent);
            }

        }
    };

    /**
     * @instance
     * Track an event by passing an object of key value pairs as added query string params.
     * @param {Object} params - Object literal containing key value pairs to encode as query string params on the end of the url.
     * @param {Boolean} [isUnloadEvent]
     * @param {String} [url] Optional runtime url if you want to call to a different base url.
     * @param {Boolean} [isSendBeacon] attempt to use the sendBeacon function
     * @returns {string} returns the path that was called via logging
     */
    self.logWithElapsedTime = function (params, isUnloadEvent, url, isSendBeacon) {
        params.vtime = mp.now() - mp.startTime;
        return self.log(params, isUnloadEvent, url, isSendBeacon);
    };

    /**
     * Set the base url
     * @instance
     * @param url
     * @param {Boolean} [isSendBeacon]
     */
    self._setBaseUrl = function (url, isSendBeacon) {
        if (has('console') && console.info) {
            console.info('You\'ve changed the url for this singleton instance from ', baseURL, ' to ', url);
        }
        baseURL = prepareURL(url);
        runQueue(isSendBeacon);
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
