/* global describe, it, sinon */

'use strict';

var domReady = require('../../lib/dom/domReady'),
	browser = require('../../lib/detect/browser.js'),
	expect = require('expect.js');

describe('dom/domReady', function() {

	it('Should execute the provided callback when the DOM is ready.', function(done) {
		var spy = sinon.spy();

		domReady(spy);

		setTimeout(function () {
			expect(spy.calledOnce).to.equal(true);
			done();
		}, 800);
	});

});

describe('dom/domReady/isInteractiveOk=true/new window', function () {

	it('Should execute given isInteractiveOk is true', function (done) {
		var spy = sinon.spy(),
			frameDoc = document.createElement('iframe'),
			htmlSrc = '<body>test</body>';

		frameDoc.src = 'data:text/html;charset=utf-8' + encodeURI(htmlSrc);
		domReady(spy, frameDoc.contentWindow, true);

		setTimeout(function () {
			expect(spy.calledOnce).to.equal(true);
			done();
		}, 800);
	});
});

describe('dom/domReady/isInteractiveOk=false/new window', function () {

	it('Should execute given isInteractiveOk is false', function (done) {
		var spy = sinon.spy(),
			frameDoc = document.createElement('iframe'),
			htmlSrc = '<body>test</body>';

		frameDoc.src = 'data:text/html;charset=utf-8' + encodeURI(htmlSrc);
		domReady(spy, frameDoc.contentWindow, false);

		setTimeout(function () {
			expect(spy.calledOnce).to.equal(true);
			done();
		}, 800);
	});
});
