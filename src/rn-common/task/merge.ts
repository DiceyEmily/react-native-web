
import * as fs from "fs"
import { CodeMerge } from "./CodeMerge";
let fromMenu = "./src/model/";
let toMenu = "./build/model/";


function merge(menu: string) {
    let toMenus = fs.readdirSync(toMenu + menu);
    // console.log(toMenus)
    for (let f of toMenus) {
        let m = menu + "/" + f;
        let st = fs.lstatSync(toMenu + m);
        if (st.isDirectory()) {
            merge(m)
        } else {
            try {
                let from = fs.readFileSync(fromMenu + m) + "";
                let to = fs.readFileSync(toMenu + m) + "";
                let ret = CodeMerge.merge(from, to);
                fs.writeFileSync(fromMenu + m, ret);
                console.log("合并：", toMenu + m)
            } catch (err) {
                console.log("拷贝：", toMenu + m)
                fs.copyFileSync(toMenu + m, fromMenu + m)
            }

        }

    }


}


merge("");