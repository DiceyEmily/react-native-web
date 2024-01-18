
// type ComponentPara<T> = T extends () => (((para: infer ParaT) => JSX.Element)) ? ParaT : (T extends () => Promise<((para: infer ParaT2) => JSX.Element)> ? ParaT2 : never)

import { Component } from "react";
import { lib } from "./lib";

// type RouterType<ParaT> = { [key: string]: RouteItem }


export interface ScreenPara {
    screen?: string,
    /**
     * 不能为空
     */
    para: any,
}

export interface StatePara {
    //paras: any;
    page: number;
}

/**
 * 界面组件类型(函数或class类型)
 */
export type TypeCompnent<ParasT> = ((para: ParasT) => any) | { new(...p: any[]): Component<ParasT>; }

/**
 * 获组件属性类型
 */
export type GetCompnentProp<CompnentT> = CompnentT extends (((para: infer Para) => any) | { new(...p: any[]): Component<infer Para>; }) ? Para : never

type componentPara<T, Key extends keyof T> = T[Key] extends {
    component: () => (Promise<TypeCompnent<infer ParasT>> | TypeCompnent<infer ParasT>)
} ? ParasT : never;


export interface RouterInfo<T> {
    name: T;

    paras: any;

    default?: boolean;
}

/**
 * 储存所有<组件,路由名>
 */
export const routerNameMap = new Map<any, string>();
export class Router<T extends { [key: string]: RouteItem<any> }, PreRouteT> {

    // static currentRoute?: RouteItem<any>;

    public static readonly screenParaName = "screen"
    public static readonly routerParaName = "?screen="

    //RouterView会自动获取url参数
    static readonly routerViewName = "RouterView";


    /**
     * 使用简化路由url
     */
    static get useSimpleUrl() {
        Router.getUrlPara = () => {
            let res = lib.getUrlParas();
            if (res == null) {
                return undefined;
            }
            let ret: ScreenPara = {
                screen: res["s_"],
                para: {},
            }

            for (let k in res) {
                if (k == "s_")
                    continue;
                try {
                    ret.para[k] = JSON.parse(res[k])
                } catch (err) {
                    console.log(k + "=" + res[k], err)
                }
            }
            return ret;
        }

        Router.setUrlPara = (paras: ScreenPara, extraUrl?: string) => {
            let url = ""

            if (paras.screen) {
                url += "?s_=" + paras.screen;
            }


            for (let k in paras.para) {
                if (paras.para[k] === undefined) {
                    continue;
                }
                let v = JSON.stringify(paras.para[k]);
                if (v === undefined) {
                    continue;
                }
                url += url.length > 0 ? "&" : "?"
                url += k + "=" + encodeURIComponent(v);
            }

            return url;
        }
        return
    }

    /**
     * 解析路由参数
     * @returns 
     */
    static getUrlPara = (): ScreenPara | undefined => {
        let res = lib.getUrlParas() as ScreenPara | undefined;
        if (res == null) {
            return undefined;
        }

        if (res.para) {
            try {
                res.para = JSON.parse(res.para);
                if (typeof res.para !== "object") {
                    res.para = {}
                }
            } catch (err) {
                res.para = {}
                console.error(res, err);
            }
        } else {
            res.para = {}
        }
        return res;
    }

    /**
     * 设置路由参数
     * @param paras 
     * @returns 
     */
    static setUrlPara = (paras: ScreenPara, extraUrl?: string): string => {

        let url = ""
        if (paras.screen) {
            url += Router.routerParaName + paras.screen;
        }

        if (paras.para) {

            let para = JSON.stringify(paras.para);
            if (paras && para !== "{}") {
                url += url.length > 0 ? "&" : "?"
                url += "para=" + encodeURIComponent(para);
            }
        }

        if (extraUrl) {
            url += extraUrl
        }

        return url
    }

    static getRouteName(comp: any): string {
        if (typeof comp === "string") {
            return comp;
        }
        return routerNameMap.get(comp) ?? comp.name
    }

    /**
     * 默认界面名
     */
    defaultName = "";

    /**
     * 默认路由
     */
    defaut?: RouteItem<any>;


    /**
     * 用于web导航记录当前页
     */
    public static currentPage = 0;


    constructor(public preRoute: (route: RouterInfo<keyof T>) => [TypeCompnent<PreRouteT>, PreRouteT] | void | null, public maps: Record<string, RouteItem<any>>) {

        for (let k in maps) {
            let res = maps[k];
            let comp = res.component();


            //异步路由,延迟加载
            if (comp instanceof Promise) {
                // let promiseFunc = comp;
                // setTimeout(() => {
                //     promiseFunc.then(res => {
                //         routerNameMap.set(res, k);
                //     })
                // }, 600)

            }
            else if (typeof comp == "function") {
                routerNameMap.set(comp, k);
            }
            if (res.default) {
                this.defaultName = k;
                this.defaut = res;
            }
        }
    }

    push<Key extends keyof T>(name: Key, para: componentPara<T, Key>) {

    }

    pop() {

    }

    replace<Key extends keyof T>(name: Key, para: componentPara<T, Key>) {

    }
}


export interface RouteItem<P> {
    component: () => any;

    /**
     * 路由参数
     */
    paras?: () => P;
    /**
     * 是否为默认界面
     */
    default?: boolean;

    title?: string;

    /**
     * 禁用前置路由拦截
     */
    disableIntercept?: boolean;
}

type RouteMap = { [key: string]: RouteItem<any> }



/**
 * 创建路由
 * @param preRoute 路由拦截器
 * @param obj 路由
 * @returns 
 */
export function createRoute<T extends RouteMap, PreRouteT>(preRoute: (route: RouterInfo<keyof T>) => [TypeCompnent<PreRouteT>, PreRouteT] | void | null, obj: T | RouteMap): Router<T, PreRouteT> {
    return new Router<T, PreRouteT>(preRoute, obj as T);
}


export let globalRouters: Router<any, any> | null = null;



/**
 * 设置全局路由
 */
export function setRouters<T extends RouteMap, PreRouteT>(route: Router<T, PreRouteT>) {
    globalRouters = route;
}

