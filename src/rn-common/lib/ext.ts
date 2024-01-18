/*eslint-disable */
import React from "react";

export function init() {
}

declare module "react" {
    interface Component {

        // /**
        //  * 获得焦点
        //  */
        // onFocus?(): void;

        // /**
        //  * 失焦
        //  */
        // onBlur?(): void;

    }
}


declare module "react-native" {

    //web端特有属性
    interface TextStyle {
        outlineColor?: string,
        outlineOffset?: string | number,
        outlineStyle?: string,
        outlineWidth?: string | number,
        whiteSpace?: string,

    }
    interface PressableStateCallbackType {
        readonly focused?: boolean;
        readonly hovered?: boolean;
    }

    interface ViewStyle {
        //web端
        background?: string,

        wordBreak?: 'break-all' | 'break-word' | 'normal' | 'keep-all' | 'inherit' | 'initial' | 'unset',
    }


    interface SwitchProps {
        //web端
        activeThumbColor?: string;
        //web端
        activeTrackColor?: string;
    }

    class CheckBox extends React.Component<any, any> {

    }

    interface ViewStyle {
        userSelect?: string
    }

    interface ViewProps {
        className?: string,
        classList?: any,
    }
}



declare global {


    export interface String {
        /**
         * 移除最后一个字符
         */
        removeLast(): string;
        /**
         * html转义
         */
        htmlEncode(): string;


        /**
         * 字串截取，截取成功末尾自动添加suffix（...）
         * @param len 长度
         * @param suffix 后缀
         */
        limitLength(len: number, suffix?: string): string;

        //转为int型，无效数字转为0
        toInt(): number;
    }
    export interface Number {
        /**
         * 循环number次
         */
        loop(func: (index: number) => void): void;
        /**
         * 循环number次,并将func返回值map成Array
         */
        loopMap<T>(func: (index: number) => T): Array<T>;

        //转换为固定长度字串,不足前面补0
        toStr(len: number): string;
    }

    export interface Date {
        /**
         * 获取当前为第几周
         */
        getWeekOfMonth(): number;
        /**
         * 获取星期几（周一起始（0-6））
         */
        getDayOfWeek(): number;
    }
    export interface Map<K, V> {

        map<T>(func: (k: K, v: V) => T): Array<T>;
    }

    export interface Array<T> {

        /**
         * 遍历数组,func返回false则中断
         * @param func
         */
        each(func: (val: T) => boolean): boolean;

        /**
         * 数组求和
         * @param func 
         */
        sum(func: (val: T, index: number) => number): number;

        /**
         * 遍历并转换数组成员为int,遇到NaN返回false,func返回false则中断
         */
        eachToInt(func?: (val: number) => boolean): boolean;

        /**
         *遍历并转换数组成员为float,func返回false则中断
         */
        eachToFloat(func?: (val: number) => boolean): boolean;

        /**
         *遍历并转换数组成员为string,func返回false则中断
         */
        eachToString(func?: (val: string) => boolean): boolean;

        /**
         * 二分查找,返回索引位置(未找到返回-1)
         * 回调里返回（目标值-itm中间值）> 0为正序,搜索后半部分，反之倒序
         * @param func
         */
        binarySearch(func: (itm: T) => number): number;


        /**
         * 遍历array并将func返回结果拼接为string
         */
        mapString(func: (itm: T, index: number) => any): string;

        /**
         * 向指定位置添加元素
         * @param index
         * @param val
         */
        add(index: number, val: T | T[]): this;

        /**
         * 同map函数，支持async与await
         * @param callbackfn
         */
        mapPromise<U>(callbackfn: (value: T, index: number, array: T[]) => Promise<U>): Promise<U[]>;
        /**
         * 遍历array并将func返回结果拼接为string,支持async与await
         * @param callbackfn
         */
        mapStringPromise(callbackfn: (value: T, index: number) => Promise<any>): Promise<string>;

    }
}


