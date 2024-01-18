import { array, ARRAY_TYPE, lib, newArrayObj } from "./lib";



export interface FiledData {
    //字段赋值函数
    setFunc?: (val: any, obj: any) => void
    //class中的字段名
    filedName: string;
    //json中的字段名
    jsonName: string;
    //是否可为空
    nullAble: boolean;
}


type ClasType<T> = T extends { new(): infer P; } ? P : T;

export class TypeJson {


    /**
     * 指定字段可以为空
     * @param target 
     * @param propertyKey 
     */
    static nullAble(target: Object, propertyKey: string) {
        lib.setData(target.constructor, "TypeJson.nullAble", propertyKey, true);
        // (target.constructor as ModMetaData)._primaryKeyName_ = propertyKey;
    }

    private static getNullAble(table: { new(): any; }, propertyKey: string) {
        return lib.getData(table, "TypeJson.nullAble", propertyKey) as boolean;
    }

    /**
     * 指定字段为别名
     * @param name 别名
     * @returns {function(Object, string): undefined}
     */
    static fieldName(name: string) {
        return (target: Object, propertyKey: string) => {
            lib.setData(target.constructor, "TypeJson.fieldName", propertyKey, name);
        }
    }

    private static getFieldName(table: { new(): any; }, field: string) {
        return lib.getData(table, "TypeJson.fieldName", field) as string | undefined;
    }

    fieldList = Array<FiledData>();

    constructor(public clas: { new(): any; }) {
        let obj = new this.clas();
        for (let k in obj) {
            let v = obj[k];

            let field = {
                filedName: k,
                jsonName: k,
                nullAble: TypeJson.getNullAble(this.clas, k),
            } as FiledData;
            this.fieldList.push(field);

            this.initField(field, k, v);
        }

    }


    /**
     * 初始化对象字段赋值函数
     * @param field 
     * @param k 
     * @param v 
     */
    initField(field: FiledData, k: string, v: any) {

        if (v == null) {//为null任意类型
            field.setFunc = (val, obj) => {
                // if (typeof val === "object")
                obj[field.filedName] = val
            }
        }
        else if (typeof v === "string") {
            field.setFunc = (val, obj) => {
                if (val != null) {
                    if (typeof val === "string")
                        obj[field.filedName] = val
                    else
                        obj[field.filedName] = val + "";
                }
            }
        }
        else if (typeof v === "number") {
            field.setFunc = (val, obj) => {
                if (val != null) {
                    if (typeof val === "number")
                        obj[field.filedName] = val
                    else {
                        obj[field.filedName] = TypeJson.parseFloat(val)
                    }
                }
            }
        }
        else if (typeof v === "boolean") {
            field.setFunc = (val, obj) => {
                if (typeof val === "boolean")
                    obj[field.filedName] = val
                else {
                    obj[field.filedName] = !!val
                }
            }

        } else if (Array.isArray(v)) {
            let arrType = v[ARRAY_TYPE];
            if (arrType) {
                this.initArrayType(field, k, v, arrType);
            } else {//没有指定数组类型，原样赋值
                // console.log(arrayBool(), "lost array", v)
                // let target = (v as any)["[[Target]]"];
                field.setFunc = (val, obj) => {
                    if (val instanceof Array) {
                        obj[field.filedName] = val;
                    }
                }
            }
        }
        else if (typeof v === "object" && v.constructor) {

            if (v.constructor.name == "Object") {  //如果为{}匿名类型，直接赋值
                field.setFunc = (val, obj) => {
                    // if (typeof val === "object")
                    obj[field.filedName] = val
                }
            } else if (v.constructor.name != "") { //递归具名类型
                field.setFunc = (val, obj) => {
                    if (typeof val === "object") {
                        obj[field.filedName] = TypeJson.objCheck(val, v.constructor, obj[field.filedName])
                    }
                }
            }

        }
    }



