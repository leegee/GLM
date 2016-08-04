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
	this.options.source = 'facebook';
};

module.exports.prototype = Object.create(Base);
module.exports.prototype.constructor = module.exports;

module.exports.prototype.ingest = function () {
	if (! this.options.id) {
		throw new MissingPropertyError('this.options.id');
	}

	return new Promise ( (resolve, reject) => {
		this.logger.debug('Post.ingest id ', this.options.id);
		this.options.FB.api('/' + this.options.id, (res) => {
			if ((this.error = this.isError(res))) {
				this.logger.error(res);
				reject(this.error);
			} else {
				this.populate( res );
				this.save()
					.then(() => {
						this.logger.info('Pre-ingestComments');
						this.ingestComments();
					})
					.then(() => {
						this.logger.trace('Done');
						resolve();
					})
					.catch( (err) => {
						this.logger.error(err);
					});
			}
		});
	});
};

module.exports.prototype.save = function () {
	this.logger.trace('Post.save');
	var options = Object.assign( this.options );
	options.created = options.created_time;
	options.idfromsite = options.id;
	['created_time', 'id'].forEach( (property) => {
		delete options[property];
	});
	this.logger.trace('Leave with new Posting', options);
	return new Posting( options ).save();
};


module.exports.prototype.ingestComments = function () {
	if (! this.options.id) {
		throw new MissingPropertyError('options.id');
	}
	return new Promise ( (resolve, reject) => {
		this.logger.trace('Post.ingestComments for ', this.options.id);
		this.options.FB.api('/' + this.options.id + '/comments', (res) => {
			if ((this.error = this.isError(res))) {
				this.logger.error(res);
				reject(this.error);
			} else {
				var saved = [];
				feedData.forEach( (i) => {
					i.source = this.options.source;
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


