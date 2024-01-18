import { FuncParse, opType } from "../lib/FuncParse";


const customStart = "自定义代码区";
const customEnd = "自定义结束";


export class CodeMerge {



    /**
     * 读取行,包括空行
     * @param str 
     * @param func 去除首部空格行，首部空格数，行号，去除所有空格行
     */
    static readLine(str: string, func: (line: string, space: string, lineNum: number, noSpace: string) => void) {
        let pos = 0;
        let lineNum = 0;
        let line = "";
        let startSpace = "";
        let noSpace = "";

        for (; pos < str.length; pos++) {
            let c = str[pos];
            if (c == "\r") {
                continue;
            }

            if (c == "\n") {
                func(line, startSpace, lineNum, noSpace);
                line = "";
                noSpace = "";
                lineNum += 1;
                startSpace = "";
                continue;
            }
            if (c == " " || c == "\t") {
                if (line.length <= 0) {
                    startSpace += c;
                    continue;
                }
            } else {
                noSpace += c;
            }

            line += c;

        }

        if (line) {
            func(line, startSpace, lineNum, noSpace);
        }
    }

    static merge(from: string, to: string) {


        //去空格,原始语句
        let imports = new Map<string, string>();
        //<字段,装饰器>
        let decoraters = new Map<string, Array<string>>();
        //<字段,注释>
        let comments = new Map<string, Array<string>>();


        //未确定字段的注释,装饰
        let curDecoraters = Array<string>();
        let curComments = Array<string>();

        //自定义代码
        let customCode = ""

        //是否进入自定义代码段
        let isCustom = false;


        CodeMerge.readLine(from, (line, space, num, noSpace) => {
            if (isCustom) {
                //自定义代码
                if (line.indexOf(customEnd) >= 0) {
                    isCustom = false;
                    return;
                }
                customCode += space + line + "\r\n";
                return;
            }

            if (line.startsWith("import")) {
                imports.set(noSpace, line);
                return;
            }

            if (line.startsWith("@")) {
                curDecoraters.push(line);
                return;
            }
            if (line.startsWith("//")) {

                if (line.indexOf(customStart) >= 0) {
                    isCustom = true;
                    return;
                }

                curComments.push(line);
                return;
            }
            if (line.length == 0) {
                return;
            }

            if (line.length >= 3 && (curDecoraters.length > 0 || curComments.length > 0)) {

                let ops = Array<string>();

                let types = Array<opType>();

                FuncParse.parseLexical(line, 0, (op, type) => {
                    ops.push(op);
                    types.push(type);
                })


                if (types.length >= 2 && types[0] == opType.var && (ops[1] == "=" || ops[1] == "(")) {
                    if (curDecoraters.length > 0)
                        decoraters.set(ops[0], curDecoraters);
                    if (curComments.length > 0)
                        comments.set(ops[0], curComments);
                }


                if (types.length >= 3 && (ops[0] == "public" || ops[0] == "private") && types[1] == opType.var && (ops[2] == "=" || ops[2] == "(")) {
                    if (curDecoraters.length > 0)
                        decoraters.set(ops[1], curDecoraters);
                    if (curComments.length > 0)
                        comments.set(ops[1], curComments);
                }
                curDecoraters = [];
                curComments = [];
                return;
            }

            curDecoraters = [];
            curComments = [];
        })


        let ret = "";
        for (let k of imports) {
            ret += k[1] + "\r\n";
        }
        isCustom = false;
        CodeMerge.readLine(to, (line, space, num, noSpace) => {

            if (isCustom) {
                if (line.indexOf(customEnd) >= 0) {
                    ret += space + line + "\r\n";
                    isCustom = false;
                    return;
                }
                return;
            }

            if (imports.get(noSpace)) {
                return;
            }

            if (line.length < 3) {
                ret += space + line + "\r\n";
                return;
            }


            if (line.startsWith("//")) {

                //合并自定义代码
                if (line.indexOf(customStart) >= 0 && customCode.length > 0) {
                    isCustom = true;
                    ret += space + line + "\r\n" + customCode;
                    return;
                }

                ret += space + line + "\r\n";
                return;
            }


            if (decoraters.size > 0 || comments.size > 0) {

                let ops = Array<string>();

                let types = Array<opType>();

                FuncParse.parseLexical(line, 0, (op, type) => {
                    ops.push(op);
                    types.push(type);
                })

                let name = "";

                if (types.length >= 2 && types[0] == opType.var && (ops[1] == "=" || ops[1] == "(")) {
                    name = ops[0];
                }

                if (types.length >= 3 && (ops[0] == "public" || ops[0] == "private") && types[1] == opType.var && (ops[2] == "=" || ops[2] == "(")) {
                    name = ops[1];
                }

                if (name) {
                    let comm = comments.get(name);
                    if (comm) {
                        for (let v of comm) {
                            ret += space + v + "\r\n";
                        }
                        comments.delete(name)
                    }
                    let decor = decoraters.get(name);
                    if (decor) {
                        for (let v of decor) {
                            ret += space + v + "\r\n";
                        }
                        decoraters.delete(name)
                    }
                }


            }

            ret += space + line + "\r\n";
        });


        return ret;
    }

}