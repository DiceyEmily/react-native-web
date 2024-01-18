import { NativeModules } from "react-native";
import { cfg } from "../../config/cfg";
import { app } from "./app";
import { IFilter, IFilterCallback, IIntent } from "./NativeType";
import Orientation from "./Orientation";


const NativeMod: any = NativeModules?.NativeMod ?? {};

/**
 * 所有原生函数
 */
export class native {

    //ios热更新
    static loadPic(name: string) {
        if (NativeMod.loadPic)
            NativeMod.loadPic(name)
    }

    static async isInstalledWeChat() {
        if (NativeMod.isInstallWeChat)
            return NativeMod.isInstallWeChat() as boolean
        return false
    }

    static async isInstalledQQ() {
        if (NativeMod.isInstalledQQ)
            return NativeMod.isInstalledQQ() as boolean
        return false
    }

    /**
     * wps 异或算法文件加密
     * @param from 待加密文件
     * @param to 结果文件
     * @returns 
     */
    static encryptFile(from: String, to: String): Promise<boolean> {
        return NativeMod.encryptFile?.(from, to)
    }


    /**
     * wps 异或算法文件解密
     * @param from 
     * @param to 
     * @returns 
     */
    static decryptFile(from: String, to: String): Promise<boolean> {
        return NativeMod.decryptFile?.(from, to)
    }


    /**
     * 创建通知栏进度(返回通知id)
     */
    static createProg(title: string, msg: string, extString: string): Promise<number> {
        if (NativeMod.createProg)
            return NativeMod.createProg(title, msg, extString)
        return 0 as any
    }


    /**
     * 更新进度通知 
     * @param id  通知id
     * @param title 
     * @param msg 
     * @param prog 进度(0-100)
     */
    static setProg(id: number, title: string, msg: string, prog: number) {
        if (NativeMod.setProg)
            NativeMod.setProg(id, title, msg, prog);
    }



    /**
     * 取消进度通知
     * @param id 通知id
     */
    static cancelProg(id: number) {
        if (NativeMod.cancelProg)
            NativeMod.cancelProg(id);
    }

    /**
    * 所有原生回调函数 (例如下载进度)
    */
    private static eventFuncMap = new Map<number, (...p: any) => any>();
    private static eventID = 0;

    static addEventFunc(func: (...p: any) => any) {
        let id = native.eventID++;
        native.eventFuncMap.set(id, func);
        return id;
    }

    static runEventFunc(arr: Array<any>) {
        if (arr.length === 0)
            return;
        let func = native.eventFuncMap.get(arr[0]);
        if (func) {
            if (arr.length === 1) {
                func();
            }
            else if (arr.length === 2) {
                func(arr[1]);
            }
            else if (arr.length === 3) {
                func(arr[1], arr[2]);
            }
            else if (arr.length === 4) {
                func(arr[1], arr[2], arr[3]);
            }
            else if (arr.length === 5) {
                func(arr[1], arr[2], arr[3], arr[4]);
            }
        }
    }

    static removeEventFunc(id: number) {
        native.eventFuncMap.delete(id);
    }

    /**
     * 下载文件
     * @param url url
     * @param temp 是否开启断点续传
     * @param file 保存文件
     * @param progess 下载进度
     */
    static async downloadFile(url: string, temp: boolean
        , file: string
        , progess: (jobID: number, transferSize: number, fileSize: number) => void
    ) {


        if (NativeMod.downloadFile) {
            let id = native.addEventFunc(progess);
            return NativeMod.downloadFile(url, temp, file, id).finally(() => native.removeEventFunc(id));
        }

        // let res = RNFS.downloadFile({
        //     fromUrl: url,
        //     toFile: file,
        //     background: true,
        //     progressDivider: 0.5,
        //     progress: (res) => progess(res.jobId, res.bytesWritten, res.contentLength)
        // })
        // return res.promise;
    }

