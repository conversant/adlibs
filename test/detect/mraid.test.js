/* global describe, it, beforeEach */

'use strict';

const detectMraid = require('../../lib/detect/mraid'),
	defaults = require('../../lib/defaults'),
	expect = require('expect.js');

describe('Mraid test', function () {

	let mockWindow;

	beforeEach(function () {
		mockWindow = typeof(window) !== 'undefined' ? window : {};
        delete mockWindow.mraid;
	});

	it('Should return -1 for version as mraid is not present on the window', function () {
		expect(detectMraid.getVersion({})).to.equal('-1');
	});

	it('Should return 2.0.0 for version as mraid is on the window', function () {
		mockWindow.mraid = {};
		mockWindow.mraid.getVersion = function () { return '2.0.0' };

		expect(detectMraid.getVersion(mockWindow)).to.equal('2.0.0');
	});

	it('Should execute ready immediately. Mraid is not present', function () {
		let readyResult = 'waiting';
		detectMraid.ready(function () {
			readyResult = 'ready';
		}, mockWindow);

        expect(readyResult).to.equal('ready');
	});

	it('Should execute immediately. Mraid will not be present on default window object', function (done) {
		let readyResult = 'waiting';
		detectMraid.ready(function () {
			readyResult = 'ready';
            done();
		}, mockWindow);

        expect(readyResult).to.equal('ready');
    
	});


	it('Should listen for a ready event, as mraid is present', function () {
		let readyResult = 'waiting';
		mockWindow.mraid = {};
		detectMraid.ready(function () {
			readyResult = 'ready';
		}, mockWindow);

		expect(readyResult).to.equal('waiting');
	});

	it('Should return a single value telling us mraid is not present', function () {
		const diagnosticResult = 'MRAID is type: boolean';
		const diagnostic = detectMraid.diagnostic(mockWindow);

		expect(diagnostic.version).to.equal(null);
		expect(diagnostic.issues.length).to.equal(1);
		expect(diagnostic.issues[0]).to.equal(diagnosticResult);
	});

	it('Should return an empty report for a proper MRAID 1.0 implementation', function () {
        
	    mockWindow.mraid = {
            addEventListener: function () {},
            close: function () {},
            expand: function () {},
            getExpandProperties: function () {},
            getPlacementType: function () {},
            getState: function () {},
            getVersion: function () { return '1.0'; },
            isViewable: function () {},
            open: function () {},
            removeEventListener: function () {},
            setExpandProperties: function () {},
            useCustomClose: function () {}
        };

	    const diagnostic = detectMraid.diagnostic(mockWindow);

	    expect(diagnostic.version).to.equal('1.0');
        expect(diagnostic.issues.length).to.equal(0);
    });

	it('Should report issues for an implementation that states its 2.0, but only has 1.0 methods', function () {

        mockWindow.mraid = {
            addEventListener: function () {},
            close: function () {},
            expand: function () {},
            getExpandProperties: function () {},
            getPlacementType: function () {},
            getState: function () {},
            getVersion: function () { return '2.0'; },
            isViewable: function () {},
            open: function () {},
            removeEventListener: function () {},
            setExpandProperties: function () {},
            useCustomClose: function () {}
        };

        const diagnostic = detectMraid.diagnostic(mockWindow);

        expect(diagnostic.version).to.equal('2.0');
        expect(diagnostic.issues.length).to.equal(10);
    });

	it('Should report an empty report for a proper MRAID 2.0 implementation', function () {

        mockWindow.mraid = {
            addEventListener: function () {},
            close: function () {},
            expand: function () {},
            getExpandProperties: function () {},
            getPlacementType: function () {},
            getState: function () {},
            getVersion: function () { return '2.0'; },
            isViewable: function () {},
            open: function () {},
            removeEventListener: function () {},
            setExpandProperties: function () {},
            useCustomClose: function () {},
            createCalendarEvent: function () {},
            getCurrentPosition: function () {},
            getDefaultPosition: function () {},
            getMaxSize: function () {},
            getResizeProperties: function () {},
            getScreenSize: function () {},
            playVideo: function () {},
            setResizeProperties: function () {},
            storePicture: function () {},
            supports: function () {}
        };

        const diagnostic = detectMraid.diagnostic(mockWindow);

        expect(diagnostic.version).to.equal('2.0');
        expect(diagnostic.issues.length).to.equal(0);
	});

	it('Should report mraid missing because mraid is not an object as defined by the spec', function () {
        const diagnosticResult = 'MRAID is type: function';

	    mockWindow.mraid = function () {};

	    const diagnostic = detectMraid.diagnostic(mockWindow);

	    expect(diagnostic.version).to.equal(null);
        expect(diagnostic.issues.length).to.equal(1);
        expect(diagnostic.issues[0]).to.equal(diagnosticResult);
    });

	it('Should report a bad implementation where MRAID is a number', function () {
        const diagnosticResult = 'MRAID is type: number';

        mockWindow.mraid = 32;

        const diagnostic = detectMraid.diagnostic(mockWindow);

        expect(diagnostic.version).to.equal(null);
        expect(diagnostic.issues.length).to.equal(1);
        expect(diagnostic.issues[0]).to.equal(diagnosticResult);
    });

	it('Should report a bad implementation where MRAID is a blank object', function () {

	    mockWindow.mraid = {};

	    const diagnostic = detectMraid.diagnostic(mockWindow);

	    expect(diagnostic.version).to.equal('-1');
	    expect(diagnostic.issues.length).to.equal(12);
    });
});
