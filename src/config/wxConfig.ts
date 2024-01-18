import { AccessRes, TicketRes } from "@src/model/WxTicket";
// import { app } from "@src/rn-common/lib/app";
// import { lib, MsgError } from "@src/rn-common/lib/lib";
// import { sha1 } from "@src/rn-common/lib/sha1";
// import { api } from "./api";
// import { cfg } from "./cfg";

// export const wxJsApiList = [
//     // 'hideOptionMenu',
//     // 'hideMenuItems',
//     // 'hideAllNonBaseMenuItem',
//     // 'closeWindow',
//     // 'onHistoryBack',  //关闭浏览器

//     'getLocation',
//     // 'openLocation',

//     // 'chooseImage',
//     // 'previewImage',
//     // 'uploadImage',
//     // 'downloadImage',
//     // 'getLocalImgData',
//     'launch3rdApp',
//     'request3rdApp',


//     'scanQRCode',//扫一扫
//     //录音
//     "startRecordVoiceBuffer",
//     "onRecordBufferReceived",
//     "stopRecordVoiceBuffer",
//     'startRecord',//开始录音
//     'stopRecord',//结束
//     'onVoiceRecordEnd',//自动停止

//     // 'playVoice',
//     // 'pauseVoice',
//     // 'stopVoice',
//     // 'onVoicePlayEnd',//监听语音播放完毕
//     // 'uploadVoice',
//     // 'downloadVoice',
//     // 'translateVoice',//语音转文字，企业微信手机端2.7.5+支持

// ];


// function getJsSdkSign(paras: { jsapi_ticket: string, nonceStr: string, time: string }) {
//     let url = window.location.href.split('#')[0];
//     let dat = 'jsapi_ticket=' + paras.jsapi_ticket + '&noncestr=' + paras.nonceStr + '&timestamp=' + paras.time.substring(0, 10) + '&url=' + url;
//     // console.log("dat:", dat);
//     return sha1(dat);
// }



// let signParaCache = null as TicketRes | null;


// export function checkWxApi(apis: string[]) {
//     return new Promise<{ [methodName: string]: boolean }>((reso, reject) => {
//         if (app.isWechat()) {
//             wxInit(apis, () => {
//                 window.wx.checkJsApi({
//                     jsApiList: apis,
//                     success: (res) => {
//                         console.log(res);
//                         reso(res.checkResult);
//                     }
//                 });
//             })
//         }
//     })
// }



// /**
//  *
//  * @param para
//  * @returns
//  */
// export function wxOpenWps(para: {
//     'instanceGUID': string,
//     'documentRowGUID': string,
//     'templateGUID': string,
//     'templateName': string,
//     'isTaohong': string,
//     'step': string,
//     'fileName': string,
//     'userGUID': string,
// }) {
//     return new Promise<void>(async reso => {
//         let data = await checkWxApi([
//             'launch3rdApp',
//             'request3rdApp'
//         ]);

//         // console.log(data);
//         if (data.launch3rdApp || data.request3rdApp) {
//             var server = 'https://oa.szzx.gov.cn:9070';
//             // var ser = 'https://10.224.183.82:9151'
//             //let downLoad = server + '/riseoffice/OfficeTagDownloadServlet?DocumentRowGUID=' + documentDoc.documentrowGUID
//             let downLoad = server + '/spring/office/downloadDocument/?' + lib.objToForm({
//                 "instanceGUID": para.instanceGUID,
//                 "userGUID": para.userGUID,
//                 "authorization": cfg.user.dat.jwt,
//             }, false);
//             let uploadUrl = server + "/wpsupload?" + lib.objToForm({
//                 "instanceGUID": para.instanceGUID,
//                 "fileName": para.fileName,
//                 "DocumentRowGUID": para.documentRowGUID,
//                 "templateGUID": para.templateGUID,
//                 "templateName": para.templateName,
//                 "istaohong": para.isTaohong,
//                 "userGUID": para.userGUID,
//                 "authorization": cfg.user.dat.jwt,
//                 "step": para.step,
//             }, false)

//             console.log(downLoad, "\r\n", uploadUrl);
//             var instanceGUID = para.instanceGUID
//             var param = {
//                 //如出现无法唤起第三方APP的时候，可以param中附加参数
//                 // 'excludeLauncherApp': 'true',
//                 'download_url': downLoad,
//                 'upload_url': uploadUrl,
//                 'file_id': para.documentRowGUID || "123",
//                 'open_mode': 'EditMode',
//                 //settings为额外设置参数，默认进入修订模式且用户为“张三”，如没有此特定需求，传“”即可。
//                 'settings': 'EnterReviseMode=true&UserName=' + cfg.user.dat.userName,

//                 //other字段必须为字串类型
//                 'other': JSON.stringify({
//                     'instanceGUID': instanceGUID,
//                     'DocumentRowGUID': para.documentRowGUID,
//                     'templateGUID': para.templateGUID,
//                     'templateName': para.templateName,
//                     'istaohong': para.isTaohong,
//                     'app': 'app',
//                     'step': para.step,
//                     'fileName': para.fileName,
//                     'userGUID': para.userGUID
//                 }),
//             }
//             if (data.request3rdApp) {
//                 // 唤起第三方app并交互登录信息，第二种方案
//                 (window.wx as any).invoke('request3rdApp', {
//                     //内部调用格式：{scheme}://wxworklocal? token=xxx&seq=xxx&param={param}，统一通过scheme //唤起，seq表示请求id，回传时使用。token也就是code，第三方app后台可 以调用通过code获取 //用户信息的接口获取用户账号。参看“开放登录”--“OAuth2.0网页授权”部分
//                     'scheme': 'ksoapp',
//                     // 是否需要传递登录票据给第三方App，0:不需要 1:需要
//                     'needToken': 0,
//                     //仅当needToken为1时传递，否则不用传此参数
//                     // 'token': '123',
//                     // 一个Base64 encode的json数据， // 车牌识别： {"action":"ocr","type":1} // 身份证识别：{"action":"ocr","type":2} // 居住证识别：{"action":"ocr","type":3} // NFC识别身份证：{"action":"nfc","type":2}
//                     'param': app.base64encode(JSON.stringify(param))
//                 }, (res: any) => {
//                     console.log(lib.dateToY_M_D_H_M_S(new Date(), false, true), res);
//                     if (res.data) {
//                         //有data数据保存成功
//                         reso();
//                     } else {