if (!String.prototype.removeLast) {
    Object.defineProperty(String.prototype, "removeLast", {
        value: function (this: string) {
            return this.substr(0, this.length - 1);
        },
        enumerable: false,
        writable: true,
    });


    Object.defineProperty(String.prototype, "toInt", {
        value: function (this: string) {
            let ret = parseInt(this);
            return Number.isNaN(ret) ? 0 : ret;
        },
        enumerable: false,
        writable: true,
    });

    Object.defineProperty(String.prototype, "htmlEncode", {
        value: function (this: string): string {
            let ret = "";
            for (let i = 0; i < this.length; i++) {
                let s = this.charAt(i);
                if (s === " ")
                    ret += "&nbsp;"
                else if (s === "<")
                    ret += "&lt;";
                else if (s === ">")
                    ret += "&gt;";
                else if (s === "&")
                    ret += "&amp;";
                else
                    ret += s;
            }

            return ret;
        },
        enumerable: false,
        writable: true,
    });

    Object.defineProperty(String.prototype, "limitLength", {
        value: function (this: string, len: number, suffix: string = "...") {
            if (this.length > len) {
                return this.substr(0, len) + suffix;
            }
            return this + "";
        },
        enumerable: false,
        writable: true,
    });


    Object.defineProperty(String.prototype, "toJSON", {
        value: function (): any {
            return this.valueOf() as any;
        },
        enumerable: false,
        writable: true,
    });
}






if (!Array.prototype.map) {
    Array.prototype.map = function (this: Array<any>, callbackfn: (value: any, index: number, array: any[]) => any) {
        let arr = Array<any>();
        for (let i = 0; i < this.length; i++) {
            arr.push(callbackfn(this[i], i, arr));
        }
        return arr;
    } as any
}

