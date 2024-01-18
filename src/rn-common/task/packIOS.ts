import * as sh from 'shelljs';
import { mkdirsSync, zipFile, zipMenu } from "./comm";


const outMenu = "./build/ios"
try {
    mkdirsSync(outMenu)
} catch (err) {
}

sh.exec(`react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ${outMenu}/main.jsbundle --assets-dest ${outMenu}`);
zipMenu(`${outMenu}/assets`, `${outMenu}/assets_ios.zip`, '', false);
zipFile(`${outMenu}/main.jsbundle`, `${outMenu}/app_ios.zip`);