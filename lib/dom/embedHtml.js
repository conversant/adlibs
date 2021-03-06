'use strict';

var insContainer,
	insId,
	insCounter = 0,
	cloneDataAttrib = 'data-adlibs-clone';

/**
 * Utility Function to Insert 'elemToInsert' after 'targetElem' in the DOM
 *
 * @param elemToInsert
 * @param targetElem
 */
var insertAfter = function (elemToInsert, targetElem) {
	targetElem.parentNode.insertBefore(elemToInsert, targetElem.nextSibling);
};

/**
 * Returns true if inputElem is a script element; false otherwise
 *
 * @param inputElem {Node | Element}
 */
var isAScript = function (inputElem) {
	return inputElem.nodeName === 'SCRIPT';
};

/**
 * Adds 'elem' to the DOM with target/parent element 'target'
 * Scripts are treated differently than other elements because they have to be to work correctly
 *
 * @param elem
 * @param target
 */
var addToDom = function (elem, target) {
	if (isAScript(target)) {
		insertAfter(elem, target);
	} else {
		target.appendChild(elem);
	}
};

/**
 * Clones a script element in a way that is compatible with dynamic DOM-ready loading
 * Unfortunately, node.cloneNode() will not work in place of this function in this case
 * nor can it be used inside this function
 *
 * @param inputScriptElem {Element} Input Script Element
 * @param win {Object}
 * @returns {Element}
 */
var customCloneScript = function (inputScriptElem, win) {
	var inputScriptAttrib,
		outputScriptElem = win.document.createElement('script'),
		inputScriptAttribs = inputScriptElem.attributes,
		i = 0;
	
	//Attribute Assignment
	for (; i < inputScriptAttribs.length; i++) {
		inputScriptAttrib = inputScriptAttribs[i];
		outputScriptElem.setAttribute(inputScriptAttrib.name, inputScriptAttrib.value);
	}
	
	//'text/innerText' are not attributes so they are assigned independently
	outputScriptElem.text = inputScriptElem.text || '';
	outputScriptElem.innerText = inputScriptElem.innerText || '';
	
	//Ref: https://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order / https://www.w3.org/Bugs/Public/show_bug.cgi?id=11295
	outputScriptElem.async = false;
	
	return outputScriptElem;
};

/**
 * Creates a deep clone of the element passed in (with special logic for scripts)
 * Scripts have to be handled differently because the script code will not execute unless they are processed this way
 *
 * @param elemToClone
 * @param win {Object}
 * @returns {Node | Element}
 */
var cloneElem = function (elemToClone, win) {
	var clonedElem = (isAScript(elemToClone)) ? customCloneScript(elemToClone, win) : elemToClone.cloneNode(true);
	clonedElem.setAttribute && clonedElem.setAttribute(cloneDataAttrib, '1'); //Mark element as being a clone
	return clonedElem;
};

/**
 * Recursively iterates through 'inputElem' child elements, creates clones of them, and attaches them to 'targetElem'
 * Why? Because script elements (including nested ones) need to be cloned a specific way in order for the code they represent to be executed.
 *
 * @param inputElem {Node | Element}
 * @param targetElem {Node | Element}
 * @param win {Object}
 *
 * @returns {Node | Element}
 */
var recursiveCloneAndAddToDom = function (inputElem, targetElem, win) {
	var childClone,
		childElem,
		clonedElem = inputElem.cloneNode(false), //Shallow clone
		i = 0;
	
	//Recursively iterate over child nodes; create shallow clones of them; then recreate DOM tree with newly-created clone army
	for (; i < inputElem.childNodes.length; i++) {
		childElem = inputElem.childNodes[i];
		if (childElem.hasChildNodes() && !isAScript(childElem)) {
			childClone = recursiveCloneAndAddToDom(childElem, clonedElem, win);
		} else {
			childClone = cloneElem(childElem, win);
			addToDom(childClone, clonedElem);
		}
	}
	
	clonedElem && addToDom(clonedElem, targetElem);
	return clonedElem;
};

