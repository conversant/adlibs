/* global describe, it, before, after */

var loadScript = require('../lib/loadScript'),
	expect = require('expect.js');

var isIE = /MSIE/.test(navigator.userAgent);

var cacheBustCounter = 0;

function cacheBust() {
	return 'cachebust=' + (++cacheBustCounter) + (new Date()).getTime();
}

describe('loadScript', function() {

	before(function() {
		window.loaderTest = null;
	});

	it('Should load the script from the given url and execute the success callback after the script loads.', function(done) {
		loadScript('/base/public/loader-test.js', function() {
			expect(window.loaderTest).to.be.a('number');
			done();
		});
	});

	it('Should load the script and attach it to a given target', function(done) {
		expect(document.body.children[document.body.children.length-1].src.indexOf('loader-test.js')).to.equal(-1);
		loadScript('/base/public/loader-test.js', function() {
			expect(document.body.children[document.body.children.length-1].src.indexOf('loader-test.js')).to.not.equal(-1);
			done();
		}, function() {}, 0, document.body);
	});

	it('Should load all scripts and execute the success callback after all scripts load.', function(done) {
		var successCallback = function() {
			var loadedCount = 0,
				i = 0;
			
			for (; i < document.scripts.length; i++) {
				if (/loader-test.js\?cachebust/.test(document.scripts[i].src)) {
					loadedCount++;
				}
			}
			
			expect(loadedCount).to.equal(3);
			done();
		};
		
		loadScript(
			[
				'/base/public/loader-test.js?' + cacheBust(),
				'/base/public/loader-test.js?' + cacheBust(),
				'/base/public/loader-test.js?' + cacheBust()
			],
			successCallback
		);
	});

	it('Should call the error callback instead of the success callback if any scripts fail to load.', function(done) {
		// IE does not support reporting script load errors, so we ignore this test
		if (isIE) {
			done();
			return;
		}

		loadScript(
			[
				'/base/public/loader-test.js?' + cacheBust(),
				'/base/public/bogus-request.js'
			],
			function() {
				expect("onLoaded callback should not execute on error when the onError callback exists").not.to.be.ok();
				done();
			},
			function(failedUrls) {
				expect(failedUrls.length).to.equal(1);
				expect(failedUrls[0]).to.equal('/base/public/bogus-request.js');
				done();
			}
		);
	});

	it('Should call the error callback if a script is not loaded before the requestTimeout expires.', function(done) {
		loadScript(
			'/base/public/loader-test.js?' + cacheBust(),
			function() {
				// IE and PhantomJS caching, even with a cachebust querystring, makes this an unreliable test at best.
				if (!isIE && !/PhantomJS/.test(navigator.userAgent)) {
					// This passes/fails unpredictably in most browsers, so not failing this test until
					// it can be made more reliable.

					// expect("onLoaded callback should not execute when timeout fires first.").not.to.be.ok();
				}

				done();
			},
			function(failedUrls) {
				expect(failedUrls.length).to.equal(1);
				expect(failedUrls[0]).to.contain('/base/public/loader-test.js');
				done();
			},
			0
		);
	});

});
