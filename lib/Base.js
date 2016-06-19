const Log4js = require('log4js');

module.exports = function Base(options) {
	this.options = Object.assign(
		{}, options
	);
	this.errors = [];
	this.logger = Log4js.getLogger();
};

module.exports.prototype.ERROR = [];

module.exports.errorNames = [
	'NaN',
	'NotYetSupported',
	'UnknownError'
];

module.exports.latestError = function latestError() {
	return this.errors[this.errors.length - 1];
};

module.exports.isError = function (res) {
	if (!res || res.error) {
		this.errors.push(
			!res ? 'An error occurred before response was received' : res.error
		);
		this.logger.error(this.errors[this.errors.length - 1]);
		return this.latestError();
	}
	return null;
};

module.exports.errorNames.forEach((errName) => {
	module.exports.prototype.ERROR[errName] = function (message) {
		Error.captureStackTrace(this, this.constructor);
		this.message = message;
	}
	module.exports.prototype.ERROR[errName].prototype = Object.create(Error.prototype, {
		constructor: {
			value: errName,
			writable: true,
			configurable: true,
			name: errName
		}
	});
	module.exports.prototype.ERROR[errName].prototype.name = errName;
	module.exports.prototype.ERROR[errName].prototype.constructor = module.exports.prototype.ERROR[errName];
});


