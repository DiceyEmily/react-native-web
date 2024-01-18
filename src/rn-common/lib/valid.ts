import { ClassMetaData, lib, MsgError } from "./lib";

export enum validType {
    int,
    number,
    string,
    object,
    file,
}


export class ObjFieldValidation<FieldT, ParentT> {
    /**
     * 接收到的值
     */
    val!: FieldT;
    /**
     * 错误提示
     */
    msg: string = "";

    //属性名
    propName = "";

    parent!: ParentT;


    required(msg?: string): boolean {
        if (this.val == null) {
            this.msg = msg ?? this.propName + vali.msgNull;
            return false;
        }

        return true;
    }
}

export class ArrayFieldValidation<FieldT, ParentT> {
    /**
     * 接收到的值
     */
    val!: Array<FieldT>;
    /**
     * 错误提示
     */
    msg: string = "";


    //属性名
    propName = "";

    parent!: ParentT;


    required(msg?: string): boolean {
        if (!(this.val instanceof Array) || this.val.length == 0) {
            this.msg = msg ?? this.propName + vali.msgNull;
            return false;
        }

        return true;
    }

    /**
     * 长度不得少于指定位数
     * @param val 位数
     * @param msg 消息提示
     * @returns 
     */
    min(val: number, msg?: string): boolean {
        if (this.val instanceof Array && this.val.length < val) {
            this.msg = msg || this.msg || this.propName + vali.msgShorter + val;
            return false;
        }
        return true;
    }

    /**
     * 长度不得大于指定位数
     * @param val 位数
     * @param msg 消息提示
     * @returns
     */
    max(val: number, msg?: string): boolean {
        if (this.val instanceof Array && this.val.length > val) {
            this.msg = msg || this.msg || this.propName + vali.msgShorter + val;
            return false;
        }
        return true;
    }

}

const regexUserName = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
export class StringFieldValidation<ParentT> {
    /**
     * 接收到的值
     */
    val!: string;
    /**
     * 错误提示
     */
    msg: string = "";

    //属性名
    propName = "";

    parent!: ParentT;

    private convertType() {
        this.val = this.val + "";
    }

    /**
     * 非空验证
     * @param msg 消息提示
     * @returns 
     */
    required(msg?: string): boolean {
        if (this.val == null || this.val == "") {
            this.msg = msg || this.msg || (this.propName + vali.msgNull);
            return false;
        }

        this.convertType();
        return true;
    }

    isPhone(msg?: string): boolean {
        if (!lib.validatorPhone(this.val)) {
            this.msg = msg || this.msg || (this.propName + "无效电话号");
            return false;
        }
        return true;
    }

    isIdCard(msg?: string): boolean {
        if (!lib.validatorIDCard(this.val)) {
            this.msg = msg || this.msg || (this.propName + "无效身份证");
            return false;
        }
        return true;
    }



    /**
     * 邮箱验证
     * @param msg
     * @returns
     */
    isEmail(msg?: string): boolean {
        if (!regexUserName.test(this.val)) {
            this.msg = msg || this.msg || "请输入正确的邮箱";
            return false;
        }
        return true
    }

    /**
     * 字串长度不得少于指定位数
     * @param val 位数
     * @param msg 消息提示
     * @returns 
     */
    min(val: number, msg?: string): boolean {
        this.convertType();
        if (this.val.length < val) {
            this.msg = msg || this.msg || this.propName + vali.msgShorter + val;
            return false;
        }
        return true;
    }

    /**
     * 字串长度不得大于指定位数
     * @param val 位数
     * @param msg 消息提示
     * @returns
     */
    max(val: number, msg?: string): boolean {
        this.convertType();
        if (this.val.length > val) {
            this.msg = msg || this.msg || this.propName + vali.msgShorter + val;
            return false;
        }
        return true;
    }

}

export class NumberFieldValidation<ParentT> {
    /**
     * 接收到的值
     */
    val!: number;
    /**
     * 错误提示
     */
    msg: string = "";

