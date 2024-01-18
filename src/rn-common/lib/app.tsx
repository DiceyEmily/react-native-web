import AsyncStorage from "@react-native-community/async-storage";
import { StackActions } from "@react-navigation/native";
import { fromByteArray, toByteArray } from "base64-js";
import React, { ReactElement } from "react";
import { LayoutRectangle, StyleProp, TextStyle } from "react-native";
import { Alert, BackHandler, Dimensions, Keyboard, Platform, StatusBar } from "react-native";
import Toast from "react-native-toast-notifications";
import { ToastOptions } from "react-native-toast-notifications/lib/typescript/toast";
import { colors } from "../components/colors";
import { PhotoViewer } from "../components/PhotoViewer";
import { WaterMarkState } from "../components/WaterMark";
import { GroupView } from "./components/custom/GroupView";
import { LoadProg } from "./components/custom/LoadProg";
import { Icon } from "./components/icon/Icon";
import { lib, MsgError } from "./lib";
import { native } from "./native";
import { NavigationCfg, navigationRef, RouterViewPara } from "./navigation";
import { PushWithBack } from "./PushWithBack";
import { GetCompnentProp, Router, StatePara, TypeCompnent } from "./Router";
import { utf8decode, utf8encode } from "./utf8";

interface StateOption {
    //额外的url参数
    extraUrl?: string
}


type ValToNum<T> = {
    [P in keyof T]: number;
};

Keyboard.addListener("keyboardDidShow", () => {
    app.keyboardDidshow = true;

})
Keyboard.addListener("keyboardDidHide", () => {
    app.keyboardDidshow = false;
})
export class app {

    private static waterText_?: string;

    public static globalWaterMark?: WaterMarkState;


    /**
     * layout变动事件
     */
    public static onLayoutChange = Array<(lay: LayoutRectangle) => any>();

    /**
     * 添加全局水印文本
     */
    static get waterText() {
        return app.waterText_
    }

    static set waterText(text: string | undefined) {
        if (app.waterText_ === text) {
            return;
        }
        app.waterText_ = text;
        if (!app.globalWaterMark) {
            setTimeout(() => {
                app.globalWaterMark?.setText(text);
            }, 0)
        } else {
            app.globalWaterMark?.setText(text);
        }

    }

    static getEnv(): string {
        if (process.env.ENVFILE) {
            return process.env.ENVFILE
        }
        return ""
    }
    static keyboardDidshow = false;

    /**
     * 获取app状态栏高度
     */
    static get statusBarHeight() {
        return StatusBar.currentHeight ?? 0
    }

    /**
     * 判断是否为ios包括web端
     * @returns 
     */
    static isIos() {
        if (Platform.OS == "ios") {
            return true;
        }
        if (Platform.OS == "web") {
            let ua = navigator.userAgent.toLowerCase()
            return ua.indexOf('iphone') >= 0 || ua.indexOf('mac os') >= 0 || ua.indexOf('ipad') >= 0
        }

        return false;
    }


    static base64encode(str: string) {
        return fromByteArray(utf8encode(str) as any);
    }

    static base64decode(str: string) {
        return utf8decode(toByteArray(str) as any);
    }


    /**
     * 根groupView
     */
    static rootGroup: GroupView | null = null;


    /**
     *每页条目数
     */
    static pageNum = 10;


    /**
     * 打开界面（入栈）：
     * @param view 界面函数组件
     * @param paras 参数，无参传{}
     */
    static push<P extends TypeCompnent<any>>(view: P, paras: GetCompnentProp<P>, options: StateOption = {}) {
        Router.currentPage++;

        let routeName = Router.getRouteName(view)
        // let router = globalRouters?.maps[routeName]
        // Router.currentRoute = router;
        if (app.isWeb && window.history.pushState) {
            window.history.pushState(
                {
                    view: routeName,
                    //paras: paras,
                    page: Router.currentPage,
                } as StatePara,
                routeName,
                Router.setUrlPara({
                    screen: routeName,
                    para: paras,
                }, options.extraUrl),
            );
        }

        navigationRef.current?.dispatch(
            StackActions.push(Router.routerViewName, { view: view, paras: paras } as RouterViewPara)
        );

        if (process.env.NODE_ENV == "development") {
            console.log("当前screen: " + routeName)
        }
    }





    public static popToTop() {
        app.rootGroup?.removeAll();
        Router.currentPage = 0;
        if (navigationRef.current?.canGoBack()) {
            navigationRef.current?.dispatch(StackActions.popToTop());
        }
    }

