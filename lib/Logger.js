'use strict';

const log4js = require('log4js');
const log4jsx = require("log4js-extend");

const format = 	require(
	'../.config/' + (process.env.ENV || 'dev') + '/log4js.conf.js'
);

log4js.configure(
	format.log4js
);

module.exports = function Logger(category) {
	log4jsx(log4js, {
		path: __dirname,
		format: format.log4jsx
	});
	return log4js.getLogger(category);
};
