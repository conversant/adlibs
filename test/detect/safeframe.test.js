/* global describe, it, beforeEach */

'use strict';

var detectSafeframe = require('../../lib/detect/safeframe'),
	defaults = require('../../lib/defaults'),
	expect = require('expect.js');

describe('Safeframe test', function () {

	var mockWindow;

	beforeEach(function () {
		mockWindow = defaults({}, window);
	});

	it('Should return -1 for version as safeframe is not present on the window', function () {
		expect(detectSafeframe.getVersion(mockWindow)).to.equal('-1');
	});

	it('Should return 2.0.0 for version as safeframe is on the window', function () {
		mockWindow.$sf = {};
		mockWindow.$sf.ver = '2.0.0';

		expect(detectSafeframe.getVersion(mockWindow)).to.equal('2.0.0');
	});

	it('Should return -1 as the ver property is not on the $sf object', function () {
		mockWindow.$sf = {};
		expect(detectSafeframe.getVersion(mockWindow)).to.equal('-1');
	});

	it('Should return -1 as there is no specVersion', function () {
		expect(detectSafeframe.getSpecVersion(mockWindow)).to.equal('-1');
	});

	it('Should return -1 as the spec version property does not exist', function () {
		mockWindow.$sf = {};
		expect(detectSafeframe.getSpecVersion(mockWindow)).to.equal('-1');
	});

	it('Should return 1-1-0 for the spec version', function () {
		mockWindow.$sf = {};
		mockWindow.$sf.specVersion = '1-1-0';
		expect(detectSafeframe.getSpecVersion(mockWindow)).to.equal('1-1-0');
	});

	it('Should return an array with two defaults as there is no $sf object', function () {
		var info = detectSafeframe.getInfo(mockWindow);

		expect(info.length).to.equal(2);
		expect(info[0]).to.equal(-1);
	});

	it('Should return an array with two values...4 for error and 5 for list', function () {
		mockWindow.$sf = {
			info: {
				errs: ['a', 'b', 'c', 'd'],
				list: ['1', '2', '3', '4', '5']
			}
		};
		var info = detectSafeframe.getInfo(mockWindow);

		expect(info.length).to.equal(2);
		expect(info[0]).to.equal(4);
		expect(info[1]).to.equal(5);
	});

	it('Should return an array with 10 default values as there is no conf object', function () {
		mockWindow.$sf = {};
		var conf = detectSafeframe.getConf(mockWindow),
			len = conf.length,
			i;

		expect(len).to.equal(10);

		for (i = 0; i < len; i++) {
			expect(conf[i]).to.equal('-1');
		}
	});

	it('Should return an array with 10 values from the conf object', function () {
		mockWindow.$sf = {
			host: {
				conf: {
					cdn: 'blah.com',
					ver: '1.0.0',
					renderFile: 'exampleAd.html',
					hostFile: 'somescript.js',
					extFile: 'some_external_js_file.js',
					bootFile: 'bootstrapper.js',
					to: 2,
					auto: true,
					msgFile: 'older_browser_file.html',
					debug: false
				}
			}
		};

		var conf = detectSafeframe.getConf(mockWindow),
			len = conf.length,
			i;

		expect(len).to.equal(10);

		for (i = 0; i < len; i++) {
			expect(conf[i]).to.not.equal('-1');
		}
	});

	it('Should return an array of default values as there is no support object', function () {
		mockWindow.$sf = {};
		var support = detectSafeframe.getSupport(mockWindow),
			len = support.length,
			i;

		expect(len).to.equal(4);

		for (i = 0; i < len; i++) {
			expect(support[i]).to.equal(-1);
		}
	});

	it('Should return an array of support values', function () {
		mockWindow.$sf = {
			ext: {
				supports: function () {
					return {
						'exp-ovr': true,
						'exp-push': true,
						'read-cookie': false,
						'write-cookie': false
					}
				}
			}
		};
		var support = detectSafeframe.getSupport(mockWindow),
			len = support.length,
			i;

		expect(len).to.equal(4);

		for (i = 0; i < len; i++) {
			expect(support[i]).to.not.equal('-1');
		}
	});

	it('Should return a default value, as there is no inView function', function () {
		mockWindow.$sf = {
			ext: {}
		};
		var inView = detectSafeframe.getInView(mockWindow);

		expect(inView).to.equal(-1);
	});

	it('Should return an inView value of 50', function () {
		var inViewValue = 50,
			inView;

		mockWindow.$sf = {
			ext: {
				inViewPercentage: function () { return inViewValue; }
			}
		};
		inView = detectSafeframe.getInView(mockWindow);

		expect(inView).to.equal(inViewValue);
	});

	it('Should return a default value, as there is no getFocus function', function () {
		mockWindow.$sf = {
			ext: {}
		};

		var hasFocus = detectSafeframe.getWinFocus(mockWindow);

		expect(hasFocus).to.equal(-1);
	});

	it('Should return a value that shows the window is in focus', function () {
		mockWindow.$sf = {
			ext: {
				winHasFocus: function () { return true; }
			}
		};

		var hasFocus = detectSafeframe.getWinFocus(mockWindow);

		expect(hasFocus).to.equal(1);
	});

	it('Should return a report with all default values, as there is no safeframe object', function () {
		var report = detectSafeframe.getMetrics(mockWindow);

		expect(report.length).to.equal(20);
		expect(report[0]).to.equal('-1');
		expect(report[19]).to.equal(-1);
	});

	it('Should return properties for a correctly populated safeframe object', function () {
		mockWindow.$sf = {
			ver: '2.0',
			specVersion: '1-1-0',
			info: {
				errs: ['a', 'b', 'c', 'd'],
				list: ['1', '2', '3', '4', '5']
			},
			host: {
				conf: {
					cdn: 'blah.com',
					ver: '1.0.0',
					renderFile: 'exampleAd.html',
					hostFile: 'somescript.js',
					extFile: 'some_external_js_file.js',
					bootFile: 'bootstrapper.js',
					to: 2,
					auto: true,
					msgFile: 'older_browser_file.html',
					debug: false
				}
			},
			ext: {
				supports: function () {
					return {
						'exp-ovr': true,
						'exp-push': true,
						'read-cookie': false,
						'write-cookie': false
					}
				},
				inViewPercentage: function () { return 0; },
				winHasFocus: function () { return true; }
			}
		};
		var report = detectSafeframe.getMetrics(mockWindow);

		expect(report.length).to.equal(20);
		expect(report[0]).to.not.equal('-1');
		expect(report[1]).to.not.equal('-1');
		expect(report[2]).to.not.equal(-1);
		expect(report[3]).to.not.equal(-1);
		expect(report[4]).to.not.equal(-1);
		expect(report[5]).to.not.equal(-1);
		expect(report[6]).to.not.equal('-1');
		expect(report[14]).to.not.equal('-1');
		expect(report[15]).to.not.equal('-1');
		expect(report[16]).to.not.equal(-1);
		expect(report[19]).to.not.equal(-1);
	});
});
