/* global describe, it, beforeEach */
'use strict';

// various user agents to test edge cases in detect functionality
var chrome12 = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.68 Safari/534.30',
	chrome46 = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36',
	firefox33 = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10; rv:33.0) Gecko/20100101 Firefox/33.0',
	firefox44 = 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:41.0) Gecko/20100101 Firefox/44.0',
	edge12 = 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10136',
	mobileChrome49 = 'Mozilla/5.0 (Linux; Android 5.0; SM-G900V Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.91 Mobile Safari/537.36',
	wii = 'Opera/9.30 (Nintendo Wii; U; ; 2047-7;pt-br)',
	playstation = 'Mozilla/5.0 (PLAYSTATION 3; 3.55)',
	android4 = 'Mozilla/5.0 (Linux; U; Android 4.0.3; de-ch; HTC Sensation Build/IML74K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
	operaMini = 'Opera/9.80 (J2ME/MIDP; Opera Mini/9.80 (S60; SymbOS; Opera Mobi/23.348; U; en) Presto/2.5.25 Version/10.54',
	ie9 = 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
	ie8 = 'Mozilla/5.0 (compatible; MSIE 7.0; Windows NT 5.0; Trident/4.0; FBSMTWB; .NET CLR 2.0.34861; .NET CLR 3.0.3746.3218; .NET CLR 3.5.33652; msn OptimizedIE8;ENUS)',
	windowsPhone = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 920)',
	blackberry = 'Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.1.0.346 Mobile Safari/534.11+',
	iphone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_4 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B350 Safari/8536.25',
	safari7 = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A';

var browser = require('../../lib/detect/browser'),
	defaults = require('../../lib/defaults'),
	expect = require('expect.js'),
	canHas = require('../../lib/canHas');

describe('detect/browser', function() {
	// Generic tests that will use given window object and user agent string
	var details = browser.detect();
	it('Each result should be present', function() {
		// The count from trustworthy to console is expected to be 11 items
		expect(Object.keys(details).length).to.eql(17);
	});

	it('Each result should be non-empty', function() {
		// The count from trustworthy to console is expected to be 11 items
		for (var i in details){
			expect(details[i]).to.not.eql(null);
		}
	});
});

// Generic tests that ensure our version logic is working as intended
describe('detect/browser/getVersion', function () {

	it('Should be the minimum version', function () {
		var ver = browser.getVersion(1, 3, 5);
		expect(ver).to.equal(3);
	});

	it('Should be the UA version as there is no max value', function () {
		var ver = browser.getVersion(30, 3);
		expect(ver).to.equal(30);
	});

	it('Should be the UA version because it is lower than the max', function () {
		var ver = browser.getVersion(30, 3, 40);
		expect(ver).to.equal(30);
	});

	it('Should be the UA version because it is lower than the max', function () {
		var ver = browser.getVersion(49, 34, Infinity);
		expect(ver).to.equal(49);
	});

	it('Should use the max because the user agent version exceeds it', function () {
		var ver = browser.getVersion(49, 34, 45);
		expect(ver).to.equal(45);
	});
});

describe('detect/browser/browserTypes', function () {

	it('Should detect Internet Explorer', function () {
		if (isIE()) {
			var honestUA = browser.detect(),
				dishonestUA = browser.detect(window, chrome46);

			expect(honestUA.name).to.equal('Internet Explorer');
			expect(dishonestUA.name).to.equal('Internet Explorer');
			ensureHonestResults(honestUA, dishonestUA);
		}
	});

	it('Should detect MS Edge', function () {
		if (isEdge()) {
			var honestUA = browser.detect(),
				dishonestUA = browser.detect(window, firefox44);

			expect(honestUA.name).to.equal('Edge');
			expect(dishonestUA.name).to.equal('Edge');
			ensureHonestResults(honestUA, dishonestUA);
		}
	});

	it('Should detect Firefox', function () {
		if (isFirefox()) {
			var honestUA = browser.detect(),
				dishonestUA = browser.detect(window, chrome46);

			expect(honestUA.name).to.equal('Firefox');
			expect(dishonestUA.name).to.equal('Firefox');
			ensureHonestResults(honestUA, dishonestUA);
		}
	});

	it('Should detect Chrome', function () {
		if (isChrome()) {
			var honestUA = browser.detect(),
				dishonestUA = browser.detect(window, firefox44);

			expect(honestUA.name).to.equal('Chrome');
			expect(dishonestUA.name).to.equal('Chrome');
			ensureHonestResults(honestUA, dishonestUA);
		}
	});

	it('Should detect Safari', function () {
		if (isSafari()) {
			var honestUA = browser.detect(),
				dishonestUA = browser.detect(window, firefox44);

			expect(honestUA.name).to.equal('Safari');
			expect(dishonestUA.name).to.equal('Safari');
			ensureHonestResults(honestUA, dishonestUA);
		}
	});

	it('Should detect Android', function () {
		if (isAndroid()) {
			var honestUA = browser.detect(),
				dishonestUA = browser.detect(window, firefox44);
			expect(honestUA.name).to.equal('Android');
			expect(dishonestUA.name).to.equal('Android');
			ensureHonestResults(honestUA, dishonestUA);
		}
	});

	it('Should detect iPhone/iPad', function () {
		if (isiPhone() || isiPad()) {
			var honestUA = browser.detect(),
				dishonestUA = browser.detect(window, firefox44);
			expect(honestUA.name).to.equal('Mobile Safari');
			expect(dishonestUA.name).to.equal('Mobile Safari');
			ensureHonestResults(honestUA, dishonestUA);
		}
	});
});

