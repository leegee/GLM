
module.exports = {
   // https://github.com/nomiddlename/log4js-node/wiki/Layouts
  log4js : {
    appenders: [
      {
        type: 'console',
        layout: {
          type: 'pattern',
          pattern: '[%[%5.5p%]] %m'
        }
      }
    ]
  },
  dir: __dirname + '/..',
  log4jsx: '  at @mod.@name in @file:@line'
};