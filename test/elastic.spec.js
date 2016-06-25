/**
 *  Test our elasticsearch interface class 
 */

/* env: mocha */

"use strict";

const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const should = chai.should();

require('../lib/Errors');
var logger = new require('../lib/Logger');
const ElasticGolem = require('../lib/ElasticGolem');

var config = require('../package.json');
var TEST_INDEX_NAME = config.elasticsearch.index = 'test';

var es;
var record = {
	"id": "1",
	"text": "Test text from a Facebook message.",
	"source": "Facebook",
	"created": "2012-06-14T01:26:14+0000",
	"siteid": "142326775790907_427534710603444"
};

beforeEach( function () {
	this.timeout(30 * 1000);
	es = new ElasticGolem(config);
	return es.setup()
		.catch( (err) => {
			throw err;
		});
});

afterEach( function () {
	this.timeout(10 * 1000);
	return es.client.indices.delete({
		index: TEST_INDEX_NAME
	});
});

describe('ElasticGolem', function () {
	// this.timeout(30 * 1000);

	describe('test', function () {
		it('defines an instance', function () {
			es.should.be.defined;
			es.should.be.instanceof(ElasticGolem);
		});
	});

	describe('pseudo-static', function () {
		it('unqiueBodyProperties', function () {
			es.unqiueBodyProperties.should.be.defined;
			Object.keys(es.unqiueBodyProperties).length.should.be.gt(0);
		});
	});

	describe('save', function () {
		it('saves a unique record', () => {
			es.save(record);
		});

		it('duplicate detected', () => {
			return es.save(record)
				.then(() => {
					return es.save(record);
				})
				.then(() => {
					console.error(arguments);
					throw new Error('Failed ');
				})
				.catch( (e) => {
					e.should.be.an.instanceof( DuplicateEntryError );
				});
		});
	});

	xdescribe('search', () => {
		it('search with term returns a Promise', () => {
			es.search('test').should.be.fulfilled;
		});

		it('search without term returns a Promise', () => {
			es.search().should.be.fulfilled;
		});

		it('searches with term', (done) => {
			es.search('test')
				.then((res) => {
					var hits = res.hits.hits;
					should.equal(typeof hits, 'object', 'hits list');
					hits.should.be.instanceof(Array, 'hits list');
					hits.should.have.length.gt(0);
					done();
				})
				.catch( (err) => {
					console.error(err);
					done();
				});
		});

		it('searches without any term', (done) => {
			es.search()
				.then((res) => {
					var hits = res.hits.hits;
					should.equal(typeof hits, 'object', 'hits list');
					hits.should.be.instanceof(Array, 'hits list');
					hits.should.have.length.gt(0);
					done();
				});
		});

	});
});
