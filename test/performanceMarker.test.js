/* global describe: true, it; true */

'use strict';

var expect = require('expect.js'),
	perfMarkerSingleton = require('../lib/performanceMarker').provider('test.perfMarker'),
	perfMarkerFactory = require('../lib/performanceMarker').factory();

describe('performanceMarker', function () {

	it('Should create a new entry in the time map', function () {
		perfMarkerSingleton.start('testEntry');
		var i = 0;
		while (i < 20000000) {
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
		while (i < 20000000) {
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
				while (i < 20000000) {
					i++;
				}
			})
			.end('runTest');
		var testTimeline = newPerfFactory.getTimeline();
		expect(testTimeline).to.have.length(1);
		expect(testTimeline[0].duration).to.be.above(0);
	});

	it('Run should execute multiple times', function () {
		this.timeout(5000);
		var newPerfFactory = require('../lib/performanceMarker').factory();
		newPerfFactory.start('runTestMultiple')
			.run(function () {
				var i = 0;
				while(i < 20000000) {
					i++;
				}
			}, 20)
			.end('runTestMultiple');
		var testTimeline = newPerfFactory.getTimeline();
		expect(testTimeline).to.have.length(1);
		expect(testTimeline[0].duration).to.be.above(0);
	});

});

