/**
 * @module canHas
 */

'use strict';

/**
 * @desc Can this object use this property?
 * @static
 * @param obj
 * @param propertyName
 * @returns {Boolean}
 * @example
 * ```js
 * var can = require('adlibs/lib/canHas').can;
 * ```
 */
var can = function (obj, propertyName) {
	return typeof obj[propertyName] !== 'undefined';
};

/**
 * @desc Does this window have this object in it?
 * @static
 * @param globalObjectName
 * @param [scope] Alternatively, you can call "run" with a more sane method signature.
 * @returns {*}
 * @example
 * ```js
 * var has = require('adlibs/lib/canHas').has;
 * ```
 */
var has = function (globalObjectName, scope) {
	scope = scope || window;
	return can(scope, globalObjectName) ? scope[globalObjectName] : false;
};

/**
 * @desc Check to see if this object owns the method as opposed to just inheriting it from another object.
 * @static
 * @param obj
 * @param propertyName
 * @returns {Boolean}
 */
var own = function (obj, propertyName) {
	return obj.hasOwnProperty(propertyName);
};

/**
 * @desc Return a runnable method by default.
 * @static
 * @param obj - Scope to use, or method to run when not providing a method as the second param.
 * @param [methodName] The method to check for.
 * @returns {Function}
 */
var run = function (obj, methodName) {
	var defaultRunnable = function () { return false;},
		runnable = methodName ? obj[methodName] : window[obj];

	return typeof runnable === 'function' ? runnable : defaultRunnable;
};

/**
 * @desc For each in, shorthanded because manually writing hasOwnProperty each and every time is not a good use of time.
 * @static
 * @param obj
 * @param callback
 */
var forIn = function (obj, callback) {
	var property;
	for (property in obj) {
		if (obj.hasOwnProperty(property)) {
			if (callback(property, obj[property]) === false) {
				break;
			}
		}
	}
};

/**
 * @desc A substitute for Object.keys for when browsers don't attempt to convert non-objects to arrays
 * @static
 * @param obj
 * @returns {*}
 */
var keys = function (obj){
	if (obj) {
		switch (typeof obj){
			case 'object':
				return Object.keys(obj);
			case 'string':
				return obj.split('');
			default:
				return [];
		}
	} else {
		throw new TypeError('Cannot convert null or undefined to object');
	}

};

module.exports = {
	can: can,
	has: has,
	run: run,
	own: own,
	forIn: forIn,
	keys: keys
};
