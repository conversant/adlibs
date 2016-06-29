/* global describe:true, it:true */

'use strict';

var parseConfig = require('../lib/parseConfig'),
	JSON3 = require('json3'),
    expect = require('expect.js');

// required so test will pass in old IE and Quirks Mode
// run in noConflict mode so it doesn't touch window.JSON
JSON3.noConflict();

var CONFIG_ATTR = 'data-cnvr-foo';

function createElement(data) {
    var el = document.createElement('script');

	el.setAttribute(CONFIG_ATTR, JSON3.stringify(data));

    return el;
}

describe('parseConfig', function() {

    it('Should parse the json string value from the provided Element attribute.', function() {
        var config = parseConfig(createElement({
            trx: 'a2z',
            url: 'http://foo.bar',
            width: 800,
            height: 600,
            type: 'full'
        }), CONFIG_ATTR);

        expect(config.trx).to.equal('a2z');
        expect(config.url).to.equal('http://foo.bar');
        expect(config.width).to.equal(800);
        expect(config.height).to.equal(600);
        expect(config.type).to.equal('full');
    });

	it('Should fallback to eval for parsing when native JSON support is missing.', function() {
		var nativeJSON = typeof window.JSON !== 'undefined' && JSON.parse;

		if (nativeJSON) {
			window.JSON = undefined;
		}

		var config = parseConfig(createElement({ foo: 'bar' }), CONFIG_ATTR);

		expect(config.foo).to.equal('bar');

		window.JSON = nativeJSON;
	});

	it('Should apply defaults to missing values in the config.', function() {
		var config = parseConfig(createElement({
			trx: 'a2z',
			url: 'http://foo.bar'
		}), CONFIG_ATTR, { align: 'center' });

		expect(config.trx).to.equal('a2z');
		expect(config.url).to.equal('http://foo.bar');
		expect(config.align).to.equal('center');
	});

});
