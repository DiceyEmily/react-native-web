const path = require('path');

// process.env.ENVFILE = false;

// console.log("bable配置文件", process.env.ENVTYPE)

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      },

    ],

    [
      "module-resolver",
      {
        "root": ["."],
        "alias": {
          "@common": './src/rn-common',
          "@src": './src',
        }
      }
    ],

    [
      "transform-inline-environment-variables",
      {
        "exclude": [
          "NODE_ENV"
        ]
      }
    ],
  ],
};
