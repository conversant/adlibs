'use strict';

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
 * Adds 'elem' to the DOM with target/parent elemement 'target'
 * Scripts are treated differently than other elements because they have to be
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
 * @returns {Element}
 */
var customCloneScript = function (inputScriptElem) {
	var inputScriptAttrib,
		outputScriptElem = document.createElement('script'),
		inputScriptAttribs = inputScriptElem.attributes,
		i = 0;
	
	//Attribute Assignment
	for (; i < inputScriptAttribs.length; i++) {
		inputScriptAttrib = inputScriptAttribs[i];
		if (inputScriptAttrib.value) {
			outputScriptElem.setAttribute(inputScriptAttrib.name, inputScriptAttrib.value);
		}
	}
	
	//'text/innerText' are not attributes so they are assigned independently
	outputScriptElem.text = inputScriptElem.text || '';
	outputScriptElem.innerText = inputScriptElem.innerText || '';
	
	//Ref: https://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
	//Ref: https://www.w3.org/Bugs/Public/show_bug.cgi?id=11295
	outputScriptElem.async = false;
	
	return outputScriptElem;
};

/**
 * Creates a deep clone of the element passed in (with special logic for scripts)
 * Scripts have to be handled differently because the script code will not execute unless they are processed this way
 *
 * @param elemToClone
 * @returns {Node | Element}
 */
var cloneElem = function (elemToClone) {
	return (isAScript(elemToClone)) ? customCloneScript(elemToClone) : elemToClone.cloneNode(true);
};

/**
 * Recursively iterates through 'inputElem' child elements, creates clones of them, and attaches them to 'targetElem'
 * Why? Because script elements (including nested ones) need to be cloned a specific way in order for the code they represent to be executed.
 *
 * @param inputElem {Node | Element}
 * @param targetElem {Node | Element}
 *
 * @returns {Node | Element}
 */
var recursiveCloneAndAddToDom = function (inputElem, targetElem) {
	var childClone,
		childElem,
		clonedElem = inputElem.cloneNode(false), //Shallow clone
		i = 0;
	
	//Recursively iterate over child nodes; create shallow clones of them; recreate DOM tree with newly-created clone army
	for (; i < inputElem.childNodes.length; i++) {
		childElem = inputElem.childNodes[i];
		if (childElem.hasChildNodes() && !isAScript(childElem)) {
			childClone = recursiveCloneAndAddToDom(childElem, clonedElem);
		} else {
			childClone = cloneElem(childElem);
			addToDom(childClone, clonedElem);
		}
	}
	
	addToDom(clonedElem, targetElem);
	return clonedElem;
};

/**
 * Adds 'htmlString' to the document.body in a way that's safe to use after the document has been closed
 *
 * @param htmlString {String} HTML String to Add to the page
 * @returns {boolean}
 */
var insertInlineHtmlString = function (htmlString) {
	var htmlStringContainer,
		lineBreak;
	
	//Overwrite document.write and document.writeln (so we can handle nested document.writes)
	document.write = insertInlineHtmlString.bind(this);
	document.writeln = insertInlineHtmlString.bind(this);
	
	//Create a line-break to delineate the HTML string for better readability
	lineBreak = document.createTextNode('\n');
	document.body.appendChild(lineBreak);
	
	//Create an 'ins' tag to be a container to hold htmlString
	htmlStringContainer = document.createElement('ins');
	htmlStringContainer.innerHTML = htmlString;
	
	//Add the HTML to the document.body by recursively creating clones
	recursiveCloneAndAddToDom(htmlStringContainer, document.body);
	
	return true;
};

/**
 * Uses document.write to add an HTML string to the page wrapped in an 'ins' tag
 *
 * @param htmlString {string} HTML String to Add to the page
 * @returns {boolean}
 */
var docWriteHtmlString = function (htmlString) {
	document.writeln('\n<ins>' + htmlString + '</ins>\n'); //jshint ignore: line
	return true;
};

/**
 * If the doc readyState is complete or interactive, use custom methods to safely write 'htmlString' to the page; otherwise, use native document.write
 *
 * @param htmlString {string}
 * @param [callback] {function}
 *
 */
var embedHtml = function (htmlString, callback) {
	if (document.readyState === 'complete' || document.readyState === 'interactive') {
		insertInlineHtmlString(htmlString);
	} else {
		docWriteHtmlString(htmlString);
	}
	
	if (typeof callback === 'function') {
		callback(htmlString);
	}
};


/**
 * Handles adding HTML elements to the DOM, in whatever state the document is in
 *
 * @returns {boolean}
 */
module.exports = embedHtml;