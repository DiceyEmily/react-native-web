
import * as path from "path";
import * as fs from "fs"



const outMenu = "."



function procJson() {
    let file = process.argv[2];
    if (file == null || !file.endsWith(".json")) {
        console.error("错误：无效json文件：", file)

    } else {

        try {
            let obj = JSON.parse(fs.readFileSync(file) + "");

            if (obj.glyphs == null) {
                console.error("错误：json文件不包含glyphs数据")
            }

            let name = path.basename(file).replace(".json", "");
            let dats = "";

            for (let d of obj.glyphs) {
                dats += `    //${d.name}\r\n`;
                dats += `    "${d.font_class}": ${d.unicode_decimal},\r\n`
            }

            let ret = `import { createIconComponent } from "@common/lib/components/icon/Icon"\r\n\r\nconst ${name}Datas={\r\n${dats}\r\n}`;
            ret += `\r\n\r\nexport const Icon${name} = createIconComponent(${name}Datas, "${name}", "${name}.ttf")`


            let outFile = outMenu + "/" + name + ".ts"
            fs.writeFileSync(outFile, ret);
            console.log("文件已生成至：", outFile)

        } catch (err) {
            console.error(err);
        }
    }

}


setTimeout(() => {
}, 5000)

procJson();