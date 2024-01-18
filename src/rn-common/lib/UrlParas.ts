import { Platform } from "react-native";
import { Router, StatePara } from "./Router";

/**
 * 用于修改属性Url参数
 */
export class UrlParas<T, U extends keyof T> {

    /**
     * 
     * @param prop 组件属性
     * @param name 属性名
     * @param val 初始值
     * @returns 
     */
    constructor(public prop: T, public name: U, public val: Required<T>[U]) {

        if (Platform.OS !== "web") {
            return;
        }


        let para = prop?.[name] as any;

        if (para != null) {

            if (typeof val === "number") {
                this.val = parseFloat(para) as any;
            }
            else if (typeof val === "string") {
                this.val = para + "" as any;
            }
            else if (typeof val === "boolean") {
                this.val = (para == "true") as any;
            }
            else {
                if (typeof val === typeof para) {
                    this.val = para
                }
            }
        }

    }

    /**
     * 设置url参数
     * @param v url参数
     * @param replaceState 是否修改url
     * @returns 
     */
    setVal(v: Required<T>[U], replaceState = true) {
        this.val = v;

        if (Platform.OS !== "web" || !replaceState) {
            return;
        }

        let paras = Router.getUrlPara();

        if (!paras) {
            paras = {
                para: {}
            }
        }

        paras.para[this.name] = this.val



        window.history.replaceState({
            page: Router.currentPage,
        } as StatePara, "", Router.setUrlPara(paras));
    }

}