//                     }
//                 })
//             }
//             else {
//                 //唤起第三方app并交互登录信息，第一种方案
//                 var paramStr = 'ksoapp://wxworklocal?token=0000000&seq=0000000&param='
//                     + app.base64encode(JSON.stringify(param))

//                 let para = {
//                     //应用显示的名称
//                     'appName': '深圳政协办公系统',
//                     // iOS使用，要启动应用的scheme
//                     'appID': 'wechat',
//                     // iOS使用，获取方法参考微信iOS SDK中的LaunchFromWXReq,启动App时附加的额外信息
//                     'messageExt': 'from=yuezhengyi_webview',
//                     //Android使用，要启动应用的包名称
//                     'packageName': 'com.kingsoft.moffice_pro',
//                     //Android使用，传递给WPSOffice的参数
//                     // 一个Base64 encode的json数据， // 车牌识别： {"action":"ocr","type":1}
//                     'param': paramStr
//                 };

//                 // console.log("launch3rdApp", para, param);

//                 // alert('方法参数:' + JSON.stringify(para));
//                 (window.wx as any).invoke('launch3rdApp', para, (res: any) => {
//                     if (res.err_msg != 'launch3rdApp:ok') {
//                         app.msg(res.err_msg)//错误信息输出
//                     } else {
//                         console.log(lib.dateToY_M_D_H_M_S(new Date(), false, true), res);
//                         //刷新当前正文，主要是不知道是否保存成功
//                         reso();

//                     }
//                 })
//             }
//         } else {
//             app.msgErr('您的客户端版本太低，不支持JS接口，请升级到最新的版本！')
//         }
//     })
// }


// /**
//  * 初始化微信sdk
//  * @returns
//  */
// export async function wxInit(apis: string[], onReady?: () => void) {

//     if (!window.wx?.ready) {
//         return;
//     }

//     //超时重新获取Ticket
//     if (!signParaCache || Date.now() - signParaCache.createTime > signParaCache.expires_in * 900) {
//         let res = await api.wxTicket().hideProg.result;

//         signParaCache = res
//     }


//     let res = signParaCache;
//     let noncestr = lib.getUniqueId16();
//     let timestamp = (Date.now() + "").substring(0, 10)

//     let sign = getJsSdkSign({
//         jsapi_ticket: res.ticket,
//         nonceStr: noncestr,
//         time: timestamp,
//     });



//     wx.config({
//         beta: true,// 调用wx.invoke形式的接口值时，该值必须为true。
//         debug: false, //开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//         appId: cfg.env.yzy.appId, //必填，企业号的唯一标识，此处填写企业号corpid
//         timestamp: timestamp, //必填，生成签名的时间戳
//         nonceStr: noncestr, //必填，生成签名的随机串
//         signature: sign,
//         jsApiList: apis.concat(['checkJsApi']), //必填，需要使用的JS接口列表，所有JS接口列表见附录2
//     } as any);

//     wx.error(function (res) {
//         let err = new MsgError("微信配置出错");
//         try {
//             err.errorInfo = JSON.stringify(res);
//         } catch (er) {
//             err.errorInfo = res + "";
//         }

//         err.errorInfo += "\r\n wxInfo:" + JSON.stringify(res)
//         err.errorInfo += "\r\n sign:" + sign
//         console.error(err, "wx.error", err.errorInfo);
//         app.msgErr("微信配置出错");
//     });

//     wx.ready(() => {
//         onReady?.();
//         // wx.checkJsApi({
//         //     jsApiList: jsApiList,
//         //     success: function (res) {

//         //         setTimeout(() => {
//         //             console.log(res);
//         //             var item = '';
//         //             var data = res.checkResult;
//         //             for (item in data) {
//         //                 if (data[item] == false) {
//         //                     //alert('你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本！');
//         //                     //return;
//         //                     console.error('你的微信版本太低，不支持微信JS接口:' + item + '，请升级到最新的微信版本！');
//         //                 }
//         //             }
//         //         }, 500)

//         //         //批量隐藏功能按钮接口
//         //         // wx.hideMenuItems({
//         //         //     menuList: ["menuItem:share:timeline", "menuItem:copyUrl", "menuItem:share:appMessage", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:favorite", "menuItem:share:facebook", "menuItem:share:QZone", "menuItem:editTag", "menuItem:delete", "menuItem:share:wechat", "menuItem:originPage", "menuItem:readMode", "menuItem:openWithQQBrowser", "menuItem:openWithSafari", "menuItem:share:email", "menuItem:share:brand"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
//         //         // });
//         //         // //隐藏右上角菜单接口
//         //         // //隐藏所有非基础按钮接口
//         //         // wx.hideAllNonBaseMenuItem();

//         //     }
//         // })
//     })
// }