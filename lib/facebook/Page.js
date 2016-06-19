'use strict';

const Base = require('../Base');
const Post = require('./Post');

module.exports = function Page(id, options) {
	Base.call(this, options);
	this.id = id;
};

module.exports.prototype = Object.create(Base);
module.exports.prototype.constructor = module.exports;

module.exports.prototype.get = function () {
	return new Promise ( (resolve, reject) => {
		this.options.FB.api('/' + this.id + '/feed', (res) => {
			if ((this.error = this.isError(res))) {
				reject(this.error);
			} else {
				resolve( this.feed2postings( res.data ));
			}
		});
	});
};

module.exports.prototype.feed2postings = function (feedData) {
	var rv = [];
	feedData.forEach( (i) => {
		i.source = 'Facebook';
		rv.push( new Post(i).toPosting() );
	});
	return rv;
};

