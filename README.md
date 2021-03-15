# AdLibs

[![Build Status](https://travis-ci.org/conversant/ad-libs.js.svg?branch=master)](https://travis-ci.org/conversant/ad-libs.js) [![Coverage Status](https://coveralls.io/repos/github/conversant/ad-libs.js/badge.svg)](https://coveralls.io/github/conversant/ad-libs.js) [![Code Climate](https://codeclimate.com/github/conversant/ad-libs.js/badges/gpa.svg)](https://codeclimate.com/github/conversant/ad-libs.js) [![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/conversant/ad-libs.js.svg)](http://isitmaintained.com/project/conversant/ad-libs.js "Average time to resolve an issue") [![Percentage of issues still open](http://isitmaintained.com/badge/open/conversant/ad-libs.js.svg)](http://isitmaintained.com/project/conversant/ad-libs.js "Percentage of issues still open") [![Dependency Status](https://david-dm.org/conversant/ad-libs.js.svg?style=flat-square)](https://david-dm.org/conversant/ad-libs.js)

| ________________ | The gist of it... |
|:---|:---|
| ![adlibs](https://github.com/conversant/ad-libs.js/raw/master/doc/Ad-libs-js.png "Adlibs") | A collection of cross-browser methods for use with front-end development. adlibs is a tool that supports various browser and OS combinations dating back to IE9. It uses feature detection to determine the user's environment and outputs details pertaining to that OS and browser. adlibs also allows developers to safely execute front end methods such as domReady and XMLHttpRequests across all browsers. |

## Installation
```bash
npm install adlibs
```
## Usage

Each function is exported as a single commonjs module, allowing only the needed modules to be
bundled into a project to keep minified bundles as small as possible.

In Node.js:
```js
// Load the full adlibs build.
var adlibs = require('adlibs');

// Load a single module for smaller builds with webpack.
var domReady = require('adlibs/lib/dom/domReady');
var browser = require('adlibs/lib/detect/browser');
```

## Detection Modules

There are several modules that use feature detection to determine the user's environment. In order to populate the resulting
objects, the detect function must be executed.

For example, in order to populate the browser object:
```js
var browser = require('adlibs/lib/detect/browser').detect();

// outputs the name of the os
console.log(browser.os.name)
```

# API Reference

## Modules

<dl>
<dt><a href="#module_canHas">canHas</a></dt>
<dd></dd>
<dt><a href="#module_comparableBits">comparableBits</a></dt>
<dd><p>This is due to Javascript using double-precision floating-point format numbers. If the number of bits in the bitmask is found to exceed the max supported, this module throws an error.</p>
</dd>
<dt><a href="#module_createSpy">createSpy</a> ⇒ <code>sinon.spy</code></dt>
<dd><p>Helper method to create Sinon.JS spies directly on the value of module.exports for a required module. To spy on a method you need access to the object it is attached to, which is problematic when the function is directly returned from a &quot;require&quot; call. By accessing the require.cache we can get handle to the module&#39;s exports and inject the spy.</p>
</dd>
<dt><a href="#module_Browser">Browser</a></dt>
<dd><p>Browser Detection - Gets Data Pertaining to User&#39;s Browser and OS</p>
</dd>
<dt><a href="#module_Capabilities">Capabilities</a></dt>
<dd><p>Determines browser&#39;s capabilities (e.g. CORS support, sandboxable, video support, etc.)</p>
</dd>
<dt><a href="#module_Environment">Environment</a></dt>
<dd><p>Environment Detection - Gets Data Pertaining to User&#39;s Environment</p>
</dd>
<dt><a href="#module_Mraid">Mraid</a></dt>
<dd><p>Mraid Detection</p>
</dd>
<dt><a href="#module_Safeframe">Safeframe</a></dt>
<dd><p>Safeframe Detection</p>
</dd>
<dt><a href="#module_addEventListener">addEventListener</a> ⇒ <code>function</code></dt>
<dd><p>Add an event listener to the element, which will execute the given callback.</p>
</dd>
<dt><del><a href="#module_appendHtml">appendHtml</a> ⇒ <code>Array</code></del></dt>
<dd><p>Appends all elements in the html string to the parent element. Correctly handles scripts with src attributes and inline javascript and ensures that the script will execute.
NOTE: Only Element nodes in the html string will be appended. All other node types will be ignored (i.e. Text, Comment).</p>
</dd>
<dt><a href="#module_domReady">domReady</a></dt>
<dd><p>Executes the provided callback when the DOM is ready. Allows code to act on the DOM before the window &quot;load&quot; event fires.</p>
</dd>
<dt><a href="#module_getExecutingScript">getExecutingScript</a></dt>
<dd></dd>
<dt><a href="#module_triggerEvent">triggerEvent</a></dt>
<dd><p>Creates a new DOM Event and triggers it on the provided element.</p>
</dd>
<dt><a href="#module_evaluator">evaluator</a> ⇒ <code>Object</code></dt>
<dd><p>Runs eval against the value passed to it. This function exists because eval prevents Uglify from minifying correctly.
    Encapsulating eval in its own module prevents the above issue. Variables and properties are one letter vars because Uglify won&#39;t function for this module.
    For more info on eval visit: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval">https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval</a></p>
</dd>
<dt><a href="#module_jsonp">jsonp</a> ⇒ <code>Object</code></dt>
<dd><p>Perform a cross domain request via JSONP. Provides the same interface as xhr.js. The request is made by appending a &#39;callback&#39; parameter to the request url, and it is expected that the server will respond with the content wrapped in a function call, using the provided value of the callback parameter. If callbackFn isn&#39;t defined, a unique name will be generated.</p>
</dd>
<dt><a href="#module_loadScript">loadScript</a></dt>
<dd><p>Dynamically loads scripts in parallel, and executes a single callback after all scripts have loaded.</p>
</dd>
<dt><a href="#module_measurePerformance">measurePerformance</a></dt>
<dd></dd>
<dt><a href="#module_parseConfig">parseConfig</a> ⇒ <code>Object</code></dt>
<dd><p>Parses a json config from the provided Element. The defaults is expected to be a JSON string in the attribute value.</p>
</dd>
<dt><a href="#module_perfMarker">perfMarker</a></dt>
<dd><p>A module to mark the timestamps for script performance</p>
</dd>
<dt><a href="#module_reportData">reportData</a></dt>
<dd></dd>
<dt><a href="#module_format">format</a> ⇒ <code>String</code></dt>
<dd><p>Constructs a URL from its parsed components. 1) Host takes precedence over hostname and port. 2) Query takes precedence over search.</p>
</dd>
<dt><a href="#module_parse">parse</a> ⇒ <code>Object</code></dt>
<dd><p>Deconstructs a URL into its components. It also parses the search component (the query string) into decoded key/value pairs on a query object.</p>
</dd>
<dt><a href="#module_xhr">xhr</a></dt>
<dd><p>Cross browser wrapper for XMLHttpRequest. If you need Cookies and HTTP Auth data to be included in the request, you must set withCredentials to true in the options.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#insertAfter">insertAfter(elemToInsert, targetElem)</a></dt>
<dd><p>Utility Function to Insert &#39;elemToInsert&#39; after &#39;targetElem&#39; in the DOM</p>
</dd>
<dt><a href="#isAScript">isAScript(inputElem)</a></dt>
<dd><p>Returns true if inputElem is a script element; false otherwise</p>
</dd>
<dt><a href="#addToDom">addToDom(elem, target)</a></dt>
<dd><p>Adds &#39;elem&#39; to the DOM with target/parent element &#39;target&#39;
Scripts are treated differently than other elements because they have to be to work correctly</p>
</dd>
<dt><a href="#customCloneScript">customCloneScript(inputScriptElem, win)</a> ⇒ <code>Element</code></dt>
<dd><p>Clones a script element in a way that is compatible with dynamic DOM-ready loading
Unfortunately, node.cloneNode() will not work in place of this function in this case
nor can it be used inside this function</p>
</dd>
<dt><a href="#cloneElem">cloneElem(elemToClone, win)</a> ⇒ <code>Node</code> | <code>Element</code></dt>
<dd><p>Creates a deep clone of the element passed in (with special logic for scripts)
Scripts have to be handled differently because the script code will not execute unless they are processed this way</p>
</dd>
<dt><a href="#recursiveCloneAndAddToDom">recursiveCloneAndAddToDom(inputElem, targetElem, win)</a> ⇒ <code>Node</code> | <code>Element</code></dt>
<dd><p>Recursively iterates through &#39;inputElem&#39; child elements, creates clones of them, and attaches them to &#39;targetElem&#39;
Why? Because script elements (including nested ones) need to be cloned a specific way in order for the code they represent to be executed.</p>
</dd>
<dt><a href="#insertInlineHtmlString">insertInlineHtmlString(htmlString, [parentElem], win)</a> ⇒ <code>boolean</code></dt>
<dd><p>Adds &#39;htmlString&#39; as a child to element &#39;parentElem&#39; in a way that&#39;s safe to use after the document has been closed</p>
</dd>
<dt><a href="#createInsContainer">createInsContainer(win)</a> ⇒ <code>HTMLModElement</code></dt>
<dd><p>Returns an &#39;ins&#39; element with a unique ID and class &#39;adlibs-ins&#39;</p>
</dd>
<dt><a href="#docWriteHtmlString">docWriteHtmlString(htmlString, win)</a> ⇒ <code>boolean</code></dt>
<dd><p>Uses document.writeln to add an HTML string to the page</p>
</dd>
<dt><a href="#isNativeFunction">isNativeFunction(value)</a> ⇒ <code>any</code></dt>
<dd><p>Returns true if a function is the native implementation; false otherwise</p>
</dd>
<dt><a href="#embedHtml">embedHtml(htmlString, [parentElem], [callback], [win])</a></dt>
<dd><p>If the doc readyState is complete or interactive, use custom methods to safely write &#39;htmlString&#39; to the page; otherwise, use native document.write</p>
</dd>
</dl>

<a name="module_canHas"></a>

## canHas

* [canHas](#module_canHas)
    * [.can(obj, propertyName)](#module_canHas.can) ⇒ <code>Boolean</code>
    * [.has(globalObjectName, [scope])](#module_canHas.has) ⇒ <code>\*</code>
    * [.own(obj, propertyName)](#module_canHas.own) ⇒ <code>Boolean</code>
    * [.run(obj, [methodName])](#module_canHas.run) ⇒ <code>function</code>
    * [.forIn(obj, callback)](#module_canHas.forIn)
    * [.keys(obj)](#module_canHas.keys) ⇒ <code>\*</code>

<a name="module_canHas.can"></a>

### canHas.can(obj, propertyName) ⇒ <code>Boolean</code>
Can this object use this property?

**Kind**: static method of [<code>canHas</code>](#module_canHas)  

| Param |
| --- |
| obj | 
| propertyName | 

**Example**  
```js
var can = require('adlibs/lib/canHas').can;
```
<a name="module_canHas.has"></a>

### canHas.has(globalObjectName, [scope]) ⇒ <code>\*</code>
Does this window have this object in it?

**Kind**: static method of [<code>canHas</code>](#module_canHas)  

| Param | Description |
| --- | --- |
| globalObjectName |  |
| [scope] | Alternatively, you can call "run" with a more sane method signature. |

**Example**  
```js
var has = require('adlibs/lib/canHas').has;
```
<a name="module_canHas.own"></a>

### canHas.own(obj, propertyName) ⇒ <code>Boolean</code>
Check to see if this object owns the method as opposed to just inheriting it from another object.

**Kind**: static method of [<code>canHas</code>](#module_canHas)  

| Param |
| --- |
| obj | 
| propertyName | 

<a name="module_canHas.run"></a>

### canHas.run(obj, [methodName]) ⇒ <code>function</code>
Return a runnable method by default.

**Kind**: static method of [<code>canHas</code>](#module_canHas)  

| Param | Description |
| --- | --- |
| obj | Scope to use, or method to run when not providing a method as the second param. |
| [methodName] | The method to check for. |

<a name="module_canHas.forIn"></a>

### canHas.forIn(obj, callback)
For each in, shorthanded because manually writing hasOwnProperty each and every time is not a good use of time.

**Kind**: static method of [<code>canHas</code>](#module_canHas)  

| Param |
| --- |
| obj | 
| callback | 

<a name="module_canHas.keys"></a>

### canHas.keys(obj) ⇒ <code>\*</code>
A substitute for Object.keys for when browsers don't attempt to convert non-objects to arrays

**Kind**: static method of [<code>canHas</code>](#module_canHas)  

| Param |
| --- |
| obj | 

<a name="module_comparableBits"></a>

## comparableBits
This is due to Javascript using double-precision floating-point format numbers. If the number of bits in the bitmask is found to exceed the max supported, this module throws an error.


* [comparableBits](#module_comparableBits)
    * [.factory](#module_comparableBits.factory) ⇒ <code>ComparableBits</code>
    * [.provider](#module_comparableBits.provider) ⇒ <code>ComparableBits</code>
    * [.make(bit, [data])](#module_comparableBits.make) ⇒ <code>Action</code>
    * [.compare(action, bitSig, [callback])](#module_comparableBits.compare) ⇒ <code>Boolean</code>

<a name="module_comparableBits.factory"></a>

### comparableBits.factory ⇒ <code>ComparableBits</code>
Create a new instance of the ComparableBits module.

**Kind**: static property of [<code>comparableBits</code>](#module_comparableBits)  
**Example**  
```js
var bits = require('adlibs/lib/comparableBits').factory();

var someAction = bits.make(0x1 | 0x2, 'flag1,mode1or2')
bits.compare(someAction, 0x1, callback) // -> executes callback
```
<a name="module_comparableBits.provider"></a>

### comparableBits.provider ⇒ <code>ComparableBits</code>
Tie into an existing instance of the ComparableBits module.

**Kind**: static property of [<code>comparableBits</code>](#module_comparableBits)  

| Param |
| --- |
| packageName | 

<a name="module_comparableBits.make"></a>

### comparableBits.make(bit, [data]) ⇒ <code>Action</code>
Creates the action object with it's attributed bitmask flag

**Kind**: static method of [<code>comparableBits</code>](#module_comparableBits)  
**Returns**: <code>Action</code> - Returns the created Action object  

| Param | Type | Description |
| --- | --- | --- |
| bit | <code>Number</code> | The actions's unique bitmask |
| [data] | <code>String</code> | The action's label |

**Example**  
```js
var make = require('adlibs/lib/comparableBits').make;
```
<a name="module_comparableBits.compare"></a>

### comparableBits.compare(action, bitSig, [callback]) ⇒ <code>Boolean</code>
Encapsulates a bitmask service which takes a bitmask and compares it to the attributed action's flag

**Kind**: static method of [<code>comparableBits</code>](#module_comparableBits)  
**Returns**: <code>Boolean</code> - Returns true if the action's flags do match either of the provided bitmasks  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>Action</code> | The action object to compare to the provided bitmasks |
| bitSig | <code>Number</code> | Should have a unique bit signature for bit logic |
| [callback] | <code>\*</code> | The action's pertaining data |

**Example**  
```js
var compare = require('adlibs/lib/comparableBits').compare;
```
<a name="module_createSpy"></a>

## createSpy ⇒ <code>sinon.spy</code>
Helper method to create Sinon.JS spies directly on the value of module.exports for a required module. To spy on a method you need access to the object it is attached to, which is problematic when the function is directly returned from a "require" call. By accessing the require.cache we can get handle to the module's exports and inject the spy.


| Param | Type | Description |
| --- | --- | --- |
| loadedModule |  |  |
| mockType | <code>String</code> | Defaults to 'spy'; can also be 'stub'. |

**Example**  
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
<a name="module_Browser"></a>

## Browser
Browser Detection - Gets Data Pertaining to User's Browser and OS

**Example**  
```
var browser = require("adlibs/lib/detect/browser")
```

* [Browser](#module_Browser)
    * _static_
        * [.mathMLSupport(d)](#module_Browser.mathMLSupport) ⇒ <code>Boolean</code>
        * [.isMobile([win])](#module_Browser.isMobile) ⇒ <code>Boolean</code>
        * [.getVersion(uaVersion, minVersion, [maxVersion])](#module_Browser.getVersion) ⇒ <code>Number</code>
        * [.looksLike(regex, ua)](#module_Browser.looksLike) ⇒ <code>\*</code> \| <code>Boolean</code>
        * [.parseIntIfMatch(ua, regex, [radix])](#module_Browser.parseIntIfMatch) ⇒ <code>Number</code>
        * [.parseFloatIfMatch(ua, regex)](#module_Browser.parseFloatIfMatch) ⇒
        * [.getAndroidVersion(win, uaVersion)](#module_Browser.getAndroidVersion) ⇒ <code>Number</code>
        * [.getChromiumVersion(win, uaVersion)](#module_Browser.getChromiumVersion) ⇒ <code>Number</code>
        * [.getSafariVersion(win, uaVersion)](#module_Browser.getSafariVersion) ⇒ <code>Number</code>
        * [.getKindleVersion(win, uaVersion)](#module_Browser.getKindleVersion) ⇒ <code>Number</code>
        * [.getOtherOS(win, ua)](#module_Browser.getOtherOS) ⇒ <code>Browser</code>
        * [.getAppleOS(win, ua)](#module_Browser.getAppleOS) ⇒ <code>Browser</code>
        * [.getMicrosoftOS(win, ua)](#module_Browser.getMicrosoftOS) ⇒ <code>Browser</code>
        * [.getAndroidOS(win, ua)](#module_Browser.getAndroidOS) ⇒ <code>Browser</code>
        * [.getKindleOS(win, ua)](#module_Browser.getKindleOS) ⇒ <code>Browser</code>
        * [.getOsFromUa(win, ua)](#module_Browser.getOsFromUa) ⇒ <code>Browser</code>
        * [.detect([win], [userAgent])](#module_Browser.detect) ⇒ <code>Browser</code>
        * [.read(key)](#module_Browser.read) ⇒ <code>\*</code>
    * _inner_
        * [~save(result)](#module_Browser..save) ⇒ <code>Number</code>

<a name="module_Browser.mathMLSupport"></a>

### browser.mathMLSupport(d) ⇒ <code>Boolean</code>
Check for MathML support in browsers to help detect certain browser version numbers where this is the only difference.

**Kind**: static method of [<code>Browser</code>](#module_Browser)  
**Returns**: <code>Boolean</code> - returns true if browser has mathml support  

| Param | Type |
| --- | --- |
| d | <code>Document</code> | 

<a name="module_Browser.isMobile"></a>

### browser.isMobile([win]) ⇒ <code>Boolean</code>
Performs a simple test to see if we're on mobile or not.

**Kind**: static method of [<code>Browser</code>](#module_Browser)  
**Returns**: <code>Boolean</code> - returns true if mobile  

| Param | Type |
| --- | --- |
| [win] | <code>Window</code> | 

<a name="module_Browser.getVersion"></a>

### browser.getVersion(uaVersion, minVersion, [maxVersion]) ⇒ <code>Number</code>
Uses the min and max versions of a browser to determine its version.

**Kind**: static method of [<code>Browser</code>](#module_Browser)  
**Returns**: <code>Number</code> - returns version number  

| Param | Type |
| --- | --- |
| uaVersion | <code>Number</code> | 
| minVersion | <code>Number</code> | 
| [maxVersion] | <code>Number</code> | 

<a name="module_Browser.looksLike"></a>

### browser.looksLike(regex, ua) ⇒ <code>\*</code> \| <code>Boolean</code>
Searches for a match between the regex and specified string.

**Kind**: static method of [<code>Browser</code>](#module_Browser)  
**Returns**: <code>\*</code> \| <code>Boolean</code> - returns true if match found  

| Param | Type |
| --- | --- |
| regex | <code>RegExp</code> | 
| ua | <code>String</code> | 

<a name="module_Browser.parseIntIfMatch"></a>

### browser.parseIntIfMatch(ua, regex, [radix]) ⇒ <code>Number</code>
Parses the result of the RegExp match if it exists.
Gracefully falls back to the default version if not.

**Kind**: static method of [<code>Browser</code>](#module_Browser)  
**Returns**: <code>Number</code> - returns the regex match or default version  

| Param | Type |
| --- | --- |
| ua | <code>String</code> | 
| regex | <code>RegExp</code> | 
| [radix] | <code>Number</code> | 

<a name="module_Browser.parseFloatIfMatch"></a>

### browser.parseFloatIfMatch(ua, regex) ⇒
Parses the floating point value of the RegExp match if found.
Gracefully falls back to the default if not.

**Kind**: static method of [<code>Browser</code>](#module_Browser)  
**Returns**: returns the regex match or the default version  

| Param | Type |
| --- | --- |
| ua | <code>String</code> | 
| regex | <code>RegExp</code> | 

<a name="module_Browser.getAndroidVersion"></a>

### browser.getAndroidVersion(win, uaVersion) ⇒ <code>Number</code>
Determines the version of Android being used.

**Kind**: static method of [<code>Browser</code>](#module_Browser)  
**Returns**: <code>Number</code> - returns the Android version  

| Param | Type |
| --- | --- |
| win | <code>Window</code> | 
| uaVersion | <code>Number</code> | 

<a name="module_Browser.getChromiumVersion"></a>

### browser.getChromiumVersion(win, uaVersion) ⇒ <code>Number</code>
Determines the version of Chrome being used.

**Kind**: static method of [<code>Browser</code>](#module_Browser)  
**Returns**: <code>Number</code> - returns the Chrome version  

| Param | Type |
| --- | --- |
| win | <code>Window</code> | 
| uaVersion | <code>Number</code> | 

<a name="module_Browser.getSafariVersion"></a>

### browser.getSafariVersion(win, uaVersion) ⇒ <code>Number</code>
Returns the version of the Safari browser.

**Kind**: static method of [<code>Browser</code>](#module_Browser)  
**Returns**: <code>Number</code> - returns the version of Safari  

| Param | Type |
| --- | --- |
| win | <code>Window</code> | 
| uaVersion | <code>Number</code> | 

<a name="module_Browser.getKindleVersion"></a>

### browser.getKindleVersion(win, uaVersion) ⇒ <code>Number</code>
Creates a Browser instance with its attributed Kindle values.

**Kind**: static method of [<code>Browser</code>](#module_Browser)  

| Param | Type |
| --- | --- |
| win | <code>Window</code> | 
| uaVersion | <code>Number</code> | 

<a name="module_Browser.getOtherOS"></a>

### browser.getOtherOS(win, ua) ⇒ <code>Browser</code>
Creates a Browser instance with its attributed OS and device type values.

**Kind**: static method of [<code>Browser</code>](#module_Browser)  
**Returns**: <code>Browser</code> - returns the browser instance  

| Param | Type |
| --- | --- |
| win | <code>Window</code> | 
| ua | <code>String</code> | 

<a name="module_Browser.getAppleOS"></a>

### browser.getAppleOS(win, ua) ⇒ <code>Browser</code>
Creates a Browser instance with its attributed Apple values.

**Kind**: static method of [<code>Browser</code>](#module_Browser)  
**Returns**: <code>Browser</code> - returns the Browser instance  

| Param | Type |
| --- | --- |
| win | <code>Window</code> | 
| ua | <code>String</code> | 

<a name="module_Browser.getMicrosoftOS"></a>

### browser.getMicrosoftOS(win, ua) ⇒ <code>Browser</code>
Creates a Browser instance with its attributed Windows values.

**Kind**: static method of [<code>Browser</code>](#module_Browser)  
**Returns**: <code>Browser</code> - returns the Browser instance  

| Param | Type |
| --- | --- |
| win | <code>Window</code> | 
| ua | <code>String</code> | 

<a name="module_Browser.getAndroidOS"></a>

### browser.getAndroidOS(win, ua) ⇒ <code>Browser</code>
Creates a Browser instance with its attributed Android values.

**Kind**: static method of [<code>Browser</code>](#module_Browser)  
**Returns**: <code>Browser</code> - returns the Browser instance  

| Param | Type |
| --- | --- |
| win | <code>Window</code> | 
| ua | <code>String</code> | 

<a name="module_Browser.getKindleOS"></a>

### browser.getKindleOS(win, ua) ⇒ <code>Browser</code>
Returns the Kindle's OS.

**Kind**: static method of [<code>Browser</code>](#module_Browser)  
**Returns**: <code>Browser</code> - returns the Browser instance  

| Param | Type |
| --- | --- |
| win | <code>Window</code> | 
| ua | <code>String</code> | 

<a name="module_Browser.getOsFromUa"></a>

### browser.getOsFromUa(win, ua) ⇒ <code>Browser</code>
Reads the user agent string to determine OS.

**Kind**: static method of [<code>Browser</code>](#module_Browser)  
**Returns**: <code>Browser</code> - returns the Browser instance  

| Param | Type |
| --- | --- |
| win | <code>Window</code> | 
| ua | <code>String</code> | 

<a name="module_Browser.detect"></a>

### browser.detect([win], [userAgent]) ⇒ <code>Browser</code>
Returns an object containing browser details (e.g. name, os, version, etc.).

**Kind**: static method of [<code>Browser</code>](#module_Browser)  
**Returns**: <code>Browser</code> - returns the Browser instance  

| Param | Type |
| --- | --- |
| [win] | <code>Window</code> | 
| [userAgent] | <code>String</code> | 

**Example**  
```js
var os = browser.detect().os.name;

console.log(os); // outputs OS name (e.g. Windows, Mac, Android, etc.)
```
<a name="module_Browser.read"></a>

### browser.read(key) ⇒ <code>\*</code>
Retrieve any results in the map by name because they're returned in an array without names.

**Kind**: static method of [<code>Browser</code>](#module_Browser)  

| Param | Type |
| --- | --- |
| key | <code>String</code> | 

<a name="module_Browser..save"></a>

### Browser~save(result) ⇒ <code>Number</code>
Saves a property to the results array and returns its index.

**Kind**: inner method of [<code>Browser</code>](#module_Browser)  

| Param | Type |
| --- | --- |
| result | <code>\*</code> | 

<a name="module_Capabilities"></a>

## Capabilities
Determines browser's capabilities (e.g. CORS support, sandboxable, video support, etc.)

**Example**  
```javascript
var capabilities = require("adlibs/lib/detect/capabilities");
```
<a name="module_Capabilities.detect"></a>

### capabilities.detect() ⇒ <code>Object</code>
Detects browser's capabilities and returns an object.

**Kind**: static method of [<code>Capabilities</code>](#module_Capabilities)  
**Example**  
```js
// Outputs whether the browser supports h264 video ( 1 if yes, else 0)
var h264 = capabilities.detect().h264;
```
<a name="module_Environment"></a>

## Environment
Environment Detection - Gets Data Pertaining to User's Environment

**Example**  
```
var environment = require("adlibs/lib/detect/environment");
```

* [Environment](#module_Environment)
    * [.detect()](#module_Environment.detect) ⇒ <code>Object</code>
    * [.getFlashVersion()](#module_Environment.getFlashVersion) ⇒ <code>Number</code>
    * [.getFrameDepth()](#module_Environment.getFrameDepth) ⇒ <code>String</code>
    * [.getAvailableScreenSize()](#module_Environment.getAvailableScreenSize) ⇒ <code>Object</code>
    * [.getScreenSize()](#module_Environment.getScreenSize) ⇒ <code>Object</code>
    * [.getAdDocSize()](#module_Environment.getAdDocSize) ⇒ <code>Object</code>

<a name="module_Environment.detect"></a>

### environment.detect() ⇒ <code>Object</code>
Detect environmental variables and return them wrapped within an object.

**Kind**: static method of [<code>Environment</code>](#module_Environment)  
**Returns**: <code>Object</code> - returns the environment object  
**Example**  
```js
var flash = environment.detect().flash;

console.log(flash) // outputs the version of Flash
```
<a name="module_Environment.getFlashVersion"></a>

### environment.getFlashVersion() ⇒ <code>Number</code>
**Kind**: static method of [<code>Environment</code>](#module_Environment)  
<a name="module_Environment.getFrameDepth"></a>

### environment.getFrameDepth() ⇒ <code>String</code>
**Kind**: static method of [<code>Environment</code>](#module_Environment)  
<a name="module_Environment.getAvailableScreenSize"></a>

### environment.getAvailableScreenSize() ⇒ <code>Object</code>
**Kind**: static method of [<code>Environment</code>](#module_Environment)  
<a name="module_Environment.getScreenSize"></a>

### environment.getScreenSize() ⇒ <code>Object</code>
**Kind**: static method of [<code>Environment</code>](#module_Environment)  
<a name="module_Environment.getAdDocSize"></a>

### environment.getAdDocSize() ⇒ <code>Object</code>
**Kind**: static method of [<code>Environment</code>](#module_Environment)  
<a name="module_Mraid"></a>

## Mraid
Mraid Detection

**Example**  
```js
var mraid = require("adlibs/lib/detect/mraid");

console.log(mraid.getVersion()) // outputs mraid version;
```

* [Mraid](#module_Mraid)
    * [.ready(cb, [If])](#module_Mraid.ready)
    * [.getVersion([If])](#module_Mraid.getVersion) ⇒ <code>String</code>
    * [.diagnostic(win)](#module_Mraid.diagnostic) ⇒ <code>Object</code>

<a name="module_Mraid.ready"></a>

### mraid.ready(cb, [If])
Executes cb when mraid is ready.

**Kind**: static method of [<code>Mraid</code>](#module_Mraid)  

| Param | Type | Description |
| --- | --- | --- |
| cb | <code>function</code> |  |
| [If] | <code>Window</code> | not given, uses the current window. |

<a name="module_Mraid.getVersion"></a>

### mraid.getVersion([If]) ⇒ <code>String</code>
Gets mraid version.

**Kind**: static method of [<code>Mraid</code>](#module_Mraid)  

| Param | Type | Description |
| --- | --- | --- |
| [If] | <code>Window</code> | not given, uses the current window. |

<a name="module_Mraid.diagnostic"></a>

### mraid.diagnostic(win) ⇒ <code>Object</code>
**Kind**: static method of [<code>Mraid</code>](#module_Mraid)  

| Param | Type | Description |
| --- | --- | --- |
| win | <code>Object</code> | Window Object |

<a name="module_Safeframe"></a>

## Safeframe
Safeframe Detection

**Example**  
```js
var safeframe = require("adlibs/lib/detect/safeframe");
```

* [Safeframe](#module_Safeframe)
    * [.getVersion([win])](#module_Safeframe.getVersion) ⇒ <code>String</code>
    * [.getSpecVersion([win])](#module_Safeframe.getSpecVersion) ⇒ <code>String</code>
    * [.getInfo([win])](#module_Safeframe.getInfo) ⇒ <code>Array</code>
    * [.getConf([win])](#module_Safeframe.getConf) ⇒ <code>Array</code>
    * [.getSupport([win])](#module_Safeframe.getSupport) ⇒ <code>Array</code>
    * [.getInView([win])](#module_Safeframe.getInView) ⇒ <code>Number</code>
    * [.getWinFocus([win])](#module_Safeframe.getWinFocus) ⇒ <code>Number</code>
    * [.getMetrics([win])](#module_Safeframe.getMetrics) ⇒ <code>Array</code>

<a name="module_Safeframe.getVersion"></a>

### Safeframe.getVersion([win]) ⇒ <code>String</code>
Get version of safeframe.

**Kind**: static method of [<code>Safeframe</code>](#module_Safeframe)  

| Param | Type |
| --- | --- |
| [win] | <code>Window</code> | 

<a name="module_Safeframe.getSpecVersion"></a>

### Safeframe.getSpecVersion([win]) ⇒ <code>String</code>
Gets specVersion of safeframe.

**Kind**: static method of [<code>Safeframe</code>](#module_Safeframe)  

| Param | Type |
| --- | --- |
| [win] | <code>Window</code> | 

<a name="module_Safeframe.getInfo"></a>

### Safeframe.getInfo([win]) ⇒ <code>Array</code>
Gets info of safeframe.

**Kind**: static method of [<code>Safeframe</code>](#module_Safeframe)  

| Param | Type |
| --- | --- |
| [win] | <code>Window</code> | 

<a name="module_Safeframe.getConf"></a>

### Safeframe.getConf([win]) ⇒ <code>Array</code>
Gets config of safeframe host.

**Kind**: static method of [<code>Safeframe</code>](#module_Safeframe)  

| Param | Type |
| --- | --- |
| [win] | <code>Window</code> | 

<a name="module_Safeframe.getSupport"></a>

### Safeframe.getSupport([win]) ⇒ <code>Array</code>
Returns array of supported fields for sf.ext.

**Kind**: static method of [<code>Safeframe</code>](#module_Safeframe)  

| Param | Type |
| --- | --- |
| [win] | <code>Window</code> | 

<a name="module_Safeframe.getInView"></a>

### Safeframe.getInView([win]) ⇒ <code>Number</code>
Gets inview percentage of safeframe.

**Kind**: static method of [<code>Safeframe</code>](#module_Safeframe)  

| Param | Type |
| --- | --- |
| [win] | <code>Window</code> | 

<a name="module_Safeframe.getWinFocus"></a>

### Safeframe.getWinFocus([win]) ⇒ <code>Number</code>
Returns if safeframe window has focus.

**Kind**: static method of [<code>Safeframe</code>](#module_Safeframe)  

| Param | Type |
| --- | --- |
| [win] | <code>Window</code> | 

<a name="module_Safeframe.getMetrics"></a>

### Safeframe.getMetrics([win]) ⇒ <code>Array</code>
Returns safeframe metrics.

**Kind**: static method of [<code>Safeframe</code>](#module_Safeframe)  

| Param | Type |
| --- | --- |
| [win] | <code>Window</code> | 

<a name="module_addEventListener"></a>

## addEventListener ⇒ <code>function</code>
Add an event listener to the element, which will execute the given callback.

**Returns**: <code>function</code> - returns a function that, when executed, will remove the event listener from the element  

| Param | Type |
| --- | --- |
| element | <code>Element</code> | 
| eventName | <code>String</code> | 
| callback | <code>function</code> | 

**Example**  
```js
var addEventListener = require('adlibs/lib/dom/addEventListener');

addEventListener(el, 'onLoad', cb);

```
<a name="module_appendHtml"></a>

## ~~appendHtml ⇒ <code>Array</code>~~
***Deprecated***

Appends all elements in the html string to the parent element. Correctly handles scripts with src attributes and inline javascript and ensures that the script will execute.
NOTE: Only Element nodes in the html string will be appended. All other node types will be ignored (i.e. Text, Comment).

**Returns**: <code>Array</code> - returns a list of any exceptions that occurred  
**Note**: This module is deprecated but remains for backwards compatibility; please use 'embedHtml' instead  

| Param | Type |
| --- | --- |
| parentEl | <code>Element</code> | 
| html | <code>String</code> | 

**Example**  
```js
var appendHtml = require('adlibs/lib/dom/appendHtml');

appendHtml(parentElement, htmlMarkup);

```
<a name="module_domReady"></a>

## domReady
Executes the provided callback when the DOM is ready. Allows code to act on the DOM before the window "load" event fires.


| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> |  |
| [targetWindow] | <code>Window</code> | You can provide your own window reference for cases where you'd have an iframe. |
| [isInteractiveOk] | <code>Boolean</code> | Interactive mode can be checked for faster responses. |

**Example**  
```js
var domReady = require('adlibs/lib/dom/domReady');

// executes the cb on dom ready
domReady(cb, window);

```
<a name="module_getExecutingScript"></a>

## getExecutingScript
<a name="module_getExecutingScript..getExecutingScript"></a>

### getExecutingScript~getExecutingScript([validatorFunc], [testScript]) ⇒ <code>HTMLScriptElement</code> \| <code>null</code>
Returns the script element that loaded the currently executing javascript code.

The validatorFunc function takes a script Element as a single argument, and should
return a boolean value. Allows more specific filtering in the case of multiple
scripts on the page where document.currentScript is not supported.

When the executing script has been located, it will be marked with an attribute
key/value pair represented at getExecutingScript.LOAD_ATTR and getExecutingScript.LOAD_STARTED.

**Kind**: inner method of [<code>getExecutingScript</code>](#module_getExecutingScript)  

| Param | Type | Description |
| --- | --- | --- |
| [validatorFunc] | <code>function</code> |  |
| [testScript] | <code>HTMLScriptElement</code> | Used for IoC/testing. |

<a name="module_triggerEvent"></a>

## triggerEvent
Creates a new DOM Event and triggers it on the provided element.


| Param | Type |
| --- | --- |
| element | <code>Element</code> | 
| eventName | <code>String</code> | 

<a name="module_evaluator"></a>

## evaluator ⇒ <code>Object</code>
Runs eval against the value passed to it. This function exists because eval prevents Uglify from minifying correctly.
	Encapsulating eval in its own module prevents the above issue. Variables and properties are one letter vars because Uglify won't function for this module.
	For more info on eval visit: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval

**Returns**: <code>Object</code> - evalResult  

| Param | Type |
| --- | --- |
| scriptString | <code>String</code> | 

<a name="module_jsonp"></a>

## jsonp ⇒ <code>Object</code>
Perform a cross domain request via JSONP. Provides the same interface as xhr.js. The request is made by appending a 'callback' parameter to the request url, and it is expected that the server will respond with the content wrapped in a function call, using the provided value of the callback parameter. If callbackFn isn't defined, a unique name will be generated.

**Returns**: <code>Object</code> - returns object with send function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| callback | <code>function</code> | Executed on response with the signature (status: Number, body: String). |

**Example**  
```js
// for call -> http://example.com/?callback=CB_1433519761916
// the following gets executed
CB_1433519761916('response from server');

```
<a name="module_loadScript"></a>

## loadScript
Dynamically loads scripts in parallel, and executes a single callback after all scripts have loaded.


| Param | Type | Description |
| --- | --- | --- |
| urls | <code>String</code> \| <code>Array</code> | A single url, or a list of urls of scripts to load. |
| onLoaded | <code>function</code> | Callback is executed when all scripts have finished loading. |
| onError | <code>function</code> | Callback is executed if one or more scripts fail to load, and passed 							  a single argument: the list of script urls that failed to load. |
| [requestTimeout] | <code>Number</code> | When supplied, this will explicitly timeout the script request 							  and report back to onError, or, if onError is not supplied, to onLoaded. 							  IMPORTANT: This does not cancel the script load, just reports that it 							  has exceeded the timeout duration. |

<a name="module_measurePerformance"></a>

## measurePerformance

* [measurePerformance](#module_measurePerformance)
    * [.factory](#module_measurePerformance.factory) ⇒ <code>MeasurePerformance</code>
    * [.provider](#module_measurePerformance.provider) ⇒ <code>MeasurePerformance</code>

<a name="module_measurePerformance.factory"></a>

### measurePerformance.factory ⇒ <code>MeasurePerformance</code>
Create a new instance of the performance module.

**Kind**: static property of [<code>measurePerformance</code>](#module_measurePerformance)  
**Example**  
```js
var perf = require('adlibs/lib/measurePerformance').factory();

console.log(perf.now() - perf.startTime); // outputs duration since script start
console.log(perf.report()); // outputs report based on performance events such as domLoading, navigationStart, etc.
```
<a name="module_measurePerformance.provider"></a>

### measurePerformance.provider ⇒ <code>MeasurePerformance</code>
Tie into an existing instance of the performance module.

**Kind**: static property of [<code>measurePerformance</code>](#module_measurePerformance)  

| Param |
| --- |
| packageName | 

<a name="module_parseConfig"></a>

## parseConfig ⇒ <code>Object</code>
Parses a json config from the provided Element. The defaults is expected to be a JSON string in the attribute value.

**Returns**: <code>Object</code> - returns the parsed json config  

| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | The HTML Element that contains the config defaults. |
| attrName | <code>String</code> |  |
| [defaults] | <code>Object</code> |  |

**Example**  
```js
var parseConfig = require('adlibs/lib/parseConfig');

console.log(parseConfig(htmlElement, attributeName, defaultVals)) // outputs the parsed object from the element
```
<a name="module_perfMarker"></a>

## perfMarker
A module to mark the timestamps for script performance


* [perfMarker](#module_perfMarker)
    * [.factory](#module_perfMarker.factory) ⇒ <code>PerfMarker</code>
    * [.provider](#module_perfMarker.provider) ⇒ <code>PerfMarker</code>

<a name="module_perfMarker.factory"></a>

### perfMarker.factory ⇒ <code>PerfMarker</code>
Creates a new instance of PerfMarker.

**Kind**: static property of [<code>perfMarker</code>](#module_perfMarker)  
<a name="module_perfMarker.provider"></a>

### perfMarker.provider ⇒ <code>PerfMarker</code>
Ties into an existing instance of PerfMarker.

**Kind**: static property of [<code>perfMarker</code>](#module_perfMarker)  

| Param | Type | Description |
| --- | --- | --- |
| [pkgName] | <code>String</code> | The name of the instance. |

<a name="module_reportData"></a>

## reportData

* [reportData](#module_reportData)
    * _static_
        * [.factory](#module_reportData.factory) ⇒ <code>ReportData</code>
        * [.provider](#module_reportData.provider) ⇒ <code>ReportData</code>
    * _inner_
        * [~xhrTrack(trackURL)](#module_reportData..xhrTrack) ⇒ <code>String</code>
        * [~imgTrack(trackURL)](#module_reportData..imgTrack)
        * [~isChrome()](#module_reportData..isChrome) ⇒ <code>boolean</code>
        * [~isSafari()](#module_reportData..isSafari) ⇒ <code>boolean</code>
        * [~objectToQueryString(params)](#module_reportData..objectToQueryString) ⇒ <code>String</code>
        * [~isSendBeaconAvailable()](#module_reportData..isSendBeaconAvailable) ⇒ <code>Boolean</code>
        * [~sendReport([url], [isUnloadEvent], [sendBeaconJsonString])](#module_reportData..sendReport) ⇒ <code>\*</code>

<a name="module_reportData.factory"></a>

### reportData.factory ⇒ <code>ReportData</code>
Create a new instance of the reportData module.

**Kind**: static property of [<code>reportData</code>](#module_reportData)  

| Param | Type | Description |
| --- | --- | --- |
| [baseURL] | <code>String</code> | Base url for reporting pixel info. |
| [measurePerformanceInstance] | <code>MeasurePerformance</code> | Performance instance to provide measurement timestamps. |

<a name="module_reportData.provider"></a>

### reportData.provider ⇒ <code>ReportData</code>
Tie into an existing instance of the reportData module.

**Kind**: static property of [<code>reportData</code>](#module_reportData)  

| Param |
| --- |
| packageName | 

<a name="module_reportData..xhrTrack"></a>

### reportData~xhrTrack(trackURL) ⇒ <code>String</code>
Safari can't use tracking pixels on unload, but xhr is said to work. Caveat is it's a sync call so it hangs the browser a split second.

**Kind**: inner method of [<code>reportData</code>](#module_reportData)  

| Param | Type |
| --- | --- |
| trackURL | <code>String</code> | 

<a name="module_reportData..imgTrack"></a>

### reportData~imgTrack(trackURL)
This method makes a call to a url but does not actually draw a pixel to a page in any way.
The image will be cleaned up by the browser easily because it's not referenced again past this point.

**Kind**: inner method of [<code>reportData</code>](#module_reportData)  

| Param | Type | Description |
| --- | --- | --- |
| trackURL | <code>String</code> | returns {String} |

<a name="module_reportData..isChrome"></a>

### reportData~isChrome() ⇒ <code>boolean</code>
Returns true if browser is Chrome; false otherwise

**Kind**: inner method of [<code>reportData</code>](#module_reportData)  
<a name="module_reportData..isSafari"></a>

### reportData~isSafari() ⇒ <code>boolean</code>
Returns true if browser is Safari; false otherwise

**Kind**: inner method of [<code>reportData</code>](#module_reportData)  
<a name="module_reportData..objectToQueryString"></a>

### reportData~objectToQueryString(params) ⇒ <code>String</code>
Iterate over an object literal's properties and convert those to a string to be appended to a url

**Kind**: inner method of [<code>reportData</code>](#module_reportData)  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | key/value pairs to convert into a query string |

<a name="module_reportData..isSendBeaconAvailable"></a>

### reportData~isSendBeaconAvailable() ⇒ <code>Boolean</code>
Utility function to determine if sendBeacon is natively supprted

**Kind**: inner method of [<code>reportData</code>](#module_reportData)  
<a name="module_reportData..sendReport"></a>

### reportData~sendReport([url], [isUnloadEvent], [sendBeaconJsonString]) ⇒ <code>\*</code>
Sends data utilizing sendBeacon if selected and available

**Kind**: inner method of [<code>reportData</code>](#module_reportData)  

| Param | Type | Description |
| --- | --- | --- |
| [url] | <code>String</code> |  |
| [isUnloadEvent] | <code>Boolean</code> |  |
| [sendBeaconJsonString] | <code>String</code> | Json formated string of data to send |

<a name="module_format"></a>

## format ⇒ <code>String</code>
Constructs a URL from its parsed components. 1) Host takes precedence over hostname and port. 2) Query takes precedence over search.


| Param | Type | Description |
| --- | --- | --- |
| components | <code>Object</code> | The url components, as generated by url/parse.js. |

<a name="module_parse"></a>

## parse ⇒ <code>Object</code>
Deconstructs a URL into its components. It also parses the search component (the query string) into decoded key/value pairs on a query object.


| Param | Type |
| --- | --- |
| url | <code>String</code> | 

**Example**  
```js
var parseUrl = require('adlibs/lib/url/parse');

var queryObj = parseUrl('http://example.com/query?cb=1234&userid=9999');

```
<a name="module_xhr"></a>

## xhr
Cross browser wrapper for XMLHttpRequest. If you need Cookies and HTTP Auth data to be included in the request, you must set withCredentials to true in the options.

**Example**  
```js
var xhr = require('adlibs/lib/xhr');
```

* [xhr](#module_xhr)
    * _static_
        * [.supportsCORS()](#module_xhr.supportsCORS) ⇒ <code>Boolean</code>
    * _inner_
        * [~xhr(options, callback)](#module_xhr..xhr) ⇒ <code>Object</code>

<a name="module_xhr.supportsCORS"></a>

### xhr.supportsCORS() ⇒ <code>Boolean</code>
Determines if CORS is supported.

**Kind**: static method of [<code>xhr</code>](#module_xhr)  
**Returns**: <code>Boolean</code> - returns whether CORS is supported  
<a name="module_xhr..xhr"></a>

### xhr~xhr(options, callback) ⇒ <code>Object</code>
**Kind**: inner method of [<code>xhr</code>](#module_xhr)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| callback | <code>function</code> | Executed on response with the signature (status: Number, body: String). |

**Example**  
```js
// performs a GET request
var resp = xhr({url: 'www.example.com'}).send();

```
<a name="insertAfter"></a>

## insertAfter(elemToInsert, targetElem)
Utility Function to Insert 'elemToInsert' after 'targetElem' in the DOM

**Kind**: global function  

| Param |
| --- |
| elemToInsert | 
| targetElem | 

<a name="isAScript"></a>

## isAScript(inputElem)
Returns true if inputElem is a script element; false otherwise

**Kind**: global function  

| Param | Type |
| --- | --- |
| inputElem | <code>Node</code> \| <code>Element</code> | 

<a name="addToDom"></a>

## addToDom(elem, target)
Adds 'elem' to the DOM with target/parent element 'target'
Scripts are treated differently than other elements because they have to be to work correctly

**Kind**: global function  

| Param |
| --- |
| elem | 
| target | 

<a name="customCloneScript"></a>

## customCloneScript(inputScriptElem, win) ⇒ <code>Element</code>
Clones a script element in a way that is compatible with dynamic DOM-ready loading
Unfortunately, node.cloneNode() will not work in place of this function in this case
nor can it be used inside this function

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| inputScriptElem | <code>Element</code> | Input Script Element |
| win | <code>Object</code> |  |

<a name="cloneElem"></a>

## cloneElem(elemToClone, win) ⇒ <code>Node</code> \| <code>Element</code>
Creates a deep clone of the element passed in (with special logic for scripts)
Scripts have to be handled differently because the script code will not execute unless they are processed this way

**Kind**: global function  

| Param | Type |
| --- | --- |
| elemToClone |  | 
| win | <code>Object</code> | 

<a name="recursiveCloneAndAddToDom"></a>

## recursiveCloneAndAddToDom(inputElem, targetElem, win) ⇒ <code>Node</code> \| <code>Element</code>
Recursively iterates through 'inputElem' child elements, creates clones of them, and attaches them to 'targetElem'
Why? Because script elements (including nested ones) need to be cloned a specific way in order for the code they represent to be executed.

**Kind**: global function  

| Param | Type |
| --- | --- |
| inputElem | <code>Node</code> \| <code>Element</code> | 
| targetElem | <code>Node</code> \| <code>Element</code> | 
| win | <code>Object</code> | 

<a name="insertInlineHtmlString"></a>

## insertInlineHtmlString(htmlString, [parentElem], win) ⇒ <code>boolean</code>
Adds 'htmlString' as a child to element 'parentElem' in a way that's safe to use after the document has been closed

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| htmlString | <code>String</code> | HTML String to Add to the page |
| [parentElem] | <code>Node</code> \| <code>Element</code> | Parent element to attach 'htmlString' as a child to; defaults to document.body |
| win | <code>Object</code> |  |

<a name="createInsContainer"></a>

## createInsContainer(win) ⇒ <code>HTMLModElement</code>
Returns an 'ins' element with a unique ID and class 'adlibs-ins'

**Kind**: global function  

| Param | Type |
| --- | --- |
| win | <code>Object</code> | 

<a name="docWriteHtmlString"></a>

## docWriteHtmlString(htmlString, win) ⇒ <code>boolean</code>
Uses document.writeln to add an HTML string to the page

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| htmlString | <code>string</code> | HTML String to Add to the page |
| win | <code>Object</code> |  |

<a name="isNativeFunction"></a>

## isNativeFunction(value) ⇒ <code>any</code>
Returns true if a function is the native implementation; false otherwise

**Kind**: global function  
**Ref**: https://davidwalsh.name/detect-native-function  

| Param | Type |
| --- | --- |
| value | <code>function</code> | 

<a name="embedHtml"></a>

## embedHtml(htmlString, [parentElem], [callback], [win])
If the doc readyState is complete or interactive, use custom methods to safely write 'htmlString' to the page; otherwise, use native document.write

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| htmlString | <code>string</code> |  |
| [parentElem] | <code>HTMLElement</code> | Parent element to attach 'htmlString' as a child to (this is only used if the document readyState is complete or interactive) |
| [callback] | <code>function</code> | Callback function |
| [win] | <code>Object</code> | Optional window reference to write into |


# adlibs Developers
* [j-brown](https://github.com/j-brown)
* [msahagu2](https://github.com/msahagu2)
* [ericperez](https://github.com/ericperez)
* [gblosser](https://github.com/gblosser42)
* [jeffreytgilbert](https://github.com/jeffreytgilbert)
* [ggustilo](https://github.com/ggustilo)
* [larrymyers](https://github.com/larrymyers)


* * *
