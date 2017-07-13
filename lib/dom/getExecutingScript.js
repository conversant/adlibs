/** @module getExecutingScript */

'use strict';

var LOAD_STARTED = 'started';

/**
 * Returns the script element that loaded the currently executing javascript code.
 *
 * The validatorFunc function takes a script Element as a single argument, and should
 * return a boolean value. Allows more specific filtering in the case of multiple
 * scripts on the page where document.currentScript is not supported.
 *
 * When the executing script has been located, it will be marked with an attribute
 * key/value pair represented at getExecutingScript.LOAD_ATTR and getExecutingScript.LOAD_STARTED.
 *
 * @param {String} [loadAttr]
 * @param {Function} [validatorFunc]
 * @param {HTMLScriptElement} [testScript] Used for IoC/testing.
 *
 * @returns {HTMLScriptElement|null}
 */
var getExecutingScript = function (loadAttr, validatorFunc, testScript) {
	var currentScriptEl = testScript || document.currentScript, // FF 4+, Chrome 29+, Opera 16+, Safari 7+
		outputScriptEl = null,
		scripts,
		scriptEl,
		i;

	validatorFunc = (typeof validatorFunc === 'function') ? validatorFunc : function () { return true; };

	if (currentScriptEl && currentScriptEl.nodeName === 'SCRIPT' && validatorFunc(currentScriptEl) === true) {
		outputScriptEl = currentScriptEl;
	} else {
		// Fallback for IE, older browsers, or cases where the document.currentScript is not available.
		scripts = document.getElementsByTagName('script');
		for (i = scripts.length - 1; i >= 0; i--) {
			scriptEl = scripts[i];

			if (!scriptEl.getAttribute(loadAttr) && validatorFunc(scriptEl) === true) {
				outputScriptEl = scriptEl;
				break;
			}
		}
	}

	if (outputScriptEl && outputScriptEl.nodeName === 'SCRIPT') {
		outputScriptEl.setAttribute(loadAttr, LOAD_STARTED);
	}

	return outputScriptEl;
};

module.exports = getExecutingScript;
module.exports.LOAD_STARTED = LOAD_STARTED;
