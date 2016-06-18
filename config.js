'use strict';
var config = {};

config.facebook = {
    rootUrl:        process.env.ROOT_URL                || 'http://local.leegoddard.net:3000/',
    appId:          process.env.FACEBOOK_APPID          || '1748057015406814',
    appSecret:      process.env.FACEBOOK_APPSECRET      || 'd2f5c6cc0d89939d0f43b45d3b2e9336',
    appNamespace:   process.env.FACEBOOK_APPNAMESPACE   || 'golem',
    redirectUri:    process.env.FACEBOOK_REDIRECTURI    ||  config.rootUrl + 'login/callback'
};

module.exports = config;
