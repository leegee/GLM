'use strict';

const Base = require('../Base');

module.exports = function Page(options) {
    Base.call(this, options);
}

module.exports.prototype = Object.create(Base);
module.exports.prototype.constructor = module.exports;

module.exports.prototype.get = function () {
    this.FB.api('fql', { q: 'SELECT uid FROM user WHERE uid=me()' }, (res) => {
        if (!res || res.error) {
            console.error(!res ? 'error occurred' : res.error);
            throw new Error();
        }
        console.log(res.data);
    });
};



    //     SELECT post_id, message
    //     FROM stream 
    //     WHERE source_id IN (
    //         SELECT page_id 
    // FROM page 
    // WHERE name= 'coca-cola'
    //     ) LIMIT 5

