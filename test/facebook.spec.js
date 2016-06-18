'use strict';

const assert = require('chai').assert;
const expect = require('chai').expect;
const Page = require('../src/facebook/page');

var config;

describe('Config', function () {
    it ('loads', function () {
        config = require( __dirname + '/../config');
        expect(config).to.be.an('object');
        expect(config.facebook).to.be.an('object');
        expect(config.facebook.appId).to.be.a('string');
    });
});

describe('Facebook', function () {
    var Facebook, facebook, Page, page;

    it('should instantiate', function () {
        Facebook = require( '../src/facebook');
        expect(Facebook).not.to.be.an('undefined');
        facebook = new Facebook( config );
        expect(facebook).to.be.an('object');
        expect(facebook).to.be.an.instanceof(Facebook);
        expect(facebook.options).to.be.an('object');
        expect(facebook.options.facebook).to.be.an('object');
        expect(facebook.options.facebook.appId).to.be.a('string');
    });

    it('connects', function () {
        facebook.connect();
        expect(facebook.accessToken).not.to.be.an('undefined');
    });

    describe('Page', function () {
        it('should be created', function () {
            page = facebook.page();
            expect(page).not.to.be.an('undefined');
            expect(page).to.be.an.instanceof(Page);
        });
    });

});
