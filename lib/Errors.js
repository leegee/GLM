'use strict';

module.exports.errorNames = [
	'DuplicateEntryError',
	'NaNError',
	'NotYetSupportedError',
	'MissingArgumentError',
	'MissingPropertyError',
	'UnknownError'
];

module.exports.errorNames.forEach((errName) => {
	global[errName] = function (message) {
		Error.captureStackTrace(this, this.constructor);
		this.message = message;
	};
	global[errName].prototype = Object.create(Error.prototype, {
		constructor: {
			value: errName,
			writable: true,
			configurable: true,
			name: errName
		}
	});
	global[errName].prototype.name = errName;
});


