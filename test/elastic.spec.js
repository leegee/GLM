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
	it('constructs a class and instance', () => {
		es = new ElasticGolem(config);
		should.equal(typeof es, "object", "Construted");
		es.should.be.instanceof(ElasticGolem, "Construted class");
	});

	it('sets up an index', (done) => {
		es.setup()
			.then(function () {
				es.index({
					"id": "1",
					"text": "Test text from a Facebook message.",
					"source": "Facebook"
				});
			})
			.then((err, resp, respcode) => {
				setTimeout( done, 2000 ); // wait
			})
			.catch((e) => {
				fail();
				setTimeout( done, 2000 ); // wait
			});
	});
});

describe('ElasticGolem class', () => {
	it('searches with term', (done) => {
		es.search('test')
			.then((res) => {
				var hits = res.hits.hits;
				should.equal(typeof hits, 'object', 'hits list');
				hits.should.be.instanceof(Array, 'hits list');
				hits.should.have.length.gt(0);
				done();
			})
			.catch((e) => {
				fail();
				done();
			});
	});

	it('searches without term', (done) => {
		es.search()
			.then((res) => {
				var hits = res.hits.hits;
				should.equal(typeof hits, 'object', 'hits list');
				hits.should.be.instanceof(Array, 'hits list');
				hits.should.have.length.gt(0);
				done();
			})
			.catch((e) => {
				fail();
				done();
			}	);
	});


	it('removes the index', (done) => {
		es.client.indices.delete({
			index: TEST_INDEX_NAME
		})
			.then((err, resp, respcode) => {
				done();
			})
			.catch((e) => {
				done(e)
			});
	});
});
