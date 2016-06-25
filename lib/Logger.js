'use strict';

const log4js = require('log4js');
const log4jsx = require("log4js-extend");

log4js.configure(
	require(
		'../.config/' + (process.env.ENV || 'dev') + '/log4js.conf.js'
	)
);

module.exports = function Logger(category) {
	log4jsx(log4js, {
		path: __dirname,
		format: " -- @name (@file:@line)"
	});
	return log4js.getLogger(category);
};
