'use strict';

var addEventListener = function (element, eventName, callback) {
	var removeEventListener;

	if (element && element.addEventListener) {
		element.addEventListener(eventName, callback, false);
		removeEventListener = function() {
			element.removeEventListener(eventName, callback, false);
		};
	} else if (element && element.attachEvent) {
		element.attachEvent('on' + eventName, callback);
		removeEventListener = function() {
			element.detachEvent('on' + eventName, callback);
		};
	} else {
		removeEventListener = function() {};
	}

	return removeEventListener;
};

/**
 * @module addEventListener
 * @desc Add an event listener to the element, which will execute the given callback.
 * @param {Element} element
 * @param {String} eventName
 * @param {Function} callback
 * @returns {Function} Returns a function, that when executed, will remove the event listener from the element.
 * @example
 * ```js
 * var addEventListener = require('ad-libs.js/lib/dom/addEventListener');
 *
 * addEventListener(el, 'onLoad', cb);
 *
 * ```
 */
module.exports = addEventListener;
