import { app } from "./app";
import { ResultBuffer } from "./components/ResultBuffer";
import { ExceptionCode, lib, MsgError } from "./lib";
import { TypeJson } from "./TypeJson";

export type MethodType = "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "TRACE" | "CONNECT"

/**
 * http请求
 */
export class HttpReq<T> {
    $http = new XMLHttpRequest();
    //请求耗时
    private time = 0;

    constructor(

        public $url: string,

        /**
         * 接口返回值类型
         */
        public $resultType: T | { new(): T; }
    ) {
        this.$http.timeout = 20 * 1000;
    }


    onMock?: () => Promise<T>



    objToUrl(paras: any) {
        let form = lib.objToForm(paras, this.$gbkEncode);
        if (form) {
            return "?" + form
        }
        return ""
    }

    /**
     * 设置url参数
     * @param str 
     * @returns 
     */
    setUrlPara(str: any): this {
        this.$url += this.objToUrl(str);
        return this;
    }

    /**
    * 拼接get参数
    */
    getUrlParas = () => {
        return this.$url + this.objToUrl(this.$paraObj)
    }

    setTimeOut(time: number): this {
        this.$http.timeout = time
        return this;
    }

    /**
     * 请求头信息
     */
    $header: Record<string, string> = {}

    setHeader(key: string, val: string) {
        this.$header[key] = val;
        return this;
    }

    setContentTypeJSON(): this {
        if (this.$method == "PATCH") {
            this.setHeader("Content-Type", "application/merge-patch+json; charset=UTF-8")
        } else {
            this.setHeader("Content-Type", "application/json; charset=UTF-8");
        }
        return this;
    }

    setContentTypeForm(): this {
        //web端没法设置编码，浏览器会自动改回UTF-8，所以用GBK编码这里只能传空
        this.setHeader("Content-Type", "application/x-www-form-urlencoded" + (this.$gbkEncode ? "" : "; charset=UTF-8"));
        return this;
    }



    //是否显示错误消息
    $showFailedMsg = true;

    /**
     * 错误提示是否为模态对话框
     */
    $dialogMsg = false;


    //显示加载进度条
    $loadProgress = true;

    private bufferFirst_?: boolean;


    //result优先使用缓存结果
    get bufferFirst() {
        this.bufferFirst_ = true;
        return this;
    }

    private bufferEnable = false;


    private key_ = "";

    /**
     * 获取缓存键值
     * @returns 
     */
    getBufferKey() {

        if (this.key_) {
            return this.key_
        }
        this.key_ = this.$method + "_" + this.$url + TypeJson.stringify(this.$paraObj);
        return this.key_;
    }


    private hasBuffer = false;
    /**
     * 开启接口缓存（开启后bufferFunc返回缓存数据，result返回远程数据）
     * @param func 
     */
    buffer(func: (dat: T) => any) {
        // if (process.env.NODE_ENV == "development") {
        if (this.onMock) {
            return this;
        }
        // }
        this.bufferEnable = true;


        app.getItem(this.getBufferKey())
            .then(res => {
                if (this.loadEnd) {
                    //缓存比网络慢
                    return;
                }
                if (res) {
                    this.hasBuffer = true;
                    func(this.onSuccess(res))
                } else if (this.$loadProgress && !this.loadEnd) {
                    app.loadStart(this.$progMsg);
                }

            })
        return this;
    }


    /**
     * 是否显示错误提示与进度条
     * @param enable
     * @returns {AjaxLoad}
     */
    msgProgress(enable: boolean): this {
        this.$showFailedMsg = enable;
        this.$loadProgress = enable;
        return this;
    }

    /**
     * 显示错误消息
     * @param enable 
     */
    showMsg(enable: boolean): this {
        this.$showFailedMsg = enable;
        return this;
    }

    showDialog(enable = true) {
        this.$dialogMsg = enable;
        return this;
    }

    get hideMsg(): this {
        this.$showFailedMsg = false;
        return this
    }



    $progMsg = "加载中..."
    /**
     * 显示进度条
     * @param enable 
     */
    showProgress(enable: boolean, msg?: string): this {
        this.$loadProgress = enable;
        if (msg != null)
            this.$progMsg = msg;
        return this;
    }

    /**
     * 隐藏进度条
     */
    get hideProg(): this {
        this.$loadProgress = false;
        return this;
    }

    isMutiForm() {
        return !!this.formData
    }

    /**
     * http 请求参数
     */
    $paraObj: any | null = null;


    $method: MethodType = "POST"

    /**
     * 是否使用GBK编码
     */
    $gbkEncode = false;


    static logFile = "http.log";
    static errorFile = "http.html";

    /**
    * 使用post请求
    */
    get usePOST(): this {
        this.$method = "POST";
        return this;
    }

    get usePUT(): this {
        this.$method = "PUT";
        return this;
    }

