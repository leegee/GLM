module.exports.errorNames = [
	'DuplicateEntryError',
	'NaNError',
	'NotYetSupportedError',
	'MissingArgumentError',
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
		// name: errName
		// constructor: global[errName]
	});
	// global[errName].prototype.name = errName;
});


