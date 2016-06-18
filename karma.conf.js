module.exports = function (config) {
    config.set({
        frameworks: ['mocha'],

        browsers: [
            'Chrome'
        ],

        files: [
            '*.js'
        ]

    });
};