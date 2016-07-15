/**
 * A Facebook 'Post Object'
 * 
 * @see {@link https://developers.facebook.com/docs/graph-api/reference/v2.0/post}
 */

'use strict';

const Base = require('../../Base');
const Posting = require('../../Posting');

module.exports = function Post(options) {
	Base.call(this, options);
};

module.exports.prototype = Object.create(Base);
module.exports.prototype.constructor = module.exports;

module.exports.prototype.save = function () {
	this.logger.debug('Post.save');
	this.options.created = this.options.created_time;
	this.options.idfromsite = this.options.id;
	['created_time', 'id'].forEach( (property) => {
		delete this.options[property];
	});
	return new Posting( this.options ).save();
};
