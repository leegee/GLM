/**
 *  Test our elasticsearch interface class 
 */

/* env: mocha */

"use strict";
const should = require('chai').should();
const log4js = require('Log4js');
const ElasticGolem = require('../lib/ElasticGolem');

var config = require('../package.json');
var TEST_INDEX_NAME = config.elasticsearch.index = 'test';

var es;

describe('ElasticGolem Initialisation', function () {
	this.timeout(10000);
	it('constructs a class and instance', function () {
		es = new ElasticGolem(config);
		should.equal(typeof es, "object", "Construted");
		es.should.be.instanceof(ElasticGolem, "Construted class");
	});

	it('sets up an index', function (done) {
		es.setup()
			.then(function () {
				es.index({
					"id": "1",
					"text": "Test text from a Facebook message.",
					"source": "Facebook"
				});
			})
			.then((err, resp, respcode) => done )
			.catch((e) => done(e));
	});
});

describe('ElasticGolem class', function () {
	it('searches with term', function (done) {
		es.search('Sci-fi')
			.then((res) => {
				var hits = res.hits.hits;
				should.equal(typeof hits, 'object', 'hits list');
				hits.should.be.instanceof(Array, 'hits list');
				hits.should.have.length.gt(0);
				done();
			})
			.catch((e) => done);
	});

	it('searches without term', function (done) {
		es.search()
			.then((res) => {
				var hits = res.hits.hits;
				should.equal(typeof hits, 'object', 'hits list');
				hits.should.be.instanceof(Array, 'hits list');
				hits.should.have.length.gt(0);
				done();
			})
			.catch((e) => done);
	});

	after(function (done) {
		this.timeout(10000);
		es.client.indices.delete({
			index: TEST_INDEX_NAME
		})
			.then((err, resp, respcode) => done)
			.catch((e) => done);
	});
});
