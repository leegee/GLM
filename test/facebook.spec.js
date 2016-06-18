'use strict';

const assert = require('chai').assert;
const expect = require('chai').expect;
const Page = require('../src/Facebook/Page');
const Facebook = require('../src/facebook');

var config;

describe('Load modules', function () {
    expect(Facebook).not.to.be.an('undefined');
    expect(Page).not.to.be.an('undefined');

    describe('Config', function () {
        it('loads', function () {
            config = require(__dirname + '/../config');
            expect(config).to.be.an('object');
            expect(config.facebook).to.be.an('object');
            expect(config.facebook.appId).to.be.a('string');
        });
    });
});


describe('Facebook', function () {
    var facebook, page;

    it('should instantiate', function () {
        expect(Facebook).not.to.be.an('undefined');
        facebook = new Facebook(config);
        expect(facebook).to.be.an('object');
        expect(facebook).to.be.an.instanceof(Facebook);
        expect(facebook.options).to.be.an('object');
        expect(facebook.options.facebook).to.be.an('object');
        expect(facebook.options.facebook.appId).to.be.a('string');
    });

    it('connects', function (done) {
        expect(facebook.accessToken).to.be.a('null');
        var c = facebook.connect();
        expect(c).to.be.instanceof(Promise);
        c.then(() => {
            expect(facebook.accessToken).not.to.be.an('undefined');
            done();
        });
    });

    describe('Page', function () {
        it('should be instantiate from Facebook', function () {
            page = facebook.newPage('142326775790907');
            expect(page).not.to.be.an('undefined');
            expect(page).to.be.an.instanceof(Page);
        });

        it('should fetch from Facebook', (done) => {
            page.get()
                .then((result) => {
                    expect(result).to.be.defined();
                    console.log(result);
                    done();
                })
                .catch((err) => {
                    fail();
                    done();
                })
        });
    });

});
