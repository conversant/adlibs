/* global describe, it, sinon, require */
'use strict';

var sendBeacon = require('../lib/sendBeacon');
var expect = require('expect.js');

describe('sendBeacon', function() {
    it('sendBeacon uses the native function if available otherwise use the post requestd.', function() {
        expect(sendBeacon('/fake/url', {fake: 'data'})).to.equal(true);
    });

});

describe('sendBeacon data types ', function () {
    var settings = {timeout: 10};

    it('Try sendBeacon with a string.', function () {
        expect(sendBeacon('/fake/url', String('asdf'))).to.equal(true);
        expect(sendBeacon('/fake/url', String('asdf'), settings)).to.equal(true);
    });

    it('Try sendBeacon with a blob.', function () {
        expect(sendBeacon('/fake/url', new Blob(['abc123'], {type: 'text/plain'}))).to.equal(true);
        expect(sendBeacon('/fake/url', new Blob(['abc123'], {type: 'text/plain'}), settings)).to.equal(true);
    });

    it('Try sendBeacon with an object.', function () {
        expect(sendBeacon('/fake/url', {fake: 'data'})).to.equal(true);
        expect(sendBeacon('/fake/url', {fake: 'data'}, settings)).to.equal(true);
    });
});