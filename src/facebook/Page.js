'use strict';

const Base = require('../Base');

module.exports = function Page(id, options) {
    Base.call(this, options);
    this.id = id;
}

module.exports.prototype = Object.create(Base);
module.exports.prototype.constructor = module.exports;

module.exports.prototype.getUser = function () {
    this.options.FB.api('fql', { 
        q: 'SELECT uid FROM user WHERE uid=me()' 
    }, (res) => {
        if (!res || res.error) {
            this.logger.error(!res ? 'error occurred' : res.error);
            throw new Error();
        }
        this.logger.log(res.data);
    });
};

module.exports.prototype.get = function () {
    this.options.FB.api('fql', { 
        q: 'SELECT post_id, message FROM stream WHERE source_id=' + this.id 
    }, (res) => {
        if (!res || res.error) {
            this.logger.error(!res ? 'error occurred' : res.error);
            throw new Error();
        }
        this.logger.log(res.data);
    });
};


    //     SELECT post_id, message
    //     FROM stream 
    //     WHERE source_id IN (
    //         SELECT page_id 
    // FROM page 
    // WHERE name= 'coca-cola'
    //     ) LIMIT 5

