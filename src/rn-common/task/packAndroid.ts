import * as fs from "fs";
import * as sh from 'shelljs';
import { mkdirsSync, zipFile, zipMenu } from "./comm";
import * as path from "path"


const buildMenu = path.resolve(__dirname, "../../../build");

const outMenu = buildMenu + "/android";



export async function packAndroid(project: string, packToWeb?: boolean) {
    let envFile = `.env.${project}`
    let appName = project
    let tempMenu = outMenu + "/" + appName + "/temp"
    try {
        fs.rmSync(tempMenu, { recursive: true });
    } catch (err) {
        // console.log(err)
    }
    try {
        mkdirsSync(tempMenu)
    } catch (err) {
        console.log(err)
    }

    console.log("开始编译: ", envFile, " 至 ", buildMenu)
    //react-native bundle --entry-file index.ts --platform ios --dev false --bundle-output ./ios/main.jsbundle --assets-dest ./ios
    // 必须--reset-cache 不然会打包混乱
    sh.exec(`cross-env ENVFILE=${envFile} react-native   bundle --reset-cache --platform android --entry-file index.js --assets-dest ${outMenu}/${appName}/temp/assets --bundle-output ${outMenu}/${appName}/temp/app.js --dev false `);

    let hermes = path.resolve(__dirname, "..", "..", "..", "node_modules", "hermes-engine", "linux64-bin", "hermesc");
    if (process.platform == "win32") {
        hermes = path.resolve(__dirname, "..", "..", "..", "node_modules", "hermes-engine", "win64-bin", "hermesc");
    }

    console.log("开始hermes: ", hermes)
    sh.exec(hermes + ` -w --emit-binary ${outMenu}/${appName}/temp/app.js -out ${outMenu}/${appName}/temp/app.hbc  -O -output-source-map`);

    await zipMenu(`${outMenu}/${appName}/temp/assets`, `${outMenu}/${appName}/assets.zip`, "android/app/src/main/assets/", false);

    // let newApp = fs.readFileSync("app.js");
    // let oldApp = fs.readFileSync("app-base.js");

    // let i = 0;
    // for (; i < oldApp.length; i++) {
    //     if (newApp[i] != oldApp[i]) {
    //         break;
    //     }
    // }

    // let iO = oldApp.length - 1;
    // let iN = newApp.length - 1;
    // for (; iO >= 0 && iN >= 0; iO-- , iN--) {
    //     if (newApp[iN] != oldApp[iO]) {
    //         break;
    //     }
    // }

    // console.log("分割点:" + (i / 1024) + " kb - " + (iN / 1024) + " kb");
    // if (i >= iN) {
    //     console.log("无需更新");
    //     return;
    // }
    // fs.writeFileSync("app-cut.js", newApp.slice(i, iN + 1));
    // zipFile("app-cut.js", "app.zip");


    await zipFile(`${outMenu}/${appName}/temp/app.hbc`, `${outMenu}/${appName}/app.zip`);

    if (packToWeb) {
        try {
            try {
                mkdirsSync(buildMenu + `/${project}/android`)
            } catch (err) {
                console.log(err)
            }
            fs.copyFileSync(buildMenu + `/android/${project}/app.zip`, buildMenu + `/${project}/android/app.zip`)
            fs.copyFileSync(buildMenu + `/android/${project}/assets.zip`, buildMenu + `/${project}/android/assets.zip`)
            fs.copyFileSync(path.resolve(__dirname, "../../../android_version.json"), buildMenu + `/${project}/android/android_version.json`)
            try {
                fs.rmSync(buildMenu + '/android', { recursive: true });
            } catch (err) {
                // console.log(err)
            }
            console.log(project + "打包完成!")
        } catch (err) {
            console.log(err)
        }
    }
}

