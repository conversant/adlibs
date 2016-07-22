/** @module dom/getExecutingScript */

'use strict';

var LOAD_ATTR    = 'data-cnvr-script-loaded',
	LOAD_STARTED = 'started';

/**
 * Returns the script element that loaded the currently executing javascript code.
 *
 * The detectScript function takes a script Element as a single argument, and should
 * return a boolean value. Allows more specific filtering in the case of multiple
 * scripts on the page where document.currentScript is not supported.
 *
 * When the executing script has been located it will be marked with an attribute
 * key/value pair represented at getExecutingScript.LOAD_ATTR and getExecutingScript.LOAD_STARTED.
 *
 * @param {Function} [detectScript]
 * @returns {HTMLScriptElement|null}
 */
var getExecutingScript = function (detectScript) {
	var currentScript = document.currentScript, // FF 4+, Chrome 29+, Opera 16+, Safari 7+
		outputScript = null,
		scripts,
		myScript,
		i;

	detectScript = detectScript || function () { return true; };

	if ('currentScript' in document && detectScript(currentScript) === true) {
		outputScript = currentScript;
	} else {
		// fallback for IE and older browsers
		scripts = document.getElementsByTagName('script');
		for (i = scripts.length - 1; i >= 0; i--) {
			myScript = scripts[i];

			if (!myScript.getAttribute(LOAD_ATTR) && detectScript(myScript) === true) {
				outputScript = myScript;
				break;
			}
		}
	}

	if (outputScript) {
		outputScript.setAttribute(LOAD_ATTR, LOAD_STARTED);
	}

	return outputScript;
};

module.exports = getExecutingScript;
module.exports.LOAD_ATTR = LOAD_ATTR;
module.exports.LOAD_STARTED = LOAD_STARTED;