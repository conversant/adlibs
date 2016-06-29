/* global describe, it */

'use strict';

var expect = require('expect.js'),
	JSONP = require('../lib/jsonp');

describe('JSONP', function() {

	it('Should request content from the server via script tag and global callback function.', function(done) {
		JSONP({ url: '/base/public/jsonp-test.js', callbackFn: 'CNVR_onResponse' }, function(status, body) {
			expect(status).to.equal(200);
			expect(body).to.equal('HELLO WORLD');
			done();
		}).send();
	});

});
