export interface MapString<T> {
    [index: string]: T;
}

export interface MapNumber<T> {
    [index: number]: T;
}

/**
 * 元组转为联合类型
 */
export type TupleToUnion<T extends any[]> = T[number];

/**
* 联合类型转交叉类型
*/
export type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never


export let ARRAY_TYPE: any = "_ARR_TYPE";
if (typeof Symbol === "function") {
    ARRAY_TYPE = (Symbol as any).for("_ARR_TYPE")
}

export let MAP_KEY_TYPE: any = "_MAP_KEY_TYPE";
if (typeof Symbol === "function") {
    MAP_KEY_TYPE = (Symbol as any).for("_MAP_KEY_TYPE")
}

export let MAP_VAL_TYPE: any = "_MAP_VAL_TYPE";
if (typeof Symbol === "function") {
    MAP_VAL_TYPE = (Symbol as any).for("_MAP_VAL_TYPE")
}

export function mapString<T>(type: { new(...paras: any[]): T }) {
    let ret = new Map<string, T>();
    (ret as any)[MAP_KEY_TYPE] = String;
    (ret as any)[MAP_VAL_TYPE] = type;
    return ret;
}

export function mapNumber<T>(type: { new(...paras: any[]): T }) {
    let ret = new Map<number, T>();
    (ret as any)[MAP_KEY_TYPE] = Number;
    (ret as any)[MAP_VAL_TYPE] = type;
    return ret;
}

/**
 * 创建带运行时number类型数组
 * @param val 
 * @returns 
 */
export function arrayNumber(val?: number[]): number[] {
    if (!val) {
        val = []
    }
    (val as any)[ARRAY_TYPE] = Number;
    return val;
}

/**
 * 创建带运行时boolean类型数组
 * @param val 
 * @returns 
 */
export function arrayBool(val?: boolean[]): boolean[] {
    if (!val) {
        val = []
    }
    (val as any)[ARRAY_TYPE] = Boolean;
    return val;
}
/**
 * 创建带运行时string类型数组
 * @param val 
 * @returns 
 */
export function arrayString(val?: string[]): string[] {
    if (!val) {
        val = []
    }
    (val as any)[ARRAY_TYPE] = String;
    return val;
}

/**
 * 创建带运行时类型数组
 * @param type 类型
 * @param val 初始化值
 * @returns 
 */
export function array<T>(type: { new(...paras: any[]): T }, val?: T[]): T[]
export function array<T>(type: Array<T>, val?: T[]): Array<Array<T>> //嵌套数组
export function array<T>(type: { new(...paras: any[]): T } | Array<T>, val?: T[]): T[] {
    if (!val) {
        val = []
    }
    (val as any)[ARRAY_TYPE] = type;
    // Object.defineProperty(val, "__type__", {
    //     value: type,
    //     enumerable: false,
    // });
    return val;
}

export function newArrayObj(arrayType: any) {
    if (Array.isArray(arrayType)) {
        return array(arrayType[ARRAY_TYPE])
    }
    return new arrayType();
}

export enum ExceptionCode { /*eslint no-shadow: 0 */
    normal = 0,
    activityClosed,
    cancelHttp,
    statusCodeError,
    otherLogin,
    HttpError,

    Unauthorized = 401,
}

/**
 * 可弹窗显示的异常
 */
export class MsgError extends Error {

    constructor(

        /**
         * 弹窗提示内容
         */
        message: string,

        /**
         * 错误码
         */
        public code = ExceptionCode.normal,

        /**
         * 是否可显示
         */
        public showAble = true,

        /**
        * 错误详细信息
        */
        public errorInfo = "",

    ) {
        super(message); // (1)
    }
}

const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const DEFAULT_PARAMS = new RegExp("=[^,]+", "mg");
const FAT_ARROWS = new RegExp("=>.*$", "mg");

const md5: any = require("./md5")
const GBK: any = require("./gbk")
const calendarLunar: any = require("./calendarLunar")

export class lib {

    /**
     * 判断后缀是否为图片
     * @param ext 
     * @returns 
     */
    static isPic(ext: string) {
        return ext == "png" || ext == "jpg" || ext == "gif" || ext == "webp" || ext == "jpeg" || ext == "bmp"
    }


    /**
     * px单位转为rem
     * @param px 
     * @returns 
     */
    static getPx2Rem(px: number) {
        let ret = 1;

        if ((window as any)?._rem_size) {
            ret = (window as any)?._rem_size / 16;
        }

        ret = parseFloat((getComputedStyle(window.document.documentElement) as any)['font-size']);
        if (ret == 0)
            ret = 1;

        return px / ret;
    }

    /**
     * web端返回px单位
     * @param num 
     * @returns 
     */
    static getPx(num: number) {

        if (num == null) {
            return num;
        }

        if (window?.getComputedStyle as any) {
            return num + "px";
        }

        return num;
    }