    private static popScreen() {
        app.rootGroup?.removeAll();
        Router.currentPage--;
        if (Router.currentPage <= 0) {
            Router.currentPage = 0;
        }

        if (navigationRef.current?.canGoBack()) {

            navigationRef.current?.dispatch(StackActions.pop());

        } else {
            if (app.isWeb) {
                navigationRef.current?.dispatch(
                    StackActions.replace(Router.routerViewName)
                );
            }

        }

    }

    /**
     * 替换当前界面 (替换栈顶)：
     * @param view 界面函数组件
     * @param paras 参数，无参传{}
     */
    static replace<P extends TypeCompnent<any>>(view: P, paras: GetCompnentProp<P>, options: StateOption = {}) {

        let routeName = Router.getRouteName(view)
        // let router = globalRouters?.maps[routeName]
        // Router.currentRoute = router;

        if (app.isWeb && window.history.replaceState) {
            window.history.replaceState(
                {
                    view: routeName,
                    //paras: paras,
                    page: Router.currentPage,
                } as StatePara,
                routeName,
                Router.setUrlPara({
                    screen: routeName,
                    para: paras,
                }, options.extraUrl),
            );
        }

        navigationRef.current?.dispatch(
            StackActions.replace(Router.routerViewName, { view: view, paras: paras } as RouterViewPara)
        );

        if (process.env.NODE_ENV == "development") {
            console.log("当前screen: " + view.name)
        }
    }

    private static popResole?: (v: any) => void;

    /**
     * 关闭当前界面（出栈）：
     * 异步函数,可以使用await app.pop() 等待其结束
     */
    static pop() {

        if (app.isWeb) {
            window.history.back()
            return new Promise((reso) => {
                this.popResole = reso;
            })
        } else {
            app.popScreen();
        }

        return undefined

    }



    /**
     * 初始化web端onpopstate
     */
    static initPopState() {
        if (app.isWeb && window?.history?.pushState as any) {
            let stOld = window.history.state as StatePara | null
            if (stOld != null && stOld.page != null) {
                Router.currentPage = stOld.page;
            }

            window.addEventListener("popstate", (event: PopStateEvent) => {
                let st = event.state as StatePara | null

                if ((st == null || st.page == Router.currentPage) && PushWithBack.idStack.length > 0) {
                    PushWithBack.clearId(PushWithBack.idStack[PushWithBack.idStack.length - 1], false)
                }

                if (st == null) {
                    if (Router.currentPage == 0) {
                        return;
                    }
                    NavigationCfg.title = "";
                    app.popScreen();

                    if (this.popResole) {
                        this.popResole(undefined)
                        this.popResole = undefined;
                    }
                    return;
                }

                if (st.page == Router.currentPage) {
                    //仍在当前页
                    return;
                }

                if (typeof st !== "object") {
                    if (this.popResole) {
                        this.popResole(undefined)
                        this.popResole = undefined;
                    }
                    return;
                }

                // let router = globalRouters?.maps[st.view];


                if (st.page < Router.currentPage || st.page == null) {//后退
                    app.popScreen();
                    // window.history.replaceState(st, st.view, app.routerParaName + st.view);
                } else {//前进
                    Router.currentPage = st.page;

                    navigationRef.current?.dispatch(
                        //routerView 会自动获取url参数
                        StackActions.push(Router.routerViewName)
                    );
                }
                if (this.popResole) {
                    this.popResole(undefined)
                    this.popResole = undefined;
                }
            })
        }
    }

    /**
     * 获取系统版本(android sdk)
     */
    static readonly version = parseInt(Platform.Version as string);

    static get isWeb() {
        return Platform.OS === 'web'
    }


    /**
     * 显示图片浏览器
     * @param imgs 
     * @param index 
     */
    static showPhotoViewer(imgs: Array<string>, index = 0) {
        if (app.isWeb) {
            let p = <PhotoViewer imgs={imgs} index={index} onClose={() => app.rootGroup?.removeView(p)} />
            app.rootGroup?.addView(p);
        } else {
            native.openImages(imgs, index);
        }

    }

    static isWechat() {
        if (!this.isWeb) {
            return false
        }
        //micromessenger微信标识，wxwork企业微信标识，
        let ua = navigator.userAgent.toLowerCase()
        return ua.indexOf('micromessenger') !== -1 || ua.indexOf('wxwork') !== -1
    }

    //是否粤政易
    static isYueZhengYi() {
        if (!this.isWeb) {
            return false
        }
        let ua = navigator.userAgent.toLowerCase()
        return ua.indexOf('zwwx-customized') !== -1
    }


