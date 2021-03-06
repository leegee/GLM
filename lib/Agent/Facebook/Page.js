'use strict';

const Base = require('../../Base');
const Post = require('./Post');

module.exports = function Page(id, options) {
	Base.call(this, options);
	this.id = id;
};

module.exports.prototype = Object.create(Base);
module.exports.prototype.constructor = module.exports;

module.exports.prototype.get = function () {
	return new Promise ( (resolve, reject) => {
		this.options.FB.api('/' + this.id + '/posts', (res) => { // /feeds
			if ((this.error = this.isError(res))) {
				reject(this.error);
			} else {
				this.save( res.data ).then(() => {
					resolve();
				});
			}
		});
	});
};

module.exports.prototype.save = function (feedData) {
	this.logger.debug('Facebook.Save creating %d Facebook.Posts', feedData.length);
	var saved = [];
	feedData.forEach( (i) => {
		i.source = 'Facebook';
		saved.push( new Post(i).ingest() );
	});
	this.logger.info('Page.save done');
	return Promise.all( saved );
};

