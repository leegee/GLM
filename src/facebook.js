'use strict';

const Step = require('step');
const Log4js = require('log4js');
const logger = Log4js.getLogger();

module.exports = Facebook;

function Facebook (options) {
    this.options = Object.assign(
        {}, options
    );
    this.FB                     = require('fb');
    this.FB.options.appId       = this.options.facebook.appId;
    this.FB.options.appSecret   = this.options.facebook.appSecret;
    this.FB.options.redirectUri = this.options.facebook.redirectUri;
}

Facebook.prototype.connect = function () {
    this.FB.setAccessToken(options.accessToken);
};

Facebook.prototype.index = function (req, res) {
    var accessToken = req.session.access_token;
    if (!accessToken) {
        res.render('index', {
            title: 'Golem',
            loginUrl: this.FB.getLoginUrl({ scope: 'user_about_me' })
        });
    } else {
        console.log("OK");
    }
};

Facebook.prototype.loginCallback = function (req, res, next) {
    var code = req.query.code;

    if (req.query.error) {
        // user might have disallowed the app
        return res.send('login-error ' + req.query.error_description);
    } else if (!code) {
        return res.redirect('/');
    }

    Step(
        function exchangeCodeForAccessToken() {
            this.FB.napi('oauth/access_token', {
                client_id: this.FB.options('appId'),
                client_secret: this.FB.options('appSecret'),
                redirect_uri: this.FB.options('redirectUri'),
                code: code
            }, this);
        },
        function extendAccessToken(err, result) {
            if (err) throw (err);
            FB.napi('oauth/access_token', {
                client_id: this.FB.options('appId'),
                client_secret: this.FB.options('appSecret'),
                grant_type: 'fb_exchange_token',
                fb_exchange_token: result.access_token
            }, this);
        },
        function (err, result) {
            if (err) return next(err);

            req.session.access_token = result.access_token;
            req.session.expires = result.expires || 0;

            if (req.query.state) {
                var parameters = JSON.parse(req.query.state);
                parameters.access_token = req.session.access_token;

                console.log(parameters);

                FB.api('/me/' + this.options.facebook.appNamespace + ':eat', 'post', parameters, function (result) {
                    console.log(result);
                    if (!result || result.error) {
                        return res.send(500, result || 'error');
                        // return res.send(500, 'error');
                    }

                    return res.redirect('/');
                });
            } else {
                return res.redirect('/');
            }
        }
    );
};

Facebook.prototype.logout = function (req, res) {
    req.session = null; // clear session
    res.redirect('/');
};

