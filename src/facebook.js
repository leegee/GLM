'use strict';

const Step = require('step');
const Log4js = require('log4js');
const logger = Log4js.getLogger();

module.exports = Facebook;

function Facebook(options) {
    this.options = Object.assign(
        {}, options
    );
    this.accessToken = null;
    this.FB = require('fb');
}

Facebook.prototype.connect = function () {
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

