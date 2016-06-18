/**
 * A Facebook 'Post Object'
 * 
 * @see {@link https://developers.facebook.com/docs/graph-api/reference/v2.0/post}
 */

'use strict';

const Base = require('../Base');
const Posting = require('../Posting');

module.exports = function Post(options) {
    Base.call(this, options);
};

module.exports.prototype = Object.create(Base);
module.exports.prototype.constructor = module.exports;

module.exports.prototype.toPosting = function () {
    return new Posting( this.options );
};
