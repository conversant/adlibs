
/* globals JSON: true */
/* jshint strict: false */

// Cannot 'use strict'; Uses eval.

var forIn = require('./canHas').forIn,
	can = require('./canHas').can,
	evaluator = require('./evaluator');


var parseConfig = function(el, attrName, defaults) {
	var configStr = el.getAttribute(attrName),
		config;

	defaults = defaults || {};

	if (configStr && configStr.length > 0) {
		if (typeof window.JSON !== 'undefined' && JSON.parse) {
			config = JSON.parse(configStr);
		} else {
			// IE in Quirks Mode doesn't expose native JSON support
			/* jshint evil: true */
			config = evaluator('(function() { return ' + configStr + '; })();').value; // jshint ignore:line
		}
	}

	forIn(defaults, function(key, value) {
		if (!can(config, key)) {
			config[key] = value;
		}
	});

	return config;
};

/**
 * @desc Parses a json config from the provided Element. The defaults is expected to be a JSON string in the attribute value.
 * @param {Element} el - The HTML Element that contains the config defaults.
 * @param {String} attrName
 * @param {Object} [defaults]
 * @returns {Object} returns the parsed json config
 * @module parseConfig
 * @example
 * ```js
 * var parseConfig = require('ad-libs/lib/parseConfig');
 *
 * console.log(parseConfig(htmlElement, attributeName, defaultVals)) // outputs the parsed object from the element
 * ```
 *
 */
module.exports = parseConfig;
