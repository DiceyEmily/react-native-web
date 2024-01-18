package net.xixian.mvvm.util;

import android.util.Log
import net.xixian.mvvm.BuildConfig

/**
 * @author djm
 * on 2021/2/4 12:49.
 * describe ：log输出工具类
 */

object LogUtils {
    const val TAG = "Logcat"

    /**
     * log输出控制开关
     */
    private val ENABLE_LOG = BuildConfig.DEBUG

    /**
     * 只有log.e输出的错误信息才写入文件
     * 使用BuglyLog接口时，为了减少磁盘IO次数，我们会先将日志缓存在内存中。当缓存大于一定阈值（默认10K），
     * 会将它持久化至文件。您可以通过setCache(int byteSize)接口设置缓存大小，范围为0-30K。例：BuglyLog.setCache(12 * 1024) //将Cache设置为12K
     *
     * @param msg 错误信息
     */
    fun e(msg: String?, up: Boolean) {
        e(TAG, msg, up)
    }

    /**
     * @param tag 日志标志 注：tag的名称中不要有空字符
     * @param msg 日志信息 注：只有比较重要的日志才保存起来
     */
    fun e(tag: String, msg: String?, up: Boolean) {
        if (ENABLE_LOG) {
            Log.e(tag, msg?:"")
        }

        //保存错误信息到本地
        ComFunUtils.createFile(tag, msg, up)
    }

    fun d(msg: String) {
        if (ENABLE_LOG) {
            Log.d(TAG, msg)
        }
    }

    fun d(tag: String, msg: String) {
        if (ENABLE_LOG) {
            Log.d(tag, msg)
        }
    }

    fun i(msg: String) {
        if (ENABLE_LOG) {
            Log.i(TAG, msg)
        }
    }

    fun i(tag: String, msg: String) {
        if (ENABLE_LOG) {
            Log.i(tag, msg)
        }
    }

    fun v(msg: String) {
        if (ENABLE_LOG) {
            Log.v(TAG, msg)
        }
    }

    fun v(tag: String, msg: String) {
        if (ENABLE_LOG) {
            Log.v(tag, msg)
        }
    }

    fun w(msg: String) {
        if (ENABLE_LOG) {
            Log.w(TAG, msg)
        }
    }

    fun w(tag: String, msg: String) {
        if (ENABLE_LOG) {
            Log.w(tag, msg)
        }
    }
}
