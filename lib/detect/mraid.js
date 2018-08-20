/**
 * @desc Mraid Detection
 * @module Mraid
 * @typicalname mraid
 * @example
 * ```js
 * var mraid = require("adlibs/lib/detect/mraid");
 *
 * console.log(mraid.getVersion()) // outputs mraid version;
 * ```
 */
'use strict';

var has = require('../canHas').has,
		forIn = require('../canHas').forIn,
		listenFor = require('../dom/addEventListener'),
		run = require('../canHas').run;

module.exports = {

	/**
	 * @desc Executes cb when mraid is ready.
	 * @param {Function} cb
	 * @param {Window=} If not given, uses the current window.
	 * @static
	 */
	ready: function (cb, win) {
		win = win || window;
		if (has('mraid', win)) {
			listenFor(win.mraid, 'ready', function () {
				cb();
			});
		} else {
			cb();
		}
	},
	/**
	 * @desc Gets mraid version.
	 * @param {Window=} If not given, uses the current window.
	 * @static
	 * @returns {String}
	 */
	getVersion: function (win) {
		win = win || window;
		if (has('mraid', win)) {
			return run(win.mraid, 'getVersion')();
		} else {
			return '-1';
		}
	},

    /**
     *
     * @param win
     * @returns {{version: null||String, issues: Array}}
     */
	diagnostic: function (win) {
		win = win || window;

        var report = {
            version: null,
            issues: []
        },
            FUNCTION = 'function',
            mraidObj = has('mraid', win);

        var mraidType = typeof mraidObj;

        var mraid1Props = {
            addEventListener: FUNCTION,
            close: FUNCTION,
            expand: FUNCTION,
            getExpandProperties: FUNCTION,
            getPlacementType: FUNCTION,
            getState: FUNCTION,
            getVersion: FUNCTION,
            isViewable: FUNCTION,
            open: FUNCTION,
            removeEventListener: FUNCTION,
            setExpandProperties: FUNCTION,
            useCustomClose: FUNCTION
        };

        var mraid2Props = {
            createCalendarEvent: FUNCTION,
            getCurrentPosition: FUNCTION,
            getDefaultPosition: FUNCTION,
            getMaxSize: FUNCTION,
            getResizeProperties: FUNCTION,
            getScreenSize: FUNCTION,
            playVideo: FUNCTION,
            setResizeProperties: FUNCTION,
            storePicture: FUNCTION,
            supports: FUNCTION
        };

        if (mraidType !== 'object') {
            report.issues.push('MRAID is type: ' + mraidType);
            return report;
        }

        report.version = mraidObj.getVersion ? mraidObj.getVersion() : '-1';

        forIn(mraid1Props, function (key, val) {
            if (typeof mraidObj[key] !== val) {
                report.issues.push(key + ' equals ' + typeof mraidObj[key]);
            }
        });

        if (report.version === '2.0') {
            forIn(mraid2Props, function (key, val) {
                if (typeof mraidObj[key] !== val) {
                    report.issues.push(key + ' equals ' + typeof mraidObj[key]);
                }
            });
        }

        return report;
    }
};