    /**
     * 获取web端转为rem后的缩放
     * @returns 
     */
    static getScale() {
        let ret = 1;
        if ((window as any)?._rem_size) {
            return (window as any)?._rem_size / 16;
        }

        if (window?.getComputedStyle) {
            let ret = (window.getComputedStyle(window.document.documentElement) as any)['font-size']
            ret = parseFloat(ret);
            if (ret > 0) {
                return ret / 16;
            }
        }
        return ret;

    }



    static imageArr = [".jpeg", ".jpg", ".bmp", ".png", ".gif", ".webp"];
    static txtArr = [".xls", ".doc", ".txt", ".pdf", "docx", ".xlsx", "ppt", "pptx"]
    static videoArr = [".mp4", ".mpeg", ".wmv", ".avi"];

    static docArr = [
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/x-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/pdf",
    ]

    /**
     * 过滤(delete)obj中的空字串与空数组
     * @param obj 
     * @returns 
     */
    static filterEmpty(obj?: any) {
        if (obj == null) {
            return null;
        }
        if (typeof obj !== "object") {
            return obj;
        }
        let ret = { ...obj };

        for (let k in ret) {
            let v = (ret as any)[k];
            if (v === "") {
                delete (ret as any)[k]
            } else if (Array.isArray(v)) {
                if (v.length == 0) {
                    delete (ret as any)[k]
                } else {
                    let arr = [];
                    for (let arrV of v) {
                        arr.push(this.filterEmpty(arrV));
                    }
                    (ret as any)[k] = arr;
                }
            }
        }

        this.setPrototypeOf(ret, obj);
        return ret;
    }


    /**
     * gbk编码
     * @param str 
     * @returns 
     */
    static gbkEncode(str: string): Array<number> {
        return GBK.encode(str)
    }

    /**
     * gbk 解码
     * @param str 
     * @returns 
     */
    static gbkDecode(str: Array<number>): string {
        return GBK.decode(str)
    }

    /**
     * gbk url编码
     * @param str 
     * @returns 
     */
    static gbkEncodeURI(str: string): string {
        return GBK.URI.encodeURI(str)
    }


    /**
     * gbk url 解码
     * @param str 
     * @returns 
     */
    static gbkDecodeURI(str: string): string {
        return GBK.URI.decodeURI(str)
    }

    /**
     * gbk url 参数编码
     * @param str 
     * @returns 
     */
    static gbkEncodeURIComponent(str: string): string {
        return GBK.URI.encodeURIComponent(str)
    }

    /**
     *  gbk url 参数解码
     * @param str
     * @returns 
     */
    static gbkDecodeURIComponent(str: string): string {
        return GBK.URI.decodeURIComponent(str)
    }

    /**
     * 生成md5 16进制字串
     * @param str 
     * @returns 
     */
    static md5hex(str: string): string {
        return md5.hex_md5(str);
    }

    /**
     * 生成md5 base64字串
     * @param str 
     * @returns 
     */
    static md5base64(str: string): string {
        return md5.b64_md5(str);
    }


    /**
     *  生成md5 加hmac密钥 16进制字串
     * @param str 
     * @param hmac 
     * @returns 
     */
    static md5hex_hmac(str: string, hmac: string): string {
        return md5.hex_hmac_md5(str, hmac);
    }


    /**
     *  公历年月日转农历数据
     * @param year 
     * @param month 
     * @param day 
     * @returns 
     */
    static solar2lunar(year: number, month: number, day: number): LunarData {
        return calendarLunar.solar2lunar(year, month, day);
    }

    /**
     * 农历年月日转公历年月日
     */
    static lunar2solar(year: number, month: number, day: number): LunarData {
        return calendarLunar.lunar2solar(year, month, day);
    }

    /**
     * 将日期调整为周一
     * @param date 
     */
    static setDateWeek1(date: Date) {
        let week = date.getDay()
        if (week == 0) {//0,表示周末
            date.setDate(date.getDate() - 6);
        } else {
            date.setDate(date.getDate() - week + 1);
        }
    }

    /**
     * 获取周起始日与结束日
     * @param date 
     * @returns 
     */
    static getWeekStartEnd(date: Date) {
        let start = new Date(date);
        lib.setDateWeek1(start);
        let end = new Date(start);
        end.setDate(start.getDate() + 6)
        return [start, end]
    }


    /**
    * 将object转换为form表单格式字串
    * @param obj 转换对象
    * @param gbkEncode 是否gbk编码
    * @returns {string}
    */
    static objToForm(obj: any, gbkEncode: boolean = false) {
        if (obj == null) {
            return "";
        }

        let ret = "";
        let encodeFunc = gbkEncode ? lib.gbkEncodeURIComponent : encodeURIComponent;

        for (let k in obj) {
            let v = obj[k];
            if (v === undefined || typeof v === "function") {
                continue;
            }

            if (v instanceof Array) {
                v.forEach(it => {
                    if (it !== undefined)
                        ret += k + "=" + encodeFunc(it + "") + "&";
                })
            }
            else if (typeof v === "object") {
                ret += k + "=" + encodeFunc(JSON.stringify(v)) + "&";
            } else {
                ret += k + "=" + encodeFunc(v) + "&";
            }
        }

        if (ret.length > 0)
            return ret.substr(0, ret.length - 1);

        return ret;
    }


