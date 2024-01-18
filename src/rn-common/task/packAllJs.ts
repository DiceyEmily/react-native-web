import * as sh from 'shelljs';



async function buildAll() {
    let args = process.argv;

    for (let i = 2; i < args.length; i++) {
        let project = args[i];
        sh.exec(`cross-env ENVPROJECT=${project} ts-node --project src/rn-common/taskconfig.json ./src/rn-common/task/packOneJs.ts`);
    }
    console.log("全部打包完成!");
}

buildAll();