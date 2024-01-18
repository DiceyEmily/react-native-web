package net.xixian.mvvm.util

import android.content.Context
import android.util.Log
import com.google.gson.JsonIOException
import com.google.gson.stream.MalformedJsonException
import net.xixian.mvvm.BuildConfig
import net.rxaa.ext.FileExt
import net.rxaa.util.MsgException
import net.rxaa.util.df
import net.rxaa.util.dfStr
import java.net.ConnectException
import java.net.SocketTimeoutException

object Mvvm {

    fun getExceptionMsg(ex: Throwable): String {
        if (ex is MsgException) {
            return ex.message ?: ""
        } else if (ex is MalformedJsonException || ex is JsonIOException) {
            return "网络数据异常!"
        } else if (ex is ConnectException) {
            return "网络异常!"
        } else if (ex is SocketTimeoutException) {
            return "网络链接超时!"
        } else {
            return "错误:" + ex.message
        }
    }

    fun init(cont: Context) {

        FileExt.logExceptionFunc = fun(ex: Throwable, msgDialog: Boolean, msg: String) {

            if (BuildConfig.DEBUG)
                Log.e("wwwwwwwwwwwwww" + msg, "error", ex)

            FileExt.writeLog(msg + "--------\r\n" + df.getStackTraceInfo(ex))
            if (msgDialog) {
                if (ex is MsgException) {
                    if (ex.showAble)
                        df.msg(ex.message)
                } else {
                    df.msg(getExceptionMsg(ex))
                }
            }
        }

        df.init(cont)
        dfStr.ok = "确定"
        dfStr.cancel = "取消"
        dfStr.error = "错误"
    }
}