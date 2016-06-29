/* global describe, it */

var format = require('../../lib/url/format'),
	expect = require('expect.js');

describe('url/format', function() {

	it('Should take a parsed url and format it in a normalized form.', function() {
		var parsed = {
			protocol: 'http:',
			host: 'www.foo.com',
			pathname: '/something',
			search: '?bar=1',
			hash: '#baz'
		};

		expect(format(parsed)).to.equal('http://www.foo.com/something?bar=1#baz');
	});

	it('Should omit the protocol if it is not present.', function() {
		var parsed = {
			host: 'www.foo.com',
			pathname: '/something',
			search: '?bar=1',
			hash: '#baz'
		};

		expect(format(parsed)).to.equal('//www.foo.com/something?bar=1#baz');
	});

	it('Should add the colon to the protocol if it is missing.', function() {
		var parsed = {
			protocol: 'http',
			host: 'www.foo.com',
			pathname: '/something',
			search: '?bar=1',
			hash: '#baz'
		};

		expect(format(parsed)).to.equal('http://www.foo.com/something?bar=1#baz');
	});

	it('Should compose the host from the hostname and port if the host is missing.', function() {
		var parsed = {
			protocol: 'http',
			hostname: 'www.foo.com',
			pathname: '/something',
			search: '?bar=1',
			hash: '#baz'
		};

		expect(format(parsed)).to.equal('http://www.foo.com/something?bar=1#baz');

		parsed = {
			protocol: 'http',
			hostname: 'www.foo.com',
			port: 80,
			pathname: '/something',
			search: '?bar=1',
			hash: '#baz'
		};

		expect(format(parsed)).to.equal('http://www.foo.com:80/something?bar=1#baz');
	});

	it('Should use the parsed querystring to generate the search if the search is missing.', function() {
		var parsed = {
			protocol: 'http',
			hostname: 'www.foo.com',
			query: { bar: 1, baz: 'hello world' }
		};

		expect(format(parsed)).to.equal('http://www.foo.com?bar=1&baz=hello%20world');

		parsed ={
			protocol: 'http',
			hostname: 'www.foo.com',
			query: null
		};

		expect(format(parsed)).to.equal('http://www.foo.com');
	});

	it('Should add the question mark to the search if it is missing.', function() {
		var parsed = {
			protocol: 'http',
			hostname: 'www.foo.com',
			pathname: '/something',
			search: 'bar=1'
		};

		expect(format(parsed)).to.equal('http://www.foo.com/something?bar=1');
	});

	it('Should add the hash symbol to the has if it missing.', function() {
		var parsed = {
			protocol: 'http',
			hostname: 'www.foo.com',
			pathname: '/something',
			search: '?bar=1',
			hash: 'baz'
		};

		expect(format(parsed)).to.equal('http://www.foo.com/something?bar=1#baz');
	});

});