    //属性名
    propName = "";

    parent!: ParentT;

    private convertType() {
        if (typeof this.val !== "number") {
            let ret = parseFloat(this.val as any);
            if (Number.isNaN(ret)) {
                this.val = 0;
            } else {
                this.val = ret;
            }
        }
    }

    private convertInt() {
        if (typeof this.val !== "number") {
            let ret = parseInt(this.val as any);
            if (Number.isNaN(ret)) {
                this.val = 0;
            } else {
                this.val = ret;
            }
        }
    }

    required(msg?: string): boolean {
        if (this.val == null || this.val as any === "") {
            this.msg = msg || this.msg || this.propName + vali.msgNull;
            return false;
        }

        this.convertType();
        return true;
    }

    requireInt(msg?: string): boolean {
        if (this.val == null || this.val as any === "") {
            this.msg = msg || this.msg || this.propName + vali.msgNull;
            return false;
        }

        this.convertInt();
        return true;
    }

    /**
     * 不能小于指定值
     * @param val 
     * @param msg 
     * @returns 
     */
    min(val: number, msg?: string): boolean {
        this.convertType();
        if (this.val < val) {
            this.msg = msg || this.msg || this.propName + vali.msgLess + val;
            return false;
        }
        return true;
    }


    /**
     * 不能大于指定值
     * @param val 
     * @param msg 
     * @returns 
     */
    max(val: number, msg?: string): boolean {
        this.convertType();
        if (this.val > val) {
            this.msg = msg || this.msg || this.propName + vali.msgShorter + val;
            return false;
        }
        return true;
    }
}


export class BoolFieldValidation<ParentT> {
    /**
     * 接收到的值
     */
    val!: boolean;
    /**
     * 错误提示
     */
    msg: string = "";

    //属性名
    propName = "";

    parent!: ParentT;

    private convertType() {
        this.val = !!this.val;
    }

    required(msg?: string): boolean {
        if (this.val == null) {
            this.msg = msg || this.msg || this.propName + vali.msgNull;
            return false;
        }

        this.convertType();
        return true;
    }

}

type FieldSelected<T, ParentT> = T extends string ? StringFieldValidation<ParentT>
    :
    (T extends number ? NumberFieldValidation<ParentT> : ObjFieldValidation<T, ParentT>)

/**
 * 验证函数
 */
type ValidateFunc<FieldT, ParentT> = (p: FieldSelected<FieldT, ParentT>) => boolean | Promise<boolean>;



/**
 * 移除Partial 
 */
type Full<T> = {
    [P in keyof T]-?: T[P];
}




export interface ObjValudation {
    /**
    * 接收到的值
    */
    val: any;
    /**
     * 错误提示
     */
    msg: string;

    //属性名
    propName: string;

    parent: any;
}
export interface ValidObj {
    validation: { new(): ObjValudation };
    func: (validation: any) => boolean | Promise<boolean>

    onCheckList: Array<(res: [boolean, string]) => void>
}

export class ObjValidMap {
    //验证失败的字段<字段>
    failedField = new Set<string>();
    onCheckList = Array<(res: [boolean, string]) => void>();

    doCheck(field: string, ok: boolean, reason: string) {
        // console.log(field, ok, this.failedField)

        let prevOk = this.failedField.size == 0;
        if (ok) {
            this.failedField.delete(field);

            if ((this.failedField.size == 0) != prevOk) {
                this.onCheckList.forEach(it => it([true, reason]))
            }
        } else {
            this.failedField.add(field);
            this.onCheckList.forEach(it => it([false, reason]))
        }
    }
}

export const ValidFieldName = "fieldCheck"

/**
 * 设置class的验证字段
 * @param obj
 * @param key
 * @param func
 */
