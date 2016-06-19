'use strict';

const Base = require('./Base');
const ElasticGolem = require('./ElasticGolem');

const ES = new ElasticGolem();

module.exports = function Posting(options) {
	Base.call(this, options);
	this.es = ES;
	if (!this.options.hasOwnProperty('source')) {
		throw new MissingArgument('Posting requires a source parameter');
	}
};

module.exports.prototype = Object.create(Base);
module.exports.prototype.constructor = module.exports;

/**
 * @return Promise
 */
module.exports.prototype.save = function () {
	return ES.save( this.options );
};
