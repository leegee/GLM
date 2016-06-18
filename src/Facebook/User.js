'use strict';

const Base = require('../Base');

module.exports = function User(id, options) {
    Base.call(this, options);
    this.id = id;
}

module.exports.prototype = Object.create(Base);
module.exports.prototype.constructor = module.exports;

module.exports.prototype.get = function () {
    this.options.FB.api('fql', { 
        q: 'SELECT uid FROM user WHERE uid="' + this.id + '"' 
    }, (res) => {
        this.fatalErrorResponse(res)
        this.logger.log(res.data);
    });
};

