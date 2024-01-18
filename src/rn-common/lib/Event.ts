import { Component, useEffect, useRef, useState } from "react";


/**
 * 捕获指定事件
 * @param ev 事件
 * @param args 初始化参数
 * @returns 事件值
 */
export function useEvent<T extends any[]>(ev: Event<T>, ...args: T) {
    const [count, setCount] = useState(args);

    useEffect(() => {
        let func = (...args: T) => {
            setCount(args)
        }
        ev.funcList.push(func)

        return () => {
            ev.removeFunc(func)
        }
    }, [ev])
    return count;
}


/**
 * 创建事件
 * @param para 
 * @returns 
 */
export function createEvent<T extends any[]>(para: (...args: T) => any): Event<T> {
    return new Event<T>(para);
}

function EventHook(ev: Event<any>, func: (...args: any) => any) {

    useEffect(() => {
        ev.funcList.push(func)

        return () => {
            ev.removeFunc(func)
        }
    }, [ev, func])
}

export let COMPONENT_EXT: symbol = "_COMPONENT_EXT" as any;
if (typeof Symbol === "function") {
    COMPONENT_EXT = Symbol.for("_COMPONENT_EXT")
}

export class ComponentExt {

    willUnmountList = Array<() => any>();

    static get(clas: Component<any, any>): ComponentExt {
        let ret = (clas as any)[COMPONENT_EXT] as ComponentExt;
        if (ret) {
            return ret
        }
        ret = new ComponentExt();
        (clas as any)[COMPONENT_EXT] = ret;

        let old = clas.componentWillUnmount
        let newUnmount = () => {
            for (let f of ret.willUnmountList) {
                f()
            }
            ret.willUnmountList.length = 0;
            old?.call(clas);
        }
        clas.componentWillUnmount = newUnmount;

        return ret
    }
}

export class Event<T extends any[]> {

    /**
     * 事件捕获回调列表
     */
    funcList = Array<(...args: T) => any>();

    constructor(public rootEvent: (...args: T) => any) {

    }

    /**
     * 捕获事件
     * @param clas 
     * @param func 
     */
    onEvent(clas: Component<any, any> | null, func: (...args: T) => any) {
        if (clas) {
            let ext = ComponentExt.get(clas);
            this.funcList.push(func);
            ext.willUnmountList.push(() => {
                this.removeFunc(func);
            })
        } else {
            EventHook(this, func);
        }

    }




    removeFunc(func: (...args: T) => any) {
        for (let i = this.funcList.length - 1; i >= 0; i--) {
            if (this.funcList[i] === func) {
                if (i === this.funcList.length - 1)
                    this.funcList.pop();
                else
                    this.funcList.splice(i, 1);
                break;
            }
        }
    }

    /**
     * 触发事件
     * @param args 
     */
    doEvent(...args: T) {
        this.rootEvent(...args);
        for (let i = 0; i < this.funcList.length; i++) {
            this.funcList[i](...args);
        }
    }

}