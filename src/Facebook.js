'use strict';

const Step = require('step');
const Base = require('./Base');
const Page = require('./Facebook/Page');

console.log(Base)

module.exports = function Facebook(options) {
    Base.call(this, options);
    this.accessToken = null;
    this.FB = require('fb');
}

module.exports.prototype = Object.create(Base);
module.exports.prototype.constructor = module.exports;

module.exports.prototype.connect = function () {
    Step(
        // Login
        () => {
            this.FB.api('oauth/access_token', {
                redirect_uri: this.options.facebook.redirectUri,
                client_id: this.options.facebook.appId,
                client_secret: this.options.facebook.appSecret,
                grant_type: 'client_credentials'
            }, (res) => {
                if (!res || res.error) {
                    console.error(!res ? 'error occurred' : res.error);
                    throw new Error();
                }
                this.accessToken = res.access_token;
                this.FB.setAccessToken(this.accessToken);
            });
        }
    );
};

module.exports.prototype.page = function (pageId) {
    var options = Object.assign(this.options, { FB: this.FB, id: pageId });
    return new Page(options);
};
