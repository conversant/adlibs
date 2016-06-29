/* global describe, it */

var expect = require('expect.js'),
	canHas = require('../lib/canHas');


describe('canHas', function() {

	it('should know if an object can use the given property.', function() {
		var obj = { foo: 1 };

		expect(canHas.can(obj, 'foo')).to.equal(true);
		expect(canHas.can(obj, 'bar')).to.equal(false);
	});

	it('should return the value of the property if it exists in the global scope.', function() {
		expect(canHas.has('location')).to.equal(window.location);
	});

	it('should return the value of the property if it exists in the object.', function() {
		var obj = { foo: 1 };

		expect(canHas.has('foo', obj)).to.equal(1);
		expect(canHas.has('bar', obj)).to.equal(false);
	});

	it('should know if the given object owns the provided property, or if it is inherited from its prototype.', function() {
		var Parent = function() { this.bar = true; };
		var Child = function() { this.foo = true; };

		Child.prototype = new Parent();

		var child = new Child();

		expect(canHas.own(child, 'foo')).to.equal(true);
		expect(canHas.own(child, 'bar')).to.equal(false);
		expect(canHas.own(child, 'baz')).to.equal(false);
	});

	it('should provide a runnable method from the given object, or provide a default method that returns false.', function() {
		var obj = { shout: function(msg) { return msg.toUpperCase(); }, name: 'Loud Talker' };

		expect(canHas.run(obj, 'shout')('foo')).to.equal('FOO');
		expect(canHas.run(obj, 'name')()).to.equal(false);
	});

	it('should iterate over all own properties of an object, returning early if the iterator returns false.', function() {
		var obj = { foo: 1, bar: 2},
			keys = [],
			sum = 0;

		canHas.forIn(obj, function(key, value) {
			keys.push(key);

			if (value > 1) {
				return false;
			}

			sum += value;
		});

		expect(keys.length).to.equal(2);
		expect(sum).to.equal(1);
	});
});
