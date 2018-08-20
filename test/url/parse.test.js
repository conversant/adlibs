/* global describe, it */

var parseUrl = require('../../lib/url/parse'),
	expect = require('expect.js');

describe('url/parse', function() {

	it('Should parse a url into its components.', function() {
		var parsed = parseUrl('http://user:pw@www.example.com:4000/something?foo=1&bar=2#baz');

		expect(parsed.protocol).to.equal('http:');
		expect(parsed.username).to.equal('user');
		expect(parsed.password).to.equal('pw');
		expect(parsed.host).to.equal('www.example.com:4000');
		expect(parsed.hostname).to.equal('www.example.com');
		expect(parsed.port).to.equal(4000);
		expect(parsed.pathname).to.equal('/something');
		expect(parsed.search).to.equal('?foo=1&bar=2');
		expect(parsed.query).to.eql({ foo: '1', bar: '2' });
		expect(parsed.hash).to.equal('#baz');
	});

	it('Should not include a port in the hostname if one does not exist.', function() {
		expect(parseUrl('http://www.example.com/').hostname).to.equal('www.example.com');
	});

	it('Should normalize the hostname to lowercase.', function() {
		expect(parseUrl('http://www.example.com/').hostname).to.equal('www.example.com');
	});

	it('Should parse relative urls.', function() {
		var parsed = parseUrl('/something?foo=1&bar=2#baz');

		expect(parsed.protocol).to.equal(undefined);
		expect(parsed.hostname).to.equal('');
		expect(parsed.pathname).to.equal('/something');
		expect(parsed.search).to.equal('?foo=1&bar=2');
		expect(parsed.query).to.eql({ foo: '1', bar: '2' });
		expect(parsed.hash).to.equal('#baz');
	});

	it('Should decode url encoded values.', function() {
		var parsed = parseUrl('http://www.example.com:4000/something?foo=hello%20world');

		expect(parsed.query.foo).to.equal('hello world');
	});

	it('Should set the parsed query to an empty object if search does not exist.', function() {
		var parsed = parseUrl('http://example.com');

		expect(parsed.query).to.eql({});
	});

	it('Should catch an empty/undefined query string value', function () {
		var parsedWithEqlSign = parseUrl('http://example.com?alpha=1&beta=3&gamma=3&delta=').query;
		var parsedNoEqlSign = parseUrl('http://bar.com?alpha=1&beta=2&gamma=3&delta').query;

		expect(parsedWithEqlSign.delta).to.eql('');
		expect(parsedNoEqlSign.delta).to.eql('');
	});

	it('Should gracefully parse a terrible pain-inducing query string', function () {
		var parsed = parseUrl('http://example.com?alpha=1&beta=2&gamma=3&delta&foo&bar&&&&&&&&someothervalue=true&strangevalue&=').query;
		console.log(parsed);
		expect(parsed.alpha).to.eql('1');
		expect(parsed.beta).to.eql('2');
		expect(parsed.gamma).to.eql('3');
		expect(parsed.delta).to.eql('');
		expect(parsed.foo).to.eql('');
		expect(parsed.bar).to.eql('');
		expect(parsed.strangevalue).to.eql('');
		expect(parsed.someothervalue).to.eql('true');
		expect(parsed['']).to.be(undefined); // in <= 5.0.5, this would be defined using the url above
	});

	it('does not blow up with a URIError when a badly-encoded query string is passed to it.', function() {
		var parsed = parseUrl('http://example.com?badQueryParam=%T');
		expect(parsed.query.badQueryParam).to.be.a('string');
		expect(parsed.query.badQueryParam).to.equal('%T');
	});
	
});
