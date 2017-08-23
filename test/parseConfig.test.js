/* global describe:true, it:true */

'use strict';

var parseConfig = require('../lib/parseConfig'),
    forIn = require('../lib/canHas').forIn,
    expect = require('expect.js');

var CONFIG_ATTR = 'data-cnvr-foo';

function createElement(data) {
    var el = document.createElement('script');

	el.setAttribute(CONFIG_ATTR, JSON.stringify(data));

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
