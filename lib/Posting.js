'use strict';

const ElasticGolem = require('./ElasticGolem');

const ES = new ElasticGolem();

module.exports = function Posting(options) {
	Object.assign( this, options );
	this.es = ES;
	if (!this.hasOwnProperty('source')) {
		throw new MissingArgumentError('Posting requires a source parameter');
	}

	Object.defineProperty(this,'id', { 
		get: function get () {
			if (!this.source || !this.idfromsite) {
				throw new MissingPropertyError('Posting requires properties source and idfromsite');
			}
			return this.source + this.idfromsite;
		}
	});
};

/**
 * @return Promise
 */
module.exports.prototype.save = function () {
	return ES.save( this );
};