if (!Array.prototype.eachToInt) {


    Object.defineProperty(Map.prototype, "map", {
        value: function (this: Map<any, any>, func: (k: any, v: any) => any) {

            let arr = Array<any>();

            this.forEach((v, k) => {
                arr.push(func(k, v));
            })

            return arr;
        },
        enumerable: false,
        writable: true,
    });

    Object.defineProperty(Number.prototype, "loop", {
        value: function (func: (index: number) => void) {
            for (let i = 0; i < this; i++) {
                func(i);
            }
        },
        enumerable: false,
        writable: true,
    });

    Object.defineProperty(Number.prototype, "toStr", {
        value: function (len: number) {
            return ("000000000000000000" + this).substr(-len);
        },
        enumerable: false,
        writable: true,
    });

    Object.defineProperty(Number.prototype, "loopMap", {
        value: function (func: (index: number) => any) {
            let arr = Array<any>();
            for (let i = 0; i < this; i++) {
                arr.push(func(i));
            }
            return arr;
        },
        enumerable: false,
        writable: true,
    });

    Object.defineProperty(Array.prototype, "add", {
        value: function (this: Array<any>, index: number, item: any) {
            if (Array.isArray(item))
                this.splice(index, 0, ...item);
            else
                this.splice(index, 0, item);
            return this;
        },
        enumerable: false,
        writable: true,
    });



    Object.defineProperty(Array.prototype, "sum", {
        value: function (this: Array<any>, func: (val: any, index: number) => number) {
            let ret = 0
            for (let i = 0; i < this.length; i++) {
                ret += func(this[i], i);
            }
            return ret;
        },
        enumerable: false,
        writable: true,
    });

    Object.defineProperty(Array.prototype, "mapString", {
        value: function (this: Array<any>, func: (itm: any, index: number) => any) {
            let str = ""
            for (let i = 0; i < this.length; i++) {
                let ret = func(this[i], i);
                if (ret != null)
                    str += ret;
            }
            return str;
        },
        enumerable: false,
        writable: true,
    });

    Object.defineProperty(Array.prototype, "binarySearch", {
        value: function (this: Array<any>, func: (itm: any) => number): number {
            let startIndex = 0;
            let stopIndex = this.length - 1;


            while (startIndex <= stopIndex) {
                let middle = (stopIndex + startIndex) >>> 1; /*eslint no-bitwise: 0*/

                let ret = func(this[middle]);
                if (ret < 0) {
                    stopIndex = middle - 1;
                }
                else if (ret > 0) {
                    startIndex = middle + 1;
                }
                else {
                    return middle;
                }
            }

            return -1;
        },
        enumerable: false,
        writable: true,
    });

    Object.defineProperty(Array.prototype, "eachToInt", {
        value: function (this: Array<any>, func?: (val: number) => boolean) {
            for (let i = 0; i < this.length; i++) {
                this[i] = parseInt(this[i], 10);
                if (isNaN(this[i])) {
                    this[i] = 0;
                    return false;
                }
                if (func) {
                    if (!func(this[i]))
                        return false;
                }

            }
            return true;
        },
        enumerable: false,
        writable: true,
    });

    Object.defineProperty(Array.prototype, "each", {
        value: function (this: Array<any>, func: (val: any) => boolean): boolean {
            for (let i = 0; i < this.length; i++) {
                if (!func(this[i]))
                    return false;
            }
            return true;
        },
        enumerable: false,
        writable: true,
    });

    Object.defineProperty(Array.prototype, "eachToFloat", {
        value: function (this: Array<any>, func?: (val: number) => boolean) {
            for (let i = 0; i < this.length; i++) {
                this[i] = parseFloat(this[i]);
                if (isNaN(this[i])) {
                    this[i] = 0;
                    return false;
                }

                if (func) {
                    if (!func(this[i]))
                        return false;
                }
            }
            return true;
        },
        enumerable: false,
        writable: true,
    });

    Object.defineProperty(Array.prototype, "eachToString", {
        value: function (this: Array<any>, func?: (val: string) => boolean) {
            for (let i = 0; i < this.length; i++) {
                this[i] = this[i] + "";
                if (func) {
                    if (!func(this[i]))
                        return false;
                }
            }
            return true;
        },
        enumerable: false,
        writable: true,
    });

    Object.defineProperty(Array.prototype, "mapPromise", {
        value: async function (this: Array<any>, callbackfn: (value: any, index: number, array: any[]) => Promise<any>) {
            let arr = new Array<any>();
            for (let i = 0; i < this.length; i++) {
                arr.push(await callbackfn(this[i], i, arr));
            }
            return arr;
        },
        enumerable: false,
    });


    Object.defineProperty(Array.prototype, "mapStringPromise", {
        value: async function (this: Array<any>, callbackfn: (value: any, index: number) => Promise<any>) {
            let str = ""
            for (let i = 0; i < this.length; i++) {
                let ret = await callbackfn(this[i], i);
                if (ret != null)
                    str += ret;
            }
            return str;
        },
        enumerable: false,
    });
}

Object.values = Object.values ? Object.values : function (obj: any) {
    var allowedTypes = ["[object String]", "[object Object]", "[object Array]", "[object Function]"];
    var objType = Object.prototype.toString.call(obj);

    if (obj === null || typeof obj === "undefined") {
        throw new TypeError("Cannot convert undefined or null to object");
    } else if (!~allowedTypes.indexOf(objType)) {
        return [];
    } else {
        // if ES6 is supported
        if (Object.keys) {
            return Object.keys(obj).map(function (key) {
                return obj[key];
            });
        }

        var result = [];
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                result.push(obj[prop]);
            }
        }

        return result;
    }
};

if (!Date.prototype.getDayOfWeek) {

    Object.defineProperty(Date.prototype, "getDayOfWeek", {
        value: function (this: Date) {
            let startWeek = this.getDay();
            if (startWeek == 0) {
                startWeek = 7;
            }
            startWeek -= 1;
            return startWeek;
        },
        enumerable: false,
    });

    Object.defineProperty(Date.prototype, "getWeekOfMonth", {
        value: function (this: Date) {
            let week = this.getDayOfWeek();
            let day = this.getDate() - 1;
            let weekI = ((day + (6 - week)) / 7) << 0;
            // console.log(day, " ", week, " ", weekI);
            // let sub = day % 7;
            // if (sub >= week) {
            //     weekI += 1;
            // }
            return weekI;
        },
        enumerable: false,
    });
}