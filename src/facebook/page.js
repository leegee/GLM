'use strict';


class Page {
    constructor (options) {
        this.options = Object.assign({}, options);
    }

    query() {
        FB.api('fql', { q: 'SELECT uid FROM user WHERE uid=me()' }, function (res) {
        if(!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }
        console.log(res.data);
        });



SELECT post_id,message 
FROM stream 
WHERE source_id IN (
    SELECT page_id 
    FROM page 
    WHERE name='coca-cola'
) LIMIT 5

    }
}



module.exports = Page;