    //是否政务微信
    static isZhengWuWeiXin() {
        if (!this.isWeb) {
            return false
        }
        let ua = navigator.userAgent.toLowerCase()
        return ua.indexOf('zwwx') !== -1
    }



    static get isAndroid() {
        return Platform.OS === 'android'
    }

    /**
     * 全局toast
     */
    static toast: Toast | null = null;


    /**
    * 弹出toast消息
    * @param str 消息内容
    * @param toastOptions toast额外项
    */
    static msg(str: string, toastOptions?: ToastOptions | undefined) {
        return app.toast?.show(str, {
            type: "normal",
            // placement: app.keyboardDidshow ? "top" : "bottom",
            duration: 2000,
            ...toastOptions
        });
    }


    /**
     * 分离属性,将props中的属性分离到[0],其他分离至[1]
     * @param style 
     * @param props 
     * @returns 
     */
    static splitStyle(style: StyleProp<TextStyle>, props: ValToNum<TextStyle>): [TextStyle, TextStyle] {
        let ret: [TextStyle, TextStyle] = [{}, {}];
        app.recureStyle(style, props, ret);
        return ret;
    }

    static textProps: ValToNum<TextStyle> = {
        "fontSize": 1,
        "color": 1,
        "fontWeight": 1,
        "fontFamily": 1,
        "fontVariant": 1,
        "fontStyle": 1,
        "textAlign": 1,
        "textDecorationLine": 1,
        "textDecorationColor": 1,
        "textDecorationStyle": 1,
        "textShadowColor": 1,
        "textShadowOffset": 1,
        "textShadowRadius": 1,
        "textTransform": 1,
    }

    private static recureStyle(style: StyleProp<TextStyle>, props: ValToNum<TextStyle>, ret: [TextStyle, TextStyle]) {

        if (!style) {
            return;
        }

        if (style instanceof Array) {
            for (let v of style) {
                this.recureStyle(v as any, props, ret);
            }
        } else if (typeof style === "object") {
            for (let v in style) {
                if ((props as any)[v]) {
                    (ret[0] as any)[v] = (style as any)[v];
                } else {
                    (ret[1] as any)[v] = (style as any)[v];
                }
            }
        }
    }

    /**
     * 弹出错误提示对话框
     * @param content 
     * @param toastOptions toast额外项
     */
    static msgErr(content: string, toastOptions?: ToastOptions | undefined) {
        return app.toast?.show(content, {
            type: "danger",
            duration: 3000,
            // placement: app.keyboardDidshow ? "top" : "bottom",
            icon: <Icon name="error" color={colors.white} size={15} />,
            ...toastOptions
        });
    }

    /**
     * 移除指定id toast
     * @param id 
     */
    static hideMsg(id: string | undefined) {
        if (id)
            app.toast?.hide(id);
    }

    static get os() {
        return Platform.OS;
    }

    /**
     * 获取原始window大小
     */
    static get window() {
        return Dimensions.get("window");
    }

    /**
     * 获取缩放后windows大小
     */
    static get windowScale() {
        let ret = { ...Dimensions.get("window") };
        ret.height /= lib.getScale();
        ret.width /= lib.getScale();
        return ret;
    }

    /**
     * 获取本地存储的：键->值
     * @param key 
     * @returns 
     */
    static getItem(key: string): Promise<string | null> {
        return AsyncStorage.getItem(key)
    }

    /**
     * 设置本地储存的键值
     * @param key 
     * @param v 
     * @returns 
     */
    static setItem(key: string, v: string): Promise<void> {
        return AsyncStorage.setItem(key, v)
    }

    /**
     * 清空本地储存的键值
     */
    static clearItems(): Promise<void> {
        return AsyncStorage.clear();
    }

    /**
    * 写入日志
    * @param log 日志内容 
    * @param file  文件名
    */
    static writeLog(log: string, file?: string) {
        if (!file || file === "")
            file = "err.log"
        if (Platform.OS === "web") {

        } else {
            native.writeLog(log, file);
        }
    }


    /**
    * 弹窗显示异常
    */
    static showError = (err?: Error | string, showMsg: boolean = true, dialog: boolean = false) => {
        if (!showMsg) {
            return;
        }
        if (!err) {
            return;
        }

        if (err instanceof MsgError && err.showAble) {
            if (dialog)
                app.msgOK(err.message)
            else
                app.msgErr(err.message)
        }
        else {
            if (dialog)
                app.msgOK((err as Error).message ?? ("" + err))
            else
                app.msgErr((err as Error).message ?? ("" + err));
        }
        return err;
    }

