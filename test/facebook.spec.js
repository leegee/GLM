'use strict';

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const Page = require('../lib/Facebook/Page');
const Facebook = require('../lib/facebook');

var config = require('../package.json');
config.elasticsearch.index = 'test';


describe('Load modules', function () {
	expect(Facebook).not.to.be.an('undefined');
	expect(Page).not.to.be.an('undefined');
});

describe('Facebook', function () {
	var facebook;

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
		var page;

		it('should be instantiate from Facebook', function () {
			page = facebook.newPage('142326775790907');
			expect(page).not.to.be.an('undefined');
			expect(page).to.be.an.instanceof(Page);
		});

		it('should fetch from Facebook', function (done) {
			var p = page.get();
			expect(p).to.be.an.instanceof(Promise);
			p.then(() => {
				done();
			}).catch((err) => {
				done();
				throw err;
			});
		});
	});

});
