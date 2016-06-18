'use strict';

const Base = require('./Base');

module.exports = function Posting(options) {
    Base.call(this, options);
    if (! this.options.hasOwnProperty('source')) {
        throw new TypeError('Posting requires a source parameter');
    }
};

module.exports.prototype = Object.create(Base);
module.exports.prototype.constructor = module.exports;
