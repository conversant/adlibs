/* global describe, it, sinon */

'use strict';

var expect = require('expect.js'),
	isSafari = window.navigator.userAgent.toLowerCase().indexOf('safari') > -1;

/** @type {ReportData} */
var rdSingleton = require('../lib/reportData').provider('test.reportData');

var rdFactory = require('../lib/reportData').factory;

describe('reportData', function() {

	it('Should create a new Image with the src url as the logging url.', function() {
		var singletonUrl = rdSingleton.log({ trid: 1, etype: 'bar', vtime: 25, edtl: 'bar' }, false, 'http://foo.com/');
		var factoryUrl = rdFactory().log({ trid: 1, etype: 'bar', vtime: 25, edtl: 'bar' }, false, 'http://foo.com/');

		expect(singletonUrl).to.equal('http://foo.com/?trid=1&etype=bar&vtime=25&edtl=bar');
		expect(factoryUrl).to.equal('http://foo.com/?trid=1&etype=bar&vtime=25&edtl=bar');
	});

	it('Should append new query parameters to the query string of the url.', function() {
		var singletonUrl = rdSingleton.log({foo: 'bar' }, false, 'http://foo.com/?feeling=awesome');
		var factoryUrl = rdFactory().log({ foo: 'bar' }, false, 'http://foo.com/?feeling=awesome');

		expect(singletonUrl).to.equal('http://foo.com/?feeling=awesome&foo=bar');
		expect(factoryUrl).to.equal('http://foo.com/?feeling=awesome&foo=bar');
	});

	it('Should automatically add the vtime parameter with the delta since page load.', function() {
		var mockPerformance = { now: function() { return 10; }, startTime: 1 };

		var url = rdFactory('http://foo.com', mockPerformance).logWithElapsedTime({ foo: 'bar' });

		expect(url).to.equal('http://foo.com?foo=bar&vtime=9');
	});

	it('Should use a synchronous XHR call when sending a report during the unload event in Safari.', function() {
		// This test only validates safari specific behavior.
		if (!isSafari) {
			return;
		}

		this.server = sinon.fakeServer.create();
		this.server.respondImmediately = true;

		var url = rdFactory('http://foo.com').log({ trid: 1 }, true);

		expect(this.server.requests.length).to.equal(1);
		expect(this.server.requests[0].url).to.equal(url);

		this.server.restore();
	});

	it('Should queue log messages until a baseUrl exists for the ReportData instance.', function() {
		// Safari won't let window.Image be mocked by sinon, but since this is browser agnostic
		// logic it will validated by Chrome and Firefox.
		if (isSafari) {
			return;
		}

		var imageStub = sinon.stub(navigator, 'sendBeacon', function(url, data) {});

		var reportData = rdFactory();

		reportData.log({ trid: 1 });
		reportData.log({ trid: 2 });
		reportData.log({ trid: 3 });

		expect(imageStub.callCount).to.equal(0);

		reportData._setBaseUrl('http://foo.com');

		expect(imageStub.callCount).to.equal(1);

		imageStub.restore();
	});

    it('If navigator.sendBeacon is not available.', function() {
        // Safari won't let window.Image be mocked by sinon, but since this is browser agnostic
        // logic it will validated by Chrome and Firefox.
        if (isSafari) {
			console.log(typeof navigator.sendBeacon === 'function');
            //var imageStub = sinon.stub(navigator, 'sendBeacon', function (url, data) {
            //});

            var reportData = rdFactory();

            reportData.log({trid: 1});
            reportData.log({trid: 2});
            reportData.log({trid: 3});

            //expect(imageStub.callCount).to.equal(0);

            reportData._setBaseUrl('http://foo.com');

            //expect(imageStub.callCount).to.equal(0);

        }
    });

});
