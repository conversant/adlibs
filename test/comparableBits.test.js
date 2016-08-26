
'use strict';

/* global describe: true, it: true */
/* jshint bitwise:false */


var expect = require('expect.js'),
    bits = require('../lib/comparableBits'),
    bitSingleton = bits.provider('test.comparableBits'),
    bitFactory = bits.factory(),
	make = bits.make,
	compare = bits.compare;

describe('checkFlags', function () {

    var actions = {
        ACTION1: make(0x1, 'ONE'),
        ACTION2: make(0x2, 'TWO'),
        ACTION3: make(0x4,'THREE'),
        ACTION4: make(0x8, 'FOUR'),
        ACTION5: make(0x10, 'FIVE'),
        ACTION6: make(0x20, 'SIX'),
        ACTION7: make(0x40, 'SEVEN'),
        ACTION8: make(0x80, 'EIGHT'),
        ACTION9: make(0x100, 'NINE'),
        ACTION10: make(0x200, 'TEN')
    };

    bitSingleton.signature = 0x1 | 0x4 | 0x10 | 0x40 | 0x100;   // every odd action (ACTION1, ACTION3, etc.)
    bitFactory.signature = 0x2 | 0x8 | 0x20 | 0x80 | 0x200;      // every even action

    it('Should find a match between a mode and one of its corresponding actions', function () {
        var DEBUG_MODE = 0x1 | 0x2 | 0x10 | 0x20 | 0x100 | 0x200;
        var DIAGNOSTIC_MODE = 0x4 | 0x8 | 0x10 | 0x40 | 0x80 | 0x200;
        expect(compare(actions.ACTION1, 0x1 | 0x4)).to.equal(true);
        expect(compare(actions.ACTION2, DEBUG_MODE)).to.equal(true);
        expect(compare(actions.ACTION5, DEBUG_MODE)).to.equal(true);
        expect(compare(actions.ACTION6, DEBUG_MODE)).to.equal(true);
        expect(compare(actions.ACTION9, DEBUG_MODE)).to.equal(true);
        expect(compare(actions.ACTION10, DEBUG_MODE)).to.equal(true);

        expect(compare(actions.ACTION1, DIAGNOSTIC_MODE)).to.equal(false);
        expect(compare(actions.ACTION2, DIAGNOSTIC_MODE)).to.equal(false);
        expect(compare(actions.ACTION5, DIAGNOSTIC_MODE)).to.equal(true);
        expect(compare(actions.ACTION6, DIAGNOSTIC_MODE)).to.equal(false);
        expect(compare(actions.ACTION9, DIAGNOSTIC_MODE)).to.equal(false);
        expect(compare(actions.ACTION10, DIAGNOSTIC_MODE)).to.equal(true);

        expect(compare(actions.ACTION3, DIAGNOSTIC_MODE)).to.equal(true);
        expect(compare(actions.ACTION4, DIAGNOSTIC_MODE)).to.equal(true);
        expect(compare(actions.ACTION7, DIAGNOSTIC_MODE)).to.equal(true);
        expect(compare(actions.ACTION8, DIAGNOSTIC_MODE)).to.equal(true);
    });

    it('Should find a match between a bitmask and its corresponding action', function () {
        expect(compare(actions.ACTION1, 0x1)).to.equal(true);
        expect(compare(actions.ACTION2, 0x1)).to.equal(false);
        expect(compare(actions.ACTION5, 0x10)).to.equal(true);
        expect(compare(actions.ACTION6, 0x1)).to.equal(false);
        expect(compare(actions.ACTION9, 0x11)).to.equal(false);
        expect(compare(actions.ACTION10, 0x200)).to.equal(true);
    });

    it('Should match the largest bitmasks allowed within the browser', function (){
        var action32 = make(0xFFFFFFFF, '32'); // 11111111111111111111111111111111
        var action33 = make(0x1FFFFFFFF, '31'); // 1111111111111111111111111111111

        var action53 = make(0x1FFFFFFFFFFFFF, '53'); // 11111111111111111111111111111111111111111111111111111

        expect(compare(action33, Math.pow(2,31)-1)).to.equal(true);
        expect(compare(action32, Math.pow(2,32)-1)).to.equal(true);
        expect(compare(action53, Math.pow(2,53)-1)).to.equal(true);

        expect(function(){
            make(0x3FFFFFFFFFFFFF, '54'); // 111111111111111111111111111111111111111111111111111111
        }).to.throwError('Exceeded maximum number of bits allowed by browser: ' + 0x3FFFFFFFFFFFFF);

        compare(action32, 0x7FFFFFFFFFFFFF, function (ex) {
            expect(ex.message).to.equal('Exceeded maximum number of bits allowed by browser: ' + 0x7FFFFFFFFFFFFF);
        });
    });

    it('Should match an action to its comparableBits provider', function () {
        var findOddActions = bitSingleton.compare;
        var findEvenActions = bitFactory.compare;
        
        expect(findOddActions(actions.ACTION1)).to.equal(true);
        expect(findOddActions(actions.ACTION3)).to.equal(true);
        expect(findOddActions(actions.ACTION5)).to.equal(true);
        expect(findOddActions(actions.ACTION7)).to.equal(true);
        expect(findOddActions(actions.ACTION9)).to.equal(true);

        expect(findEvenActions(actions.ACTION2)).to.equal(true);
        expect(findEvenActions(actions.ACTION4)).to.equal(true);
        expect(findEvenActions(actions.ACTION6)).to.equal(true);
        expect(findEvenActions(actions.ACTION8)).to.equal(true);
        expect(findEvenActions(actions.ACTION10)).to.equal(true);

        expect(findEvenActions(actions.ACTION1)).to.equal(false);
        expect(findOddActions(actions.ACTION4)).to.equal(false);
        expect(findEvenActions(actions.ACTION9)).to.equal(false);
        expect(findOddActions(actions.ACTION10)).to.equal(false);

        // ...let's add an even action
        bitSingleton.signature = 0x1 | 0x4 | 0x10 | 0x40 | 0x100 | 0x200;   // every odd action (ACTION1, ACTION3, etc.)
        expect(findOddActions(actions.ACTION10)).to.equal(true);

    });

});

