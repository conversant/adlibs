var forIn = require('./canHas').forIn;

var defaults = function(obj, source) {

	forIn(source, function(key, value) {
		if (typeof obj[key] === 'undefined') {
			obj[key] = value;
		}
	});

	return obj;
};

module.exports = defaults;
