/* global describe: true, it: true */

'use strict';

var expect = require('expect.js'),
	mpSingleton = require('../lib/measurePerformance').provider('test.measurePerformance'),
	mpFactory = require('../lib/measurePerformance').factory();

describe('measurePerformance', function() {

	it('Should report if the Performance API is supported.', function() {
		expect(mpSingleton.supported).to.be.a('boolean');
		expect(mpFactory.supported).to.be.a('boolean');
	});

	it('Should generate a timing report as a comma delimited string.', function() {
		var reportSingleton = mpSingleton.report();
		var reportFactory = mpFactory.report();

		expect(reportSingleton.length).to.be.greaterThan(0);
		expect(reportSingleton.split(',')).to.have.length(36);

		expect(reportFactory.length).to.be.greaterThan(0);
		expect(reportFactory.split(',')).to.have.length(36);
	});

	it('Should denote navigationStart as startTime.', function() {
		expect(mpSingleton.startTime).to.be.a('number');
		expect(mpSingleton.startTime).to.be.greaterThan(0);

		expect(mpFactory.startTime).to.be.a('number');
		expect(mpFactory.startTime).to.be.greaterThan(0);
	});

	it('Should provide a "now" method to report milliseconds since epoch.', function() {
		var mpSingletonTime = mpSingleton.now();
		var mpFactoryTime = mpFactory.now();

		expect(mpSingletonTime).to.be.a('number');
		expect(mpSingletonTime).to.be.greaterThan(0);

		expect(mpFactoryTime).to.be.a('number');
		expect(mpFactoryTime).to.be.greaterThan(0);
	});

	it('Should return the time delta since startTime in milliseconds.', function(done) {
		var mpSingletonTime = mpSingleton.sinceStart();
		var mpFactoryTime = mpFactory.sinceStart();

		expect(mpSingletonTime).to.be.a('number');
		expect(mpSingletonTime).to.be.greaterThan(0);

		expect(mpFactoryTime).to.be.a('number');
		expect(mpFactoryTime).to.be.greaterThan(0);

		setTimeout(function () {
			var singletonTimeWithMicroseconds = mpSingleton.sinceStart(true);

			var factoryTimeWithMicroseconds = mpFactory.sinceStart(true);

			expect(singletonTimeWithMicroseconds).to.be.a('number');
			expect(singletonTimeWithMicroseconds).to.be.greaterThan(0);
			expect(singletonTimeWithMicroseconds).to.be.greaterThan(mpSingletonTime);

			expect(factoryTimeWithMicroseconds).to.be.a('number');
			expect(factoryTimeWithMicroseconds).to.be.greaterThan(0);
			expect(factoryTimeWithMicroseconds).to.be.greaterThan(mpFactoryTime);

			done();
		}, 500);

	});

});
