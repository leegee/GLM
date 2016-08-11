'use strict';

/**
 * Possting: an object that can be saved in ElasticGolem
 */

const ElasticGolem = require('../ElasticGolem');
const Base = require('../Base');

const ES = new ElasticGolem();

module.exports = function Posting(options) {
	Base.call(this, options);
	this.es = ES;

	Object.defineProperty(this,'id', { 
		get: function get () {
			this.checkFields();
			return this.options.source + this.options.idfromsite;
		}
	});
};

module.exports.prototype = Object.create(Base);
module.exports.prototype.constructor = module.exports;

module.exports.prototype.checkFields = function checkFields () {
	if (!this.options.hasOwnProperty('source')) {
		throw new MissingArgumentError('Posting requires a source parameter');
	}
	if (!this.options.hasOwnProperty('idfromsite')) {
		throw new MissingArgumentError('Posting requires a idfromsite parameter');
	}
};

/**
 * @return Promise
 */
module.exports.prototype.save = function save () {
	this.logger.trace('Enter');

	try { 
		this.checkFields();
	} catch (err) {
		this.logger.error(err);
		return new Promise.reject( err );
	}
	
	this.options.id = this.id;
	return ES.save( this.options );
};