// Compares an honest and dishonest array of results
// This should be consistent across platforms
function ensureHonestResults (honestUA, dishonestUA) {
	// expect the honest one to be trustworthy
	expect(honestUA.trustworthy).to.equal(true);
	// vice versa for the dishonest ua
	expect(dishonestUA.trustworthy).to.equal(false);
	// we should expect the script to get the same browser name
	expect(honestUA.name).to.equal(dishonestUA.name);
	// we should expect it to set something for the engine...even unknown
	expect(Object.keys(honestUA.engine.name).length).to.not.equal(0);
	expect(Object.keys(dishonestUA.engine.name).length).to.not.equal(0);
	// the final 4 parts, defining the environment, should be the same
	expect(honestUA.desktop).to.equal(dishonestUA.desktop);
	expect(honestUA.mobile).to.equal(dishonestUA.mobile);
	expect(honestUA.tablet).to.equal(dishonestUA.tablet);
	expect(honestUA.console).to.equal(dishonestUA.console);
	// for testing, the honest ua should never exceed the max
	expect(honestUA.max).to.equal('ok');
	// a dishonest UA may result in a very different version
	// in the event that a UA is being dishonest, we default to lower possible version
	// it is for this reason we don't compare version properties
}

// Universal function for validating the results from the detect function
function validateDetails(details) {
	expect(details.name).to.be.a('string');
	expect(details.version).to.be.a('number');
	expect(details.trustworthy).to.be.a('boolean');
	expect(details.desktop).to.be.a('boolean');
	expect(details.mobile).to.be.a('boolean');
	expect(details.tablet).to.be.a('boolean');
	expect(details.console).to.be.a('boolean');
	expect(details.max).to.be.a('string');
	expect(details.ua).to.be.a('object');
	expect(details.feature).to.be.a('object');
	expect(details.engine).to.be.a('object');
	expect(details.os).to.be.a('object');
	expect(details.isIE).to.be.a('boolean');
	expect(details.isFF).to.be.a('boolean');
	expect(details.isOpera).to.be.a('boolean');
	expect(details.isChrome).to.be.a('boolean');
	expect(details.isSafari).to.be.a('boolean');
}

describe('detect/browser/ validate details datatypes', function () {
	it('Should have details with the correct data types', function () {
		browser.detect();
		validateDetails(browser.details);
	});
});

function isIE() {
	var ua = window.navigator.userAgent,
	    msie = ua.toLowerCase().indexOf('msie '),
	    trident = ua.toLowerCase().indexOf('trident/');
	return msie > -1 || trident > -1;
}

function isEdge() {
	var ua = window.navigator.userAgent,
		edge = ua.toLowerCase().indexOf('edge/');
	return edge > -1;
}

function isFirefox() {
	var ua = window.navigator.userAgent,
		mob = ua.toLowerCase().indexOf('mobile'),
		ff = ua.toLowerCase().indexOf('firefox');
	return ff > -1 && mob === -1;
}

function isChrome() {
	var ua = window.navigator.userAgent,
		chr = ua.toLowerCase().indexOf('chrome'),
		mob = ua.toLowerCase().indexOf('mobile'),
		edge = ua.toLowerCase().indexOf('edge');
	return chr > -1 && edge === -1 && mob === -1;
}

function isSafari() {
	var ua = window.navigator.userAgent,
		saf = ua.toLowerCase().indexOf('safari'),
		mob = ua.toLowerCase().indexOf('mobile'),
		chr = ua.toLowerCase().indexOf('chrome');
	return saf > -1 && chr === -1 && mob === -1;
}

function isMobile() {
	var ua = window.navigator.userAgent;
	var ff = ua.toLowerCase().indexOf('mobile');
	return ff > -1;
}

function isAndroid() {
	var ua = window.navigator.userAgent,
		android = ua.toLowerCase().indexOf('android'),
		mob = ua.toLowerCase().indexOf('mobile');
	return android > -1 && mob > -1;
}

function isiPhone() {
	var ua = window.navigator.userAgent,
		iphone = ua.toLowerCase().indexOf('iphone'),
		mob = ua.toLowerCase().indexOf('mobile');
	return iphone > -1 && mob > -1;
}

function isiPad() {
	var ua = window.navigator.userAgent,
		ipad = ua.toLowerCase().indexOf('ipad'),
		mob = ua.toLowerCase().indexOf('mobile');
	return ipad > -1 && mob > -1;
}