/**
 * Adds 'htmlString' as a child to element 'parentElem' in a way that's safe to use after the document has been closed
 *
 * @param htmlString {String} HTML String to Add to the page
 * @param [parentElem] {Node | Element} Parent element to attach 'htmlString' as a child to; defaults to document.body
 * @param win {Object}
 * @returns {boolean}
 */
var insertInlineHtmlString = function (htmlString, parentElem, win) {
	parentElem = parentElem || win.document.body;
	
	//Create an 'ins' tag to be a container to hold htmlString
	(insContainer = createInsContainer(win)).innerHTML = htmlString;
	
	//Add the HTML to 'parentElem' by recursively creating clones
	recursiveCloneAndAddToDom(insContainer, parentElem, win);
	return true;
};

/**
 * Returns an 'ins' element with a unique ID and class 'adlibs-ins'
 * @param win {Object}
 * @returns {HTMLModElement}
 */
var createInsContainer = function (win) {
	var ins = win.document.createElement('ins');
	insId = 'adlibs-ins-' + (++insCounter);
	ins.setAttribute('id', insId);
	ins.setAttribute('class', 'adlibs-ins');
	return ins;
};

/**
 * Uses document.writeln to add an HTML string to the page
 *
 * @param htmlString {string} HTML String to Add to the page
 * @param win {Object}
 * @returns {boolean}
 */
var docWriteHtmlString = function (htmlString, win) {
	win.document.writeln(htmlString); //jshint ignore: line
	return true;
};

/**
 * Returns true if a function is the native implementation; false otherwise
 *
 * @ref https://davidwalsh.name/detect-native-function
 * @param value {function}
 * @returns {any}
 */
var isNativeFunction = function (value) {
	var type = typeof value,
		toString = Object.prototype.toString,
		fnToString = Function.prototype.toString,
		reHostCtor = /^\[object .+?Constructor\]$/,
		reNative = RegExp('^' + String(toString)
			.replace(/[.*+?^${}()|[\]\/\\]/g, '\\$&')
			.replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
	return (type === 'function') ? reNative.test(fnToString.call(value)) : (value && type === 'object' && reHostCtor.test(toString.call(value))) || false;
};

/**
 * If the doc readyState is complete or interactive, use custom methods to safely write 'htmlString' to the page; otherwise, use native document.write
 *
 * @param htmlString {string}
 * @param [parentElem] {HTMLElement} Parent element to attach 'htmlString' as a child to (this is only used if the document readyState is complete or interactive)
 * @param [callback] {function} Callback function
 * @param [win] {Object} Optional window reference to write into
 *
 */
var embedHtml = function (htmlString, parentElem, callback, win) {
    var originalDocWrite,
            originalDocWriteln;
	
    win = win || window;
    originalDocWrite = win.document.write;
    originalDocWriteln = win.document.writeln;
 
	if (win.document.readyState === 'complete' || win.document.readyState === 'interactive') {
		//Overwrite document.write and document.writeln (so we can handle nested document.writes)
		if (isNativeFunction(win.document.write)) {
            win.document.write = embedHtml.bind(this);
		}
		
		if (isNativeFunction(win.document.writeln)) {
            win.document.writeln = embedHtml.bind(this);
		}
		
		insertInlineHtmlString(htmlString, parentElem, win);
	} else {
        delete win.document.write; //Restore native implementation
        delete win.document.writeln; //Restore native implementation
        docWriteHtmlString(htmlString, win); //Write contents to DOM using native implementation
	}
    //Restore document.write and document.writeln
    win.document.write = originalDocWrite;
    win.document.writeln = originalDocWriteln;
	
	//Pass the container element to the callback
	if (typeof callback === 'function') {
		callback(insContainer);
	}
};

/**
 * Handles adding HTML elements to the DOM, in whatever state the document is in
 */
module.exports = embedHtml;
