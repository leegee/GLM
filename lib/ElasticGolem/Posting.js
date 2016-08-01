'use strict';

/**
 * An object that can be saved in ElasticGolem
 */

const ElasticGolem = require('../ElasticGolem');

const ES = new ElasticGolem();

module.exports = function Posting(options) {
	Object.assign( this, options );
	this.es = ES;
	this.checkFields();

	Object.defineProperty(this,'id', { 
		get: function get () {
			this.checkFields();
			return this.source + this.idfromsite;
		}
	});
};

module.exports.prototype.checkFields = function checkFields () {
	if (!this.hasOwnProperty('source')) {
		throw new MissingArgumentError('Posting requires a source parameter');
	}
	if (!this.hasOwnProperty('idfromsite')) {
		throw new MissingArgumentError('Posting requires a idfromsite parameter');
	}
};

/**
 * @return Promise
 */
module.exports.prototype.save = function save () {
	return ES.save( this );
};

