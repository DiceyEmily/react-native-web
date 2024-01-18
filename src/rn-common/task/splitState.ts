import { FuncParse, opType } from "../lib/FuncParse";
import * as fs from "fs"
import * as path from "path"


/**
 * 分离状态代码
 */
export async function splitState() {

    let name = process.argv[2];
    if (!name) {
        throw new Error("请先选择文件!")
    }

    let pa = path.parse(name);

    let stateStr = "";
    let fileNameState = pa.name + "State";
    let cont = fs.readFileSync(name) + "";
    let currentType: "import" | "class" | "interface" | "" = "";
    let startPos = -1;
    let ended = false;
    let leftBucketCount = 0;
    let rightBucketCount = 0;
    let prefix = "";
    let cont2 = cont;
    let prevOp = "";
    let exportPos = -1;
    let hasExport = false;
    FuncParse.parseLexical(cont, 0, (op, type, pos) => {

        try {
            if (type == opType.var) {


                if (op == "import") {
                    currentType = "import";
                    startPos = pos;
                    return;
                }

                if (op == "interface") {
                    currentType = "interface";
                    leftBucketCount = 0;
                    rightBucketCount = 0;
                    startPos = pos;
                    if (prevOp == "export") {
                        startPos = exportPos;
                        hasExport = true;
                    }
                    return;
                }

                if (op == "class") {
                    currentType = "class";
                    leftBucketCount = 0;
                    rightBucketCount = 0;
                    startPos = pos;
                    if (prevOp == "export") {
                        startPos = exportPos;
                        hasExport = true;
                    }
                    return;
                }

                if (prevOp == "class" || prevOp == "interface") {
                    cont2 = `import { ${op} } from "./${pa.name}.state";\r\n` + cont2;
                }

                if (op == "export") {
                    exportPos = pos;
                }
            }

            if (type == opType.operator) {

                if (op == '\n') {
                    if (currentType == "import") {
                        ended = true;
                    }

                    if (ended) {
                        let str = cont.substring(startPos, pos);
                        if (prefix) {
                            cont2 = cont2.replace(str, "");
                        }
                        stateStr += prefix + str;

                        currentType = "";
                        hasExport = false;
                        prefix = "";
                        ended = false;

                    }

                    return;
                }

                if (op == "{") {
                    leftBucketCount++;
                    return;
                }

                if (op == "}") {
                    rightBucketCount++;
                    if ((currentType == "interface" || currentType == "class") && rightBucketCount == leftBucketCount) {
                        if (!hasExport)
                            prefix = "\r\nexport "
                        else {
                            prefix = "\r\n"
                        }
                        ended = true;
                        return;
                    }
                    return;
                }

                return;
            }
        } finally {
            prevOp = op;
        }



    })


    fs.writeFileSync(name, cont2);
    fs.writeFileSync(pa.dir + "/" + pa.name + ".state.tsx", stateStr);
    // console.log(stateStr)

}

splitState().catch(err => console.error(err))