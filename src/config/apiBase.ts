import { lib, MsgError } from "@common/lib/lib";
import { TypeJson } from "@common/lib/TypeJson";
import Config from "react-native-config";
import { FilterJhipster } from "../model/JHipsterFilter";
import { UpFileBean } from "../model/UpFileBean";
import { HttpCookie } from "../rn-common/lib/HttpCookie";
import { HttpReq } from "../rn-common/lib/HttpReq";
import { cfg } from "./cfg";
import { url } from "./url";
import { app } from "../rn-common/lib/app";
import { Weather } from "@src/model/home/Weather";
export class ApiRequestBase {
    // static urlMain = baseUrl.main;
    static cookie = new HttpCookie();

    /**
    * 上传文件
    * @param obj 
    * @returns 
    */
    uploadFile(obj: {
        file: File | string,
    }) {
        let http = this.request(`${url.singlefile}`, UpFileBean)
            .addFile("file", obj.file)
            .showProgress(true, "上传中...")

        http.onSendProg = (e) => {
            if (e.total > 0)
                app.loadProgRef?.setText("上传中:" + (e.loaded * 99 / e.total).toFixed(1) + "%");
        }

        return http;
    }

    //城市天气
    cityWeather() {
        // let http = this.request('http://www.weather.com.cn/data/cityinfo/101280601.html', '').useGET
        let http = this.request('http://api.k780.com', Weather).setPara({
            app: 'weather.today',
            cityNm: '深圳', appkey: 10003,
            sign: 'b59bc3ef6191eb9f747dd4e83c99f2a4',
            format: 'json',
        }).useGET
        return http;
    }

    //城市质量
    cityPm() {
        let http = this.request('http://api.k780.com', Weather).setPara({
            app: 'weather.pm25',
            cityNm: '深圳', appkey: 10003,
            sign: 'b59bc3ef6191eb9f747dd4e83c99f2a4',
            format: 'json',
        }).useGET
        return http;
    }

    getWebHost(urlPath: string) {

        return Config.HOST_URL
    }


    getUrl(urlPath: string) {
        if (app.isWeb) {
            // if (process.env.NODE_ENV != "development") {
            //     return this.getWebHost(urlPath) + urlPath
            // }

            return urlPath
        }

        if (urlPath.startsWith('http://') || urlPath.startsWith('https://')) {
            return urlPath
        }
        return this.getWebHost(urlPath) + urlPath
    }

    static hasError = [false]

    /**
    * 创建http链接
    * @param urlPath 
    * @param checkResult 是否需要分析结果
    */
    request<T>(urlPath: string, retType: T | { new(): T; }, checkResult: boolean = true): HttpReq<T> {
        let http = new HttpReq<T>(this.getUrl(urlPath), retType);

        http.setSendJSON

        // if (Platform.OS === "android") {
        //     let ck = ApiRequestBase.cookie.getCookisStr(this.newProxyServer(urlPath));
        //     if (ck) {
        //         http.setHeader("cookie", ck);
        //     }
        // }


        http.onPreSend = async () => {
            if (urlPath.startsWith('http://') || urlPath.startsWith('https://')) {
                //排除不是outh2验证系统（自定义）
            } else
                if (cfg.user.dat.token) {
                    http.setHeader("Authorization", "Bearer " + cfg.user.dat.token)
                } else {
                    http.setHeader("Authorization", "Basic " + 'Y2xpZW50OjEyMzQ1Ng==')
                }

            //处理JHipster filter参数
            FilterJhipster.parseParas(http.$paraObj)
        }

        http.onSuccess = res => {

            if (typeof http.$resultType === "string") {
                return res as unknown as T;
            }
            else if (typeof http.$resultType === "boolean") {
                return (res == "true") as unknown as T;
            }
            else if (typeof http.$resultType === "number") {
                return parseFloat(res) as unknown as T;
            }

            /**
             * 解析返回结果,将错误码转换为异常抛出
             */
            let obj = {} as any
            if (res) {
                obj = JSON.parse(res)
                if (obj.code && checkResult) {
                    if (obj.code != '0') {
                        if (obj.code == 'A0231') {
                            if (!ApiRequestBase.hasError[0]) {
                                cfg.user.dat.token = ''
                                cfg.user.save
                                cfg.toLogin();
                                http.$err.message = "token禁用";
                                http.$err.errorInfo = http.$url + "\r\n" + res
                                http.$err.showAble = http.$showFailedMsg
                                ApiRequestBase.hasError[0] = true
                                lib.sleep(1000).then(() => {
                                    ApiRequestBase.hasError[0] = false
                                })
                                throw http.$err;
                            }
                        } else {
                            http.$err.message = obj.msg ? obj.msg + '' : ''
                            http.$err.errorInfo = http.$url + "\r\n" + res
                            http.$err.showAble = http.$showFailedMsg
                            throw http.$err
                        }
                    }
                    obj = obj.data
                }
            }

            let resp = TypeJson.objCheck(obj, http.$resultType as { new(): T; }, null)
            return resp as T
        }


        http.onParseResult = (res: XMLHttpRequest) => {
            if (res.status == 401) {
                if (cfg.user.dat.isLogin()) {
                    if (!ApiRequestBase.hasError[0]) {
                        ApiRequestBase.hasError[0] = true
                        cfg.user.dat.token = ''
                        cfg.user.save
                        cfg.toLogin();
                        http.$err.code = res.status;
                        http.$err.message = "登录已过期";
                        http.$err.errorInfo = http.$url + " " + res.statusText + "\r\n";
                        http.$err.showAble = http.$showFailedMsg;
                        lib.sleep(1000).then(() => {
                            ApiRequestBase.hasError[0] = false
                        })
                        throw http.$err;
                    }
                }
            }
            if (res.status >= 200 && res.status < 300) {
                try {
                    return http.onSuccess(res.responseText);
                } catch (error) {
                    if (error instanceof MsgError) {
                        throw error;
                    } else {
                        http.$err.message = "网络数据异常";
                        http.$err.errorInfo = http.$url + " " + res.statusText + "\r\n" + error
                        http.$err.showAble = http.$showFailedMsg;
                        throw http.$err;
                    }
                }
            }
            else if (res.status === 0) {
                http.$err.message = "网络异常:0";
                http.$err.errorInfo = http.$url + " statue:0 " + res.statusText + "\r\n"
                http.$err.showAble = http.$showFailedMsg;
                throw http.$err;
            }

            http.$err.message = "网络异常:" + res.status;
            http.$err.errorInfo = http.$url + " statue:" + res.status + " " + res.statusText + "\r\n"
            http.$err.showAble = http.$showFailedMsg;
            throw http.$err;
        }

        return http;
    }



}


export const apiBase = new ApiRequestBase();