import * as fs from "fs";


// function webColor() {
//     let menu = "./node_modules/react-native-web/dist/modules/isWebColor/index.js";
//     if (fs.existsSync(menu)) {
//         let source = fs.readFileSync(menu, { encoding: "utf8" }) + "";
//         if (source && source != "null") {
//             source = source.replace("|| color.indexOf('var(') === 0"
//                 , "|| color.indexOf('var(') === 0 || color.indexOf('gradient(') >= 0");
//             fs.writeFileSync(menu, source, { encoding: "utf8" });
//         }
//     }
// }

function overrideTsconfig() {
    let menu = "./node_modules/react-scripts/scripts/utils/verifyTypeScriptSetup.js";
    if (fs.existsSync(menu)) {
        let source = fs.readFileSync(menu, { encoding: "utf8" }) + "";
        if (source && source != "null") {
            source = source.replace("writeJson(paths.appTsConfig, appTsConfig);", "");
            fs.writeFileSync(menu, source, { encoding: "utf8" });
        }
    }

}


/**
 * 修复rn-web源码 bug
 */
function replaceFile() {
    try {


        let px2rem = process.argv.findIndex(it => it == "px2rem") >= 0

        let from = "./src/rn-common/task/normalizeValueWithProperty.js";
        //需要先清空编译缓存/node_modules/.cache 目录
        let to = "./node_modules/react-native-web/dist/exports/StyleSheet/compiler/normalizeValueWithProperty.js";

        if (px2rem && fs.existsSync(to)) {
            let st = fs.statSync(to);
            // if (st.size == 902) {

            fs.unlinkSync(to);
            fs.copyFileSync(from, to);
            try {
                fs.rmSync("./node_modules/.cache", { recursive: true });
            } catch (err) {

            }
            // }
        }


        let androidPromiseRej = "./node_modules/promise/setimmediate/rejection-tracking.js";
        if (fs.existsSync(androidPromiseRej)) {
            let promiseFile = fs.readFileSync(androidPromiseRej, { encoding: "utf8" }) + "";
            if (promiseFile && promiseFile != "null") {
                promiseFile = promiseFile.replace("? 100", "? 80");
                promiseFile = promiseFile.replace(": 2000", ": 100");
                fs.writeFileSync(androidPromiseRej, promiseFile, { encoding: "utf8" });
            }
        }



        let TextInput = "./node_modules/react-native-web/dist/exports/TextInput/index.js";
        let oldSrc = `numberOfLines = _props$numberOfLines === void 0 ? 1 : _props$numberOfLines,`;
        let newSrc = `numberOfLines = _props$numberOfLines,`;


    } catch (err) {
        console.log(err);
    }

}

replaceFile();
overrideTsconfig();
// webColor();