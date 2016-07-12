
/**
 * @module perfMarker
 * @desc A module to mark the timestamps for script performance
 */

'use strict';

/**
 * Used to manage instances of perfMarker
 * @private
 * @type {Object}
 */
var instanceRegistry = {};

/*
 *
 * @type {Function}
 */
var now = function () {
	return window.performance && performance.now ? performance.now() : +(new Date());
};

var startTime = (function () {
	if (window.performance && performance.timing) {
		return performance.timing.navigationStart;
	} else {
		return +(new Date());
	}
}());

/*
 *
 * @constructor
 */
var PerfMarker = function () {

	var self = this,
		timeMap = {},
		timeline = [];

	self.start = function (name) {
		if (timeMap[name]) {
			timeline[timeMap[name]].start = now();
		} else {
			timeMap[name] = timeline.length;
			timeline.push({
				name: name,
				start: now(),
				end: 0
			});
		}
		return this;
	};

	self.end = function (name) {
		if (typeof timeMap[name] !== 'undefined') {
			timeline[timeMap[name]].end = now();
		} else {
			throw new Error('No start time set for time marked as', name);
		}
		return this;
	};

	self.run = function (fn, iterate) {
		var i = 0;
		if (iterate) {
			for (i = 0; i < iterate; i++) {
				fn();
			}
		} else {
			fn();
		}
		return this;
	};

	self.getTimeline = function () {
		var timelineMap = [],
			time,
			calculatedStart;

		var makeEntry = function (time) {
			var entry;
			if (window.performance && performance.now){
				calculatedStart = time.start;
 			} else {
				calculatedStart = time.start - startTime;
			}
			entry = {
				name: time.name,
				startTime: calculatedStart,
				duration: (time.end - time.start) >= 0 ? (time.end - time.start) : null,
				toString: function () {
					return 'name: ' + this.name +
						'\tstartTime:\t' + this.startTime +
						'\tduration:\t' + this.duration;
				}
			};
			return entry;
		};

		for (time in timeline) {
			if (timeline.hasOwnProperty(time)) {
				timelineMap.push(makeEntry(timeline[time]));
			}
		}
		return timelineMap;
	};

	self.report = function () {
		return self.getTimeline().join('\n');
	};
};


var markerFactory = function () {
	return new PerfMarker();
};


var markerProvider = function (pkgName) {
	if (!instanceRegistry[pkgName]) {
		instanceRegistry[pkgName] = new PerfMarker();
	}
	return instanceRegistry[pkgName];
};


/**
 * @desc Creates a new instance of PerfMarker
 * @static
 * @returns {PerfMarker}
 */
module.exports.factory = markerFactory;

/**
 * @desc Ties into existing instance of PerfMarker
 * @static
 * @param {string} [pkgName] The name of the instance
 * @returns {PerfMarker}
 */
module.exports.provider = markerProvider;

