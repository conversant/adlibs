'use strict';

/**
 * @module evaluator
 * @license Apache-2.0
 * @desc Runs eval against the value passed to it. This function exists because eval prevents Uglify from minifying correctly. Encapsulating eval in its own module prevents the above issue. Variables and properties are one letter vars because Uglify won't function for this module. That's right - we have one letter vars in our source code, ain't eval grand? For more info on eval visit: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
 * @param {String} v
 * @returns {Object}
 */
var evaluator = function (v) {
	var r = {
		value: undefined,
		errors: null
	};
	try {
		r.value = eval(v); // jshint ignore:line
	} catch(err) {
		r.errors = err;
	}
	return r;
};

module.exports = evaluator;
