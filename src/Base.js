const Log4js = require('log4js');

module.exports = function Base(options) {
    this.options = Object.assign(
        {}, options
    );
    this.errors = [];
    this.logger = Log4js.getLogger();
};

module.exports.latestError = function latestError () {
    return this.errors[ this.errors.length -1 ];
};

module.exports.fatalErrorResponse = function (res) {
    if (!res || res.error) {
        this.errors.push( 
            !res ? 'An error occurred before response was received' : res.error
        );
        this.logger.error( this.errors[ this.errors.length -1 ] );
        return this.latestError();
    }
};
