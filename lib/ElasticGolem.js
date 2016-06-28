/**
* Agent to interact with ElasticSearch
* @module ElasticGolem
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
				idfromsite: { type: "string", index: "not_analyzed", include_in_all: false },
				text: { type: "string", analyzer: "toy_analyser", include_in_all: true },
				created: { type: "date", index: "not_analyzed", include_in_all: false }
			}
		}
	}
};

// In ES search format for exists
module.exports.prototype.unqiueBodyProperties = Object.keys(
	module.exports.prototype.schemaBody.mappings.posting.properties
).filter(
	(field) => {
		return module.exports.prototype.schemaBody.mappings.posting.properties[field].hasOwnProperty('analyzer');
	}
	);


/* Toy scheme */
module.exports.prototype.setup = function (term) {
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

module.exports.prototype.save = function (posting) {
	this.logger.debug('Enter');
	if (!posting.id) {
		throw new MissingPropertyError('passed posting.id absent');
	}
	var body = {
		id: posting.id,
		text: posting.text,
		source: posting.source,
		created: posting.created,
		idfromsite: posting.idfromsite
	};
	return this.exists(body).then((exists) => {
		if (exists) {
			return Promise.reject(new DuplicateEntryError('during save of ' + body.id));
		} else {
			return this.client.index({
				index: this.options.elasticsearch.index,
				type: 'posting',
				body: body
			}).then(() => {
				this.logger.debug('Saved posting');
			}).catch((err) => {
				throw (err);
			});
		}
	});
};

module.exports.prototype.all = function () {
	this.logger.debug('Enter');
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
	this.logger.debug('Enter with "%s"', term);
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

module.exports.prototype.exists = function (posting) {
	this.logger.debug('Enter with %s', posting.id);

	return this.client.count({
		index: this.options.elasticsearch.index,
		body: {
			size: 1,
			query: {
				term: { id : posting.id }
			}
		}
	}).then((body) => {
		return body.count;
	}).catch((err) => {
		this.logger.error(err);
		throw err;
	});
};