export function setFieldCheckMetaData(obj: ClassMetaData, propertyKey: string, valid: ValidObj) {
    /**
     * 储存所有验证字段名
     */
    let arrs = lib.getData(obj, ValidFieldName, "");
    if (!arrs) {
        arrs = Array<string>();
        lib.setData(obj, ValidFieldName, "", arrs);
    }
    arrs.push(propertyKey);

    /**
     * 储存验证函数
     */
    lib.setData(obj, ValidFieldName, propertyKey, valid);
}


export function getFieldCheckMetaData(obj: ClassMetaData, propertyKey: string) {
    return lib.getData(obj, ValidFieldName, propertyKey) as ValidObj | undefined;
}

export function validString<T extends object>(func: (num: StringFieldValidation<T>) => boolean | Promise<boolean>) {
    return (target: T, propertyKey: string, index?: number) => {
        setFieldCheckMetaData(target.constructor, propertyKey, {
            validation: StringFieldValidation,
            func: func,
            onCheckList: [],
        })
    }
}

export function validBool<T extends object>(func: (num: BoolFieldValidation<T>) => boolean | Promise<boolean>) {
    return (target: T, propertyKey: string, index?: number) => {
        setFieldCheckMetaData(target.constructor, propertyKey, {
            validation: BoolFieldValidation,
            func: func,
            onCheckList: [],
        })
    }
}

export function validNumber<T extends object>(func: (num: NumberFieldValidation<T>) => boolean | Promise<boolean>) {
    return (target: T, propertyKey: string, index?: number) => {
        setFieldCheckMetaData(target.constructor, propertyKey, {
            validation: NumberFieldValidation,
            func: func,
            onCheckList: [],
        })
    }
}

export function validObject<T extends object>(func: (num: ObjFieldValidation<any, T>) => boolean | Promise<boolean>) {
    return (target: T, propertyKey: string, index?: number) => {
        setFieldCheckMetaData(target.constructor, propertyKey, {
            validation: ObjFieldValidation,
            func: func,
            onCheckList: [],
        })
    }
}

export function validArray<T extends object>(func: (num: ArrayFieldValidation<any, T>) => boolean | Promise<boolean>) {
    return (target: T, propertyKey: string, index?: number) => {
        setFieldCheckMetaData(target.constructor, propertyKey, {
            validation: ArrayFieldValidation,
            func: func,
            onCheckList: [],
        })
    }
}

/**
 * 对象验证
 */
export class vali {
    static msgNull = " 不能为空"
    static msgShorter = " 不能短于:"
    static msgLess = " 不能小于:"
    static msgGreater = " 不能大于:"
    static errMsg_ = " : invalid!";

    /**
     * 对象验证弱引用
     */
    // private static objMap = new WeakMap<any, valid>();

    /**
     * 验证结果回调列表
     */
    // checkMap = new Map<string, Array<(res: [boolean, string]) => void>>();

    // constructor() {


    // }


    // static getObjMap(obj: object) {
    //     let ret = valid.objMap.get(obj);
    //     if (!ret) {
    //         ret = new valid();
    //         valid.objMap.set(obj, ret);
    //     }
    //     return ret;
    // }


    /**
     * 验证指定对象
     * @param obj 
     * @returns [成功或失败，失败消息]
     */
    static async check(obj: object): Promise<[boolean, string]> {
        if (obj instanceof Array) {
            for (let it of obj) {
                if (typeof it === "object") {
                    let subValid = lib.getData(it.constructor, ValidFieldName, "");
                    if (subValid) {
                        let res = await vali.check(it as any);
                        if (!res[0]) {
                            return res;
                        }
                    }
                }
            }
            return [true, ""];
        }

        for (let key in obj) {
            let res = await vali.checkField<any>(obj, key);
            if (!res[0]) {
                return res;
            }
        }
        return [true, ""];
    }
    /**
       * 验证指定对象,失败抛MsgError异常
       * @param obj 
       * @returns 
       */
    static async checkOrThrow(obj: object): Promise<void> {
        let [ok, msg] = await vali.check(obj);
        if (!ok) {
            throw new MsgError(msg)
        }
    }


