
/**
 * @module perfMarker
 * @returns an object containing a performance marker factory and provider
 */

'use strict';

/**
 * Used to manage instances of perfMarker
 * @private
 * @type {Object}
 */
var instanceRegistry = {};

/**
 * Creates a new instance of PerfMarker
 * @returns {PerfMarker}
 */
var markerFactory = function () {
	return new PerfMarker();
};

/**
 *
 * @param {string} [pkgName] The name of the instance
 * @returns {PerfMarker}
 */
var markerProvider = function (pkgName) {
	if(!instanceRegistry[pkgName]) {
		instanceRegistry[pkgName] = new PerfMarker();
	}
	return instanceRegistry[pkgName];
};

/*
 *
 * @type {Function}
 */
var now = (function () {
	if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
		return performance.now();
	} else if (typeof Date.now === 'function') {
		return Date.now();
	} else {
		return new Date().getTime();
	}
});

var startTime = (function () {
	if (typeof performance !== 'undefined' &&
		typeof performance.timing !== 'undefined') {
		return performance.timing.navigationStart;
	} else {
		return new Date().getTime();
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
		if(timeMap[name]) {
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
			if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
				calculatedStart = time.start;
 			} else {
				calculatedStart = time.start - startTime;
			}
			var entry = {
				name: time.name,
				startTime: calculatedStart,
				duration: (time.end - time.start) >= 0 ? (time.end - time.start) : null,
				toString: function () {
					return 'name: ' + this.name + '\t' +
						'startTime:\t' + this.startTime + '\t' +
						'duration:\t' + this.duration
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


module.exports.factory = markerFactory;
module.exports.provider = markerProvider;

