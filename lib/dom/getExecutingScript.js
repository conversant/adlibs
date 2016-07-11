'use strict';

var LOAD_ATTR = 'script-loaded',
	LOAD_STARTED = 'started';

var getExecutingScript = function (detectScript) {
	var doc = document,
		currentScript = doc.currentScript, // FF 4+, Chrome 29+, Opera 16+, Safari 7+
		scripts,
		script,
		startIdx,
		i;

	if (!detectScript) {
		detectScript = function() { return true; };
	}

	// fallback for IE and older browsers

	if (!currentScript) {
		scripts = doc.getElementsByTagName('script');
		startIdx = scripts.length - 1;

		for (i = startIdx; i >= 0; i--) {
			script = scripts[i];

			if (!script.getAttribute(LOAD_ATTR) && detectScript(script)) {
				currentScript = script;
				break;
			}
		}
	}

	if (currentScript) {
		currentScript.setAttribute(LOAD_ATTR, LOAD_STARTED);
	}

	return currentScript;
};

/**
 * @module getExecutingScript
 * @desc Returns the script element that loaded the currently executing javascript code. The detectScript function takes a script Element as a single argument, and should return a boolean value. Allows more specific filtering in the case of multiple  scripts on the page where document.currentScript is not supported. When the executing script has been located it will be marked with an attribute  key/value pair represented at getExecutingScript.LOAD_ATTR and getExecutingScript.LOAD_STARTED.
 * @param {Function} [detectScript]
 * @returns {HTMLScriptElement}
 * @example
 * ```js
 * var getExecutingScript = require('ad-libs.js/lib/dom/getExecutingScript');
 *
 * ```
 */
module.exports = getExecutingScript;

module.exports.LOAD_ATTR = LOAD_ATTR;
module.exports.LOAD_STARTED = LOAD_STARTED;
