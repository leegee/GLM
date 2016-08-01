/**
 * A Facebook 'Post Object'
 * 
 * @see {@link https://developers.facebook.com/docs/graph-api/reference/v2.0/post}
 */

'use strict';

const Base = require('../../Base');
const Posting = require('../../ElasticGolem/Posting');

module.exports = function Post(options) {
	Base.call(this, options);
};

module.exports.prototype = Object.create(Base);
module.exports.prototype.constructor = module.exports;

module.exports.prototype.ingest = function () {
	if (! this.options.id) {
		this.logger.debug('this.options = ', this.options);
		throw new MissingPropertyError('options.id');
	}

	this.logger.debug('Post.ingest id ', this.options.id);

	return new Promise ( (resolve, reject) => {
		this.options.FB.api('/' + this.options.id, (res) => {
			if ((this.error = this.isError(res))) {
				this.logger.error(res);
				reject(this.error);
			} else {
				this.populate( res );
				this.save()
					.then(() => {
						this.ingestComments();
					})
					.then(() => {
						resolve();
					});
			}
		});
	});
};

module.exports.prototype.save = function () {
	this.logger.debug('Post.save');
	this.options.created = this.options.created_time;
	this.options.idfromsite = this.options.id;
	['created_time', 'id'].forEach( (property) => {
		delete this.options[property];
	});
	return new Posting( this.options ).save();
};


module.exports.prototype.ingestComments = function () {
	this.logger.debug('Post.ingestComments for ', this.options.id);
	return new Promise ( (resolve, reject) => {
		this.options.FB.api('/' + this.options.id + '/comments', (res) => {
			if ((this.error = this.isError(res))) {
				this.logger.error(res);
				reject(this.error);
			} else {
				var saved = [];
				feedData.forEach( (i) => {
					i.source = 'Facebook';
					saved.push( new Comment(i).ingest() );
				});
				Promise.all( saved )
					.then( () => {
						resolve();
					});			
			}
		});
	});
};


