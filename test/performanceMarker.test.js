/* global describe: true, it; true */

'use strict';

var expect = require('expect.js'),
	perfMarkerSingleton = require('../lib/performanceMarker').provider('test.perfMarker'),
	perfMarkerFactory = require('../lib/performanceMarker').factory();

describe('performanceMarker', function () {

	it('Should create a new entry in the time map', function () {
		perfMarkerSingleton.start('testEntry');
		var i = 0;
		while (i < 2E7) {
			i++;
		}
		perfMarkerSingleton.end('testEntry');
		var testTimeline = perfMarkerSingleton.getTimeline();
		expect(testTimeline).to.have.length(1);
		expect(testTimeline[0].startTime).to.be.a('number');
		expect(testTimeline[0].duration).to.be.a('number');
	});

	it('Should find a duration', function () {
		perfMarkerFactory.start('durationTest');
		var i = 0;
		while (i < 2E7) {
			i++;
		}
		perfMarkerFactory.end('durationTest');
		var testTimeline = perfMarkerFactory.getTimeline();
		expect(testTimeline).to.have.length(1);
		expect(testTimeline[0].duration).to.be.above(0);
	});

	it('Run should execute the function', function () {
		var newPerfFactory = require('../lib/performanceMarker').factory();
		newPerfFactory.start('runTest')
			.run(function () {
				var i = 0;
				while (i < 2E7) {
					i++;
				}
			})
			.end('runTest');
		var testTimeline = newPerfFactory.getTimeline();
		expect(testTimeline).to.have.length(1);
		expect(testTimeline[0].duration).to.be.above(0);
	});

	it('Run should execute multiple times', function (done) {
		var counter = function () {
			var i = 0;
			while(i < 2E7) {
				i++;
			}
		};
		var newPerfFactory = require('../lib/performanceMarker').factory();
		newPerfFactory.start('runTestMultiple')
			.run(counter, 20)
			.end('runTestMultiple');
		var testTimeline = newPerfFactory.getTimeline();
		expect(testTimeline).to.have.length(1);
		expect(testTimeline[0].duration).to.be.above(0);
		done();
	});

});
