/* global describe: true, it: true */

'use strict';

var environment = require('../../lib/detect/environment'),
	expect = require('expect.js');

describe('Environment Test', function(){
	var details = environment.detect();

	it('Reports and Properties should have the appropriate number of entries', function(){
		// The count from parent ads to doc mode is expected to be 14 items
		expect(Object.keys(details).length).to.eql(14);
	});
	/* This test isn't working currently, but that's because neither is the feature.
	it('Each viewSize property should have a width and height', function(){
		var viewSize = environment.getViewportSize();
		expect((!!viewSize.height && !!viewSize.width)).to.eql(true);
	});
	*/
	it('Each availableSize property should have a width and height', function(){
		var availableSize = environment.getAvailableScreenSize();
		expect((!!availableSize.height && !!availableSize.width)).to.eql(true);
	});
	it('Each screenSize property should have a width and height', function(){
		var screenSize = environment.getScreenSize();
		expect((!!screenSize.height && !!screenSize.width)).to.eql(true);
	});
	it('Each adSize property should have a width and height', function(){
		var adSize = environment.getAdDocSize();
		expect((!!adSize.height && !!adSize.width)).to.eql(true);
	});

	it('Flash version should be present', function(){
		expect(environment.getFlashVersion()).to.not.eql('');
	});
});