    /**
     * 秒数转字串00:00时间
     * @param currentTime 
     * @returns 
     */
    static timeSecToStr(currentTime: number) {
        let ret = ""
        let minute = Math.floor(currentTime / 60);
        if (minute < 10)
            ret += "0"
        ret += minute;
        let second = Math.floor(currentTime % 60);

        ret += ":"
        if (second < 10)
            ret += "0"
        ret += second
        return ret;
    }



    static sleep(time: number) {

        return new Promise<void>((reso, reject) => {
            setTimeout(() => {
                try {
                    reso();
                } catch (e) {
                    reject(e)
                }
            }, time);
        });

    }

    /**
     * 比较数字或字串
     * @param l
     * @param r
     * @returns {number}
     */
    static compare(l: any, r: any): number {
        if (l.localeCompare) {
            return l.localeCompare(r);
        }
        return l - r;
    }


    private static funcReg = /function\s*(\w*)/i;

    /**
     * 生成可显示（带showAble属性）异常
     * @param msg
     * @returns {Error}
     */
    static err(msg: string, code = ExceptionCode.normal, showAble = true) {
        return new MsgError(msg, code, showAble);
    }


    /**
     * 获取函数名
     * @param func
     * @returns {any}
     */
    static getFuncName(func: (...paras: any[]) => any) {
        if ((func as any).name !== undefined)
            return (func as any).name;

        let matches = lib.funcReg.exec(func + "");
        if (matches)
            return matches[1];

        return "";
    }



    static getDateStr(d: Date) {

        let n = new Date();
        if (n.getFullYear() === d.getFullYear()) {
            if (n.getMonth() === d.getMonth()) {
                if (n.getDay() === d.getDay()) {
                    if (n.getDate() === d.getDate()) {
                        return "今天";
                    }
                    return "一周以内"
                }
                return "一月以内"
            }
            return "一年以内"
        }
        return "一年以前"
    }


    /**
    * 将字符串解析成日期
    * @param str 输入的日期字符串，如'2014-09-13'
    * @param fmt 字符串格式，默认'yyyy-MM-dd'，支持如下：y、M、d、H、m、s、S，不支持w和q
    * @returns 解析后的Date类型日期
    */
    static parseDate(str: string, fmt: string = "yyyy-MM-dd HH:mm:ss"): Date {
        if (!str)
            return new Date(0);
        fmt = fmt || 'yyyy-MM-dd';
        let obj: any = { y: 0, M: 1, d: 0, H: 0, h: 0, m: 0, s: 0, S: 0 };
        fmt.replace(/([^yMdHmsS]*?)(([yMdHmsS])\3*)([^yMdHmsS]*?)/g, function (m, $1, $2, $3, $4) {
            str = str.replace(new RegExp($1 + '(\\d{' + $2.length + '})' + $4), function (_m, _$1) {
                obj[$3] = parseInt(_$1, 10);
                return '';
            });
            return '';
        });
        obj.M--; // 月份是从0开始的，所以要减去1
        let date = new Date(obj.y, obj.M, obj.d, obj.H, obj.m, obj.s);
        if (obj.S !== 0) date.setMilliseconds(obj.S); // 如果设置了毫秒
        return date;
    }

    /**
     * 将日期(年月日)转为可比较数字
     * @param p 
     * @returns 
     */
    static dateToNumber(p?: Date) {
        if (p) {
            return p.getFullYear() * 10000 + p.getMonth() * 100 + p.getDate();
        }
        return 0;
    }

    static dayOfWeek = ["日", "一", "二", "三", "四", "五", "六"]
    static dayOfWeek1 = ["一", "二", "三", "四", "五", "六", "日"]

    /* 单独控制年月日 */
    static dateToY_M_D(p?: Date | number | string, showYear = true, showDay = true, symb = "-") {
        if (!p) {
            return ''
        }
        let d = p instanceof Date ? p as Date : new Date(p as any);
        return (showYear ? d.getFullYear() + symb : '') + (d.getMonth() + 1).toStr(2) + (showDay ? (symb + d.getDate().toStr(2)) : "");
    }


    /* 单独控制年月日 */
    static dateToY_M_D_CN(p?: Date | number | string | null | undefined, showYear = true, showDay = true) {
        if (!p) {
            return ''
        }
        let d = p instanceof Date ? p as Date : new Date(p as any);
        return (showYear ? d.getFullYear() + '年' : '') + (d.getMonth() + 1).toStr(2) + '月' + (showDay ? d.getDate().toStr(2) + '日' : "");
    }

    /**
     * 单独控制时分秒
     */
    static dateToH_M_S(p?: Date | number | string, showSecond = false, symb = ":", showText = false) {
        if (!p) {
            return ''
        }
        let d = p instanceof Date ? p as Date : new Date(p as any);
        let ret = ''
        if (showText) {
            if (d.getHours() < 12) {
                ret += "上午 "
            } else {
                ret += "下午 "
            }
        }
        ret = d.getHours().toStr(2) + symb + d.getMinutes().toStr(2) + (showSecond ? (symb + d.getSeconds().toStr(2)) : "")
        return ret
    }

