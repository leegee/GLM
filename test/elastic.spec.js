/**
 *  Test our elasticsearch interface class 
 */

/* env: mocha */

"use strict";

const CLEAN_WHEN_DONE = false;

const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const should = chai.should();

require('../lib/Errors');
const logger = new require('../lib/Logger');
const Posting = require('../lib/Posting');
const ElasticGolem = require('../lib/ElasticGolem');

var config = require('../package.json');
config.elasticsearch.index = 'test';

const postingFixture = {
	id: '1',
	story: 'Test text from a Facebook story.',
	message: 'Test text from a Facebook message.',
	source: 'Facebook',
	created: '2012-06-14T01:26:14+0000',
	idfromsite: '99999999999999_999999999999999'
};

var es, posting;

function cleanES() {
	return es.client.indices.delete({
		index: '_all'
	}).then(() => {
		console.info('Deleted all indexes');
	}).catch((err) => {
		console.error('Failed to delete all indexes', err);
	});
}

before(function () {
	this.timeout(30 * 1000);
	es = new ElasticGolem(config);
	return cleanES().then(() => {
		es.setup();
	}).then(() => {
		posting = new Posting(postingFixture);
	})
		.catch((err) => {
			throw err;
		});
});

after(function () {
	if (CLEAN_WHEN_DONE) {
		this.timeout(10 * 1000);
		return cleanES();
	}
});

describe('ElasticGolem', function () {
	describe('test', function () {
		it('defines an instance', function () {
			es.should.be.defined;
			es.should.be.instanceof(ElasticGolem);
		});
	});

	describe('fields', function () {
		it('unqiueBodyProperties', function () {
			es.unqiueBodyProperties.should.be.defined;
			Object.keys(es.unqiueBodyProperties).length.should.be.gt(0);
		});
	});

	describe('save', function () {
		it('saves a unique posting', () => {
			return es.save(posting);
		});

		it('pauses', (done) => {
			return pause(2000).then(done);
		}).timeout(2100);

		it('duplicate detected', () => {
			return es.save(posting).then(() => {
				throw new Error('Failed ');
			}).catch((e) => {
				e.should.be.an.instanceof(DuplicateEntryError);
			});
		});
	});

	describe('search', () => {
		it('with term returns a Promise', () => {
			return es.search('test').should.be.fulfilled;
		});

		it('without term returns a Promise', () => {
			return es.search().should.be.fulfilled;
		});

		it('with term', (done) => {
			return es.search('test').then((res) => {
				var hits = res.hits.hits;
				should.equal(typeof hits, 'object', 'hits list');
				hits.should.be.instanceof(Array, 'hits list');
				hits.should.have.length.gt(0);
				done();
			}).catch((err) => {
				console.error(err);
				done();
			});
		});

		it('without any term', (done) => {
			return es.search().then((res) => {
				var hits = res.hits.hits;
				should.equal(typeof hits, 'object', 'hits list');
				hits.should.be.instanceof(Array, 'hits list');
				hits.should.have.length.gt(0);
				done();
			});
		});

	});
});
