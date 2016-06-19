/**
* Agent to interact with Elasticsearch
* @module Elasticsearch
*/

"use strict";

const elasticsearch = require('elasticsearch');
const Base = require('./Base.js');
// sleep = require('sleep');

/**
* Promise-based interface to Elasticsearch 2.1
* @constructor
*/
module.exports = function ElasticGolem(options) {
	Base.call(this, options);
	this.client = new elasticsearch.Client({
		host: this.options.elasticsearch.host + ':' + this.options.elasticsearch.port,
		log: this.options.elasticsearch.logLevel,
		apiVersion: "2.1"
	});
};

module.exports.prototype = Object.create(Base);
module.exports.constructor = module.exports;

/* Toy scheme */
module.exports.prototype.setup = function (term) {
	this.logger.info("Re-creating the index '%s'", this.options.elasticsearch.index);
	return this.client.indices.delete({
		index: this.options.elasticsearch.index,
		ignore: [404]
	}).then((err, resp, respcode) => {
		// sleep.sleep(1);
		this.logger.info("Creating index '%s'", this.options.elasticsearch.index);
		this.client.indices.create({
			index: this.options.elasticsearch.index,
			body: {
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
					torrent: {
						properties: {
							text: { type: "string", analyzer: "toy_analyser", include_in_all: true },
							id: { type: "string", index: "not_analyzed", include_in_all: false },
							source: { type: "string", index: "not_analyzed", include_in_all: false }
						}
					}
				}
			}
		});
		// sleep.sleep(5);
	});
};

module.exports.prototype.index = function (record) {
	this.logger.debug('Add to index:', record);
	return this.client.index({
		index: this.options.elasticsearch.index,
		type: "posting", // XXX Use as category?
		body: {
			id: record.id,
			text: record.title,
			source: record.source
		}
	});
};


module.exports.prototype.all = function () {
	this.logger.debug('Enter all');
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

