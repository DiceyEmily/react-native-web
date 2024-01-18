package net.xixian.mod

import android.content.Intent
import android.content.pm.ActivityInfo
import android.net.Uri
import android.os.Bundle
import android.util.SparseArray
import android.view.WindowManager
import com.facebook.imagepipeline.core.ImagePipelineFactory
import com.facebook.react.bridge.*
import com.github.promeg.pinyinhelper.Pinyin
import net.xixian.mvvm.util.AppUtils
import net.xixian.mvvm.util.ComFunUtils.killApp
import net.xixian.mvvm.util.JsonUtils
import net.xixian.mvvm.util.KeyStoreUtils
import net.rxaa.ext.FileExt
import net.rxaa.ext.getAllFileSize
import net.rxaa.ext.notNull
import net.rxaa.http.HttpReq
import net.rxaa.media.Pic
import net.rxaa.util.Pack
import net.rxaa.util.df
import net.xixian.util.*
import java.io.File

var NativeModContext: ReactApplicationContext? = null

/**
 * 所有正在进行的下载任务
 */
val downloadTask = SparseArray<DownloadFid>();

//任务id
var jobId = 0;

fun getJobID(): Int {
    return jobId++;
}


/**
 * 发送onFunc通用事件
 * @param id 事件唯一id
 */
inline fun sendEvent(cont: ReactContext, id: Int, arr: (WritableArray) -> Unit) {
    val paras = Arguments.createArray();
    paras.pushInt(id)
    arr(paras);
    Noti.sendEvent(cont, "onFunc", paras)
}


