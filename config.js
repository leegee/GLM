'use strict';
var config = {};

var facebookRootUrl = process.env.FACEBOOK_ROOT_URL || 'http://local.leegoddard.net:3000/';

config.facebook = {
    rootUrl:        facebookRootUrl,
    appId:          process.env.FACEBOOK_APPID          || '1748057015406814',
    appSecret:      process.env.FACEBOOK_APPSECRET      || 'd2f5c6cc0d89939d0f43b45d3b2e9336',
    appNamespace:   process.env.FACEBOOK_APPNAMESPACE   || 'golem',
    redirectUri:    process.env.FACEBOOK_REDIRECTURI    ||  facebookRootUrl + 'login/callback'
};

module.exports = config;