    /**
     * 保证针对整个对象的验证结果回调
     */
    private static objectGlobalValid = new Map<any, ObjValidMap>();

    /**
     * 添加对象指定字段验证结果回调(需搭配removeCheckFunc使用，否则内存泄漏)
     * @param obj 
     * @param name 
     * @param func 
     * @returns 
     */
    static addCheckFunc<T extends object>(obj: T, name: keyof T, func: (res: [boolean, string]) => void) {
        let ret = getFieldCheckMetaData(obj.constructor, name as string) as ValidObj | undefined;
        if (!ret) {
            return func;
        }
        ret.onCheckList.push(func);
        return func;
    }

    /**
    * 添加对象验证结果回调(需搭配removeObjCheckFunc使用，否则内存泄漏)
    * @param obj
    * @param name
    * @param func
    * @returns
    */
    static addObjCheckFunc(obj: object, func: (res: [boolean, string]) => void) {
        let v = vali.objectGlobalValid.get(obj);
        if (!v) {
            v = new ObjValidMap();
            vali.objectGlobalValid.set(obj, v);
        }
        v.onCheckList.push(func)
        //执行一遍验证, 不触发事件
        for (let key in obj) {
            vali.checkField<any>(obj, key, false);
        }
    }

    /**
    * 移除对象验证结果回调
    * @param obj 
    * @param name 
    * @param func 
    * @returns 
    */
    static removeObjCheckFunc(obj: object, func: (res: [boolean, string]) => void) {
        let v = vali.objectGlobalValid.get(obj);
        if (!v) {
            return;
        }

        for (let i = v.onCheckList.length - 1; i >= 0; i--) {
            if (v.onCheckList[i] == func) {
                v.onCheckList.splice(i, 1);
                return;
            }
        }
        if (v.onCheckList.length == 0) {
            vali.objectGlobalValid.delete(obj);
        }
    }


    /**
     * 移除验证结束回调
     * @param obj 
     * @param name 
     * @param func 
     * @returns 
     */
    static removeCheckFunc<T extends object>(obj: T, name: keyof T, func: (res: [boolean, string]) => void) {
        let ret = getFieldCheckMetaData(obj.constructor, name as string) as ValidObj | undefined;
        if (!ret) {
            return;
        }

        for (let i = ret.onCheckList.length - 1; i >= 0; i--) {
            if (ret.onCheckList[i] == func) {
                ret.onCheckList.splice(i, 1);
                return;
            }
        }
    }

    /**
     * 验证对象指定字段
     * @param obj 
     * @param name 
     * @returns 
     */
    static async checkField<T extends object>(obj: T, name: keyof T, checkItem = true): Promise<[boolean, string]> {
        let val = obj[name];

        if (val instanceof Array) {
            for (let it of val) {
                if (typeof it === "object") {
                    let subValid = lib.getData(it.constructor, ValidFieldName, "");
                    if (subValid) {
                        let res = await vali.check(it as any);
                        if (!res[0]) {
                            return res;
                        }
                    }
                }
            }
        }
        else if (typeof val === "object") {
            //递归子类型
            let subValid = lib.getData(obj.constructor, ValidFieldName, "");
            if (subValid) {
                let res = await vali.check(val as any);
                if (!res[0]) {
                    return res;
                }
            }
        }



        let ret = getFieldCheckMetaData(obj.constructor, name as string) as ValidObj | undefined;
        if (!ret) {
            return [true, ""];
        }

        let validation = new ret.validation;

        validation.val = val;
        validation.propName = name as string;
        validation.parent = obj;

        let ok = await ret.func(validation);
        let res = [ok, validation.msg] as [boolean, string]

        if (checkItem)
            ret.onCheckList.forEach(it => it(res))

        let v = vali.objectGlobalValid.get(obj);
        if (v) {
            v.doCheck(name as string, ok, validation.msg);
        }

        return res;
    }



}