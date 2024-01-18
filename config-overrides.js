/* config-overrides.js */
const { override, addDecoratorsLegacy, addExternalBabelPlugin, babelInclude, addWebpackAlias, removeModuleScopePlugin, addWebpackPlugin, setWebpackPublicPath } = require('customize-cra')
const path = require('path')
const webpack = require('webpack')
const fs = require('fs')

//读取env配置文件
const envFilePath = path.resolve(__dirname, process.env.ENVFILE);
const _dotenv = require('dotenv');
const env = (0, _dotenv.config)({ path: envFilePath }).parsed;

//删除android端url
delete env.HOTLOAD_URL
// delete env.HOST_URL



/**
 * index.html中的环境变量必须以REACT_APP开头
 * 
 */
process.env.REACT_APP_PHOTO_VIEW_CSS = `<style type="text/css">`
    + fs.readFileSync(path.resolve(__dirname, './node_modules/react-photo-view/dist/index.css'))
    + `</style>`;



const ReactConfig = {
    '__REACT_WEB_CONFIG__': JSON.stringify(env), //react-web-config 
    'process.env.ENVFILE': "'" + process.env.ENVFILE + "'",
    'process.env.ENVTYPE': "'" + process.env.ENVTYPE + "'",
}

//app名
let appName = process.env.ENVFILE.substr(process.env.ENVFILE.lastIndexOf(".") + 1)


// process.env.PUBLIC_URL = "/" + appName;


const config = override(
    addWebpackPlugin(new webpack.DefinePlugin(ReactConfig)),
    addDecoratorsLegacy(),// 开启@装饰器
    addExternalBabelPlugin('@babel/plugin-proposal-class-properties'), //类属性 语法
    babelInclude([
        //path.resolve(__dirname, "../rn-common"),
        path.resolve("src"), // 确保要包含自己的项目
        path.resolve("node_modules/react-native-vector-icons"), //引入第三方项目
    ]),
    addWebpackAlias({
        "@src": path.resolve(__dirname, 'src'),
        "@common": path.resolve(__dirname, 'src/rn-common'),
        "react-native-fs": path.resolve(__dirname, "./src/rn-common/lib/web/react-native-fs"),
        'react-native-config': path.resolve(__dirname, './src/rn-common/lib/web/react-web-config'),
        '@react-native-cookies/cookies': path.resolve(__dirname, './src/rn-common/lib/web/cookies'),
    }),
    removeModuleScopePlugin(),
    config => {
        // config.optimization.runtimeChunk = true;
        //分包node_modules
        if (process.env.NODE_ENV == "production") {
            config.optimization.splitChunks = {
                chunks: "all",
            };
        }
        // console.log(config.optimization.splitChunks);
        // config.optimization.minimizer[0].options.terserOptions.keep_fnames = true;
        // config.optimization.minimizer[0].options.terserOptions.keep_classnames = true;
        return config;
    },
)


// rewireDefinePlugin(config, null, {
//     '__REACT_WEB_CONFIG__': JSON.stringify(env)
// })

module.exports = {
    webpack: config,
    paths: function (paths, env) {



        //打包目录
        paths.appBuild = path.resolve(__dirname, 'build/' + appName);
        // paths.publicPath = '/' + appName;
        // paths.publicUrl = '/' + appName;

        return paths;
    },
}
