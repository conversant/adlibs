/**
 * @desc Mraid Detection
 * @module Mraid
 * @license Apache-2.0
 * @typicalname mraid
 * @example
 * ```js
 * var mraid = require("ad-libs.js/lib/detect/mraid");
 *
 * console.log(mraid.getVersion()) // outputs mraid version;
 * ```
 */
'use strict';

var has = require('../canHas').has,
	can = require('../canHas').can,
	listenFor = require('../dom/addEventListener');

module.exports = {

	/**
	 * @desc Executes cb when mraid is ready
	 * @param {Function} cb
	 * @param {Window=} win is an optional param. If not given, uses the current window
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
	 * @desc Gets mraid version
	 * @param {Window=} Win is an optional param. If not given, uses the current window
	 * @static
	 * @returns {String}
	 */
	getVersion: function (win) {
		win = win || window;
		if (can(has('mraid', win), 'getVersion')) {
			return win.mraid.getVersion();
		} else {
			return '-1';
		}
	}
};
