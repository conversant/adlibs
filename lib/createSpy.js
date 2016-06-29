'use strict';

/* globals sinon */

/**
Helper method to create Sinon.JS Spies directly on the value of module.exports for a required module. To spy on a method you need access to the object it is attached to, which is problematic when the function is directly returned from a "require" call. By accessing the require.cache we can get handle to the module's exports and inject the spy.

@param loadedModule
@param {String} mockType  defaults to 'spy', can also be 'stub'
@returns {sinon.spy}
@module createSpy
@example
incrementCounter.js:
```js
module.exports = function() { ... async call ...  };
```

my-test.js
```js
var incrementCounter = require('./incrementCounter'),
	createSpy = require('cse-common/lib/createSpy');

var spy = createSpy(incrementCounter);

// test code
assert(spy.callCount, 4);
spy.restore();

```
 */
var createSpy = function (loadedModule, mockType) {
	mockType = mockType || 'spy';

	var spy,
		cache = require.cache,
		cachedModuleIndex,
		cachedModule;

	for (cachedModuleIndex in cache) {
		if (cache.hasOwnProperty(cachedModuleIndex)) {
			cachedModule = cache[cachedModuleIndex];

			if (cachedModule.exports === loadedModule) {
				spy = sinon[mockType](cachedModule, 'exports');
			}
		}
	}

	return spy;
};

module.exports = createSpy;