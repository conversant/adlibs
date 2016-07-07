'use strict';

/**
 * @module triggerEvent
 * @license Apache-2.0
 * @desc Creates a new DOM Event and triggers it on the provided element.
 * @param {Element} element
 * @param {String} eventName
 */
var triggerEvent = function(element, eventName) {
	var doc = document,
		evt;

	if (doc.createEvent) {
		evt = doc.createEvent('Event');
		evt.initEvent(eventName, true, true);
	} else if (doc.createEventObject) { // IE < 9
		evt = doc.createEventObject();
		evt.eventType = eventName;
	}

	evt.eventName = eventName;

	if (element.dispatchEvent) {
		element.dispatchEvent(evt);
	} else if (element.fireEvent) {// IE < 9
		element.fireEvent('on' + evt.eventType, evt);
	} else if (element[eventName]) {
		element[eventName]();
	} else if (element['on' + eventName]) {
		element['on' + eventName]();
	}
};

module.exports = triggerEvent;
