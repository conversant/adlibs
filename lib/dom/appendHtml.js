'use strict';

var evaluator = require('../evaluator');

/**
 * @module appendHtml
 * @license Apache-2.0
 * @desc Appends all elements in the html string to the parent element. Correctly handles scripts with src attributes and inline javascript and ensures that the script will execute.  NOTE: Only Element nodes in the html string will be appended. All other node types will be ignored (i.e. Text, Comment).
 * @param {Element} parentEl
 * @param {string} html
 * @returns {Array} a list of any exceptions that occurred.
 * @example
 * ```js
 * var appendHtml = require('ad-libs.js/lib/dom/appendHtml');
 *
 * ```
 */
var appendHtml = function(parentEl, html) {
	if (!(parentEl && parentEl.appendChild)) {
		return [new Error('parentEl is not an Element')];
	}

	var container = document.createElement('div'),
		jsText = [],
		jsErrors = [],
		childEl,
		clonedScript,
		len,
		i;

	container.innerHTML = html;

	while (container.children.length > 0) {
		childEl = container.removeChild(container.children[0]);

		// IE 6, 7, 8 support Element.children, but incorrectly include Comment nodes
		// so we need to include this check, even though nodeType should always be ELEMENT_NODE.
		if (childEl.nodeType !== 1) {
			continue;
		}

		if (childEl.nodeName === 'SCRIPT') {
			if (childEl.text) {
				jsText.push(childEl.text);
			} else if (childEl.src) {
				clonedScript = document.createElement('script');
				clonedScript.type = childEl.type || 'text/javascript';
				clonedScript.src = childEl.src;

				if (childEl.hasAttributes()) {
					len = childEl.attributes.length;

					for (i = 0; i < len; i++) {
						clonedScript.setAttribute(
							childEl.attributes[i].name, childEl.attributes[i].value);
					}
				}

				childEl = clonedScript;
			}
		}

		parentEl.appendChild(childEl);
	}

	while (jsText.length > 0) {
		var nextJs = evaluator(jsText.shift());
		if (nextJs.errors) {
			jsErrors.push(nextJs.errors);
		}
	}

	return jsErrors;
};

module.exports = appendHtml;
