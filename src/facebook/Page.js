'use strict';

const Base = require('../Base');

module.exports = function Page(id, options) {
    Base.call(this, options);
    this.id = id;
};

module.exports.prototype = Object.create(Base);
module.exports.prototype.constructor = module.exports;

module.exports.prototype.get = function () {
    return new Promise ( (resolve, reject) => {
        this.options.FB.api('fql', { 
            q: 'SELECT post_id, message FROM stream WHERE source_id=' + this.id 
        }, (res) => {
            if ((this.error = this.isError(res))) {
                return reject(this.error);
            } else {
                resolve(res.data);
            }
        });
    });
};


    //     SELECT post_id, message
    //     FROM stream 
    //     WHERE source_id IN (
    //         SELECT page_id 
    // FROM page 
    // WHERE name= 'coca-cola'
    //     ) LIMIT 5

