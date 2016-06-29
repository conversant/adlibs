/* global describe, it, sinon */

var addEventListener = require('../../lib/dom/addEventListener'),
	triggerEvent = require('../../lib/dom/triggerEvent'),
	expect = require('expect.js');

describe('dom/addEventListener', function() {

	it('Should add the given callback as an event listener to the provided element.', function() {
		var element = document.body,
			eventName = 'click',
			callback = sinon.spy();

		var remove = addEventListener(element, eventName, callback);

		triggerEvent(element, eventName);

		expect(callback.calledOnce).to.equal(true);

		remove();

		triggerEvent(element, eventName);

		expect(callback.calledOnce).to.equal(true);
	});

	it('Should continue without error when an invalid element is provided.', function() {
		var eventName = 'click',
			callback = sinon.spy();

		var remove = addEventListener(null, eventName, callback);

		expect(callback.callCount).to.equal(0);

		remove();
	});

});