    /**
     * 初始化数组类型
     * @param field 
     * @param k 
     * @param v 
     * @param arrType 
     */
    initArrayType(field: FiledData, k: string, v: any, arrType: any) {
        if (arrType === String) {
            field.setFunc = (val, obj) => {
                let ret = array(arrType) as any[];
                if (val instanceof Array) {
                    for (let arr of val) {
                        if (typeof arr === "string")
                            ret.push(arr)
                        else if (arr == null) {
                            if (field.nullAble) {
                                ret.push(arr)
                            } else {
                                ret.push("") //非空字串默认值：""
                            }

                        }
                        else {
                            ret.push(arr + "")
                        }
                    }
                }
                obj[field.filedName] = ret;
            }
        }
        else if (arrType === Number) {
            field.setFunc = (val, obj) => {
                let ret = array(arrType) as any[];
                if (val instanceof Array) {
                    for (let arr of val) {
                        if (typeof arr === "number")
                            ret.push(arr)
                        else if (arr == null) {
                            if (field.nullAble) {
                                ret.push(arr)
                            } else {
                                ret.push(0) //非空number默认值：0
                            }
                        }
                        else {
                            ret.push(TypeJson.parseFloat(arr))
                        }
                    }
                }
                obj[field.filedName] = ret;
            }
        }
        else if (arrType === Boolean) {
            field.setFunc = (val, obj) => {
                let ret = array(arrType) as any[];
                if (val instanceof Array) {
                    for (let arr of val) {
                        if (typeof arr === "boolean")
                            ret.push(arr)
                        else if (arr == null) {
                            if (field.nullAble) {
                                ret.push(arr)
                            } else {
                                ret.push(false) //非空bool默认值：false
                            }
                        }
                        else {
                            ret.push(!!arr)
                        }
                    }
                }
                obj[field.filedName] = ret;
            }
        }
        else {
            field.setFunc = (val, obj) => {
                let ret = array(arrType) as any[];
                if (val instanceof Array) {
                    for (let arr of val) {
                        if (arr == null) {
                            if (field.nullAble) {
                                ret.push(arr)
                            } else {
                                ret.push(newArrayObj(arrType))
                            }
                        } else {
                            ret.push(TypeJson.objCheck(arr, arrType, null))
                        }
                    }
                }
                obj[field.filedName] = ret;
            }
        }

    }


    /**
     * 解析json字串为指定对象
     * @param str json字串
     * @param clas  结果类型
     * @returns 结果
     */
    static parse<T>(str: string, clas?: Array<T>): Array<T>
    static parse<T>(str: string, clas?: { new(): T; }): T
    static parse<T>(str: string, clas?: { new(): T; } | Array<T>): T | Array<T> {
        let obj = JSON.parse(str);
        return TypeJson.objCheck(obj, clas as Array<T>, null)
    }

    static stringify(obj: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number) {
        return JSON.stringify(obj, replacer, space)
    }


    static parseFloat(num: any) {
        try {
            let ret = parseFloat(num);
            if (Number.isNaN(ret)) {
                return 0;
            }
            return ret;
        } catch (err) {
            return 0;
        }
    }

    static parseInt(num: any) {
        try {
            let ret = parseInt(num);
            if (Number.isNaN(ret)) {
                return 0;
            }
            return ret;
        } catch (err) {
            return 0;
        }
    }

    static initArrData(from: Array<any>, to: Array<any>, arrType: any) {
        if (arrType === String) {
            for (let arr of from) {
                if (typeof arr === "string")
                    to.push(arr)
                else if (arr == null) {
                    to.push("") //非空字串默认值：""
                }
                else {
                    to.push(arr + "")
                }
            }
        }
        else if (arrType === Number) {
            for (let arr of from) {
                if (typeof arr === "number")
                    to.push(arr)
                else if (arr == null) {
                    to.push(0)
                }
                else {
                    to.push(TypeJson.parseFloat(arr))
                }
            }
        }
        else if (arrType === Boolean) {
            for (let arr of from) {
                if (typeof arr === "boolean")
                    to.push(arr)
                else if (arr == null) {
                    to.push(false) //非空字串默认值：""
                }
                else {
                    to.push(!!arr)
                }
            }
        }
        else {
            for (let arr of from) {
                if (arr == null || typeof arr != "object") {
                    to.push(newArrayObj(arrType))
                } else {
                    to.push(TypeJson.objCheck(arr, arrType, null)) //递归嵌套类型
                }
            }
        }
    }

    static objCheck2<T extends Array<any> | { new(): any; }>(clasT: T): ClasType<T> {
        return null as any;
    }

    /**
     * 验证并转换obj类型
     * @param obj 带转换对象
     * @param clas 转换的类
     * @param ret 初始值
     */
    static objCheck<T>(obj: any, clas?: Array<T> | null, ret?: any | null): Array<T>
    static objCheck<T>(obj: any, clas?: { new(): T; } | null, ret?: any | null): T
    static objCheck<T>(obj: any, clas?: { new(): T; } | Array<T> | null, ret?: any | null): T | Array<T> {


        if (clas instanceof Array) {
            if (obj instanceof Array) {
                let arrType = clas[ARRAY_TYPE];
                if (arrType) {
                    let ret = array(arrType as any)
                    TypeJson.initArrData(obj, ret, arrType)
                    return ret as Array<T>;
                }
                else { //没有指定数组类型, 原样返回
                    return obj;
                }
            }
            return clas;
        }
        if (obj == null) {
            obj = {};
        }


        if (typeof clas !== "function") {
            return obj;
        }



        let meta = (clas as any)._JSON_META as TypeJson
        if (!meta) {
            meta = new TypeJson(clas);
            (clas as any)._JSON_META = meta;
        }
        if (!ret)
            ret = new clas();
        for (let i = 0; i < meta.fieldList.length; i++) {
            let field = meta.fieldList[i];
            if (field.setFunc) {
                let jsonVal = obj[field.jsonName];
                if (jsonVal == null) {
                    if (field.nullAble)
                        ret[field.jsonName] = jsonVal;
                } else
                    field.setFunc(jsonVal, ret);
            }

        }

        return ret;
    }


}
