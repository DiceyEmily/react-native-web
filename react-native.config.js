// react-native.config.js
module.exports = {
    dependencies: {
        'rn-common': {
            platforms: {
                android: null, // disable Android platform, other platforms will still autolink if provided
                ios: null,
            },
        },
        //图像选择库android端修改了源码，所以排除自动link, 改为手动引用
        'react-native-image-crop-picker': {
            platforms: {
                android: null, // disable Android platform, other platforms will still autolink if provided
            },
        },
    },
};