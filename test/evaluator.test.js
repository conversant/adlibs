/* global describe, it */

var expect = require('expect.js'),
	evaluator = require('../lib/evaluator');

describe('evaluator', function () {

	it('should return the value of the function evaluated', function () {
		var addNumbersTogether = '(function () { return 5 + 10 + 20 })();';
		expect(evaluator(addNumbersTogether).value).to.equal(35);
		expect(evaluator(addNumbersTogether).errors).to.equal(null);
	});

	it('should return an error when the eval fails', function () {
		var badCode = '(function () { this should fail })();';
		expect(evaluator(badCode).value).to.equal(undefined);
		expect(evaluator(badCode).errors).to.not.equal(null);
	});
});
