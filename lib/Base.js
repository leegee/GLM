/**
 * A base class that provides:
 * 
 * * Global errors (@link{#errorNames})
 * * A `logger` property that is an instance of (@link Logger)
 */

const Errors = require('./Errors');
const Logger = require('./Logger');


module.exports = function Base(options) {
	var category;
	this.options = Object.assign( {}, options );
	this.errors = [];

	// https://github.com/v8/v8/wiki/Stack-Trace-API
	try {
		category = ((new Error).stack.split('\n'))[2].match(/^\s+at\sBase\.(\w+)/)[1];
	}
	catch (e) {
		try {
			category = ((new Error).stack.split('\n'))[1].match(/^\s+at\s(\w+)\.Base/)[1];
		}
		catch (e) {
			throw new Error(
				'Could not set logging category from stack:\n' + (new Error).stack
			);
		}
	}

	this.logger = new Logger(category);
};

module.exports.errorNames = Errors.errorNames;

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

global.pause = function (ms) {
	return new Promise(function (resolve, reject) {
		setTimeout(resolve, ms);
	});
};
