/* global describe, it, sinon, require */
'use strict';

require('../lib/sendBeacon');
var expect = require('expect.js');


describe('sendBeacon', function() {
    it('If sendBeacon is not an available function, use the post request instead.', function() {
        expect(window.navigator !== undefined).to.equal(true);
        //var sendBeaconFunc = typeof(navigator.sendBeacon) === 'function' ? navigator.sendBeacon : sendBeacon;

        expect(navigator.sendBeacon('/fake/url', {fake: 'data'})).to.equal(true);
    });

});
