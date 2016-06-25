
module.exports = {
   // https://github.com/nomiddlename/log4js-node/wiki/Layouts
  log4js : {
    appenders: [
      {
        type: 'console',
        layout: {
          type: 'pattern',
          pattern: '[%[%5.5p%]] at %m%n'
        }
      }
    ]
  },
  log4jsx: ' -- @name (@file:@line)'
};