const Log4js = require('log4js');

module.exports = function Base(options) {
    this.options = Object.assign(
        {}, options
    );
    this.logger = Log4js.getLogger();
}
