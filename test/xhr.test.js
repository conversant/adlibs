/* global describe:true, it:true */

'use strict';

var expect = require('expect.js'),
	XHR = require('../lib/xhr'),
	isAndroid = /Android/.test(navigator.userAgent);

describe('XHR', function() {

	it('Should return an wrapped XMLHttpRequest instance when it is supported.', function(done) {
		var xhr = XHR({ method: 'GET', url: '/base/public/test-file.txt' }, function(status, body) {

			expect(status).to.equal(200);
			expect(body).to.equal('HELLO WORLD\n');
			done();
		}).send();

		expect(xhr.xhr).to.not.equal(undefined);
	});

	it('Should return a response when a blob is requested.', function(done) {
		// Android pre-4.4 does not support blobs, so we ignore them for this test
		if (!isAndroid) {
			var xhr = XHR({ method: 'GET', url: '/base/public/test-file.txt', responseType: 'blob' }, function(status, body) {
				if (status === 200) {
					//Supported browsers should generate a 200 status and a blob object
					expect(body.toString()).to.equal('[object Blob]');
				} else if (status === 500) {
					//IE 9 and other unsupported browsers should generate a 500 status and return an empty body
					expect(body).to.equal('');
				} else {
					expect(false).to.equal(true);
				}

				done();
			});
			xhr.send();
		} else {
			done();
		}
	});
	
	it('Should return an wrapped JSON object after making a XHR request with type JSON.', function(done) {
		var xhr = XHR({ method: 'GET', url: '/base/public/test-json-file.json' , responseType: 'json'}, function(status, body) {
			expect(status).to.equal(200);
			expect(body.message).to.equal('hello world');
			done();
		}).send();
		
		expect(xhr.xhr).to.not.equal(undefined);
	});

	it('Should determine if the browser XHR implementation supports cross origin requests.', function() {
		expect(XHR.supportsCORS()).to.be.a('boolean');
	});

});
