'use strict';

const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const should = chai.should();

var config = require('../package.json');
config.elasticsearch.index = 'test';

describe('Config', function () {
	it('loads', function () {
		config = require(__dirname + '/../package.json');
		config.should.be.an('object');
		config.facebook.should.be.an('object');
		config.facebook.appId.should.be.a('string');
	});
});
