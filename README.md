# ad-libs.js


A collection of cross-browser methods for use with front-end development. Ad-Libs is a tool that supports various browser
and OS combinations dating back to IE5. It uses feature detection to determine the user's environment and outputs details
pertaining to that OS and browser.

## Installation

npm install https://github.com/conversant/ad-libs.js

## Usage

Each function is exported as a single commonjs module, allowing only the needed modules to be
bundled into a project to keep minified bundles as small as possible.

In Node.js:
```js
// Load the full ad-libs.js build.
var ad-libs = require('ad-libs.js');

// Load a single module for smaller builds with webpack.
var domReady = require('ad-libs.js/lib/dom/domReady');
var browser = require('ad-libs.js/lib/detect/browser');
```

## Detection Modules

There are several modules that use feature detection to determine the user's environment. In order to populate the resulting
objects, the detect function must be executed.

For example, in order to populate the browser object:
```js
var browser = require('ad-libs.js/lib/detect/browser').detect();

// outputs the name of the os
console.log(browser.os.name)
```

# API Reference

    
* [canHas](#module_canHas)
    * [.can(obj, propertyName)](#module_canHas.can) ⇒ <code>boolean</code>
    * [.has(globalObjectName, [scope])](#module_canHas.has) ⇒ <code>\*</code>
    * [.own(obj, propertyName)](#module_canHas.own) ⇒ <code>boolean</code>
    * [.run(obj, [methodName])](#module_canHas.run) ⇒ <code>function</code>
    * [.forIn(obj, callback)](#module_canHas.forIn)

<a name="module_canHas.can"></a>

### canHas.can(obj, propertyName) ⇒ <code>boolean</code>
Can this object use this property

**Kind**: static method of <code>[canHas](#module_canHas)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>obj</td>
    </tr><tr>
    <td>propertyName</td>
    </tr>  </tbody>
</table>

**Example**  
```js
var can = require('ad-libs/lib/canHas').can;
```
<a name="module_canHas.has"></a>

### canHas.has(globalObjectName, [scope]) ⇒ <code>\*</code>
Does this window have this object in it

**Kind**: static method of <code>[canHas](#module_canHas)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>globalObjectName</td><td></td>
    </tr><tr>
    <td>[scope]</td><td><p>Optional scope to use. Alternatively, you can call &quot;run&quot; with a more sane method signature.</p>
</td>
    </tr>  </tbody>
</table>

<a name="module_canHas.own"></a>

### canHas.own(obj, propertyName) ⇒ <code>boolean</code>
Check to see if this object own's the method as opposed to just inheriting it from another object

**Kind**: static method of <code>[canHas](#module_canHas)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>obj</td>
    </tr><tr>
    <td>propertyName</td>
    </tr>  </tbody>
</table>

<a name="module_canHas.run"></a>

### canHas.run(obj, [methodName]) ⇒ <code>function</code>
Return a runnable method by default

**Kind**: static method of <code>[canHas](#module_canHas)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>obj</td><td><p>Scope to use or method to run when not providing a method as the second param</p>
</td>
    </tr><tr>
    <td>[methodName]</td><td><p>The method to check for</p>
</td>
    </tr>  </tbody>
</table>

<a name="module_canHas.forIn"></a>

### canHas.forIn(obj, callback)
For each in, shorthanded because manually writing hasOwnProperty each and every time is not a good use of time.

**Kind**: static method of <code>[canHas](#module_canHas)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>obj</td>
    </tr><tr>
    <td>callback</td>
    </tr>  </tbody>
</table>

    Helper method to create Sinon.JS Spies directly on the value of module.exports for a required module. To spy on a method you need access to the object it is attached to, which is problematic when the function is directly returned from a "require" call. By accessing the require.cache we can get handle to the module's exports and inject the spy.

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>loadedModule</td><td></td><td></td>
    </tr><tr>
    <td>mockType</td><td><code>String</code></td><td><p>defaults to &#39;spy&#39;, can also be &#39;stub&#39;</p>
</td>
    </tr>  </tbody>
</table>

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
    Browser Detection - Gets Data Pertaining to User's Browser and OS

**Example**  
```
var browser = require("adlibs-js/lib/detect/browser")
```

* [Browser](#module_Browser)
    * [.mathMLSupport(d)](#module_Browser.mathMLSupport) ⇒ <code>boolean</code>
    * [.isMobile([win])](#module_Browser.isMobile) ⇒ <code>boolean</code>
    * [.getVersion(uaVersion, minVersion, [maxVersion])](#module_Browser.getVersion) ⇒ <code>number</code>
    * [.looksLike(regex, ua)](#module_Browser.looksLike) ⇒ <code>\*</code> &#124; <code>boolean</code>
    * [.parseIntIfMatch(ua, regex, [radix])](#module_Browser.parseIntIfMatch) ⇒ <code>number</code>
    * [.parseFloatIfMatch(ua, regex)](#module_Browser.parseFloatIfMatch) ⇒
    * [.getAndroidVersion(win, uaVersion)](#module_Browser.getAndroidVersion) ⇒ <code>number</code>
    * [.getChromiumVersion(win, uaVersion)](#module_Browser.getChromiumVersion) ⇒ <code>number</code>
    * [.getSafariVersion(win, uaVersion)](#module_Browser.getSafariVersion) ⇒ <code>number</code>
    * [.getKindleVersion(win, uaVersion)](#module_Browser.getKindleVersion) ⇒ <code>number</code>
    * [.getOtherOS(win, ua)](#module_Browser.getOtherOS) ⇒ <code>Browser</code>
    * [.getAppleOS(win, ua)](#module_Browser.getAppleOS) ⇒ <code>Browser</code>
    * [.getMicrosoftOS(win, ua)](#module_Browser.getMicrosoftOS) ⇒ <code>Browser</code>
    * [.getAndroidOS(win, ua)](#module_Browser.getAndroidOS) ⇒ <code>Browser</code>
    * [.getKindleOS(win, ua)](#module_Browser.getKindleOS) ⇒ <code>Browser</code>
    * [.getOsFromUa(win, ua)](#module_Browser.getOsFromUa) ⇒ <code>Browser</code>
    * [.detect([win], [userAgent])](#module_Browser.detect) ⇒ <code>Browser</code>

<a name="module_Browser.mathMLSupport"></a>

### browser.mathMLSupport(d) ⇒ <code>boolean</code>
Check for MathML support in browsers to help detect certain browser version numbers where this is the only difference

**Kind**: static method of <code>[Browser](#module_Browser)</code>  
**Returns**: <code>boolean</code> - Returns true if browser has mathml support  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>d</td><td><code>Document</code></td>
    </tr>  </tbody>
</table>

<a name="module_Browser.isMobile"></a>

### browser.isMobile([win]) ⇒ <code>boolean</code>
Performs a simple test to see if we're on mobile or not

**Kind**: static method of <code>[Browser](#module_Browser)</code>  
**Returns**: <code>boolean</code> - Returns true if mobile  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[win]</td><td><code>Window</code></td>
    </tr>  </tbody>
</table>

<a name="module_Browser.getVersion"></a>

### browser.getVersion(uaVersion, minVersion, [maxVersion]) ⇒ <code>number</code>
Uses the min and max versions of a browser to determine its version

**Kind**: static method of <code>[Browser](#module_Browser)</code>  
**Returns**: <code>number</code> - Returns version number  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>uaVersion</td><td><code>number</code></td>
    </tr><tr>
    <td>minVersion</td><td><code>number</code></td>
    </tr><tr>
    <td>[maxVersion]</td><td><code>number</code></td>
    </tr>  </tbody>
</table>

<a name="module_Browser.looksLike"></a>

### browser.looksLike(regex, ua) ⇒ <code>\*</code> &#124; <code>boolean</code>
Searches for a match between the regex and specified string

**Kind**: static method of <code>[Browser](#module_Browser)</code>  
**Returns**: <code>\*</code> &#124; <code>boolean</code> - Returns true if match found  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>regex</td><td><code>RegExp</code></td>
    </tr><tr>
    <td>ua</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="module_Browser.parseIntIfMatch"></a>

### browser.parseIntIfMatch(ua, regex, [radix]) ⇒ <code>number</code>
Parses the result of the RegExp match if it exists.
Gracefully falls back to the default version if not

**Kind**: static method of <code>[Browser](#module_Browser)</code>  
**Returns**: <code>number</code> - Returns the regex match or default version  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>ua</td><td><code>string</code></td>
    </tr><tr>
    <td>regex</td><td><code>RegExp</code></td>
    </tr><tr>
    <td>[radix]</td><td><code>number</code></td>
    </tr>  </tbody>
</table>

<a name="module_Browser.parseFloatIfMatch"></a>

### browser.parseFloatIfMatch(ua, regex) ⇒
Parses the floating point value of the RegExp match if found.
Gracefully falls back to the default if not

**Kind**: static method of <code>[Browser](#module_Browser)</code>  
**Returns**: Returns the regex match or the default version  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>ua</td><td><code>string</code></td>
    </tr><tr>
    <td>regex</td><td><code>RegExp</code></td>
    </tr>  </tbody>
</table>

<a name="module_Browser.getAndroidVersion"></a>

### browser.getAndroidVersion(win, uaVersion) ⇒ <code>number</code>
Determines the version of Android being used

**Kind**: static method of <code>[Browser](#module_Browser)</code>  
**Returns**: <code>number</code> - Returns the Android version  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>win</td><td><code>Window</code></td>
    </tr><tr>
    <td>uaVersion</td><td><code>number</code></td>
    </tr>  </tbody>
</table>

<a name="module_Browser.getChromiumVersion"></a>

### browser.getChromiumVersion(win, uaVersion) ⇒ <code>number</code>
Determines the version of Chrome being used

**Kind**: static method of <code>[Browser](#module_Browser)</code>  
**Returns**: <code>number</code> - Returns the Chrome version  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>win</td><td><code>Window</code></td>
    </tr><tr>
    <td>uaVersion</td><td><code>number</code></td>
    </tr>  </tbody>
</table>

<a name="module_Browser.getSafariVersion"></a>

### browser.getSafariVersion(win, uaVersion) ⇒ <code>number</code>
Returns the version of the Safari browser

**Kind**: static method of <code>[Browser](#module_Browser)</code>  
**Returns**: <code>number</code> - Returns the version of Safari  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>win</td><td><code>Window</code></td>
    </tr><tr>
    <td>uaVersion</td><td><code>number</code></td>
    </tr>  </tbody>
</table>

<a name="module_Browser.getKindleVersion"></a>

### browser.getKindleVersion(win, uaVersion) ⇒ <code>number</code>
Creates a Browser instance with its attributed Kindle values

**Kind**: static method of <code>[Browser](#module_Browser)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>win</td><td><code>Window</code></td>
    </tr><tr>
    <td>uaVersion</td><td><code>number</code></td>
    </tr>  </tbody>
</table>

<a name="module_Browser.getOtherOS"></a>

### browser.getOtherOS(win, ua) ⇒ <code>Browser</code>
Creates a Browser instance with its attributed OS and device type values

**Kind**: static method of <code>[Browser](#module_Browser)</code>  
**Returns**: <code>Browser</code> - Returns the browser instance  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>win</td><td><code>Window</code></td>
    </tr><tr>
    <td>ua</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="module_Browser.getAppleOS"></a>

### browser.getAppleOS(win, ua) ⇒ <code>Browser</code>
Creates a Browser instance with its attributed Apple values

**Kind**: static method of <code>[Browser](#module_Browser)</code>  
**Returns**: <code>Browser</code> - Returns the Browser instance  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>win</td><td><code>Window</code></td>
    </tr><tr>
    <td>ua</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="module_Browser.getMicrosoftOS"></a>

### browser.getMicrosoftOS(win, ua) ⇒ <code>Browser</code>
Creates a Browser instance with its attributed Windows values

**Kind**: static method of <code>[Browser](#module_Browser)</code>  
**Returns**: <code>Browser</code> - Returns the Browser instance  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>win</td><td><code>Window</code></td>
    </tr><tr>
    <td>ua</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="module_Browser.getAndroidOS"></a>

### browser.getAndroidOS(win, ua) ⇒ <code>Browser</code>
Creates a Browser instance with its attributed Android values

**Kind**: static method of <code>[Browser](#module_Browser)</code>  
**Returns**: <code>Browser</code> - Returns the Browser instance  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>win</td><td><code>Window</code></td>
    </tr><tr>
    <td>ua</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="module_Browser.getKindleOS"></a>

### browser.getKindleOS(win, ua) ⇒ <code>Browser</code>
Returns the Kindle's OS

**Kind**: static method of <code>[Browser](#module_Browser)</code>  
**Returns**: <code>Browser</code> - Returns the Browser instance  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>win</td><td><code>Window</code></td>
    </tr><tr>
    <td>ua</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="module_Browser.getOsFromUa"></a>

### browser.getOsFromUa(win, ua) ⇒ <code>Browser</code>
Reads the user agent string to determine OS

**Kind**: static method of <code>[Browser](#module_Browser)</code>  
**Returns**: <code>Browser</code> - Returns the Browser instance  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>win</td><td><code>Window</code></td>
    </tr><tr>
    <td>ua</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

<a name="module_Browser.detect"></a>

### browser.detect([win], [userAgent]) ⇒ <code>Browser</code>
Returns an object containing browser details (e.g. name, os, version, etc.)

**Kind**: static method of <code>[Browser](#module_Browser)</code>  
**Returns**: <code>Browser</code> - Returns the Browser instance  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[win]</td><td><code>Window</code></td>
    </tr><tr>
    <td>[userAgent]</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
var os = browser.detect().os.name;

console.log(os); // outputs OS name (e.g. Windows, Mac, Android, etc.)
```
    Determines browser's capabilities (e.g. CORS support, sandboxable, video support, etc.)

**Example**  
```javascript
var capabilities = require("adlibs-js/lib/detect/capabilities");
```
<a name="module_Capabilities.detect"></a>

### capabilities.detect() ⇒ <code>Object</code>
Detect browser's capabilities and returns an object

**Kind**: static method of <code>[Capabilities](#module_Capabilities)</code>  
**Example**  
```js
// Outputs whether the browser supports h264 video ( 1 if yes, else 0)
var h264 = capabilities.detect().h264;
```
    Environment Detection - Gets Data Pertaining to User's Environment

**Example**  
```
var environment = require("adlibs-js/lib/detect/environment");
```

* [Environment](#module_Environment)
    * [.detect()](#module_Environment.detect) ⇒ <code>Object</code>
    * [.getFlashVersion()](#module_Environment.getFlashVersion) ⇒ <code>Number</code>
    * [.getAvailableScreenSize()](#module_Environment.getAvailableScreenSize) ⇒ <code>Object</code>
    * [.getScreenSize()](#module_Environment.getScreenSize) ⇒ <code>Object</code>
    * [.getAdDocSize()](#module_Environment.getAdDocSize) ⇒ <code>Object</code>

<a name="module_Environment.detect"></a>

### environment.detect() ⇒ <code>Object</code>
Detect environmental variables and return them as an array with standard read accessor method and map.

**Kind**: static method of <code>[Environment](#module_Environment)</code>  
**Returns**: <code>Object</code> - Returns the environment object  
**Example**  
```js
var flash = environment.detect().flash;

console.log(flash) // outputs the version of Flash
```
<a name="module_Environment.getFlashVersion"></a>

### environment.getFlashVersion() ⇒ <code>Number</code>
**Kind**: static method of <code>[Environment](#module_Environment)</code>  
<a name="module_Environment.getAvailableScreenSize"></a>

### environment.getAvailableScreenSize() ⇒ <code>Object</code>
**Kind**: static method of <code>[Environment](#module_Environment)</code>  
<a name="module_Environment.getScreenSize"></a>

### environment.getScreenSize() ⇒ <code>Object</code>
**Kind**: static method of <code>[Environment](#module_Environment)</code>  
<a name="module_Environment.getAdDocSize"></a>

### environment.getAdDocSize() ⇒ <code>Object</code>
**Kind**: static method of <code>[Environment](#module_Environment)</code>  
    Mraid Detection

**Example**  
```js
var mraid = require("adlibs-js/lib/detect/mraid");

```

* [Mraid](#module_Mraid)
    * [.ready(cb, [win])](#module_Mraid.ready)
    * [.getVersion([Win])](#module_Mraid.getVersion) ⇒ <code>String</code>

<a name="module_Mraid.ready"></a>

### mraid.ready(cb, [win])
Executes cb when mraid is ready

**Kind**: static method of <code>[Mraid](#module_Mraid)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>cb</td><td><code>function</code></td><td></td>
    </tr><tr>
    <td>[win]</td><td><code>Window</code></td><td><p>is an optional param. If not given, uses the current window</p>
</td>
    </tr>  </tbody>
</table>

<a name="module_Mraid.getVersion"></a>

### mraid.getVersion([Win]) ⇒ <code>String</code>
Gets mraid version

**Kind**: static method of <code>[Mraid](#module_Mraid)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[Win]</td><td><code>Window</code></td><td><p>is an optional param. If not given, uses the current window</p>
</td>
    </tr>  </tbody>
</table>

    Safeframe Detection

**Example**  
```js
var safeframe = require("adlibs-js/lib/detect/safeframe");
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
Get version of safeframe

**Kind**: static method of <code>[Safeframe](#module_Safeframe)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[win]</td><td><code>Window</code></td>
    </tr>  </tbody>
</table>

<a name="module_Safeframe.getSpecVersion"></a>

### Safeframe.getSpecVersion([win]) ⇒ <code>String</code>
Gets specVersion of sf

**Kind**: static method of <code>[Safeframe](#module_Safeframe)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[win]</td><td><code>Window</code></td>
    </tr>  </tbody>
</table>

<a name="module_Safeframe.getInfo"></a>

### Safeframe.getInfo([win]) ⇒ <code>Array</code>
Gets info of sf

**Kind**: static method of <code>[Safeframe](#module_Safeframe)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[win]</td><td><code>Window</code></td>
    </tr>  </tbody>
</table>

<a name="module_Safeframe.getConf"></a>

### Safeframe.getConf([win]) ⇒ <code>Array</code>
Gets conf of safeframe host

**Kind**: static method of <code>[Safeframe](#module_Safeframe)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[win]</td><td><code>Window</code></td>
    </tr>  </tbody>
</table>

<a name="module_Safeframe.getSupport"></a>

### Safeframe.getSupport([win]) ⇒ <code>Array</code>
Returns array of supported fields for sf.ext

**Kind**: static method of <code>[Safeframe](#module_Safeframe)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[win]</td><td><code>Window</code></td>
    </tr>  </tbody>
</table>

<a name="module_Safeframe.getInView"></a>

### Safeframe.getInView([win]) ⇒ <code>Number</code>
Gets inview percentage of safeframe

**Kind**: static method of <code>[Safeframe](#module_Safeframe)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[win]</td><td><code>Window</code></td>
    </tr>  </tbody>
</table>

<a name="module_Safeframe.getWinFocus"></a>

### Safeframe.getWinFocus([win]) ⇒ <code>Number</code>
Returns if safeframe window has focus

**Kind**: static method of <code>[Safeframe](#module_Safeframe)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[win]</td><td><code>Window</code></td>
    </tr>  </tbody>
</table>

<a name="module_Safeframe.getMetrics"></a>

### Safeframe.getMetrics([win]) ⇒ <code>Array</code>
Returns safeframe metrics

**Kind**: static method of <code>[Safeframe](#module_Safeframe)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[win]</td><td><code>Window</code></td>
    </tr>  </tbody>
</table>

    Add an event listener to the element, which will execute the given callback.

**Returns**: <code>function</code> - Returns a function, that when executed, will remove the event listener from the element.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>element</td><td><code>Element</code></td>
    </tr><tr>
    <td>eventName</td><td><code>String</code></td>
    </tr><tr>
    <td>callback</td><td><code>function</code></td>
    </tr>  </tbody>
</table>

**Example**  
```js
var addEventListener = require('ad-libs/lib/dom/addEventListener');

addEventListener(el, 'onLoad', cb);

```
    Appends all elements in the html string to the parent element. Correctly handles scripts with src attributes and inline javascript and ensures that the script will execute.  NOTE: Only Element nodes in the html string will be appended. All other node types will be ignored (i.e. Text, Comment).

**Returns**: <code>Array</code> - a list of any exceptions that occurred.  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>parentEl</td><td><code>Element</code></td>
    </tr><tr>
    <td>html</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

    Executes the provided callback when the DOM is ready. Allows code to act on the DOM before the window "load" event fires.

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>callback</td><td><code>function</code></td><td></td>
    </tr><tr>
    <td>[targetWindow]</td><td><code>window</code></td><td><p>Optionally, you can provide your own window reference for cases where you&#39;d have an iframe.</p>
</td>
    </tr><tr>
    <td>[isInteractiveOk]</td><td><code>Boolean</code></td><td><p>Optionally, interactive mode can be checked for faster responses.</p>
</td>
    </tr>  </tbody>
</table>

    Returns the script element that loaded the currently executing javascript code. The detectScript function takes a script Element as a single argument, and should return a boolean value. Allows more specific filtering in the case of multiple  scripts on the page where document.currentScript is not supported. When the executing script has been located it will be marked with an attribute  key/value pair represented at getExecutingScript.LOAD_ATTR and getExecutingScript.LOAD_STARTED.

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[detectScript]</td><td><code>function</code></td>
    </tr>  </tbody>
</table>

    Creates a new DOM Event and triggers it on the provided element.

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>element</td><td><code>Element</code></td>
    </tr><tr>
    <td>eventName</td><td><code>String</code></td>
    </tr>  </tbody>
</table>

    Runs eval against the value passed to it. This function exists because eval prevents Uglify from minifying correctly. Encapsulating eval in its own module prevents the above issue. Variables and properties are one letter vars because Uglify won't function for this module. That's right - we have one letter vars in our source code, ain't eval grand? For more info on eval visit: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>v</td><td><code>String</code></td>
    </tr>  </tbody>
</table>

    Perform a cross domain request via JSONP. Provides the same interface as xhr.js.   The request is made by appending a 'callback' parameter to the request url,  and it is expected that the server will respond with the content wrapped in  a function call using the provided value of the callback parameter.   If callbackFn isn't defined, a unique name will be generated.

**Returns**: <code>Object</code> - Returns object with send function  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>Object</code></td><td></td>
    </tr><tr>
    <td>callback</td><td><code>function</code></td><td><p>executed on response with the signature (status: Number, body: String)</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
http://foo.com/?callback=CB_1433519761916 => CB_1433519761916('response from server');
```
    Dynamically loads scripts in parallel, and executes a single callback after all scripts have loaded.

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>urls</td><td><code>String</code> | <code>Array</code></td><td><p>a single url, or a list of urls of scripts to load</p>
</td>
    </tr><tr>
    <td>onLoaded</td><td><code>function</code></td><td><p>callback executed when all scripts have finished loading</p>
</td>
    </tr><tr>
    <td>onError</td><td><code>function</code></td><td><p>callback executed if one or more scripts fail to load, passed
                              a single argument, the list of script urls that failed to load</p>
</td>
    </tr><tr>
    <td>[requestTimeout]</td><td><code>Number</code></td><td><p>when supplied, this will explicitly timeout the script request
                              and report back to onError or if onError is not supplied, to onLoaded.
                              IMPORTANT: This does not cancel the script load, just reports that it
                              has exceeded the timeout duration.</p>
</td>
    </tr>  </tbody>
</table>

        Create a new instance of the performance module

    Tie into an existing instance of the performance module

<table>
  <thead>
    <tr>
      <th>Param</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>packageName</td>
    </tr>  </tbody>
</table>

    Parses a json config from the provided Element. The defaults is expected to be a JSON string in the attribute value.

**Returns**: <code>Object</code> - the parsed json config  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>el</td><td><code>Element</code></td><td><p>the HTML Element that contains the config defaults</p>
</td>
    </tr><tr>
    <td>attrName</td><td><code>String</code></td><td></td>
    </tr><tr>
    <td>[defaults]</td><td><code>Object</code></td><td></td>
    </tr>  </tbody>
</table>

**Example**  
```js
var parseConfig = require('ad-libs/lib/parseConfig');

console.log(parseConfig(htmlElement, attributeName, defaultVals)) // outputs the parsed object from the element
```
    **Returns**: an object containing a performance marker factory and provider  

* [perfMarker](#module_perfMarker) ⇒
    * [~markerFactory()](#module_perfMarker..markerFactory) ⇒ <code>PerfMarker</code>
    * [~markerProvider([pkgName])](#module_perfMarker..markerProvider) ⇒ <code>PerfMarker</code>

<a name="module_perfMarker..markerFactory"></a>

### perfMarker~markerFactory() ⇒ <code>PerfMarker</code>
Creates a new instance of PerfMarker

**Kind**: inner method of <code>[perfMarker](#module_perfMarker)</code>  
<a name="module_perfMarker..markerProvider"></a>

### perfMarker~markerProvider([pkgName]) ⇒ <code>PerfMarker</code>
**Kind**: inner method of <code>[perfMarker](#module_perfMarker)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[pkgName]</td><td><code>string</code></td><td><p>The name of the instance</p>
</td>
    </tr>  </tbody>
</table>

    
* [reportData](#module_reportData)
    * [~reportDataFactory([baseURL], [measurePerformanceInstance])](#module_reportData..reportDataFactory) ⇒ <code>ReportData</code>
    * [~reportDataProvider(packageName)](#module_reportData..reportDataProvider) ⇒ <code>ReportData</code>

<a name="module_reportData..reportDataFactory"></a>

### reportData~reportDataFactory([baseURL], [measurePerformanceInstance]) ⇒ <code>ReportData</code>
Create a new instance of the reportData module

**Kind**: inner method of <code>[reportData](#module_reportData)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[baseURL]</td><td><code>string</code></td><td><p>Base url for reporting pixel info</p>
</td>
    </tr><tr>
    <td>[measurePerformanceInstance]</td><td><code>MeasurePerformance</code></td><td><p>performance instance to provide measurement timestamps</p>
</td>
    </tr>  </tbody>
</table>

<a name="module_reportData..reportDataProvider"></a>

### reportData~reportDataProvider(packageName) ⇒ <code>ReportData</code>
Tie into an existing instance of the reportData module

**Kind**: inner method of <code>[reportData](#module_reportData)</code>  
<table>
  <thead>
    <tr>
      <th>Param</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>packageName</td>
    </tr>  </tbody>
</table>

    Constructs a URL from its parsed components. 1) host takes precedence over hostname and port 2) query takes precedence over search

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>components</td><td><code>Object</code></td><td><p>the url components, as generated by url/parse.js</p>
</td>
    </tr>  </tbody>
</table>

    Deconstructs a URL into its components. It also parses the search component (the query string) into decoded key/value pairs on a query object.

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>url</td><td><code>String</code></td>
    </tr>  </tbody>
</table>

    Cross browser wrapper for XMLHttpRequest. If you need Cookies and HTTP Auth data to be included in the request you must set withCredentials to true in the options.

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>Object</code></td><td></td>
    </tr><tr>
    <td>callback</td><td><code>function</code></td><td><p>executed on response with the signature (status: Number, body: String)</p>
</td>
    </tr>  </tbody>
</table>

**Example**  
```js
var xhr = require('ad-libs/lib/xhr').xhr;

xhr.send();

```
    **Returns**: <code>boolean</code> - returns whether CORS is supported  



* * *