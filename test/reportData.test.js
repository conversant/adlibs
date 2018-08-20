/* global describe, it, sinon */

'use strict';

var browser = require('../lib/detect/browser');

var expect = require('expect.js'),
	isSafari = browser.detect().name === 'Safari';

/** @type {ReportData} */
var rdSingleton = require('../lib/reportData').provider('test.reportData');

var rdFactory = require('../lib/reportData').factory;

var data = {
    eventData: [
        {trid:1},
        {trid:2},
        {trid:3}
    ]
};
data = JSON.stringify(data);


var singleData = {
    eventData: [
        {trid:3}
    ]
};
singleData = JSON.stringify(data);

var baseUrl ='http://example.com';
var singleParamUrl = baseUrl + '?aid=1';
var twoParamUrl = singleParamUrl + '&bid=2';

describe('reportData', function() {

	it('Should create a new Image with the src url as the logging url.', function() {
		var singletonUrl = rdSingleton.log({ trid: 1, etype: 'bar', vtime: 25, edtl: 'bar' }, false, 'http://example.com/');
		var factoryUrl = rdFactory().log({ trid: 1, etype: 'bar', vtime: 25, edtl: 'bar' }, false, 'http://example.com/');

		expect(singletonUrl).to.equal('http://example.com/?trid=1&etype=bar&vtime=25&edtl=bar');
		expect(factoryUrl).to.equal('http://example.com/?trid=1&etype=bar&vtime=25&edtl=bar');
	});

	it('Should append new query parameters to the query string of the url.', function() {
		var singletonUrl = rdSingleton.log({foo: 'bar' }, false, 'http://example.com/?feeling=awesome');
		var factoryUrl = rdFactory().log({ foo: 'bar' }, false, 'http://example.com/?feeling=awesome');

		expect(singletonUrl).to.equal('http://example.com/?feeling=awesome&foo=bar');
		expect(factoryUrl).to.equal('http://example.com/?feeling=awesome&foo=bar');
	});

	it('Should automatically add the vtime parameter with the delta since page load.', function() {
		var mockPerformance = { now: function() { return 10; }, startTime: 1 };

		var url = rdFactory('http://example.com', mockPerformance).logWithElapsedTime({ foo: 'bar' });

		expect(url).to.equal('http://example.com?foo=bar&vtime=9');
	});

	it('Should use a synchronous XHR call when sending a report during the unload event in Safari.', function() {
		// This test only validates safari specific behavior.
		if (!isSafari) {
			return;
		}

		this.server = sinon.fakeServer.create();
		this.server.respondImmediately = true;

		var url = rdFactory('http://example.com').log({ trid: 1 }, true);

		expect(this.server.requests.length).to.equal(1);
		expect(this.server.requests[0].url).to.equal(url);

		this.server.restore();
	});

	// sendBeacon
    describe('sendBeacon:enabled ', function () {
        if (!(typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function'))) {
            return;
        }

        describe('reportFunction:set_baseUrl ', function (){
            describe('set_baseUrl.sendBeaconParm = true ', function () {
            it('url:baseUrl', function () {
                var beacon = sinon.stub(window.navigator, 'sendBeacon', function (url, data) {
                });
                var imageStub = sinon.stub(window, 'Image', function () {
                    this.src = '';
                });

                var reportData = rdFactory();

                reportData.log({trid: 1});
                reportData.log({trid: 2});
                reportData.log({trid: 3});

                expect(beacon.callCount).to.equal(0);
                expect(imageStub.callCount).to.equal(0);

                reportData._setBaseUrl(baseUrl, true);

                expect(beacon.callCount).to.equal(1);
                expect(imageStub.callCount).to.equal(0);
                expect(beacon.calledWith(baseUrl, data));

                beacon.reset();
                imageStub.reset();
                imageStub.restore();
                beacon.restore();
            });

            it('url:singleParamUrl', function () {
                var beacon = sinon.stub(window.navigator, 'sendBeacon', function (url, data) {
                });
                var imageStub = sinon.stub(window, 'Image', function () {
                    this.src = '';
                });

                var reportData = rdFactory();

                reportData.log({trid: 1});
                reportData.log({trid: 2});
                reportData.log({trid: 3});

                expect(beacon.callCount).to.equal(0);
                expect(imageStub.callCount).to.equal(0);

                reportData._setBaseUrl(singleParamUrl, true);

                expect(beacon.callCount).to.equal(1);
                expect(imageStub.callCount).to.equal(0);
                expect(beacon.calledWith(singleParamUrl, data));

                beacon.reset();
                imageStub.reset();
                imageStub.restore();
                beacon.restore();
            });

            it('url:twoParamUrl', function () {
                if (!(typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function'))) {
                    return;
                }

                var beacon = sinon.stub(window.navigator, 'sendBeacon', function (url, data) {
                });
                var imageStub = sinon.stub(window, 'Image', function () {
                    this.src = '';
                });

                var reportData = rdFactory();

                reportData.log({trid: 1});
                reportData.log({trid: 2});
                reportData.log({trid: 3});

                expect(beacon.callCount).to.equal(0);
                expect(imageStub.callCount).to.equal(0);

                reportData._setBaseUrl(twoParamUrl, true);

                expect(beacon.callCount).to.equal(1);
                expect(imageStub.callCount).to.equal(0);
                expect(beacon.calledWith(twoParamUrl, data));

                beacon.reset();
                imageStub.reset();
                imageStub.restore();
                beacon.restore();
            });
        });
            describe('set_baseUrl.sendBeaconParm = false ', function () {
                it('url:baseUrl', function () {
                    var beacon = sinon.stub(window.navigator, 'sendBeacon', function (url, data) {
                    });
                    var imageStub = sinon.stub(window, 'Image', function () {
                        this.src = '';
                    });

                    var reportData = rdFactory();

                    reportData.log({trid: 1});
                    reportData.log({trid: 2});
                    reportData.log({trid: 3});

                    expect(beacon.callCount).to.equal(0);
                    expect(imageStub.callCount).to.equal(0);

                    reportData._setBaseUrl(baseUrl, false);

                    expect(beacon.callCount).to.equal(0);
                    expect(imageStub.callCount).to.equal(3);
                    expect(imageStub.calledWith(baseUrl + '?' + 'trid=3'));

                    beacon.reset();
                    imageStub.reset();
                    imageStub.restore();
                    beacon.restore();
                });

                it('url:singleParamUrl', function () {
                    var beacon = sinon.stub(window.navigator, 'sendBeacon', function (url, data) {
                    });
                    var imageStub = sinon.stub(window, 'Image', function () {
                        this.src = '';
                    });

                    var reportData = rdFactory();

                    reportData.log({trid: 1});
                    reportData.log({trid: 2});
                    reportData.log({trid: 3});

                    expect(beacon.callCount).to.equal(0);
                    expect(imageStub.callCount).to.equal(0);

                    reportData._setBaseUrl(singleParamUrl, false);

                    expect(beacon.callCount).to.equal(0);
                    expect(imageStub.callCount).to.equal(3);
                    expect(imageStub.calledWith(singleParamUrl + '&' + 'trid=3'));

                    beacon.reset();
                    imageStub.reset();
                    imageStub.restore();
                    beacon.restore();
                });

                it('url:twoParamUrl', function () {
                    if (!(typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function'))) {
                        return;
                    }

                    var beacon = sinon.stub(window.navigator, 'sendBeacon', function (url, data) {
                    });
                    var imageStub = sinon.stub(window, 'Image', function () {
                        this.src = '';
                    });

                    var reportData = rdFactory();

                    reportData.log({trid: 1}, twoParamUrl);
                    reportData.log({trid: 2}, twoParamUrl);
                    reportData.log({trid: 3}, twoParamUrl);

                    expect(beacon.callCount).to.equal(0);
                    expect(imageStub.callCount).to.equal(0);

                    reportData._setBaseUrl(twoParamUrl, false);

                    expect(beacon.callCount).to.equal(0);
                    expect(imageStub.callCount).to.equal(3);
                    expect(imageStub.calledWith(twoParamUrl + '&' + 'trid=3'));

                    beacon.reset();
                    imageStub.reset();
                    imageStub.restore();
                    beacon.restore();
                });
            });
        });

        describe('reportFunction:log(with url) ', function () {
            it('url:baseUrl', function () {
                var beacon = sinon.stub(window.navigator, 'sendBeacon', function (url, data) {
                });
                var imageStub = sinon.stub(window, 'Image', function () {
                    this.src = '';
                });

                var reportData = rdFactory();

                reportData.log({trid: 1}, false, baseUrl, true);
                reportData.log({trid: 2}, false, baseUrl, true);
                reportData.log({trid: 3}, false, baseUrl, true);

                expect(beacon.calledWith(baseUrl, singleData));
                expect(beacon.callCount).to.equal(3);
                expect(imageStub.callCount).to.equal(0);
                expect(beacon.calledWith(baseUrl, singleData));

                beacon.reset();
                imageStub.reset();
                imageStub.restore();
                beacon.restore();
            });

            it('url:singleParamUrl', function () {
                var beacon = sinon.stub(window.navigator, 'sendBeacon', function (url, data) {
                });
                var imageStub = sinon.stub(window, 'Image', function () {
                    this.src = '';
                });

                var reportData = rdFactory();

                reportData.log({trid: 1}, false, singleParamUrl, true);
                reportData.log({trid: 2}, false, singleParamUrl, true);
                reportData.log({trid: 3}, false, singleParamUrl, true);

                expect(beacon.callCount).to.equal(3);
                expect(imageStub.callCount).to.equal(0);
                expect(beacon.calledWith(singleParamUrl, singleData));

                beacon.reset();
                imageStub.reset();
                imageStub.restore();
                beacon.restore();
            });

            it('url:twoParamUrl', function () {
                var beacon = sinon.stub(window.navigator, 'sendBeacon', function (url, data) {
                });
                var imageStub = sinon.stub(window, 'Image', function () {
                    this.src = '';
                });

                var reportData = rdFactory();

                reportData.log({trid: 1}, false, twoParamUrl, true);
                reportData.log({trid: 2}, false, twoParamUrl, true);
                reportData.log({trid: 3}, false, twoParamUrl, true);

                expect(beacon.callCount).to.equal(3);
                expect(imageStub.callCount).to.equal(0);
                expect(beacon.calledWith(twoParamUrl, singleData));

                beacon.reset();
                imageStub.reset();
                imageStub.restore();
                beacon.restore();
            });
        });

        describe('reportFunction:runQueue ', function () {
            describe('runQueue.sendBeaconParm = true ', function () {
                it('url:baseUrl', function () {
                    var beacon = sinon.stub(window.navigator, 'sendBeacon', function (url, data) {
                    });
                    var imageStub = sinon.stub(window, 'Image', function () {
                        this.src = '';
                    });

                    var reportData = rdFactory();

                    reportData.log({trid: 1});
                    reportData.log({trid: 2});
                    reportData.log({trid: 3});

                    expect(beacon.callCount).to.equal(0);
                    expect(imageStub.callCount).to.equal(0);

                    reportData.runQueue(baseUrl, true);

                    expect(beacon.callCount).to.equal(1);
                    expect(imageStub.callCount).to.equal(0);
                    expect(beacon.calledWith(baseUrl, data));

                    beacon.reset();
                    imageStub.reset();
                    imageStub.restore();
                    beacon.restore();
                });

                it('url:singleParamUrl', function () {
                    var beacon = sinon.stub(window.navigator, 'sendBeacon', function (url, data) {
                    });
                    var imageStub = sinon.stub(window, 'Image', function () {
                        this.src = '';
                    });

                    var reportData = rdFactory();

                    reportData.log({trid: 1});
                    reportData.log({trid: 2});
                    reportData.log({trid: 3});

                    expect(beacon.callCount).to.equal(0);
                    expect(imageStub.callCount).to.equal(0);

                    reportData.runQueue(singleParamUrl, true);

                    expect(beacon.callCount).to.equal(1);
                    expect(imageStub.callCount).to.equal(0);
                    expect(beacon.calledWith(singleParamUrl, data));

                    beacon.reset();
                    imageStub.reset();
                    imageStub.restore();
                    beacon.restore();
                });

                it('url:twoParamUrl', function () {
                    var beacon = sinon.stub(window.navigator, 'sendBeacon', function (url, data) {
                    });
                    var imageStub = sinon.stub(window, 'Image', function () {
                        this.src = '';
                    });

                    var reportData = rdFactory();

                    reportData.log({trid: 1});
                    reportData.log({trid: 2});
                    reportData.log({trid: 3});

                    expect(beacon.callCount).to.equal(0);
                    expect(imageStub.callCount).to.equal(0);

                    reportData.runQueue(twoParamUrl, true);

                    expect(beacon.callCount).to.equal(1);
                    expect(imageStub.callCount).to.equal(0);
                    expect(beacon.calledWith(twoParamUrl, data));

                    beacon.reset();
                    imageStub.reset();
                    imageStub.restore();
                    beacon.restore();
                });
            });

            describe('runQueue.sendBeaconParm = false ', function () {
                it('url:baseUrl', function () {
                    var beacon = sinon.stub(window.navigator, 'sendBeacon', function (url, data) {
                    });
                    var imageStub = sinon.stub(window, 'Image', function () {
                        this.src = '';
                    });

                    var reportData = rdFactory();

                    reportData.log({trid: 1});
                    reportData.log({trid: 2});
                    reportData.log({trid: 3});

                    expect(beacon.callCount).to.equal(0);
                    expect(imageStub.callCount).to.equal(0);

                    reportData.runQueue(baseUrl, false);

                    expect(beacon.callCount).to.equal(0);
                    expect(imageStub.callCount).to.equal(3);
                    expect(imageStub.calledWith(baseUrl + '?' + 'trid=3'));

                    beacon.reset();
                    imageStub.reset();
                    imageStub.restore();
                    beacon.restore();
                });

                it('url:singleParamUrl', function () {
                    var beacon = sinon.stub(window.navigator, 'sendBeacon', function (url, data) {
                    });
                    var imageStub = sinon.stub(window, 'Image', function () {
                        this.src = '';
                    });

                    var reportData = rdFactory();

                    reportData.log({trid: 1});
                    reportData.log({trid: 2});
                    reportData.log({trid: 3});

                    expect(beacon.callCount).to.equal(0);
                    expect(imageStub.callCount).to.equal(0);

                    reportData.runQueue(singleParamUrl, false);

                    expect(beacon.callCount).to.equal(0);
                    expect(imageStub.callCount).to.equal(3);
                    expect(imageStub.calledWith(singleParamUrl + '&' + 'trid=3'));

                    beacon.reset();
                    imageStub.reset();
                    imageStub.restore();
                    beacon.restore();
                });

                it('url:twoParamUrl', function () {
                    var beacon = sinon.stub(window.navigator, 'sendBeacon', function (url, data) {
                    });
                    var imageStub = sinon.stub(window, 'Image', function () {
                        this.src = '';
                    });

                    var reportData = rdFactory();

                    reportData.log({trid: 1});
                    reportData.log({trid: 2});
                    reportData.log({trid: 3});

                    expect(beacon.callCount).to.equal(0);
                    expect(imageStub.callCount).to.equal(0);

                    reportData.runQueue(twoParamUrl, false);

                    expect(beacon.callCount).to.equal(0);
                    expect(imageStub.callCount).to.equal(3);
                    expect(imageStub.calledWith(twoParamUrl + '&' + 'trid=3'));

                    beacon.reset();
                    imageStub.reset();
                    imageStub.restore();
                    beacon.restore();
                });
            });
        });
    });

    // sendBeacon
    describe('sendBeacon:disabled ', function () {
        describe('reportFunction:set_baseUrl ', function () {
            it('url:baseUrl', function () {
                var sendBeaconAllias;
                if (typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function')) {
                    sendBeaconAllias = window.navigator.sendBeacon;
                    window.navigator.sendBeacon = undefined;
                }

                var imageStub = sinon.stub(window, 'Image', function () {
                    this.src = '';
                });

                var reportData = rdFactory();

                reportData.log({trid: 1});
                reportData.log({trid: 2});
                reportData.log({trid: 3});

                expect(imageStub.callCount).to.equal(0);

                reportData._setBaseUrl(baseUrl, true);

                expect(imageStub.callCount).to.equal(3);
                expect(imageStub.calledWith(baseUrl + '?' + 'trid=3'));

                imageStub.reset();
                imageStub.restore();
                window.navigator.sendBeacon = sendBeaconAllias;
            });

            it('url:singleParamUrl', function () {
                var sendBeaconAllias;
                if (typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function')) {
                    sendBeaconAllias = window.navigator.sendBeacon;
                    window.navigator.sendBeacon = undefined;
                }

                var imageStub = sinon.stub(window, 'Image', function () {
                    this.src = '';
                });

                var reportData = rdFactory();

                reportData.log({trid: 1});
                reportData.log({trid: 2});
                reportData.log({trid: 3});

                expect(imageStub.callCount).to.equal(0);

                reportData._setBaseUrl(singleParamUrl, true);

                expect(imageStub.callCount).to.equal(3);
                expect(imageStub.calledWith(singleParamUrl + '&' + 'trid=3'));

                imageStub.reset();
                imageStub.restore();
                window.navigator.sendBeacon = sendBeaconAllias;
            });

            it('url:twoParamUrl', function () {
                var sendBeaconAllias;
                if (typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function')) {
                    sendBeaconAllias = window.navigator.sendBeacon;
                    window.navigator.sendBeacon = undefined;
                }

                var imageStub = sinon.stub(window, 'Image', function () {
                    this.src = '';
                });

                var reportData = rdFactory();

                reportData.log({trid: 1}, twoParamUrl);
                reportData.log({trid: 2}, twoParamUrl);
                reportData.log({trid: 3}, twoParamUrl);

                expect(imageStub.callCount).to.equal(0);

                reportData._setBaseUrl(twoParamUrl, true);

                expect(imageStub.callCount).to.equal(3);
                expect(imageStub.calledWith(twoParamUrl + '&' + 'trid=3'));

                imageStub.reset();
                imageStub.restore();
                window.navigator.sendBeacon = sendBeaconAllias;
            });
        });

        describe('reportFunction:log(with url) ', function () {
            describe('isUnloadEvent:true ', function () {
                it('url:baseUrl', function () {
                    var sendBeaconAllias;
                    if (typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function')) {
                        sendBeaconAllias = window.navigator.sendBeacon;
                        window.navigator.sendBeacon = undefined;
                    }

                    var imageStub = sinon.stub(window, 'Image', function () {
                        this.src = '';
                    });
                    this.server = sinon.fakeServer.create();
                    this.server.respondImmediately = true;

                    var reportData = rdFactory();

                    reportData.log({trid: 1}, true, baseUrl);
                    reportData.log({trid: 2}, true, baseUrl);
                    reportData.log({trid: 3}, true, baseUrl);


                    if(isSafari){
                        expect(imageStub.callCount).to.equal(0);
                        expect(this.server.requests.length).to.equal(3);
                        expect(this.server.requests[0].url).to.equal(baseUrl + '?' + 'trid=1');
                    } else {
                        expect(imageStub.callCount).to.equal(3);
                        expect(imageStub.calledWith(baseUrl + '?' + 'trid=3'));
                    }

                    imageStub.reset();
                    imageStub.restore();
                    window.navigator.sendBeacon = sendBeaconAllias;
                    this.server.restore();
                });

                it('url:singleParamUrl', function () {
                    var sendBeaconAllias;
                    if (typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function')) {
                        sendBeaconAllias = window.navigator.sendBeacon;
                        window.navigator.sendBeacon = undefined;
                    }

                    var imageStub = sinon.stub(window, 'Image', function () {
                        this.src = '';
                    });
                    this.server = sinon.fakeServer.create();
                    this.server.respondImmediately = true;

                    var reportData = rdFactory();

                    reportData.log({trid: 1}, true, singleParamUrl);
                    reportData.log({trid: 2}, true, singleParamUrl);
                    reportData.log({trid: 3}, true, singleParamUrl);

                    if (isSafari) {
                        expect(imageStub.callCount).to.equal(0);
                        expect(this.server.requests.length).to.equal(3);
                        expect(this.server.requests[0].url).to.equal(singleParamUrl + '&' + 'trid=1');
                    } else {
                        expect(imageStub.callCount).to.equal(3);
                        expect(imageStub.calledWith(singleParamUrl + '?' + 'trid=3'));
                    }

                    imageStub.reset();
                    imageStub.restore();
                    window.navigator.sendBeacon = sendBeaconAllias;
                    this.server.restore();
                });

                it('url: twoParamUrl', function () {
                    var sendBeaconAllias;
                    if (typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function')) {
                        sendBeaconAllias = window.navigator.sendBeacon;
                        window.navigator.sendBeacon = undefined;
                    }

                    var imageStub = sinon.stub(window, 'Image', function () {
                        this.src = '';
                    });
                    this.server = sinon.fakeServer.create();
                    this.server.respondImmediately = true;

                    var reportData = rdFactory();

                    reportData.log({trid: 1}, true, twoParamUrl);
                    reportData.log({trid: 2}, true, twoParamUrl);
                    reportData.log({trid: 3}, true, twoParamUrl);

                    if (isSafari) {
                        expect(imageStub.callCount).to.equal(0);
                        expect(this.server.requests.length).to.equal(3);
                        expect(this.server.requests[0].url).to.equal(twoParamUrl + '&' + 'trid=1');
                    } else {
                        expect(imageStub.callCount).to.equal(3);
                        expect(imageStub.calledWith(twoParamUrl + '?' + 'trid=3'));
                    }

                    imageStub.reset();
                    imageStub.restore();
                    window.navigator.sendBeacon = sendBeaconAllias;
                    this.server.restore();
                });
            });
            describe('isUnloadEvent:false ', function () {
                it('url:baseUrl', function () {
                    var sendBeaconAllias;
                    if (typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function')) {
                        sendBeaconAllias = window.navigator.sendBeacon;
                        window.navigator.sendBeacon = undefined;
                    }

                    var imageStub = sinon.stub(window, 'Image', function () {
                        this.src = '';
                    });

                    var reportData = rdFactory();

                    reportData.log({trid: 1}, false, baseUrl);
                    reportData.log({trid: 2}, false, baseUrl);
                    reportData.log({trid: 3}, false, baseUrl);

                    expect(imageStub.callCount).to.equal(3);
                    expect(imageStub.calledWith(baseUrl + '?' + 'trid=3'));

                    imageStub.reset();
                    imageStub.restore();
                    window.navigator.sendBeacon = sendBeaconAllias;
                });

                it('url:singleParamUrl', function () {
                    var sendBeaconAllias;
                    if (typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function')) {
                        sendBeaconAllias = window.navigator.sendBeacon;
                        window.navigator.sendBeacon = undefined;
                    }

                    var imageStub = sinon.stub(window, 'Image', function () {
                        this.src = '';
                    });

                    var reportData = rdFactory();

                    reportData.log({trid: 1}, false, singleParamUrl);
                    reportData.log({trid: 2}, false, singleParamUrl);
                    reportData.log({trid: 3}, false, singleParamUrl);

                    expect(imageStub.callCount).to.equal(3);
                    expect(imageStub.calledWith(singleParamUrl + '&' + 'trid=3'));

                    imageStub.reset();
                    imageStub.restore();
                    window.navigator.sendBeacon = sendBeaconAllias;
                });

                it('url: twoParamUrl', function () {
                    var sendBeaconAllias;
                    if (typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function')) {
                        sendBeaconAllias = window.navigator.sendBeacon;
                        window.navigator.sendBeacon = undefined;
                    }

                    var imageStub = sinon.stub(window, 'Image', function () {
                        this.src = '';
                    });

                    var reportData = rdFactory();

                    reportData.log({trid: 1}, false, twoParamUrl);
                    reportData.log({trid: 2}, false, twoParamUrl);
                    reportData.log({trid: 3}, false, twoParamUrl);

                    expect(imageStub.callCount).to.equal(3);
                    expect(imageStub.calledWith(twoParamUrl+ '&' + 'trid=3'));

                    imageStub.reset();
                    imageStub.restore();
                    window.navigator.sendBeacon = sendBeaconAllias;
                });
            });
        });

        describe('reportFunction:runQueue ', function () {
            describe('runQueue.sendBeaconParm = true ', function () {
                it('url:baseUrl', function () {
                    var sendBeaconAllias;
                    if (typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function')) {
                        sendBeaconAllias = window.navigator.sendBeacon;
                        window.navigator.sendBeacon = undefined;
                    }

                    var imageStub = sinon.stub(window, 'Image', function () {
                        this.src = '';
                    });

                    var reportData = rdFactory();

                    reportData.log({trid: 1});
                    reportData.log({trid: 2});
                    reportData.log({trid: 3});

                    expect(imageStub.callCount).to.equal(0);

                    reportData.runQueue(baseUrl, true);

                    expect(imageStub.callCount).to.equal(3);
                    expect(imageStub.calledWith(baseUrl + '?' + 'trid=3'));

                    imageStub.reset();
                    imageStub.restore();
                    window.navigator.sendBeacon = sendBeaconAllias;
                });

                it('url:singleParamUrl', function () {
                    var sendBeaconAllias;
                    if (typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function')) {
                        sendBeaconAllias = window.navigator.sendBeacon;
                        window.navigator.sendBeacon = undefined;
                    }

                    var imageStub = sinon.stub(window, 'Image', function () {
                        this.src = '';
                    });

                    var reportData = rdFactory();

                    reportData.log({trid: 1});
                    reportData.log({trid: 2});
                    reportData.log({trid: 3});

                    expect(imageStub.callCount).to.equal(0);

                    reportData.runQueue(singleParamUrl, true);

                    expect(imageStub.callCount).to.equal(3);
                    expect(imageStub.calledWith(singleParamUrl + '&' + 'trid=3'));

                    imageStub.reset();
                    imageStub.restore();
                    window.navigator.sendBeacon = sendBeaconAllias;
                });

                it('url:twoParamUrl', function () {
                    var sendBeaconAllias;
                    if (typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function')) {
                        sendBeaconAllias = window.navigator.sendBeacon;
                        window.navigator.sendBeacon = undefined;
                    }

                    var imageStub = sinon.stub(window, 'Image', function () {
                        this.src = '';
                    });

                    var reportData = rdFactory();

                    reportData.log({trid: 1});
                    reportData.log({trid: 2});
                    reportData.log({trid: 3});

                    expect(imageStub.callCount).to.equal(0);

                    reportData.runQueue(twoParamUrl, true);

                    expect(imageStub.callCount).to.equal(3);
                    expect(imageStub.calledWith(twoParamUrl + '&' + 'trid=3'));

                    imageStub.reset();
                    imageStub.restore();
                    window.navigator.sendBeacon = sendBeaconAllias;
                });
            });

            describe('runQueue.sendBeaconParm = false ', function () {
                it('url:baseUrl', function () {
                    var sendBeaconAllias;
                    if (typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function')) {
                        sendBeaconAllias = window.navigator.sendBeacon;
                        window.navigator.sendBeacon = undefined;
                    }

                    var imageStub = sinon.stub(window, 'Image', function () {
                        this.src = '';
                    });

                    var reportData = rdFactory();

                    reportData.log({trid: 1});
                    reportData.log({trid: 2});
                    reportData.log({trid: 3});

                    expect(imageStub.callCount).to.equal(0);

                    reportData.runQueue(baseUrl, false);

                    expect(imageStub.callCount).to.equal(3);
                    expect(imageStub.calledWith(singleParamUrl + '?' + 'trid=3'));

                    imageStub.reset();
                    imageStub.restore();
                    window.navigator.sendBeacon = sendBeaconAllias;
                });

                it('url:singleParamUrl', function () {
                    var sendBeaconAllias;
                    if (typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function')) {
                        sendBeaconAllias = window.navigator.sendBeacon;
                        window.navigator.sendBeacon = undefined;
                    }

                    var imageStub = sinon.stub(window, 'Image', function () {
                        this.src = '';
                    });

                    var reportData = rdFactory();

                    reportData.log({trid: 1});
                    reportData.log({trid: 2});
                    reportData.log({trid: 3});

                    expect(imageStub.callCount).to.equal(0);

                    reportData.runQueue(singleParamUrl, true);

                    expect(imageStub.callCount).to.equal(3);
                    expect(imageStub.calledWith(singleParamUrl + '&' + 'trid=3'));

                    imageStub.reset();
                    imageStub.restore();
                    window.navigator.sendBeacon = sendBeaconAllias;
                });

                it('url:twoParamUrl', function () {
                    var sendBeaconAllias;
                    if (typeof window.navigator === 'object' && (typeof window.navigator.sendBeacon === 'function')) {
                        sendBeaconAllias = window.navigator.sendBeacon;
                        window.navigator.sendBeacon = undefined;
                    }

                    var imageStub = sinon.stub(window, 'Image', function () {
                        this.src = '';
                    });

                    var reportData = rdFactory();

                    reportData.log({trid: 1});
                    reportData.log({trid: 2});
                    reportData.log({trid: 3});

                    expect(imageStub.callCount).to.equal(0);

                    reportData.runQueue(twoParamUrl, true);

                    expect(imageStub.callCount).to.equal(3);
                    expect(imageStub.calledWith(twoParamUrl + '&' + 'trid=3'));

                    imageStub.reset();
                    imageStub.restore();

                    window.navigator.sendBeacon = sendBeaconAllias;
                });
            });
        });
    });
});