    /**
     * 单独控制时分秒
     */
    static dateToH_M_S_CN(p?: Date | number | string, showSecond = false, showText = false) {
        if (!p) {
            return ''
        }
        let d = p instanceof Date ? p as Date : new Date(p as any);
        let ret = ''
        if (showText) {
            if (d.getHours() < 12) {
                ret += "上午 "
            } else {
                ret += "下午 "
            }
        }
        ret = d.getHours().toStr(2) + '时' + d.getMinutes().toStr(2) + (showSecond ? ('分' + d.getSeconds().toStr(2)) : "分")
        return ret
    }

    /**
     * 日期处理
     * @param p 
     * @param showText 显示上午，下午
     * @param showSecond 
     * @param symb 
     * @returns 
     */
    static dateToY_M_D_H_M_S(p: Date | number | string | null | undefined, showText = false, showSecond = false, symb = "-") {
        if (!p) {
            return "";
        }

        let d = p instanceof Date ? p as Date : new Date(p as any);

        let ret = d.getFullYear() + symb + (d.getMonth() + 1).toStr(2) + symb + d.getDate().toStr(2) + " ";

        if (showText) {
            if (d.getHours() < 12) {
                ret += "上午 "
            } else {
                ret += "下午 "
            }
        }
        ret += d.getHours().toStr(2) + ":" + d.getMinutes().toStr(2) + (showSecond ? (":" + d.getSeconds().toStr(2)) : "")

        return ret;


    }

    /**
     * 获取当前时间戳毫秒值
     * @returns 
     */
    static now() {
        return Date.now();
    }

    /**
     * 获取当前时间戳秒值
     * @returns
     */
    static nowSec() {
        return Math.floor(Date.now() / 1000);
    }

    /**
     * 获取周几时间
     * @returns 
     */
    static getOneDate(now: Date = new Date, num: number = 1) {
        let nowTime = now.getTime();
        let day = now.getDay();
        let oneDayTime = 24 * 60 * 60 * 1000;
        let dayTime = nowTime - (day - num) * oneDayTime;//显示周一//num=1
        return dayTime
    }

    /**
     * 获取两个时间差天数
     * @param fushu 需要返回负数
     * @returns 
     */
    static betweenDays(start: Date | number | string | null | undefined, end: Date | number | string | null | undefined, fushu?: boolean) {
        if (!start || !end) {
            return 0;
        }

        let dstart = start instanceof Date ? start as Date : new Date(start as any);
        let dend = end instanceof Date ? end as Date : new Date(end as any);

        let startDate = Date.parse(this.dateToY_M_D(dstart))
        let endDate = Date.parse(this.dateToY_M_D(dend))

        if (startDate == endDate) {
            return 0
        }

        let day = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)