    /**
     * 弹窗显示异常,并加入日志
     * @param err 
     * @param title 
     * @param showMsg 
     * @param dialog 
     */
    static logError = (err?: Error | string, title: string = "Error", showMsg: boolean = true, dialog: boolean = false) => {
        app.showError(err, showMsg, dialog)

        let log = title + ":\r\n" + err + "\r\n";
        if (err instanceof MsgError) {
            log += err.errorInfo + "\r\n";
        }
        if (err instanceof Error) {
            log += "stack:" + err.stack + "\r\n";
        }
        app.writeLog(log);
    }

    /**
     * 弹出确定,取消对话框(返回是否点击了确定按钮)
     * @param content 显示内容
     * @param title  标题
     */
    static msgOK(content: string, title = "提示"): Promise<boolean> {
        if (this.isWeb) {
            return new Promise<boolean>((reso) => {
                /*eslint no-alert: 0*/
                let res = window.confirm(content);
                reso(res)
            });
        }
        return new Promise<boolean>((reso) => {
            Alert.alert(title, content, [
                {
                    text: "取消", style: "cancel", onPress: () => {
                        reso(false);
                    }
                },
                {
                    text: "确定", onPress: () => {
                        reso(true);
                    }
                },
            ],
                {
                    cancelable: false,
                }
            );
        });

    }





    /**
    * 全屏加载条
    */
    static loadProg?: ReactElement

    private static loadN = 0;

    private static backFunc = () => {
        app.loadStop()
        return true;
    }

    static hideProg() {
        app.loadN = 0;
        app.rootGroup?.removeView(app.loadProg)
    }


    /**
     * 关闭所有打开的对话框
     */
    static closeAllDialog() {
        app.rootGroup?.removeAll();
    }
    /**
     * 全局加载组件
     */
    static loadProgRef: LoadProg | null = null
    /**
     * 显示全局加载
     */
    static loadStart(msg = "加载中...") {

        if (!app.loadProg) {
            app.loadProg = <LoadProg msg={msg} ref={ref => { app.loadProgRef = ref }} key="LoadProg" onClose={() => { app.rootGroup?.removeView(app.loadProg) }} />
        }

        app.loadProgRef?.setText(msg);
        if (app.loadN <= 0) {
            BackHandler.addEventListener('hardwareBackPress', app.backFunc);
            app.rootGroup?.addView(app.loadProg)
            app.loadN++;
        }
        else {
            app.loadN++;
        }
    }

    /**
     * 关闭全局加载
     */
    static loadStop() {
        //延迟关闭, 用于合并快速连续加载
        setTimeout(() => {
            app.loadN--;
            if (app.loadN > 0)
                return;

            app.loadN = 0;
            if (app.loadProg) {
                BackHandler.removeEventListener('hardwareBackPress', app.backFunc);
                app.hideProg()
                app.loadProg = undefined;
            }
        }, 30);
    }

    /**
     * 转换为uuid
     * @param id 待转换id
     */
    static toUUID(id: string | null | undefined): string {
        if (id === null || id === undefined) {
            return "";
        }
        id = id.replace('{', '').replace('}', '');
        if (id.indexOf('-') === -1 && id.length > 20) {
            id = id.substring(0, 8) + '-' + id.substring(8, 12) + '-' + id.substring(12, 16) + '-' + id.substring(16, 20) + '-' + id.substring(20);
        }
        return id.toLowerCase();
    }

    /* 判断内容是否是段落，在每个段落前面空两个中文空格，构造中文文章段落 */
    static textDuanLuo(w: string): string {
        let nw = w.replace(/\r\n/g, '<br>')
        nw = nw.replace(/\\r\\n/g, '<br>')
        nw = nw.replace(/\\n/g, '<br>')
        nw = nw.replace(/\n/g, '<br>')
        let wArr = nw.split('<br>')
        let html = ""
        wArr.map(function (item, index) {
            if (item.trim().length !== 0) { // 如果一行全是空格，保留
                item = lib.trim1(item)
            }
            html += '\u2003\u2003'
            html += item
            if (index != wArr.length - 1) {
                html += '\n'//white-space: pre-wrap;属性换行
            }
        })
        return html
    }

    /* 判断pad或者手机,true为pad */
    static PadOrPhone(): boolean {
        return !(this.window.height < 500 || this.window.width < 500)
    }

}

Router.prototype.push = app.push as any;
Router.prototype.pop = app.pop as any;
Router.prototype.replace = app.replace as any;


app.initPopState();


//db连接成功前的任务队列
let dbTask = Array<() => void>();


function checkTask() {
    if (dbTask.length > 0) {
        let res = dbTask.shift();
        res?.();
    }
}

