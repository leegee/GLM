'use strict';

const Base = require('../Base');

module.exports = function User(id, options) {
	Base.call(this, options);
	this.id = id;
};

module.exports.prototype = Object.create(Base);
module.exports.prototype.constructor = module.exports;

module.exports.prototype.get = function () {
	return new Promise((resolve, reject) => {
		this.options.FB.api('fql', {
			q: 'SELECT uid FROM user WHERE uid="' + this.id + '"'
		}, (res) => {
			if ((this.error = this.isError(res))) {
				reject(this.error);
			} else {
				resolve(res.data);
			}
		});
	});
};

