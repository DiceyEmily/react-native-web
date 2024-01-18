/**
 * 词法解析类型
 */
export enum opType {
    //操作符
    operator,
    var,//单词
    string,//字串
    comment,//注释
    invalid,
}

/**
 * 解析函数字串
 */
export class FuncParse {
    /**
     * 参数名
     * @type {Array}
     */
    paras: string[] = [];
    body: string = "";
    //函数名
    funcName: string = "";
    /**
     * 函数体(去除形参部分)起始位置
     * @type {number}
     */
    pos = 0;

    //单词ascii码范围(0-9 _ a-z A-Z)
    static varArr: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


    static getFieldName(func: Function) {
        let str = func.toString();
        return str.substring(str.indexOf(".") + 1);

    }

    /**
     * 将/替换为_
     * @param url
     * @returns {string}
     */
    static fixUrl(url: string) {
        let ret = "";
        for (let i = 0; i < url.length; i++) {
            if (url[i] == '/') {
                if (i == 0)
                    continue;

                ret += "_";
                continue;
            }

            ret += url[i];
        }
        return ret;
    }



    constructor(func: Function) {
        this.body = func.toString();
        let count = 0;
        FuncParse.parseLexical(this.body, 0, (op, type, pos) => {
            count++;

            if (op == "=>" || op == "{") {
                this.pos = pos;
                return false;
            }

            if (op == "(" && this.paras.length > 0) {
                this.funcName = this.paras[this.paras.length - 1];
                this.paras.pop();
            }

            if (count == 1 && op == "function")
                return true;

            if (type == opType.var)
                this.paras.push(op);

            return true;
        });
    }

    /**
     * 函数体词法解析
     * @param cb
     */
    parseBody(cb: (op: string, type: opType, pos?: number) => boolean | void) {
        FuncParse.parseLexical(this.body, this.pos, cb);
    }


    /**
     * 
     * @param funcStr 
     * @param startPos 
     * @param cb p: string, type: opType, pos: number, line: number, linePos: number
     * @returns 
     */
    static parseLexical(funcStr: string, startPos: number, cb: (op: string, type: opType, pos: number, line: number, lineStartPos: number) => boolean | void) {
        let symb = "";
        let type = opType.invalid;
        let i = startPos

        //当前行
        let curLine = 0;
        //当前行起始位置
        let linePos = 0;
        //符合起始位置
        let symbleStartPos = 0;

        for (; i < funcStr.length; i += 1) {
            let c = funcStr[i];

            //跳过的字符
            if (c == ' ' || c == '\r' || c == '\t') {
                if (symb.length > 0) {
                    if (cb(symb, type, symbleStartPos, curLine, linePos) === false)
                        return;
                    symb = "";
                }
                continue;
            }


            //特数字符
            if (c == '(' || c == ')' || c == '\n') {


                if (symb.length > 0) {
                    if (cb(symb, type, symbleStartPos, curLine, linePos) === false)
                        return;
                    symb = "";
                }

                symbleStartPos = i;
                if (cb(c, opType.operator, symbleStartPos, curLine, linePos) === false)
                    return;
                if (c == '\n') {
                    linePos = i + 1;
                    curLine++;
                }
                continue;
            }

            //字串
            if (c == "'" || c == "\"" || c == '`') {
                let stringSymble = c;
                if (symb.length > 0) {
                    if (cb(symb, type, symbleStartPos, curLine, linePos) === false)
                        return;
                    symb = "";
                }

                i += 1;
                symbleStartPos = i;
                for (; i < funcStr.length; i += 1) {
                    c = funcStr[i];

                    if (c == '\n') {
                        linePos = i + 1;
                        curLine++;
                    }

                    if (c == '\\') {

                        symb += c;
                        i += 1;
                        if (i >= funcStr.length)
                            break;
                        // if (funcStr[i] !== stringSymble)
                        //     symb += "\\";
                        symb += funcStr[i];
                        continue;
                    }

                    if (c === stringSymble) {
                        if (cb(symb, opType.string, symbleStartPos, curLine, linePos) === false)
                            return;
                        symb = "";
                        break;
                    }

                    symb += c;
                }
                continue;
            }


            //单词
            //if (c == "_" || c >= "0" && c <= "9" || c >= "a" && c <= "z" || c >= "A" && c <= "Z") {
            if (FuncParse.varArr[c.charCodeAt(0)]) {
                if (symb.length == 0) {
                    symbleStartPos = i;
                    type = opType.var;
                }
                symb += c;
                continue;
            }


            //注释
            if (c == "/" && funcStr.length > i + 1 && funcStr[i + 1] == "*") {
                if (symb.length > 0) {
                    if (cb(symb, type, symbleStartPos, curLine, linePos) === false)
                        return;
                    symb = "";
                }

                i += 2;
                symbleStartPos = i;
                for (; i < funcStr.length; i += 1) {
                    c = funcStr[i]
                    if (c == '\n') {
                        linePos = i + 1;
                        curLine++;
                    }
                    if (c == '*' && funcStr.length > i + 1 && funcStr[i + 1] == "/") {
                        i++;
                        if (cb(symb, opType.comment, symbleStartPos, curLine, linePos) === false)
                            return;
                        symb = "";
                        break;
                    } else
                        symb += c;
                }
                continue;
            }


            if (c == "/" && funcStr.length > i + 1 && funcStr[i + 1] == "/") {
                if (symb.length > 0) {
                    if (cb(symb, type, symbleStartPos, curLine, linePos) === false)
                        return;
                    symb = "";
                }

                i += 2;
                symbleStartPos = i;
                for (; i < funcStr.length; i += 1) {
                    c = funcStr[i]

                    if (c == '\n') {
                        if (cb(symb, opType.comment, symbleStartPos, curLine, linePos) === false)
                            return;
                        symb = "";

                        symbleStartPos = i;
                        if (cb(c, opType.operator, symbleStartPos, curLine, linePos) === false)
                            return;
                        linePos = 0;
                        curLine++;
                        break;
                    }
                    else if (funcStr[i] == '\r') {

                    } else
                        symb += c;
                }
                continue;
            }

            //其他符号
            if (symb.length > 0) {
                if (cb(symb, type, symbleStartPos, curLine, linePos) === false)
                    return;
                symb = "";
            }

            // symb = c;
            type = opType.operator;
            symbleStartPos = i;
            if (cb(c, type, symbleStartPos, curLine, linePos) === false)
                return;

        }

        //最后一个词
        if (symb.length > 0) {
            if (cb(symb, type, symbleStartPos, curLine, linePos) === false)
                return;
        }
    }

}