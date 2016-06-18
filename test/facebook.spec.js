'use strict';

const assert = require('chai').assert;
const expect = require('chai').expect;
const PROJECT_ROOT = '../';

var config;

describe('Config', function () {
    it ('loads', function () {
        config = require( __dirname + '/../config.js');
        expect(config).to.be.an('object');
        expect(config.facebook).to.be.an('object');
        expect(config.facebook.appId).to.be.a('string');
    });
});

describe('Facebook', function () {
    var Facebook, facebook;

    it('should instantiate', function () {
        Facebook = require( '../src/facebook');
        expect(Facebook).not.to.be.an('undefined');
        facebook = new Facebook( config );
        expect(facebook).to.be.an('object');
        expect(facebook).to.be.an.instanceof(Facebook);
        // expect(facebook.options).to.be.an('object');
        // expect(facebook.options.facebook).to.be.an('object');
        // expect(facebook.options.facebook.appId).to.be.a('string');
    });

    describe('Page', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal(-1, [1, 2, 3].indexOf(5));
            assert.equal(-1, [1, 2, 3].indexOf(0));
        });
    });

});
