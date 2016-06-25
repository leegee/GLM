/**
* Agent to interact with Elasticsearch
* @module Elasticsearch
*/

'use strict';

const elasticsearch = require('elasticsearch');
const Base = require('./Base.js');
// sleep = require('sleep');

/**
* Promise-based interface to Elasticsearch 2.1
* @constructor
*/
module.exports = function ElasticGolem(options) {
	options = options || require('../package.json');
	Base.call(this, options);
	this.client = new elasticsearch.Client({
		host: this.options.elasticsearch.host + ':' + this.options.elasticsearch.port,
		log: this.options.elasticsearch.logLevel,
		apiVersion: "2.1"
	});
};

module.exports.prototype = Object.create(Base);
module.exports.constructor = module.exports;

module.exports.prototype.schemaBody = {
	settings: {
		number_of_shards: 1,
		number_of_replicas: 1,
		analysis: {
			analyzer: {
				toy_analyser: {
					type: 'standard',
					tokenizer: 'standard',
					filter: ['whitespace', 'asciifolding', 'standard']
				}
			}
		}
	},
	mappings: {
		posting: {
			properties: {
				id: { type: "string", index: "not_analyzed", include_in_all: false },
				source: { type: "string", index: "not_analyzed", include_in_all: false },
				siteid: { type: "string", index: "not_analyzed", include_in_all: false },
				text: { type: "string", analyzer: "toy_analyser", include_in_all: true },
				created: { type: "date", index: "not_analyzed", include_in_all: false }
			}
		}
	}
};

// In ES search format for getDuplicates
module.exports.prototype.unqiueBodyProperties = Object.keys(
	module.exports.prototype.schemaBody.mappings.posting.properties
).filter(
	(field) => {
		module.exports.prototype.schemaBody.mappings.posting.properties[field].hasOwnProperty('analyzer');
	}
);


/* Toy scheme */
module.exports.prototype.setup = function (term) {
	this.logger.info("Re-creating the index '%s'", this.options.elasticsearch.index);
	return this.client.indices.delete({
		index: this.options.elasticsearch.index,
		ignore: [404]
	}).then((err, resp, respcode) => {
		this.logger.info("Creating index '%s'", this.options.elasticsearch.index);
		return this.client.indices.create({
			index: this.options.elasticsearch.index,
			body: this.schemaBody
		});
	}).then((err, resp, respcode) => {
		this.logger.info('Created the index "%s"', this.options.elasticsearch.index);
		return resp;
	}).catch((err) => {
		throw err;
	});
};

module.exports.prototype.save = function (record) {
	this.logger.debug('Save');
	return this.getDuplicates(record).then((hasDupes) => {
		if (!hasDupes) {
			this.client.index({
				index: this.options.elasticsearch.index,
				type: 'posting', // XXX Use as category?
				body: {
					id: record.id,
					text: record.text,
					source: record.source,
					date: record.date
				}
			});
		}
	});
};


module.exports.prototype.all = function () {
	this.logger.debug('Enter all to return every thing');
	return this.client.search({
		index: this.options.elasticsearch.index,
		body: {
			query: {
				match_all: {}
			}
		}
	});
};

module.exports.prototype.search = function (term) {
	this.logger.debug('Enter search for "%s"', term);
	if (typeof term === 'undefined') {
		return this.all();
	}
	var sendTerm = '*' + term + '*';
	return this.client.search({
		index: this.options.elasticsearch.index,
		body: {
			query: {
				wildcard: {
					_all: { value: sendTerm }
				}
			}
		}
	});
};

module.exports.prototype.hasDupes = function (record) {
	this.logger.debug('Enter hasDupes');

	return this.client.search({
		index: this.options.elasticsearch.index,
		body: {
			size: 0,
			aggs: {
				duplicateCount: {
					terms: {
						field: 'name',
						min_doc_count: 2
					},
					aggs: {
						duplicateDocuments: {
							top_hits: {}
						}
					}
				}
			}
		}
	});
};
