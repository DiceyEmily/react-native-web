package net.xixian.mvvm

import android.app.Application
import android.os.Handler
import android.os.Process
import net.xixian.mvvm.util.Mvvm
import net.xixian.mvvm.util.AppUtils
import net.rxaa.util.df
import net.xixian.mvvm.util.ActiUtil

/**
 * @author djm
 * on 2017/6/14 12:56.
 * describe ：初始化应用，保存全局变量
 *
 *
 * MultiDexApplication 是为了解决引入了多个第三方jar包，导致调用的方法数超过了android设定的65536个（DEX 64K problem）
 */

open class BaseApplication : Application() {

    /**
     * 是否是平板
     */
    val isTabletDevice: Boolean
        get() = AppUtils.isTabletDevice(instance)

    /**
     * 得到主线程的线程id
     */
    var mainThreadId: Int = 0

    /**
     * 得到主线程的handler
     */
    lateinit var mainHandler: Handler

    override fun onCreate() {
        instance = this

        super.onCreate()

        // 主线程handler
        mainHandler = Handler()
        // 主线程的id
        mainThreadId = Process.myTid()



        df.actStack = ActiUtil.allActivity
        Mvvm.init(this)
    }

    companion object {
        /**
         * 全局的上下文
         */
        lateinit var instance: BaseApplication
    }
}