    get usePATCH(): this {
        this.$method = "PATCH";
        return this;
    }

    get useGET(): this {
        this.$method = "GET";
        return this;
    }


    get useDELETE(): this {
        this.$method = "DELETE";
        return this;
    }

    /**
     * 使用编码
     * @param gbk 
     * @returns 
     */
    useGBK(gbk = true): this {
        this.$gbkEncode = gbk;
        return this;
    }



    static parseJson(str: string, clas: any) {
        return TypeJson.parse(str, clas) as any;
        //return TypeJson.parse(str.replace(/\\\//ig, "/"), clas) as any;
    }

    $err = new MsgError("", ExceptionCode.HttpError);

    /**
     * 默认返回结果解析函数
     */
    onParseResult = (res: XMLHttpRequest) => {
        if (res.status >= 200 && res.status < 300) {
            try {
                return this.onSuccess(res.responseText);
            } catch (error) {
                if (error instanceof MsgError) {
                    throw error;
                } else {
                    this.$err.message = "网络数据异常";
                    this.$err.errorInfo = this.$url + " " + res.statusText + "\r\n" + error
                    this.$err.showAble = this.$showFailedMsg;
                    throw this.$err;
                }
            }
        }
        else if (res.status === 0) {
            this.$err.message = "网络异常:0";
            this.$err.errorInfo = this.$url + " statue:0 " + res.statusText + "\r\n"
            this.$err.showAble = this.$showFailedMsg;
            throw this.$err;
        }

        this.$err.code = res.status;
        this.$err.message = "网络异常:" + res.status;
        this.$err.errorInfo = this.$url + " statue:" + res.status + " " + res.statusText + "\r\n"
        this.$err.showAble = this.$showFailedMsg;
        throw this.$err;
    }

    /**
     * 服务器返回200状态时的结果解析回调
     * @param res 
     * @returns 
     */

    onSuccess = (res: string) => {
        if (typeof this.$resultType === "string") {
            return res as unknown as T;
        } else if (typeof this.$resultType === "boolean") {
            return (res == "true") as unknown as T;
        } else if (typeof this.$resultType === "number") {
            return parseFloat(res) as unknown as T;
        }
        let resp = HttpReq.parseJson(res, this.$resultType) as T;
        return resp as T;
    }


    /**
     * http发送前回调
     */
    onPreSend?= async () => {

    }

    /**
     * 是否将请求内容加入日志
     */
    $logPostData = true;
    /**
     * 是否将请求结果加入日志
     */
    $logResData = true;

    private logRes(res: XMLHttpRequest) {
        let len = Date.now() - this.time;
        let log = len + "ms " + res.status + (this.$method === "GET" ? " GET: " + this.getUrlParas() : this.$method + ": " + this.$url) + "\r\n";

        if (this.$logPostData)
            log += TypeJson.stringify(this.$paraObj)

        if (this.$logResData)
            log += "\r\n\r\n" + res.responseText

        app.writeLog(log
            , res.status === 500 ? HttpReq.errorFile : HttpReq.logFile);
    }





    private loadEnd = false;
    private async getResult(): Promise<T> {
        this.loadEnd = false;

        if (this.bufferFirst_) {
            let res = await app.getItem(this.getBufferKey());
            if (res) {
                this.loadData();
                return this.onSuccess(res)
            }
        }

        if (this.$loadProgress && !this.bufferEnable)
            app.loadStart(this.$progMsg);

        try {
            return await this.loadData();
        }
        finally {
            if (this.$loadProgress && !this.hasBuffer) {
                app.loadStop();
            }
            this.loadEnd = true;
        }
    }


    /**
     * 获取网络数据并缓存
     * @returns 
     */
    private async loadData() {
        this.$http.onprogress = this.onRespProg;
        this.$http.upload.onprogress = this.onSendProg;

        await this.onPreSend?.();


        this.httpSend();
        let xmlRes = await this.procXMLHttp();
        // console.log(xmlRes)
        this.logRes(xmlRes);
        let dat = this.onParseResult(xmlRes);

        if (this.bufferEnable || this.bufferFirst_) {
            app.setItem(this.getBufferKey(), this.respText);
        }
        return dat;
    }

    /**
     * 开始网络请求，并获取请求的结果,
     * @returns {Promise<T>}
     */
    get result(): Promise<T> {
        // if (process.env.NODE_ENV == "development") {
        if (this.onMock) {
            console.log("mock:", this.$url)

            return this.onMock().then(ret => {
                let fix = TypeJson.objCheck(ret, this.$resultType as any);
                return fix
            }) as any;
        }
        // }
        return this.getResult();
    }


    /**
     * 同时获取缓存与net结果
     */
    get bufResult() {
        let buf = new Promise<T>(reso => {
            this.buffer(res => {
                reso(res);
            })
        })

        return new ResultBuffer(this.result, buf)
    }