class NativeMod(val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    init {
        NativeModContext = reactContext;
    }

    override fun getName(): String {
        return "NativeMod"
    }

    /**
     *
     */
    @ReactMethod
    fun isInstallWeChat(res: Promise) {
        //res.resolve(WxUtils.getWXAPI(reactContext).isWXAppInstalled());
    }


    /**
     * 判断是否存在指定app(包名)
     */
    @ReactMethod
    fun hasApp(name: String, res: Promise) {
        val intent = reactContext.getPackageManager().getLaunchIntentForPackage(name)
        res.resolve(intent != null)
    }

    @ReactMethod
    fun registerReceiver(filterParas: ReadableMap, id: Int, res: Promise) {
        df.runOnUi {
            ReceiverManage.registerReceiver(reactContext, filterParas, id, res);
        }
    }


    @ReactMethod
    fun unregisterReceiver(id: Int, res: Promise) {
        return ReceiverManage.unregisterReceiver(reactContext, id, res);
    }

    /**
     *
     */
    @ReactMethod
    fun isInstalledQQ(mediaType: ReadableArray, res: Promise) {
        //res.resolve(QQUtils.mTencent.isQQInstalled(df.appContext));
    }

    @ReactMethod
    fun openFile(filter: String, mediaType: ReadableArray?, promise: Promise) {
        val arr = mediaType?.let { Array(mediaType.size()) { i -> mediaType.getString(i) } }
        Pic.getFile(MainActivity.inst ?: return, filter, arr) { res ->
            promise.resolve(res)
        }
    }

    /**
     * 创建通知栏进度
     */
    @ReactMethod
    fun createProg(title: String, msg: String, extString: String, res: Promise) {
        val id = Noti.createProg(title, msg, extString);
        res.resolve(id.toDouble());
    }

    //更新进度通知
    @ReactMethod
    fun setProg(id: Double, title: String, msg: String, prog: Double) {
        Noti.setProg(id.toInt(), title, msg, prog.toInt());
    }

    /**
     * 取消进度通知
     */
    @ReactMethod
    fun cancelProg(id: Double) {
        Noti.cancelProg(id.toInt());
    }

    /**
     *下载文件
     */
    @ReactMethod
    fun downloadFile(url: String, temp: Boolean, file: String, progess: Int, res: Promise) {
        DownloadService.runTask {
            val down = DownloadFid(url).temp(temp);
            val jobID = synchronized(downloadTask) {
                val id = getJobID();
                downloadTask.put(id, down)
                id
            }
            //progess.invoke(0,1,2)
            down.progress { transferSize: Long, fileSize: Long ->

                sendEvent(reactContext, progess) {
                    val dats = Arguments.createMap();
                    it.pushInt(jobID)
                    it.pushDouble(transferSize.toDouble())
                    it.pushDouble(fileSize.toDouble())
                }
            }
            down.fileMenu = { File(file) }
            down.start { ex ->

                synchronized(downloadTask) {
                    downloadTask.remove(jobID)
                }

                if (ex == null) {
                    res.resolve("")
                } else {
                    res.reject(ex)
                }

            }
        }
    }

    /**
     *取消下载
     */
    @ReactMethod
    fun stopDownload(jobID: Double) {
        synchronized(downloadTask) {
            val down = downloadTask.get(jobID.toInt());
            if (down != null) {
                down.cancel()
            }
            downloadTask.remove(jobID.toInt())
        }
    }

    /**
     * 常亮
     */
    @ReactMethod
    fun wakeLock() {
        df.runOnUi {
            currentActivity.notNull {
                it.window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)   //应用运行时，保持屏幕高亮，不锁屏
            }
        }

    }

    //取消常亮
    @ReactMethod
    fun wakeRelease() {
        df.runOnUi {
            currentActivity.notNull {
                it.window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
            }
        }

    }

    //切换竖屏
    @ReactMethod
    fun orientationPortrait() {
        currentActivity.notNull {
            FileExt.catchLogNoMsg {
                it.requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT;
            }
        }
    }

    //不指定
    @ReactMethod
    fun orientationUnspecified() {
        currentActivity.notNull {
            FileExt.catchLogNoMsg {
                it.requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED;
            }
        }
    }

    //切换横屏
    @ReactMethod
    fun orientationLandscape() {
        currentActivity.notNull {
            FileExt.catchLogNoMsg {
                it.requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE;
            }
        }
    }


    /**
     * 取消全屏
     */
    @ReactMethod
    fun cancelFullScreen() {
        df.runOnUi {
            currentActivity.notNull {
                FileExt.catchLogNoMsg {
                    it.window.clearFlags(
                        WindowManager.LayoutParams.FLAG_FULLSCREEN
                    );
                }
            }

        }
    }

    //全屏
    @ReactMethod
    fun fullScreen() {
        df.runOnUi {
            currentActivity.notNull {
                FileExt.catchLogNoMsg {
                    it.window.setFlags(
                        WindowManager.LayoutParams.FLAG_FULLSCREEN,
                        WindowManager.LayoutParams.FLAG_FULLSCREEN
                    )
                }
            }
        }
    }

    //通知栏消息
    @ReactMethod
    fun showNotify(title: String, msg: String, sound: Int, extString: String) {
        Noti.showNoti(title, msg, sound, extString)
    }

    /**
     * qq登陆,返回openid accesstoken
     */
    @ReactMethod
    fun qqLogin(call: Promise) {
//        df.runOnUi {
//            QQUtils.login(Func1 {
//                val map = Arguments.createMap();
//                map.putString("openid", it.optString("openid"))
//                map.putString("appid", QQUtils.app_id)
//                map.putString("access_token", it.optString("access_token"))
//                call.resolve(map);
//            })
//        }
    }

    /**
     * 微信登陆,返回code
     */
    @ReactMethod
    fun weChatLogin(call: Promise) {
//        df.runOnUi {
//            WxUtils.WxLogin(reactContext) {
//                call.resolve(it)
//            }
//        }
    }

    /**
     * 微信支付
     */
    @ReactMethod
    fun wePay(paras: ReadableMap, call: Promise) {
//        WXPayEntryActivity.payPromise = call;
//        df.runOnUi {
//            //    req.partnerId = partnerId;
//            //        req.prepayId = prepayId;
//            //        req.nonceStr = nonceStr;
//            //        req.timeStamp = timeStamp;
//            //        //"Sign=WXPay"
//            //        req.packageValue = packageValue;
//            //        req.sign = sign;
//            WxUtils.wxPay(reactContext,
//                    paras
//            )
//        }
    }

    @ReactMethod
    fun qqShare(title: String, summary: String, url: String) {
        currentActivity.notNull {
            //QQUtils.shareToQQ(it, title, summary, url);
        }
    }

    @ReactMethod
    fun qqZoneShare(title: String, summary: String, url: String, img: String) {
        currentActivity.notNull {
            //QQUtils.shareToQQZone(it, title, summary, url, img);
        }
    }

    /**
     * 微信分享(内容,0好友,1朋友圈
     */
    @ReactMethod
    fun weShare(paras: String, type: Int) {
        df.runOnUi {
//            WxUtils.WxTextShare(reactContext,
//                    paras, type
//            )
        }
    }

    /**
     * 微信分享至小程序(内容,0好友,1朋友圈
     */
    @ReactMethod
    fun WxMiniShare(
        url: String,
        miniType: Int,
        miniId: String,
        miniPath: String,
        title: String,
        text: String,
        judge: Int
    ) {
//        df.runOnUi {
//            WxUtils.WxMiniShare(reactContext,
//                    url, miniType, miniId, miniPath, title, text, judge
//            )
//        }
    }

    @ReactMethod
    fun startActivity(para: ReadableMap) {
        df.runOnUi {

            val launchIntentForPackage = para.getString("launchIntentForPackage");
            val intent = if (launchIntentForPackage != null && launchIntentForPackage != "")
                reactContext.packageManager.getLaunchIntentForPackage(launchIntentForPackage)
            else
                Intent()

            if (intent == null) {
                FileExt.writeLog("startActivity null intent" + para.toString())
                return@runOnUi;
            }

            para.getMap("extras").notNull {
                for (k in it.entryIterator) {
                    val v = k.value
                    if (v is String) {
                        intent.putExtra(k.key, v);
                    } else if (v is Int) {
                        intent.putExtra(k.key, v);
                    } else if (v is Boolean) {
                        intent.putExtra(k.key, v);
                    } else if (v is Float) {
                        intent.putExtra(k.key, v);
                    } else if (v is Double) {
                        intent.putExtra(k.key, v);
                    }
                }
            }

            para.getMap("bundle").notNull {
                val bundle = Bundle()
                for (k in it.entryIterator) {
                    val v = k.value
                    if (v is String) {
                        bundle.putString(k.key, v);
                    } else if (v is Int) {
                        bundle.putInt(k.key, v);
                    } else if (v is Boolean) {
                        bundle.putBoolean(k.key, v);
                    } else if (v is Float) {
                        bundle.putFloat(k.key, v);
                    } else if (v is Double) {
                        bundle.putDouble(k.key, v);
                    }
                }
                intent.putExtras(bundle)
            }

            para.getString("action").notNull {
                intent.action = it;
            }
            para.getInt("flags").notNull {
                intent.flags = it;
            }
            para.getString("type").notNull {
                intent.type = it;
            }
            para.getString("file").notNull {
                intent.data = FileExt.getFileUri(File(it))
            }

            para.getString("url").notNull {
                intent.data = Uri.parse(it)
            }

//            Log.e("wwwwwww", intent.toString());

            //执行安装
            val conte = df.currentActivity ?: reactContext
            conte.startActivity(intent)
        }
    }


    @ReactMethod
    fun aliPay(paras: String, call: Promise) {
//        AliUtils.payPromise = call;
//        currentActivity.notNull {
//            AliUtils.aliPay(it, paras);
//        }
    }


    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getAppVersion(): String {
        return Pack.versionName
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getAppInfo(): String {
        return JsonUtils.serialize(AppUtils.getAppInfo(getPackagename())).toString()
    }

    /**
     * 获取设备id
     */
    @ReactMethod
    fun deviceID(call: Promise) {
        var ret = Pack.getDeviceID()
        call.resolve(ret)
    }

    /**
     *
     */
    @ReactMethod
    fun setItem(key: String, v: String, encrypt: Boolean, res: Promise) {

        df.runOnPool(HttpReq.poolHttp) {
            df.setItem(key, if (encrypt) KeyStoreUtils.encrypt(v) else v)
            res.resolve(true)
        }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getItem(key: String, encrypt: Boolean): String {
        val ret = df.getItem(key) ?: ""
        return if (encrypt) KeyStoreUtils.decrypt(ret) else ret
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getPackagename(): String {
        return reactContext.packageName;
    }


    /**
     * 获取缓存大小
     */
    @ReactMethod
    fun getCacheSize(call: Promise) {
        var size = df.context.getCacheDir().getAllFileSize();
        if (size < 0)
            size = 0
        call.resolve(size.toDouble())
    }

    @ReactMethod
    fun clearBitmapMemory() {
        ImagePipelineFactory.getInstance().imagePipeline.clearMemoryCaches()
    }


    /**
     * 汉字转拼音
     */
    @ReactMethod(isBlockingSynchronousMethod = true)
    fun toPinyin(arr: ReadableArray, separator: String, call: Promise): WritableArray {
        val res = Arguments.createArray();
        for (i in 0..arr.size() - 1) {
            val str = arr.getString(i);
            val py = Pinyin.toPinyin(str, separator);
            res.pushString(py);
        }
        return res
    }

    /**
     * 清空缓存
     */
    @ReactMethod
    fun clearCache() {
        ImagePipelineFactory.getInstance().mainFileCache.clearAll()
        ImagePipelineFactory.getInstance().smallImageFileCache.clearAll()
    }

    /**
     * 写日志
     */
    @ReactMethod
    fun writeLog(text: String, fileName: String) {
        FileExt.writeLog(text, File(FileExt.getFileDir().toString() + "/" + fileName))
    }


    /**
     * 指纹识别
     */
    @ReactMethod
    fun startBiometric() {
        FingerUtils.startBiometric()
    }

    /**
     * 扫码
     */
    @ReactMethod
    fun qrActivity(call: Promise) {
        val conte = df.currentActivity ?: reactContext
        val intent = Intent(conte, QrActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        conte.startActivity(intent)
    }

    /**
     * 关闭app
     */
    @ReactMethod(isBlockingSynchronousMethod = true)
    fun exitApp() {
        killApp()
    }

}