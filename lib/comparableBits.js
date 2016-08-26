'use strict';

/* jshint bitwise:false */

/**
 * @module checkFlags
 * @desc A module to encapsulate bitmasking flags. Bitmasks have different limitations across browsers, ranging from 31 bits to 53 bits.
 * @desc This is due to Javascript using double-precision floating-point format numbers. If the number of bits in the bitmask is found to exceed the max supported, this module throws an error.
 */


var validate = function (bit) {
	if (bit){
		if ((bit & bit) === 0) {
			throw new Error('Exceeded maximum number of bits allowed by browser: ' + bit);
		}
	}
	return true;
};


/**
 * @desc Assigns an action or behavior to its corresponding flag and datum
 * @private
 * @param {Number} bit
 * @param {*} [data]
 */
var Action = function (bit, data) {
	validate(bit);
	this.bit = bit;
	this.data = data;
};

/**
 * @desc Creates the action object with it's attributed bitmask flags
 * @static
 * @param {Number} bit The actions's unique bitmask
 * @param {String} [data] The action's label
 * @returns {Action} Returns the created Action object
 * @example
 * ```js
 * var make = require('ad-libs/lib/checkFlags').make;
 * ```
 *
 */
var make = function (bit, data) {
	return new Action(bit, data);
};

/**
 * @desc Encapsulates a bitmask service which takes either a mode or flag bitmask and compares it to the attributed action's flags
 * @static
 * @param {Action} action The action object to compare to the provided bitmasks
 * @param {Number} bitSig Should have a unique bit signature for bit logic
 * @param {*} [callback] The action's pertaining data
 * @returns {Boolean} Returns true if the action's flags do match either of the provided bitmasks
 * @example
 * ```js
 * var compareFlags = require('ad-libs/lib/checkFlags').compare;
 * ```
 *
 */
var compare = function (action, bitSig, callback) {
	var cb = typeof callback === 'function' ? callback : function () {};
	var match = !!(action.bit & bitSig);

	try {
		validate(bitSig);
	} catch (ex) {
		cb(ex);
		return ex;
	}

	cb(match);
	return match;
};

/**
 * @desc Creates a single comparableBits object with a global signature/bitmask
 * @private
 * @constructor
 */
var ComparableBits = function () {
	var self = this;
	self.signature = 0;
	self.make = make;
	self.compare = function (action, callback) {
		return compare(action, self.signature, callback);
	};
};

/**
 * @private
 * Adding registry objects for managing instances between modules in a safely package scoped way.
 */
var instanceRegistry = {};

var compareBitFactory = function () {
	return new ComparableBits();
};

var compareBitProvider = function (packageName) {
	if (!instanceRegistry[packageName]) {
		instanceRegistry[packageName] = new ComparableBits();
	}
	return instanceRegistry[packageName];
};

module.exports.validate = validate;
module.exports.make = make;
module.exports.compare = compare;

/**
 * @desc Create a new instance of the ComparableBits module.
 * @static
 * @returns {ComparableBits}
 * @example
 * ```js
 * var bits = require('ad-libs.js/lib/comparableBits').factory();
 *
 * var someAction = bits.make(0x1 | 0x2, 'flag1,mode1or2')
 * bits.compare(someAction, 0x1, callback) // -> executes callback
 * ```
 */
module.exports.factory = compareBitFactory;

/**
 * @desc Tie into an existing instance of the ComparableBits module.
 * @static
 * @param packageName
 * @returns {ComparableBits}
 */
module.exports.provider = compareBitProvider;