    private onHttpOpen() {
        for (let k in this.$header) {
            this.$http.setRequestHeader(k, this.$header[k]);
        }
    }


    /**
     * 根据paraObj参数构造http请求
     */
    private httpSend() {

        this.time = Date.now();

        if (this.formData) {
            this.$http.open("POST", this.$url, true);

            //this.http.setRequestHeader('content-type', 'multipart/form-data;');
            this.onHttpOpen()
            // 发送表单数据
            if (this.$paraObj) {
                for (let k in this.$paraObj) {
                    let v = this.$paraObj[k];
                    if (typeof v === "object") {
                        v = JSON.stringify(v);
                    }
                    this.addText(k, v + "");
                }
            }

            this.$http.send(this.formData);
        }
        else if (this.$method === "GET") {
            if (this.$paraObj)
                this.$http.open("GET", this.getUrlParas(), true);
            else
                this.$http.open("GET", this.$url, true);
            this.onHttpOpen()
            this.$http.send(null);
        } else if (this.$method === "DELETE") {
            if (this.$paraObj)
                this.$http.open("DELETE", this.getUrlParas(), true);
            else
                this.$http.open("DELETE", this.$url, true);
            this.onHttpOpen()
            this.$http.send(null);
        }
        // else if (this.$method === "PUT") {
        //     if (this.$paraObj)
        //         this.$http.open("PUT", this.getUrlParas(), true);
        //     else
        //         this.$http.open("PUT", this.$url, true);
        //     this.onHttpOpen()
        //     this.$http.send(null);
        // }
        else {
            this.onSendContent();
        }
    }


    private sendForm() {
        this.$http.open(this.$method, this.$url, true);
        this.setContentTypeForm();
        this.onHttpOpen()
        this.$http.send(lib.objToForm(this.$paraObj, this.$gbkEncode));
    }


    /**
     * post form格式数据
     */
    onSendContent = () => this.sendForm();


    /**
     * 设置提交内容为json格式，默认form表单
     */
    get setSendJSON(): this {
        this.onSendContent = () => {
            this.$http.open(this.$method, this.$url, true);
            this.setContentTypeJSON();
            this.onHttpOpen()
            this.$http.send(TypeJson.stringify(this.$paraObj));
        }
        return this;
    }

    /**
    * 设置提交内容为表单格式
    */
    get setSendForm(): this {
        this.onSendContent = () => this.sendForm();
        return this;
    }

    get setSendMutipart(): this {
        if (!this.formData) {
            this.formData = new FormData();
        }
        return this;
    }


    /**
     * multipart 表单
     */
    private formData: FormData | undefined;

    /**
     * 添加上传的文件
     * @param key 
     * @param file 
     * @name 文件名
     */
    addFile(key: string, file: File | string, name: string = ""): this {
        if (!this.formData) {
            this.formData = new FormData();
        }

        if (app.isWeb) {
            this.formData.append("file", file);
        } else {

            let uri = typeof file === "string" ? file : file.name;
            let type = typeof file === "string" ? "*.*" : file.type;

            if (app.isAndroid) {

                if (!(uri.startsWith("content://") || uri.startsWith("file://")))
                    uri = "file://" + uri;
            }

            this.formData.append(key, {
                uri: uri,
                type: type,
                name: name ? name : lib.getFileName(uri),
            } as any);
        }
        return this
    }

    /**
     * 添加FormData键值
     * @param key 
     * @param val 
     */
    addText(key: string, val: string): this {
        if (!this.formData) {
            this.formData = new FormData();
        }
        this.formData.append(key, val);
        return this;
    }

    /**
     * 设置http请求入参
     * @param obj
     * @returns {AjaxLoad}
     */
    setPara(obj: object | null | string | number): this {

        if (obj instanceof Array) {
            this.$paraObj = []
            obj.forEach(it => this.$paraObj.push(it));
        }
        else if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
            this.$paraObj = obj;
        }
        else if (obj) {
            if (!this.$paraObj) {
                this.$paraObj = {};
            }
            for (let key in obj) {
                this.$paraObj[key] = (obj as any)[key];
            }
        } else {
            this.$paraObj = null;
        }
        return this;
    }


    /**
     * 上传进度
     */
    onSendProg = (ev: ProgressEvent) => {/*eslint @typescript-eslint/no-unused-vars: 0 */
    }

    /**
     * 下载进度
     */
    onRespProg = (ev: ProgressEvent) => {/*eslint @typescript-eslint/no-unused-vars: 0 */
    }


    /**
     * 中断请求
     */
    abort() {
        this.$http.abort();
    }

    private respText = "";
    private procXMLHttp() {

        return new Promise<XMLHttpRequest>(resolve => {
            this.$http.onreadystatechange = () => {
                if (this.$http.readyState === 4) {
                    this.respText = this.$http.responseText;
                    resolve(this.$http);
                }
            };
        })


    }
}
