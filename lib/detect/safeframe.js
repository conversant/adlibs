/**
 * @desc Safeframe Detection
 * @module Safeframe
 * @typicalname Safeframe
 * @example
 * ```js
 * var safeframe = require("ad-libs.js/lib/detect/safeframe");
 * ```
 */

'use strict';

var has = require('../canHas').has,
	DEFAULT = -1,
	CONF_FIELDS = ['cdn', 'ver', 'renderFile', 'hostFile', 'extFile', 'bootFile', 'to', 'auto', 'msgFile', 'debug'],
	EXT_SUPPORT_FIELDS = ['exp-ovr', 'exp-push', 'read-cookie', 'write-cookie'];

/**
 * Get version of safeframe.
 * @static
 * @param {Window=} win
 * @returns {String}
 */
var getVersion = function (win) {
		win = win || window;

		if (has('$sf', win)) {
			return win.$sf.ver || DEFAULT + '';
		} else {
			return DEFAULT + '';
		}
	};

/**
 * Gets specVersion of safeframe.
 * @static
 * @param {Window=} win
 * @returns {String}
 */
var	getSpecVersion = function (win) {
		win = win || window;

		if (has('$sf', win)) {
			return win.$sf.specVersion || DEFAULT + '';
		} else {
			return DEFAULT + '';
		}
	};

/**
 * Gets info of safeframe.
 * @static
 * @param {Window=} win
 * @returns {Array}
 */
var	getInfo = function (win) {
		win = win || window;
		var info = [];

		if (has('$sf', win) && has('info', win.$sf)) {
			info.push(win.$sf.info.errs.length || DEFAULT);
			info.push(win.$sf.info.list.length || DEFAULT);
		} else {
			info = [DEFAULT, DEFAULT];
		}
		return info;
	};

/**
 * Gets config of safeframe host.
 * @static
 * @param {Window=} win
 * @returns {Array}
 */
var	getConf = function (win) {
		win = win || window;
		var conf = [],
			len = CONF_FIELDS.length,
			i;

		if (has('$sf', win) && has('host', win.$sf) && has('conf', win.$sf.host)) {
			for (i = 0; i < len; i++) {
				conf.push(typeof win.$sf.host.conf[CONF_FIELDS[i]] !== null ? win.$sf.host.conf[CONF_FIELDS[i]] : DEFAULT + '');
			}
		} else {
			for (i = 0; i < len; i++) {
				conf.push(DEFAULT + '');
			}
		}

		return conf;
	};

/**
 * Returns array of supported fields for sf.ext.
 * @static
 * @param {Window=} win
 * @returns {Array}
 */
var getSupport = function (win) {
		win = win || window;
		var support = [],
			len = EXT_SUPPORT_FIELDS.length,
			result,
			i;

		if (has('$sf', win) && has('ext', win.$sf) && has('supports', win.$sf.ext)) {
			result = win.$sf.ext.supports();
			for (i = 0; i < len; i++) {
				support.push(typeof result[EXT_SUPPORT_FIELDS[i]] !== null ? (result[EXT_SUPPORT_FIELDS[i]] ? 1 : 0) : DEFAULT);
			}
		} else {
			for (i = 0; i < len; i++) {
				support.push(DEFAULT);
			}
		}

		return support;
	};

/**
 * Gets inview percentage of safeframe.
 * @static
 * @param {Window=} win
 * @returns {Number}
 */
var getInView = function (win) {
		win = win || window;

		if (has('$sf', win) && has('ext', win.$sf) && has('inViewPercentage', win.$sf.ext)) {
			return win.$sf.ext.inViewPercentage();
		} else {
			return DEFAULT;
		}
	};

/**
 * Returns if safeframe window has focus.
 * @static
 * @param {Window=} win
 * @returns {Number}
 */
var getWinFocus = function (win) {
	win = win || window;

	if (has('$sf', win) && has('ext', win.$sf) && has('winHasFocus', win.$sf.ext)) {
		return win.$sf.ext.winHasFocus() ? 1 : 0;
	} else {
		return DEFAULT;
	}
};

/**
 * Returns safeframe metrics.
 * @static
 * @param {Window=} win
 * @returns {Array}
 */
var getMetrics = function (win) {
	win = win || window;
	var report = [];
	report.push(getVersion(win));
	report.push(getSpecVersion(win));
	report.push(getInView(win));
	report.push(getWinFocus(win));
	report = report.concat(getInfo(win), getConf(win), getSupport(win));
	return report;
};

module.exports.getVersion = getVersion;
module.exports.getSpecVersion = getSpecVersion;
module.exports.getInfo = getInfo;
module.exports.getConf = getConf;
module.exports.getSupport = getSupport;
module.exports.getInView = getInView;
module.exports.getWinFocus = getWinFocus;
module.exports.getMetrics = getMetrics;
