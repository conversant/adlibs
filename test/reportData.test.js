/* global describe, it, sinon */

'use strict';

var browser = require('../lib/detect/browser');

var expect = require('expect.js'),
	isSafari = browser.detect().name === 'Safari';

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


    describe('Use setBaseUrl to send report ', function () {
        it('when sendBeacon is avaiable.', function() {
            if (!(typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function'))) {
                return;
            }

            var beacon = sinon.stub(window.navigator, 'sendBeacon', function(url, data) {});
            var imageStub = sinon.stub(window, 'Image', function(x, y) {
                this.x = 0;
                this.y = 0;
                this.src = '';
            });

            var reportData = rdFactory();

            reportData.log({ trid: 1 });
            reportData.log({ trid: 2 });
            reportData.log({ trid: 3 });

            expect(beacon.callCount).to.equal(0);
            expect(imageStub.callCount).to.equal(0);

            reportData._setBaseUrl('http://fooNoSendBeconTest.com', true);

            expect(beacon.callCount).to.equal(1);
            expect(imageStub.callCount).to.equal(0);

            beacon.reset();
            imageStub.reset();
            imageStub.restore();
            beacon.restore();
        });

        it('when sendBeacon is NOT avaiable', function() {
            if (typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function')) {
                return true;
            }

            var imageStub = sinon.stub(window, 'Image', function(x, y) {
                this.x = 0;
                this.y = 0;
                this.src = '';
            });

            var reportData = rdFactory();

            reportData.log({trid: 1});
            reportData.log({trid: 2});
            reportData.log({trid: 3});

            expect(imageStub.callCount).to.equal(0);

            reportData._setBaseUrl('http://foo.com');

            expect(imageStub.callCount).to.equal(3);
            imageStub.reset();
            imageStub.restore();
        });
    });

    describe('Use runQueue to send report ', function () {
        it('when sendBeacon is avaiable.', function() {
            if (!(typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function'))) {
                return;
            }

            var beacon = sinon.stub(window.navigator, 'sendBeacon', function(url, data) {});
            var imageStub = sinon.stub(window, 'Image', function(x, y) {
                this.x = 0;
                this.y = 0;
                this.src = '';
            });

            var reportData = rdFactory();

            reportData.log({ trid: 1 });
            reportData.log({ trid: 2 });
            reportData.log({ trid: 3 });

            expect(beacon.callCount).to.equal(0);
            expect(imageStub.callCount).to.equal(0);

            reportData.runQueue('http://fooNoSendBeconTest.com', true);

            expect(beacon.callCount).to.equal(1);
            expect(imageStub.callCount).to.equal(0);

            beacon.reset();
            imageStub.reset();
            imageStub.restore();
            beacon.restore();
        });

        it('when sendBeacon is NOT used', function() {
            if (typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function')) {
                return true;
            }

            var imageStub = sinon.stub(window, 'Image', function(x, y) {
                this.x = 0;
                this.y = 0;
                this.src = '';
            });

            var reportData = rdFactory();

            reportData.log({trid: 1});
            reportData.log({trid: 2});
            reportData.log({trid: 3});

            expect(imageStub.callCount).to.equal(0);

            reportData.runQueue('http://foo.com');

            expect(imageStub.callCount).to.equal(3);
            imageStub.reset();
            imageStub.restore();
        });

        it('when sendBeacon is explicitly NOT used', function() {
            if (typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function')) {
                return true;
            }

            var imageStub = sinon.stub(window, 'Image', function(x, y) {
                this.x = 0;
                this.y = 0;
                this.src = '';
            });

            var reportData = rdFactory();

            reportData.log({trid: 1});
            reportData.log({trid: 2});
            reportData.log({trid: 3});

            expect(imageStub.callCount).to.equal(0);

            reportData.runQueue('http://foo.com', false);

            expect(imageStub.callCount).to.equal(3);
            imageStub.reset();
            imageStub.restore();
        });

        it('when sendBeacon is NOT used, a url with query string params is used', function() {
            if (typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function')) {
                return true;
            }

            var imageStub = sinon.stub(window, 'Image', function(x, y) {
                this.x = 0;
                this.y = 0;
                this.src = '';
            });

            var reportData = rdFactory();

            var url = reportData.log({trid: 1, comId: 123}, null, 'http://foo.com');

            expect(url).to.equal('http://foo.com?trid=1&comId=123');
            expect(imageStub.callCount).to.equal(1);
            imageStub.reset();
            imageStub.restore();
        });
    });

    describe('A url is passed ', function () {
        it('When sendBeacon is avaiable', function() {
            if (!(typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function'))) {
                return;
            }

            var beacon = sinon.stub(navigator, 'sendBeacon', function(url, data) {});
            var imageStub = sinon.stub(window, 'Image', function(x, y) {
                this.x = 0;
                this.y = 0;
                this.src = '';
            });

            var reportData = rdFactory();
            expect(beacon.callCount).to.equal(0);
            expect(imageStub.callCount).to.equal(0);

            reportData.log({ trid: 1 }, null, 'http://foo.com', true);
            reportData.log({ trid: 2 }, null, 'http://foo.com', true);

            expect(beacon.callCount).to.equal(2);
            expect(imageStub.callCount).to.equal(0);

            beacon.reset();
            imageStub.reset();
            imageStub.restore();
            beacon.restore();
        });

        it('When sendBeacon is NOT avaiable', function() {
            if ((typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function'))) {
                return;
            }

            var imageStub = sinon.stub(window, 'Image', function(x, y) {
                this.x = 0;
                this.y = 0;
                this.src = '';
            });

            var reportData = rdFactory();
            expect(imageStub.callCount).to.equal(0);

            reportData.log({ trid: 1 }, null, 'http://foo.com', true);
            reportData.log({ trid: 2 }, null, 'http://foo.com', true);

            expect(imageStub.callCount).to.equal(2);

            imageStub.reset();
            imageStub.restore();
        });
    });

    describe('Safari tests ', function () {
        it('Use xmlhtprequest instead of image.src', function() {
            if (!isSafari) {
                return;
            }

            var imageStub = sinon.stub(window, 'Image', function(x, y) {
                this.x = 0;
                this.y = 0;
                this.src = '';
            });
            this.server = sinon.fakeServer.create();
            this.server.respondImmediately = true;


            var reportData = rdFactory();
            expect(imageStub.callCount).to.equal(0);
            expect(this.server.requests.length).to.equal(0);
            
            reportData.log({ trid: 1 }, true, 'http://foo.com', true);
            reportData.log({ trid: 2 }, true, 'http://foo.com', true);

            expect(this.server.requests.length).to.equal(2);
            expect(this.server.requests[0].url).to.equal('http://foo.com?trid=1');
            expect(this.server.requests[1].url).to.equal('http://foo.com?trid=2');
            expect(imageStub.callCount).to.equal(0);

            this.server.restore();
            imageStub.reset();
            imageStub.restore();
        });

        it('Use xmlhtprequest instead of image.src', function() {
            if (!isSafari) {
                return;
            }

            var imageStub = sinon.stub(window, 'Image', function(x, y) {
                this.x = 0;
                this.y = 0;
                this.src = '';
            });
            this.server = sinon.fakeServer.create();
            this.server.respondImmediately = true;


            var reportData = rdFactory();
            expect(imageStub.callCount).to.equal(0);
            expect(this.server.requests.length).to.equal(0);

            reportData.log({ trid: 1 }, false, 'http://foo.com', true);
            reportData.log({ trid: 2 }, false, 'http://foo.com', true);

            expect(this.server.requests.length).to.equal(0);
            expect(imageStub.callCount).to.equal(2);

            this.server.restore();
            imageStub.reset();
            imageStub.restore();
        });
    });
});