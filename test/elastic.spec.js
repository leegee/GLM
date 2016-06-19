/**
 *  Test our elasticsearch interface class 
 */

/* env: mocha */

"use strict";
const should = require('chai').should();
const log4js = require('Log4js');
const Elasticsearch = require('../lib/ElasticGolem');

var config = require('../package.json');
var TEST_INDEX_NAME = config.elasticsearch.index = 'test';

var es;

describe('Init', function () {
    this.timeout(10000);
    it('is as expected', function () {
        es = new Elasticsearch(config);
        should.equal(typeof es, "object", "Construted");
        es.should.be.instanceof(Elasticsearch, "Construted class");
    });

    it('sets up an index', function (done) {
        es.setup()
            .then(function () {
                es.index({
                    "id": "1",
                    "text": "Test"
                });
            })
            .then((err, resp, respcode) => {
                done();
            });
    });
});

describe('Elasticsearch class', function () {
    it('search with term', function (done) {
        es.search('Sci-fi')
            .then((res) => {
                var hits = res.hits.hits;
                should.equal(typeof hits, 'object', 'hits list');
                hits.should.be.instanceof(Array, 'hits list');
                hits.should.have.length.gt(0);
                done();
            })
            .catch((e) => {
                done(e);
            });
    });

    it('search without term', function (done) {
        es.search()
            .then((res) => {
                var hits = res.hits.hits;
                should.equal(typeof hits, 'object', 'hits list');
                hits.should.be.instanceof(Array, 'hits list');
                hits.should.have.length.gt(0);
                done();
            })
            .catch((e) => {
                done(e);
            });
    });

    after(function (done) {
        this.timeout(10000);
        es.client.indices.delete({
            index: TEST_INDEX_NAME
        })
            .then(function (err, resp, respcode) {
                done();
            })
            .catch((e) => {
                done(e);
            });
    });
});
