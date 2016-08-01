/**
 * A Facebook 'Comment Object'
 */

'use strict';

const Base = require('../../Base');
const Posting = require('../../ElasticGolem/Posting');

module.exports = function Comment(options) {
	Base.call(this, options);
};

module.exports.prototype = Object.create(Base);
module.exports.prototype.constructor = module.exports;
