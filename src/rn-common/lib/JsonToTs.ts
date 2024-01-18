import { parse } from "comment-json";
import { MapString } from "./lib";


/**
 * JSON数据转TypeScript class
 */
export class JsonToTs {

    classMap = new Map<string, string>();

    //class body 对应的类名
    bodyMap = new Map<string, string>();


    //成员字段类目强制包含所属类目
    hasParentName: MapString<boolean> = {
        "list": true,
        "content": true,
        "dat": true,
        "data": true,
        "rows": true,
    }

    /**
     * 生成json对应的Class至classMap
     * @param obj json字串
     * @param className class名
     */
    parseObj(obj: string, className: string) {
        if (obj && className)
            this.toTs(parse(obj) as object, className)
    }


    private toTs(obj: object, className: string, Partial = false): string {
        if (!className || !obj || obj instanceof Array) {
            return "";
        }

        className = className[0].toUpperCase() + className.substr(1);

        let imports = new Map<string, string>();
        let body = this.getField(className, obj, imports, Partial);

        let classCache = this.bodyMap.get(body);//已有同样字段的Class
        if (classCache) {
            return classCache;
        }

        let importStr = ""
        imports.forEach((v, k) => {
            importStr += k + "\r\n";
        })

        let newName = className;
        for (let i = 2; this.classMap.has(newName); i++) {
            newName = className + i
        }

        let ret = `
${importStr}

export class ${newName} {

${body}

}
        `

        this.classMap.set(newName, ret);

        this.bodyMap.set(body, newName);

        return newName;
    }


    /**
     * 获取数组类型值
     * @param key 所属类中的字段名 
     * @param arrV 数组0索引位置的值
     * @param imports 
     * @returns 
     */
    private getArrayType(parentName: string, key: string, arrV: any, imports: Map<String, String>) {
        let ret = "";
        if (typeof arrV === "string") {
            imports.set(`import { arrayString } from "@common/lib/lib";`, "")
            ret = "arrayString()"
        }
        else if (typeof arrV === "number") {
            imports.set(`import { arrayNumber } from "@common/lib/lib";`, "")
            ret = "arrayNumber()"
        }
        else if (typeof arrV === "boolean") {
            imports.set(`import { arrayBool } from "@common/lib/lib";`, "")
            ret = "arrayBool()"
        }
        else if (arrV instanceof Array) {
            if (arrV.length > 0) {
                ret = `array(${this.getArrayType(parentName, key, arrV[0], imports)})`
            } else {
                ret = `Array<any>()`;
            }
        }
        else if (typeof arrV === "object") {
            let name = this.toTs(arrV, this.getSubName(parentName, key));
            if (name) {
                imports.set(`import { ${name} } from "./${name}";`, "")
                imports.set(`import { array } from "@common/lib/lib";`, "")
                ret = `array(${name})`;
            }
        }
        return ret;
    }

    /**
     * 遍历对象字段
     * @param obj 
     * @param imports 
     * @returns 
     */
    private getField(parentName: string, obj: any, imports: Map<String, String>, Partial = false) {
        let ret = '';
        for (let key in obj) {
            let v = obj[key];

            let comment = ""
            let comment1 = obj[Symbol.for('before:' + key)]
            let comment2 = obj[Symbol.for('after:' + key)];
            if (comment1) {
                for (let com of comment1) {
                    comment += com.value + " ";
                }
            }
            if (comment2) {
                for (let com of comment2) {
                    comment += com.value + " ";
                }
            }

            if (comment.indexOf("[partial]") >= 0) {
                Partial = true;
            }


            if (comment) {
                ret += `\r\n    /**\r\n     * ${comment}    \r\n     */\r\n`
            }

            let PartialStr = "";
            if (Partial) {
                PartialStr = "?"
            }
            if (typeof v === "string" || v == null) {
                ret += `    ${key}${PartialStr} = "";\r\n\r\n`;
            }
            else if (typeof v === "number") {
                ret += `    ${key}${PartialStr} = 0;\r\n\r\n`;
            }
            else if (typeof v === "boolean") {
                ret += `    ${key}${PartialStr} = false;\r\n\r\n`;
            }
            else if (v instanceof Array) {
                if (v.length > 0) {
                    let arrV = v[0];
                    ret += `    ${key}${PartialStr} = ${this.getArrayType(parentName, key, arrV, imports)};\r\n\r\n`;
                } else {
                    ret += `    ${key}${PartialStr} = Array<any>();\r\n\r\n`;
                }
            }
            else if (typeof v === "object") {

                let name = this.toTs(v, this.getSubName(parentName, key), Partial);
                if (name) {
                    imports.set(`import { ${name} } from "./${name}";`, "")
                    ret += `    ${key}${PartialStr} = new ${name}();\r\n\r\n`;
                }
            }
        }
        return ret;
    }

    getSubName(parentName: string, key: string) {

        if (!this.hasParentName[key]) {
            return key;
        }

        if (key == "") {
            return parentName;
        }
        return parentName + key[0].toUpperCase() + key.substr(1);
    }
}