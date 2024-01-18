import * as fs from "fs";
import * as sh from 'shelljs';


/**
 * 待更新的项目
 */
let projects = ["rnWeb", "ReactNativeWeb", "gong-xin-ju"]




let root = __dirname + "/../../../../"

let common = "/src/rn-common/";



async function start() {

    for (let i = 0; i < projects.length; i++) {


        let project = projects[i];



        let base = root + project;

        if (!fs.existsSync(base)) {
            continue;
        }

        let pathCommon = root + project + common;
        sh.cd(pathCommon)
        sh.exec(`chdir`);
        sh.exec(`git fetch`);
        sh.exec(`git pull`);


        sh.cd(base)
        sh.exec(`chdir`);
        sh.exec(`git fetch`);
        sh.exec(`git pull`);
        sh.exec(`yarn install`);
    }
}

start();