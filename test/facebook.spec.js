'use strict';

const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const Page = require('../lib/agent/Facebook/Page');
const Post = require('../lib/agent/Facebook/Post');
const Facebook = require('../lib/agent/facebook');

var config = require('../package.json');
config.elasticsearch.index = 'test';

var facebook;

it('Loads modules', function () {
	expect(Facebook).not.to.be.an('undefined');
	expect(Page).not.to.be.an('undefined');
});

describe('Facebook', function () {
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


	describe('Post', function () {
		var post;
		this.timeout(10000);
		it('should ingest', function (done) {
			var options = Object.assign( facebook.options, {
				id: '127824130594191_1126071777436083',
				source: 'facebook'
			});
			post = new Post(options)
			.ingest()
				.then(() => {
					console.log('DONE');
					done();
				}).catch((err) => {
					console.log('FAIL', err);
					done();
				});			
		});
	});

	describe('Page', function () {
		var page;

		it('should instantiate from Facebook', function () {
			page = facebook.newPage('127824130594191');
			page.should.not.be.an('undefined');
			page.should.be.an.instanceof(Page);
		});

		it('should fetch from Facebook', function (done) {
			this.timeout(40000);
			page.get()
				.then(() => {
					console.log('DONE');
					done();
				}).catch((err) => {
					console.log('FAIL', err);
					done();
				});
		});
	});

});
