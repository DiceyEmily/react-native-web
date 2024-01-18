package net.xixian.util

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Looper
import com.wanjian.cockroach.Cockroach
import com.wanjian.cockroach.ExceptionHandler
import net.xixian.LaunchActivity
import net.xixian.mvvm.BaseApplication
import net.xixian.mvvm.util.LogUtils
import net.rxaa.ext.FileExt
import net.rxaa.util.df


/**
 * @author djm
 * 降低Android非必要crash
 *
 *
 * 可能是由于view点击时抛出了异常等等，像这种异常我们更希望即使点击没反应也不要crash，用户顶多会认为是点了没反应，或者认为是本来就不可以点击
 *
 *
 * 注：如果是在初始化view时，异常可能会导致anr。所以这里在初始view的地方替换成自定义的crash处理类。
 */
object CockroachUtils {

    fun installCockroach() {
        val sysExcepHandler = Thread.getDefaultUncaughtExceptionHandler()
        Cockroach.install(BaseApplication.instance, object : ExceptionHandler() {
            override fun onUncaughtExceptionHappened(thread: Thread, throwable: Throwable) {
                FileExt.logException(
                    throwable.cause?.cause ?: throwable,
                    true,
                    "--->onUncaughtExceptionHappened:$thread<---"
                );
            }

            override fun onBandageExceptionHappened(throwable: Throwable) {
                FileExt.logException(
                    throwable.cause?.cause ?: throwable,
                    true,
                );
            }

            override fun onEnterSafeMode() {
                //安全模式
            }

            override fun onMayBeBlackScreen(e: Throwable) {
                val thread = Looper.getMainLooper().thread
                LogUtils.e(
                    "AndroidRuntime",
                    "--->onUncaughtExceptionHappened:$thread<---\n" +
                            df.getStackTraceInfo(e) + "<---",
                    true
                )
                //黑屏时建议直接杀死app
                //重新启动
                val intent = Intent()
                intent.setClassName(
                    BaseApplication.instance.packageName,
                    LaunchActivity::class.java.name
                )
                val restartIntent = PendingIntent.getActivity(
                    BaseApplication.instance, 0, intent,
                    Intent.FLAG_ACTIVITY_NEW_TASK
                )
                val mgr =
                    BaseApplication.instance.getSystemService(Context.ALARM_SERVICE) as AlarmManager
                mgr[AlarmManager.RTC, System.currentTimeMillis() + 1000] = restartIntent
                sysExcepHandler.uncaughtException(thread, RuntimeException("black screen"))
//                CommonFunUtils.killApp()
            }

        })
    }

}
