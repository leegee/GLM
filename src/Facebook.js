'use strict';

const Step = require('step');
const Base = require('./Base');
const Page = require('./Facebook/Page');

module.exports = function Facebook(options) {
    Base.call(this, options);
    this.accessToken = null;
    this.options.FB = this.options.FB || require('fb');
};

module.exports.prototype = Object.create(Base);
module.exports.prototype.constructor = module.exports;

module.exports.prototype.connect = function () {
    return new Promise( (resolve, reject) => {
        this.options.FB.api('oauth/access_token', {
            redirect_uri: this.options.facebook.redirectUri,
            client_id: this.options.facebook.appId,
            client_secret: this.options.facebook.appSecret,
            grant_type: 'client_credentials'
        }, (res) => {
            var err = this.isError(res);
            if (err) {
                return reject(err);
            }
            this.accessToken = res.access_token;
            this.options.FB.setAccessToken(this.accessToken);
            resolve( this.accessToken );
        });
    });
};

module.exports.prototype.newPage = function (pageId) {
    return new Page(pageId, this.options);
};

module.exports.prototype.newUser = function (pageId) {
    return new User(userId, this.options);
};