let db: IDBDatabase | undefined;
const ItemTable = "Items"
let oldGet = app.getItem;
let oldSet = app.setItem;

if (window?.indexedDB?.open != null) {
    app.clearItems = () => {

        return new Promise<void>(reso => {
            let task = () => {
                if (!db) {
                    reso();
                    return;
                }
                try {
                    let trans = db.transaction(ItemTable, 'readwrite');
                    let store = trans.objectStore(ItemTable);
                    let res = store.clear()
                    // console.log(key, "buffer res", res.result)
                    res.onsuccess = function () {
                        // checkTask()
                        reso()
                    }
                    res.onerror = (err) => {
                        console.error("db clear onerror:", err);
                        reso()
                    }
                } catch (err) {
                    console.error("catch db clear onerror:", err);
                    reso()
                }
            }
            if (!db) {
                dbTask.push(task);
            } else {
                task();
            }
        });

    }

    app.getItem = (key: string): Promise<string | null> => {
        return new Promise<string | null>((reso) => {

            let task = () => {
                try {
                    if (!db) {
                        reso(null)
                        return;
                    }
                    let trans = db.transaction(ItemTable, 'readonly');
                    let store = trans.objectStore(ItemTable);
                    let res = store.get(key)
                    // console.log(key, "buffer res", res.result)
                    res.onsuccess = function () {
                        // checkTask()
                        reso(res.result?.value)
                    }
                    res.onerror = (err) => {
                        console.error("on get onerror:", err);
                        console.log(key, "buffer res", res.result)
                        // checkTask()
                        reso(null)
                    }
                } catch (err) {
                    console.error("on get onerror:", err);
                    // checkTask()
                    reso(null)
                }
            }
            //|| dbTask.length > 0
            // console.log(key, " getItem", db);
            if (!db) {
                dbTask.push(task);
            } else {
                task();
            }

        })
    }

    app.setItem = (key: string, v: string): Promise<void> => {

        return new Promise<void>((reso) => {
            let task = () => {
                try {
                    if (!db) {

                        reso()
                        return;
                    }


                    let trans = db.transaction(ItemTable, "readwrite");
                    let store = trans.objectStore(ItemTable);
                    let res = store.put({
                        'key': key,
                        'value': v,
                        'time': Date.now(),
                    })

                    res.onsuccess = () => {
                        // Taro.showToast({
                        //     title: "设置成功:" + count,
                        // })
                        //checkTask()
                        reso()
                    }
                    res.onerror = (err) => {
                        console.error("on set onerror:", err);
                        // Taro.showToast({
                        //     title: "设置失败:" + err,
                        // })
                        //checkTask()
                        reso()
                    }
                } catch (err) {
                    // checkTask()
                    // Taro.showToast({
                    //     title: "设置失败:" + err,
                    // })
                    console.error("on set onerror:", err);
                    reso()
                }
            }

            if (!db) {
                dbTask.push(task);
            } else {
                task();
            }
        })
    }
}



function initDb() {
    if (window?.indexedDB?.open) {
        if (db) {
            return;
        }
        //初始化浏览器IndexDb
        let request = window.indexedDB.open("app_Item_data", 5);
        request.onsuccess = (event: any) => {
            // console.error("on open onsuccess:", dbTask);
            if (!db) {
                db = event.target.result;
            }


            dbTask.forEach(it => it());
            dbTask.length = 0;
        }
        request.onerror = (err) => {
            console.error("on open error:", err);
            dbTask.length = 0;
            app.getItem = oldGet;
            app.setItem = oldSet;
        }
        request.onupgradeneeded = function (event: any) {
            console.warn("on open onupgradeneeded:", event);
            try {
                if (!db) {
                    db = event.target.result;
                }
                try {
                    db?.deleteObjectStore(ItemTable);
                } catch (err) {

                }
                var objectStore = db?.createObjectStore(ItemTable, { keyPath: "key", autoIncrement: false });
                if (objectStore == null) {
                    return;
                }
                objectStore.transaction.oncomplete = function (event) {
                    dbTask.forEach(it => it());
                    dbTask.length = 0;
                };


                // let db = request.result;
            } catch (err) {
                console.error("on onupgradeneeded error:", err);
            }
        }

    }
}


if (window?.document) {
    require("./inobounce")

    initDb();

    //safari open db会经常不触发onsuccess，这里定时循环重试
    document.addEventListener("DOMContentLoaded", function () {
        // console.log("DOMContentLoaded")
        if (window?.indexedDB?.open != null) {
            let timer = setInterval(() => {
                if (db) {
                    clearInterval(timer);
                    return;
                }
                initDb();
            }, 150);
        }

    });

}