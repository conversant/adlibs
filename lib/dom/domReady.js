'use strict';

// Take care when listening for 'interactive' since things can be wonky in IE unless checking 'complete' only
// https://connect.microsoft.com/IE/feedback/details/792880/document-readystate-interactive-firing-too-early-misfiring-in-ie11-9-and-10

var domReady = function (callback, targetWindow, isInteractiveOk) {

	// Local variables, because domReady should work for more than just the parent document/window
	var hasLoaded = false,
		pollingTimeoutHandle,
		win = targetWindow || window,
		doc = win.contentDocument || win.document;

	var checkDoc = function () {
		return (doc.readyState === 'interactive' && !!isInteractiveOk) || doc.readyState === 'complete';
	};

	var pollReadiness = function (callback) {
		if (checkDoc() && !hasLoaded) { // The state of the doc is ready, but this was somehow missed by the event handlers
			hasLoaded = true;
			callback();
		} else if (!hasLoaded) { // This check will drop us out of this checking loop if we fail
			pollingTimeoutHandle = setTimeout(function () {
				pollReadiness(callback);
			}, 10);
		}
	};

	var signalReadiness = function (callback) {
		if (!hasLoaded) {
			hasLoaded = true;

			if (pollingTimeoutHandle) {
				clearTimeout(pollingTimeoutHandle);
			}
			callback();
		}
	};

	if (hasLoaded || checkDoc()) {
		signalReadiness(callback);
	} else {
		if (doc.addEventListener) {
			// IE9+, Firefox, Chrome, Safari
			doc.addEventListener('DOMContentLoaded', function() { // same as interactive readyState
				if (checkDoc()) {
					signalReadiness(callback);
				}
			}, false);
			// IE, old Safari
			win.addEventListener('load', function() { // same as complete readyState
				signalReadiness(callback);
			}, false);
			// IE 8
		} else if (doc.attachEvent) {
			doc.attachEvent('onreadystatechange', function() { // can be any readyState
				if (checkDoc()) {
					signalReadiness(callback);
				}
			});
			doc.attachEvent('onLoad', function() { // same as complete readyState
				signalReadiness(callback);
			});
		}

		// For scripts using the "async" attribute, they'll execute AFTER the synchronous scripts load in sequence. This
		// can cause a race condition where the DOMContentLoaded event will fire, but the script itself becomes unaware
		// it happened. Because this is problematic even in modern browsers like chrome, it's important to have a fallback
		// polling check which will cancel itself once the page finishes loading.
		pollReadiness(callback);
	}

};

/**
 * @module domReady
 * @desc Executes the provided callback when the DOM is ready. Allows code to act on the DOM before the window "load" event fires.
 * @param {Function} callback
 * @param {Window} [targetWindow] You can provide your own window reference for cases where you'd have an iframe.
 * @param {Boolean} [isInteractiveOk] Interactive mode can be checked for faster responses.
 * @example
 * ```js
 * var domReady = require('ad-libs.js/lib/dom/domReady');
 *
 * // executes the cb on dom ready
 * domReady(cb, window);
 *
 * ```
 */
module.exports = domReady;
