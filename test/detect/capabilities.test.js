/* global describe, it, document, beforeEach */

'use strict';

var capabilities = require('../../lib/detect/capabilities'),
	defaults = require('../../lib/defaults'),
	expect = require('expect.js');

describe('Capabilities Test', function() {

	var mockWindow;

	beforeEach(function() {
		mockWindow = defaults({}, window);
	});

	it('should detect if the browser has support for canvas.', function() {
		mockWindow.document = defaults({
			createElement: function(name) {
				if (name === 'canvas') {
					return {};
				} else {
					return document.createElement(name);
				}
			}
		}, document);

		var details = capabilities.detect(mockWindow);

		expect(details.canvas).to.be(false);

		mockWindow.document.createElement = function(name) {
			if (name === 'canvas') {
				return { getContext: function() { return true;} };
			} else {
				return document.createElement(name);
			}
		};

		details = capabilities.detect(mockWindow);

		expect(details.canvas).to.be(true);
	});

	it('should detect supported video codecs.', function() {
		mockWindow.document = defaults({
			createElement: function(name) {
				if (name === 'video') {
					return {
						canPlayType: function(codec) {
							var supported;

							if (codec.indexOf('mp4') > -1) {
								supported = 'probably';
							} else if (codec.indexOf('ogg') > -1) {
								supported = '';
							} else if (codec.indexOf('webm') > -1) {
								supported = 'no';
							}

							return supported;
						}
					};
				} else {
					return document.createElement(name);
				}
			}
		}, document);

		var details = capabilities.detect(mockWindow);

		expect(details.h264).to.be(true);
		expect(details.ogg).to.be(false);
		expect(details.webm).to.be(false);
	});

	it('should generate a report with 1 or 0 for each entry in the capability list.', function() {
		var details = capabilities.detect();

		// The count from canvas to active x is expected to be the same as the indexed names
		expect(Object.keys(details).length).to.eql(capabilities.indexNames.length);
	});

	it('Should read the requested result given an index name', function () {
		capabilities.detect();
		var results = capabilities.results;

		expect(capabilities.read('JSON')).to.equal(results[8]);
	});
});