        if (fushu) {
            return day
        }
        return day < 0 ? -day : day
    }


    /**
     * 获取数组类型
     * @param val 
     * @returns 
     */
    static getArrayType(val: any) {
        return val[ARRAY_TYPE];
    }

    static setPrototypeOf(target: any, proto: any) {
        if ((Object as any).setPrototypeOf)
            (Object as any).setPrototypeOf(target, proto);
        else if (target.__proto__) { /*eslint no-proto:0*/
            target.__proto__ = proto;
        }
        else {
            /** IE9 fix - copy object methods from the protype to the new object **/
            for (let prop in proto) {
                target[prop] = proto[prop];
            }
        }
    }


    /**
     * 将所有obj合并到v1里
     * @returns {any}
     * @param v1
     * @param v2
     * @param v3
     * @param v4
     * @param v5
     */
    static joinObjFast<T1, T2, T3, T4, T5>(v1: T1, v2: T2, v3: T3, v4: T4, v5: T5): T1 & T2 & T3 & T4 & T5
    static joinObjFast<T1, T2, T3, T4>(v1: T1, v2: T2, v3: T3, v4: T4): T1 & T2 & T3 & T4
    static joinObjFast<T1, T2, T3>(v1: T1, v2: T2, v3: T3): T1 & T2 & T3
    static joinObjFast<T1, T2>(v1: T1, v2: T2): T1 & T2
    static joinObjFast(...values: any[]) {
        let first = values[0];
        for (let i = 1; i < values.length; i++) {
            let next = values[i];
            for (let key in next) {
                first[key] = next[key];
            }
        }
        return first;
    }


    /**
     * 合并多个个对象,返回新对象
     * @returns {any}
     */
    static joinObj<T1, T2, T3, T4, T5>(v1: T1, v2: T2, v3: T3, v4: T4, v5: T5): T1 & T2 & T3 & T4 & T5
    static joinObj<T1, T2, T3, T4>(v1: T1, v2: T2, v3: T3, v4: T4): T1 & T2 & T3 & T4
    static joinObj<T1, T2, T3>(v1: T1, v2: T2, v3: T3): T1 & T2 & T3
    static joinObj<T1, T2>(v1: T1, v2: T2): T1 & T2
    static joinObj(...values: any[]) {
        let clas: any = function () {

        }
        let newObj = new clas();

        for (let i = 0; i < values.length; i++) {
            let next = values[i];
            lib.setParent(newObj.constructor, next.constructor);
            for (let key in next) {
                newObj[key] = next[key];
            }
        }
        return newObj;
    }

    /**
     * 联合两个Array,例子:sdf.leftJoin(ArrayL, ArrayR, ArrayL=>ArrayL.lid, ArrayR=>ArrayR.rid);
     * @param left 左表,funcL里的外键字段,值可重复
     * @param right 右表,funcR里的主键字段,不能有重复值
     * @param funcL 左表外键回调
     * @param funcR 右表主键回调
     * @param overrideLeft 是否覆盖左表重复的键值
     * @returns {Array<TL&TR>}
     */
    static leftJoin<TL, TR>(left: Array<TL>, right: Array<TR>, funcL: (l: TL) => any, funcR: (l: TR) => any, overrideLeft?: boolean): Array<TL
        & TR> {
        if (!right || right.length < 1)
            return left as Array<TL & TR>;

        return lib.leftJoinMap(left, lib.arrToMap(right, funcR), funcL, overrideLeft);
    }

    /**
     * 返回函数体内容字串
     * @param func
     * @returns {string}
     */
    static getFuncBody(func: (...paras: any[]) => any) {
        let funStr = func + "";
        let i = funStr.indexOf("=>");
        if (i > 0) {
            return funStr.substring(i + 2, funStr.length);
        }

        return funStr;
    }

    /**
     * 将Array映射为Map
     * @param right
     * @param funcR 作为Map键值的字段回调函数
     * @param filter filter过滤回调
     * @returns {MapString<TR>}
     */
    static arrToMap<TR>(right: Array<TR>, funcR: (l: TR) => any, filter?: (l: TR) => boolean): MapString<TR> {
        let rightMap: MapString<TR> = {};
        if (filter) {
            for (let i = 0; i < right.length; i++) {
                let rObj = right[i];
                if (filter(rObj))
                    rightMap[funcR(rObj)] = rObj;
            }
        }
        else {
            for (let i = 0; i < right.length; i++) {
                let rObj = right[i];
                rightMap[funcR(rObj)] = rObj;
            }
        }
        return rightMap;
    }

    /**
     * 将map映射为array
     * @param map 
     * @param func 自定义array数据结构
     * @returns 
     */
    static mapToArray<T, Ret>(map: Record<string, T>, func: (k: string, v: T) => Ret) {
        let ret = Array<Ret>();
        for (let k in map) {
            ret.push(func(k, map[k]));
        }
        return ret;
    }

    /**
     * 将map映射为array
     * @param right
     * @param filter filter过滤回调
     * @returns {Array}
     * @constructor
     */
    static mapToArr<T>(right: MapString<T>, filter?: (key: string, val: T) => boolean): T[] {
        let ret = Array<any>();
        if (filter) {
            for (let k in right) {
                let val = right[k];
                if (filter(k, val))
                    ret.push(val);
            }
        }
        else {
            for (let k in right) {
                ret.push(right[k]);
            }
        }

        return ret;
    }


    /**
     * 判断是否整数
     * @param val
     * @returns {boolean}
     */
    static isInt(val: string) {
        if (val == null || val.length === 0) {
            return false;
        }

        for (let u of val) {
            if (u < '0' || u > '9')
                return false;
        }

        return true;
    }

    /**
     * 将字节number，转为Byte/KB/MB/GB/TB字串：
     * @param num 
     * @returns 
     */
    static showByte(num: number) {
        if (num <= 1024) {
            return "" + num + " Byte"
        }

        if (num <= 1024 * 1024) {
            return (num / 1024).toFixed(1) + " KB"
        }

        if (num <= 1024 * 1024 * 1024) {
            return (num / 1024.0 / 1024.0).toFixed(1) + " MB"
        }

        if (num <= 1024 * 1024 * 1024 * 1024) {
            return (num / 1024.0 / 1024.0 / 1024.0).toFixed(1) + " GB"
        }

        return (num / 1024.0 / 1024.0 / 1024.0 / 1024.0).toFixed(1) + " TB";
    }

    /**
     * 将字节number，转为KB/MB/GB/TB字串：
     * @param num 
     * @returns 
     */
    static showByte2(num: number) {

        if (num <= 1024 * 1024) {
            return (num / 1024).toFixed(1) + "KB"
        }

        if (num <= 1024 * 1024 * 1024) {
            return (num / 1024.0 / 1024.0).toFixed(1) + "MB"
        }

        if (num <= 1024 * 1024 * 1024 * 1024) {
            return (num / 1024.0 / 1024.0 / 1024.0).toFixed(1) + "GB"
        }

        return (num / 1024.0 / 1024.0 / 1024.0 / 1024.0).toFixed(1) + "TB";
    }

    static leftJoinMap<TL, TR>(left: Array<TL>, right: MapString<TR>, funcL: (l: TL) => any, overrideLeft?: boolean): Array<TL
        & TR> {
        if (!left || left.length < 1)
            return left as Array<TL & TR>;

        for (let i = 0; i < left.length; i++) {
            let lObj: any = left[i];
            let rObj: any = right[funcL(lObj)];
            if (rObj) {
                if (overrideLeft) {
                    for (let na in rObj) {
                        lObj[na as any] = rObj[na];
                    }
                }
                else {
                    for (let na in rObj) {
                        if (lObj[na as any] == null)
                            lObj[na as any] = rObj[na];
                    }
                }
            }
        }
        return left as Array<TL & TR>;
    }


    /**
     * 将_下划线命名法替换为首字母大写驼峰式
     * @param name
     * @param symble
     * @param filterCode
     * @returns {string}
     */
    static fixNameUpperCase(name: string, symble?: string, filterCode?: string) {
        if (symble === "") {
            symble = "_";
        }
        let ret = "";
        for (let i = 0; i < name.length; i++) {
            let c = name[i];

            if (c === filterCode)
                continue;

            if (c === symble) {
                i++;
                if (i < name.length)
                    ret += name[i].toUpperCase();
                continue;
            }

            ret += c;
        }
        return ret;
    }

    private static autoInc = 0;

    static getAutoInc() {
        return lib.autoInc++;
    }

    private static hexString = "0123456789abcdefghijklmnopqrstuvwxyz";


    /**
     * 产生[0,num)以内的随机数
     * @param num
     * @returns {number}
     */
    static randomInt(num: number) {
        return Math.floor(Math.random() * num);
    }

    /**
     * 获取定长10进制随机数
     * @param len 长度
     * @returns {string}
     */
    static getRandFixNum(len: number) {
        let ret = "";
        for (let i = 0; i < len; i++) {
            ret += Math.floor(Math.random() * 10);
        }
        return ret;
    }


    /**
     * 获取22位16进制的唯一id
     * @returns {string}
     */
    static getUniqueId() {
        lib.autoInc += 1;
        if (lib.autoInc >= 0xFFFFF)
            lib.autoInc = 0;
        let ret = Date.now().toString(16) + "" + lib.autoInc.toString(16);
        for (let i = ret.length; i < 11 + 5; i++) {
            ret += "0";
        }
        for (let i = 0; i < 6; i++) {
            ret += lib.hexString[lib.randomInt(16)];
        }
        return ret;
    }

    /**
     * 创建日期增减年数后返回
     * @param d 
     * @param year 增减的年数
     * @returns 
     */
    static newDate(d: Date, year: number, month?: number) {
        let ret = new Date(d);
        ret.setFullYear(ret.getFullYear() + year);
        if (month != null)
            ret.setMonth(ret.getMonth() + month);
        return ret
    }

    /**
     * 将数组拼接为字符串
     * @param arr 数组
     * @param func 拼接的字段
     * @param symble 分隔符
     * @returns 
     */
    static joinString<T>(arr: Array<T> | Map<any, T> | undefined | null, func: (d: T) => string, symble = ",") {
        let ret = "";
        if (arr) {
            arr.forEach(it => {
                if (ret.length > 0) {
                    ret += symble;
                }
                ret += func(it);
            })
        }
        return ret;
    }

    /**
     * 获取16位36进制的唯一id
     * @returns {string}
     */
    static getUniqueId16() {
        lib.autoInc += 1;
        if (lib.autoInc >= 1679616)
            lib.autoInc = 0;
        let ret = Date.now().toString(36) + lib.autoInc.toString(36);
        for (let i = ret.length; i < 8 + 4; i++) {
            ret += "0";
        }
        for (let i = 0; i < 4; i++) {
            ret += lib.hexString[lib.randomInt(36)];
        }
        return ret;
    }


    /**
     * 获取class@装饰器设置的元数据
     * @param clas class名
     * @param metaKey 元数据键值
     * @param field class成员名
     * @returns {any} 未找到返回null
     */
    static getData(clas: ClassMetaData, metaKey: string, field: string): any {
        if (!clas)
            return undefined;

        let ret: any;
        if (clas._fieldMetaDataMap_)
            ret = clas._fieldMetaDataMap_[lib.getKey(metaKey, field)];

        if (ret === undefined) {
            let parent = (clas as any).__proto__;
            // let parent = Object.getPrototypeOf(clas);
            if (parent && parent instanceof Function)
                return lib.getData(parent, metaKey, field);
            else
                return undefined;
        }

        return ret;
    }

    /**
     * 设置class的元数据
     * @param classType
     * @param metaKey 元数据键值
     * @param field class成员名
     * @param data
     */
    static setData(classType: ClassMetaData, metaKey: string, field: string, data: any) {
        if (!classType._fieldMetaDataMap_)
            classType._fieldMetaDataMap_ = {};
        classType._fieldMetaDataMap_[lib.getKey(metaKey, field)] = data;
    }

    private static getKey(metaKey: string, field: string) {
        return "_" + metaKey + "_" + field + "_";
    }


    /**
     * 获取类的父类,没有返回空数组
     * @param clas
     * @returns {any}
     */
    static getParent(clas: { new(p: any): any; } | ((...p: any) => any)): { new(): any; }[] {
        let ret = Array<{ new(): any; }>();
        let cl = Object.getPrototypeOf(clas);
        if (cl && cl instanceof Function) {
            ret.push(cl);
        }

        let meta = lib.getData(clas, "class_parent", "") as any[];
        if (meta) {
            for (let m of meta) {
                ret.push(m);
            }
        }
        return ret;
    }

    /**
     * 设置clas的parent元信息
     * @param clas
     * @param parent
     */
    static setParent(clas: { new(p: any): any; } | ((...p: any) => any), parent: { new(p: any): any; } | ((...p: any) => any)) {
        let meta = lib.getData(clas, "class_parent", "") as any[];
        if (meta == null) {
            meta = [];
            lib.setData(clas, "class_parent", "", meta);
        }

        let par = lib.getParent(parent);
        if (par.length > 0)
            par.forEach(it => meta.push(it));

        meta.push(parent);

    }


    /**
     * 生成字串的hase值
     * @param str
     * @returns {number}
     */
    static hashCode(str: string) {
        let hash = 0, i, chr, len;
        if (str.length === 0) return hash;
        for (i = 0, len = str.length; i < len; i++) {
            chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr; /*eslint no-bitwise:0 */
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    /**
     * 从字串中截取文件名
     * @param file
     * @returns {any}
     */
    static getFileName(file: string | File) {
        let name = typeof file === "string" ? file : file.name;
        let pos = name.lastIndexOf("/");
        if (pos >= 0) {
            return name.substring(pos + 1, name.length)
        }
        return name;
    }

    static getFileExt(file: string) {
        let pos = file.lastIndexOf(".");
        if (pos >= 0) {
            return file.substring(pos + 1, file.length)
        }
        return "";
    }
    /**
     * 获取函数参数名别表
     * @param fn
     * @returns {Array|RegExpMatchArray}
     */
    static getParameterNames(fn: (...paras: any[]) => any): Array<string> {
        let code = fn.toString()
            .replace(COMMENTS, '')
            .replace(FAT_ARROWS, '')
            .replace(DEFAULT_PARAMS, '');

        let result = code.slice(code.indexOf('(') + 1, code.indexOf(')'))
            .match(/([^\s,]+)/g);

        return result === null
            ? []
            : result;
    }


    /**
     * 设置指定类的方法的参数名元信息
     * @param clas
     * @param method
     * @param paras
     */
    private static setParasNameMeta(clas: any, method: string, paras: Array<string>) {
        lib.setData(clas, "paras_name", method, paras);
    }

    /**
     * 获取指定类的方法的参数名元信息
     * @returns {Array<string>}
     * @param target class实例
     * @param propertyKey
     */
    static getParasNameMeta(target: object, propertyKey: string) {
        let ret = lib.getData(target.constructor, "paras_name", propertyKey) as Array<string> | undefined;
        if (!ret) {
            let func = (target as any)[propertyKey];
            if (!func)
                throw Error((target.constructor as any).name + " not have " + propertyKey);
            ret = lib.getParameterNames(func)
            lib.setParasNameMeta(target.constructor, propertyKey, ret);
        }
        return ret as Array<string>;
    }


    /**
     * 动态加载js脚本(仅限web端)
     * @param url 
     * @param callback 
     */
    static loadScript(url: string): Promise<void> {
        return new Promise<void>((reso, reject) => {
            let script = document.createElement("script")
            script.type = "text/javascript";

            if ((script as any).readyState) {  //IE
                (script as any).onreadystatechange = function () {
                    if ((script as any).readyState === "loaded" ||
                        (script as any).readyState === "complete") {
                        (script as any).onreadystatechange = null;
                        reso();
                    }
                };
            } else {  //Others
                script.onload = function () {
                    reso();
                };
                script.onerror = err => {
                    reject(err);
                }
            }

            script.src = url;
            document.body.appendChild(script);
        })

    }

    /**
     * 获取cookie
     * @param name 
     * @returns 
     */
    static getCookie(name: string): string | null {
        if (!document?.cookie) {
            return null;
        }
        let reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        let arr = document.cookie.match(reg)
        if (arr)
            return arr[2];
        else
            return null;
    }

    /**
     * 设置cookie(默认30天)
     * @param name 键
     * @param value 值(可不传, 不传Name必须为xxx=xxx格式) 
     * @param times 有效时间(毫秒)
     * @returns 
     */
    static setCookie(name: string, value?: string, times = 30 * 24 * 60 * 60 * 1000) {
        if (!window?.document) {
            return;
        }
        let exp = new Date();
        exp.setTime(exp.getTime() + times);
        let str = name;
        if (value) {
            str += "=" + value;
        }
        str += ";expires=" + exp.toUTCString();
        document.cookie = str;
    }

    static validatorPhone(phone: string) {
        return /^1[123456789]\d{9}$/.test(phone)
    }

    /*
    *
    * @params {string} idcode
    *
    * 函数参数必须是字符串，因为二代身份证号码是十八位，而在javascript中，十八位的数值会超出计算范围，造成不精确的结果，
    * 导致最后两位和计算的值不一致，从而该函数出现错误（详情查看javascript的数值范围）。
    * 为了避免这一误差，idcode必须是字符串
    *
    * 正则思路：
    *   第一位不可能是0
    *   第二位到第六位可以是0-9
    *   第七位到第十位是年份，所以七八位为19或者20
    *   十一位和十二位是月份，这两位是01-12之间的数值
    *   十三位和十四位是日期，是从01-31之间的数值
    *   十五，十六，十七都是数字0-9
    *   十八位可能是数字0-9，也可能是X
    * */
    static validatorIDCard(idcode: string) {
        if (typeof idcode !== 'string') {
            return false
        }
        const idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
        // 判断格式是否正确
        const format = idcard_patter.test(idcode);
        if (!format) {
            return false
        }
        // 加权因子
        const weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        // 校验码
        const check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
        const last = idcode[17];//最后一位
        const seventeen = idcode.substring(0, 17);
        // ISO 7064:1983.MOD 11-2
        // 判断最后一位校验码是否正确
        const arr = seventeen.split("") as any;
        const len = arr.length;
        let num = 0;
        for (let i = 0; i < len; i++) {
            num += arr[i] * weight_factor[i];
        }
        // 获取余数
        const resisue = num % 11;
        const last_no = check_code[resisue];
        // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
        const result = last === last_no ? true : false;
        return result
    }

    /**
     * 删除cookie
     * @param name 
     * @returns 
     */
    static delCookie(name: string) {
        if (!document?.cookie) {
            return;
        }

        let exp = new Date();
        exp.setTime(exp.getTime() - 1);
        let cval = lib.getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toUTCString();
    }



    /**
     * 循环Count次,计算函数耗时
     * @param count 
     * @param func 
     */
    static timer(count: number, func: () => void) {
        let d = Date.now()
        for (let i = 0; i < count; i++) {
            func()
        }
        console.log("耗时：" + (Date.now() - d) + "ms");

    }

    /**
     * 读取字串的所有行
     * @param str 目标字串
     * @param func 读取结果(返回false中断遍历)
     */
    static readLine(str: string, func: (line: string) => void | boolean) {
        let line = "";
        for (let i = 0; i < str.length; i++) {
            let c = str[i];
            if (c === "\n") {
                if (func(line) === false)
                    return;

                line = "";
                continue;
            }

            if (c === "\r")
                continue;

            line += c;
        }
        if (line.length > 0)
            func(line);
    }


    /**
    * [获取URL中的参数名及参数值的集合]
    * @param {[string]} urlStr [当该参数不为空的时候，则解析该url中的参数集合]
    * @return {[string]}       [参数集合]
     */
    static getRequest(urlStr: string): Record<string, string> {
        let theRequest = {} as Record<string, string>;
        let str1 = urlStr.split("?");
        let strs: string[] = []
        if (str1[1]) {
            strs = str1[1].split("&");
        } else {
            strs = urlStr.split("&");
        }
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
        }
        return theRequest;
    }

    /**
    * [获取URL中的参数名及参数值的集合]
    * @param {[string]} urlStr [当该参数不为空的时候，则解析该url中的参数集合]
    * @return {[string]}       [参数集合]
     */
    static getRequestFast(urlStr: string): Record<string, string> {
        let theRequest = {} as Record<string, string>;
        let strs = urlStr.split("&");
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
        }
        return theRequest;
    }

    static getUrlParas(): Record<string, string> | undefined {
        let i = window?.location?.href?.indexOf("?")
        if (i > 0) {
            let res = lib.getRequest(window.location.href.substring(i + 1))
            return res;
        }
        return undefined;
    }


    //移除收尾空格和换行符
    static trim1(str: string): string {
        if (!str) {
            return str
        }
        return str.replace(/(^\s*)|(\s*$)|(^\n*)|(\n*$)/g, '')
    }

}


/**
 * 通过@装饰器设置的class的元数据
 */
export interface ClassMetaData extends Function {
    _fieldMetaDataMap_?: MapString<Object>;
}



export type LunarData = {
    Animal: "兔" | string,
    IDayCn: "初十" | string,
    IMonthCn: "九月" | string,
    Term: null,
    astro: "天蝎座" | string,
    cDay: 1 | number,
    cMonth: 11 | number,
    cYear: 1987 | number,
    gzDay: "甲寅" | string,
    gzMonth: "庚戌" | string,
    gzYear: "丁卯" | string,
    isLeap: false | boolean,
    isTerm: false | boolean,
    isToday: false | boolean,
    lDay: 10 | number,
    lMonth: 9 | number,
    lYear: 1987 | number,
    nWeek: 7 | number,
    //农历节日
    lunarFestival: string | null,
    date: "2022-4-1" | string,
    festival: "愚人节" | string | null,
    ncWeek: "星期日" | string,
}