    /**
    *取消下载
    */
    static stopDownload(jobID: number) {
        if (NativeMod.stopDownload)
            NativeMod.stopDownload(jobID);
        // else
        //     RNFS.stopDownload(jobID)
    }

    static openImages(urls: Array<string>, index: number) {
        if (NativeMod.openImages) {
            NativeMod.openImages(urls, index);
        }
    }

    /**
     * 指纹识别
     * @returns 
     */
    static startBiometric() {
        if (NativeMod.startBiometric) {
            return NativeMod.startBiometric();
        }
        return
    }

    static openFile(filter: string, mediaType?: Array<string>): Promise<string> {
        if (NativeMod.openFile) {
            return NativeMod.openFile(filter, mediaType);
        }
        return undefined as any
    }

    static startActivity(paras: IIntent) {
        if (NativeMod.startActivity) {
            return NativeMod.startActivity(paras);
        }
        return "" as any
    }

    /**
     * 判断是否存在指定app
     * @param app 
     * @returns 
     */
    static hasApp(app: string): Promise<boolean> {

        if (NativeMod.hasApp) {
            return NativeMod.hasApp(app);
        }
        return new Promise(reso => reso(false))
    }


    /**
     * 注册广播监听, 返回广播id
     * @param fileter 
     * @param callback 
     */
    static registerReceiver(fileter: IFilter, callback: (res: IFilterCallback) => void): Promise<number> {
        if (NativeMod.registerReceiver) {

            let id = this.addEventFunc(callback)

            return NativeMod.registerReceiver(fileter, id);
        }

        return new Promise(reso => reso(0))
    }

    /**
     * 销毁广播
     * @param id 广播id
     * @returns 
     */
    static unregisterReceiver(id: number): Promise<boolean> {
        if (NativeMod.unregisterReceiver) {
            this.removeEventFunc(id);
            return NativeMod.unregisterReceiver(id);
        }

        return new Promise(reso => reso(false))
    }

    /**
     * 微信登陆,成功返回code
     */
    static weChatLogin(): Promise<string> {
        if (NativeMod.weChatLogin) {
            return NativeMod.weChatLogin();
        }

        return "" as any
    }


    private static appVersion = ""
    /**
     * 获取app版本号名称
     */
    static getAppVersion(): string {
        if (app.isWeb) return cfg.env.appVersion
        if (NativeMod.getAppVersion) {
            if (this.appVersion == "")
                this.appVersion = NativeMod.getAppVersion()
        }
        return this.appVersion
    }

    private static appVersionCode = 0
    /**
     * 获取app版本号
     */
    static getAppVersionCode(): number {
        if (app.isWeb) return 0
        //app信息
        if (NativeMod.getAppInfo) {
            if (this.appVersionCode == 0)
                this.appVersionCode = JSON.parse(NativeMod.getAppInfo()).versionCode
            // console.log(NativeMod.getAppInfo())
        }
        return this.appVersionCode
    }

    /**
     * 
     * @param obj 微信支付
     */
    static wePay(obj: object): Promise<string> {
        if (NativeMod.wePay)
            return NativeMod.wePay(obj);
        return "" as any
    }


    /**
     * 微信分享
     * @param content 内容
     * @param type 0好友,1朋友圈
     */
    static weShare(content: string, type: number) {
        if (NativeMod.weShare)
            return NativeMod.weShare(content, type);
    }

    static getPackagename() {
        if (NativeMod.getPackagename) {
            return NativeMod.getPackagename();
        }
        return ""
    }

    /**
     * 微信分享至小程序
     * @param url 
     * @param miniType  正式版:0，测试版:1，体验版:2
     * @param miniId  小程序原始id
     * @param miniPath  小程序页面路径
     * @param title 小程序消息title
     * @param text 
     * @param judge 类型选择 好友- 0 WECHAT_FRIEND 朋友圈- 1 WECHAT_MOMENT
     */
    static WxMiniShare(url: string, miniType: number, miniId: string, miniPath: string, title: string, text: string, judge: number) {
        if (NativeMod.WxMiniShare)
            return NativeMod.WxMiniShare(url, miniType, miniId, miniPath, title, text, judge);
    }


