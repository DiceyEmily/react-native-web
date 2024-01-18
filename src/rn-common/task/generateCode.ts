import * as path from "path";
import * as fs from "fs"
import { JsonToTs } from "../lib/JsonToTs"
import { menuWatch, mkdirsSync } from "./comm";

const menus = ["./src/img"];
//const menus = ["./src/img", "./src/rn-common/img"];
const out = ["./src/imgs.ts"];
const outWeb = ["./src/imgs.web.ts"];
const objname = ["imgs"];

const JsonMenu = "./json"
const JsonTsMenu = "./json/model"


try {
    mkdirsSync(JsonTsMenu)
} catch (err) {
}



/**
 * 遍历目录
 * @param menu 
 * @param space 
 * @returns 
 */
function genSubObj(menu: string, space: string, pathCode: string) {
    let ret = "{\r\n";
    let web = "{\r\n";

    let files = fs.readdirSync(menu);

    files.forEach(it => {
        let st = fs.statSync(menu + "/" + it);
        let name = path.parse(it);
        let newName = name.name.replace(" ", "_").replace("-", "_");
        if (st.isDirectory()) {
            let [r1, r2] = genSubObj(menu + "/" + it, space + "      ", pathCode + "/" + it);

            let env1 = `${r1}`;
            let env2 = `${r2}`;

            if (it.endsWith("_env")) {
                env1 = `process.env.ENVFILE === '.env.${it.replace("_env", "")}' ? ${r1} : {}`
                env2 = `process.env.ENVFILE === '.env.${it.replace("_env", "")}' ? ${r2} : {}`
            }

            ret += space + `      ${newName}: ${env1},\r\n`
            web += space + `      ${newName}: ${env2},\r\n`
            return;
        }
        if (name.ext == ".ts" || name.ext == ".js") {
            return;
        }

        ret += space + `      ${newName}: require('./img${pathCode}/${name.name}${name.ext}'),\r\n`
        web += space + `      ${newName}: require('./img${pathCode}/${name.name}${name.ext}')${name.ext == ".svg" ? ".default" : ""},\r\n`
    })
    ret += space + `}`;
    web += space + `}`;
    return [ret, web];
}

const comment = "//此文件为src/task/generateCode.ts自动生成(npm脚本: json_model)";

/**
 * 用于生成imgs.ts文件
 */
function genImg(index: number) {

    let [nat, web] = genSubObj(menus[index], "", "")
    let ret = comment + `, 请勿修改
export const ${objname[index]} = `;

    fs.writeFile(out[index], ret + nat + "\r\n", err => {
        if (err)
            console.error(err)
    });
    fs.writeFile(outWeb[index], ret + web + "\r\n", err => {
        if (err)
            console.error(err)
    });
}




for (let i = 0; i < menus.length; i++) {
    let m = menus[i];
    try {
        fs.mkdirSync(m)
    } catch (err) {
    }
    console.log("开始监听图片目录：" + m);
    menuWatch(m, (event, file) => {
        if (file)
            console.log(file + "变动.");
        genImg(i);
    })
}



/**
 * 生成json对应的Class
 */
function genTs() {

    let files = fs.readdirSync(JsonMenu);
    let ts = new JsonToTs();
    files.forEach(it => {

        let jsonFile = JsonMenu + "/" + it;
        if (!it.endsWith(".json")) {
            return;
        }
        let res = fs.readFileSync(jsonFile) + ""

        try {
            ts.parseObj(res, it.replace(".json", ""))
        } catch (err) {
            console.warn(err)
        }

    })

    for (let [k, v] of ts.classMap) {
        fs.writeFile(JsonTsMenu + `/${k}.ts`, comment + "\r\n" + v, err => {
            if (err)
                console.error(err)
        });
    }
}

console.log("开始监听json目录：" + JsonMenu);
menuWatch(JsonMenu, (event, file) => {
    if (file)
        console.log(file + "变动.");
    genTs();
})
