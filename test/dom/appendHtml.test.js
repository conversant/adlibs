/* global describe, it, sinon, beforeEach, afterEach */

var appendHtml = require('../../lib/dom/appendHtml'),
	expect = require('expect.js');

var waitForInterval = 50;
var waitFor = function(check, callback, timeout) {
	var elapsed = 0;
	var intervalId = setInterval(function() {
		elapsed += waitForInterval;

		if (check() || elapsed >= timeout) {
			clearInterval(intervalId);
			callback();
		}
	}, waitForInterval);
};

describe('appendHtml', function() {
	var div;

	beforeEach(function() {
		div = document.createElement('div');
		div.className = 'parent';
		document.body.appendChild(div);
	});

	afterEach(function() {
		document.body.removeChild(div);
	});

	it('Should safely handle the case where no parent element is provided.', function() {
		var errors = appendHtml(undefined, '');

		expect(errors[0].message).to.equal('parentEl is not an Element');
	});

	it('Should append an html string to the given element.', function() {
		appendHtml(div, '<div class="foo">bar</div><span class="baz">something</span>');

		expect(div.querySelectorAll('.foo').length).to.equal(1);
		expect(div.querySelectorAll('.baz').length).to.equal(1);
	});

	it('Should safely handle malformed html and report any errors.', function() {
		var errors = appendHtml(div, '<div>foo</div><td><script src="bogus.js"><script>');

		expect(errors).to.not.equal(null);
		expect(errors.length).to.equal(1);

		// Since the closing tag for the <script> is missing the forward slash, it will
		// be treated as inline js text, and trigger a Syntax Error since it's not valid javascript.
		expect(errors[0]).to.be.a(SyntaxError);

		expect(div.children.length).to.equal(2); // <div> and <script>, <td> should be tossed
	});

	it('Should return an empty array if no errors are encountered.', function() {
		var errors = appendHtml(div, '<script>true</script>');

		expect(errors.length).to.equal(0);
	});

	it('Should append scripts in an html string so that they still load remote javascript.', function(done) {
		this.timeout(5000);

		appendHtml(div, '<script id="test-script" src="/base/public/append-html-verify.js" data-foo="bar"></script>');

		// Verify both the loaded javascript, and the existence of the attribute, since we
		// want to make sure the script tag was properly cloned.

		waitFor(function() {
			return typeof window.APPEND_HTML_TEST === 'boolean';
		}, function() {
			var script = document.querySelectorAll('.parent script')[0];

			if (script && script.getAttribute('data-foo') === 'bar') {
				expect(window.APPEND_HTML_TEST).to.equal(true);
			}

			done();
		}, 5000);
	});

	it('Should append scripts in an html string so that they still execute inline javascript.', function(done) {
		appendHtml(div, '<script type="text/javascript">window.APPEND_HTML_INLINE_JS = true;</script>');

		waitFor(function() {
			return typeof window.APPEND_HTML_INLINE_JS === 'boolean';
		}, function() {
			expect(window.APPEND_HTML_INLINE_JS).to.equal(true);
			done();
		}, 3000);
	});

	it('Should use the "type" attribute from the source for scripts, and default to "text/javascript" if it does not exist.', function() {
		appendHtml(div, '<script type="application/javascript" id="foo1" src="/base/public/append-html-verify.js"></script>');
		appendHtml(div, '<script id="foo2" src="/base/public/append-html-verify.js"></script>');

		expect(document.getElementById('foo1').type).to.equal('application/javascript');
		expect(document.getElementById('foo2').type).to.equal('text/javascript');
	});

	it('Should not append text and comment nodes.', function() {
		appendHtml(div, ' <div>foo</div>  <!-- A COMMENT -->  <div>bar</div> ');

		expect(div.children.length).to.equal(2);
		expect(div.innerHTML).to.equal('<div>foo</div><div>bar</div>');
	});

});