    /**
    * qq分享
    */
    static qqShare(title: string, summary: string, url: string) {
        if (NativeMod.qqShare)
            return NativeMod.qqShare(title, summary, url);
    }

    /**
   * qq空间分享
   */
    static qqZoneShare(title: string, summary: string, url: string, img: string) {
        if (NativeMod.qqZoneShare)
            return NativeMod.qqZoneShare(title, summary, url, img);
    }

    /**
     * 汉字转拼音
     * @param arr 汉字数组
     * @param separator 分隔符
     */
    static toPinyin(arr: string[], separator: string): string[] {
        if (NativeMod.toPinyin)
            return NativeMod.toPinyin(arr, separator);
        return [];
    }

    /**
     * 支付宝
     * @param order 
     */
    static aliPay(order: string) {
        if (NativeMod.aliPay)
            return NativeMod.aliPay(order);
    }

    static fullScreen() {
        if (NativeMod.fullScreen)
            NativeMod.fullScreen();
    }
    static cancelFullScreen() {
        if (NativeMod.cancelFullScreen)
            NativeMod.cancelFullScreen();
    }


    //通知栏消息
    static showNotify(title: string, msg: string, sound: number = 0, extString: string = "") {
        if (NativeMod.showNotify) {
            NativeMod.showNotify(title, msg, sound, extString);
        }
    }

    /**
     * 禁止自动锁屏
     */
    static wakeLock() {
        if (NativeMod.wakeLock)
            NativeMod.wakeLock();
    }

    /**
     * 允许自动锁屏
     */
    static wakeRelease() {
        if (NativeMod.wakeRelease)
            NativeMod.wakeRelease();
    }


    /**
     * 切换到竖屏
     */
    static orientationPortrait() {

        if (NativeMod.orientationPortrait)
            NativeMod.orientationPortrait();
        else {
            Orientation.lockToPortrait();
        }
    }

    /**
     * 切换到横屏
     */
    static orientationLandscape() {
        if (NativeMod.orientationLandscape)
            NativeMod.orientationLandscape();
        else {
            Orientation.lockToLandscape();
        }
    }



    /**
     * 取消切换,设为系统默认
     */
    static orientationUnspecified() {
        if (NativeMod.orientationLandscape)
            NativeMod.orientationUnspecified();
        else {
            Orientation.unlockAllOrientations();
        }
    }

    /**
     * 获取设备Id
     * @returns {Promise<string>}
     */
    static deviceID(): Promise<string> {
        if (NativeMod.deviceID)
            return NativeMod.deviceID()
        return "" as any;
    }

    //获取缓存大小(字节)
    static getCacheSize(): Promise<number> {
        if (NativeMod.getCacheSize)
            return NativeMod.getCacheSize()
        return 0 as any;
    }

    /**
     * 清除缓存
     */
    static clearCache() {
        if (NativeMod.clearCache)
            NativeMod.clearCache()
    }

    /**
     * 写日志
     * @param text 内容
     * @param file 文件名
     */
    static writeLog(text: string, file: string) {
        if (NativeMod.writeLog)
            NativeMod.writeLog(text, file);
    }

    //关闭app
    static exitApp() {
        if (NativeMod.exitApp) {
            NativeMod.exitApp();
        }
        else if (window.history) {
            window.history.go(-9999)
            window.location.reload();
        }
        else
            app.pop()
    }

    /**
     * pc扫码登录
     * @param return 结果成功或失败
     */
    static startQRScanLogin(): Promise<string | boolean> {
        if (NativeMod.rnStartQRScanLogin)
            return NativeMod.rnStartQRScanLogin()
        return "" as any
    }

    /**
     * 扫码
     * @param return 结果成功或失败
     */
    static rnQrActivity(): Promise<string | boolean> {
        if (NativeMod.qrActivity)
            return NativeMod.qrActivity()
        return "" as any
    }


}