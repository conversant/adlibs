/* global describe, it, beforeEach */

'use strict';

var detectMraid = require('../../lib/detect/mraid'),
	defaults = require('../../lib/defaults'),
	expect = require('expect.js');

describe('Mraid test', function () {

	var mockWindow;

	beforeEach(function () {
		mockWindow = defaults({}, window);
	});

	it('Should return -1 for version as mraid is not present on the window', function () {
		expect(detectMraid.getVersion(mockWindow)).to.equal('-1');
	});

	it('Should return 2.0.0 for version as mraid is on the window', function () {
		mockWindow.mraid = {};
		mockWindow.mraid.getVersion = function () { return '2.0.0' };

		expect(detectMraid.getVersion(mockWindow)).to.equal('2.0.0');
	});

	it('Should execute ready immediately. Mraid is not present', function () {
		var readyResult = 'waiting';
		detectMraid.ready(function () {
			readyResult = 'ready';
		}, mockWindow);

		expect(readyResult).to.equal('ready');
	});

	it('Should execute immediately. Mraid will not be present on default window object', function () {
		var readyResult = 'waiting';
		detectMraid.ready(function () {
			readyResult = 'ready';
		});

		expect(readyResult).to.equal('ready');
	});

	it('Should listen for a ready event, as mraid is present', function () {
		var readyResult = 'waiting';
		mockWindow.mraid = {};
		detectMraid.ready(function () {
			readyResult = 'ready';
		}, mockWindow);

		expect(readyResult).to.equal('waiting');
	});
});
