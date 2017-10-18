'use strict';

/**
 * @module evaluator
 * @desc Runs eval against the value passed to it. This function exists because eval prevents Uglify from minifying correctly. Encapsulating eval in its own module prevents the above issue. Variables and properties are one letter vars because Uglify won't function for this module. That's right - we have one letter vars in our source code. Ain't eval grand? For more info on eval visit: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
 * @param {String} scriptString
 * @returns {Object} evalResult
 */
var evaluator = function (scriptString) {
	var evalResult = {
		value: undefined,
		errors: null
	};
	try {
		evalResult.value = eval(scriptString); // jshint ignore:line
	} catch(err) {
		evalResult.errors = err;
	}
	return evalResult;
};

module.exports = evaluator;
