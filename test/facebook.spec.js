'use strict';

const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const Page = require('../lib/Facebook/Page');
const Facebook = require('../lib/facebook');

var config = require('../package.json');
config.elasticsearch.index = 'test';

it('Loads modules', function () {
	expect(Facebook).not.to.be.an('undefined');
	expect(Page).not.to.be.an('undefined');
});

describe('Facebook', function () {
	var facebook;

	it('instantiation', function () {
		expect(Facebook).not.to.be.an('undefined');
		facebook = new Facebook(config);
		facebook.should.be.an('object');
		facebook.should.be.an.instanceof(Facebook);
		facebook.options.should.be.an('object');
		facebook.options.facebook.should.be.an('object');
		facebook.options.facebook.appId.should.be.a('string');
	});

	it('connects', function (done) {
		expect(facebook.accessToken).to.be.a('null');
		var c = facebook.connect();
		expect(c).to.be.instanceof(Promise);
		c.then(() => {
			facebook.accessToken.should.not.to.be.an('undefined');
			done();
		});
	});

	describe('Page', function () {
		var page;

		it('should be instantiate from Facebook', function () {
			page = facebook.newPage('142326775790907');
			page.should.not.be.an('undefined');
			page.should.be.an.instanceof(Page);
		});

		it('should fetch from Facebook', function (done) {
			this.timeout(4000);
			page.get()
			.then(() => {
				done();
			}).catch((err) => {
				done();
				throw err;
			});
		});
	});

});
