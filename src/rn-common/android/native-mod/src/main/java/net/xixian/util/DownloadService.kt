package net.xixian.util

import android.app.Service
import android.content.Intent
import android.os.IBinder
import net.rxaa.ext.FileExt
import net.rxaa.util.df
import java.util.concurrent.ConcurrentLinkedQueue


class DownloadService : Service() {


    companion object {
        val task = ConcurrentLinkedQueue<() -> Unit>();

        /**
         * 启动服务任务
         */
        fun runTask(func: () -> Unit) {
            task.offer(func)
            df.context.startService(Intent(df.context, DownloadService::class.java))
        }
    }

    /**
     * 绑定服务时才会调用
     * 必须要实现的方法
     * @param intent
     * @return
     */
    override fun onBind(intent: Intent?): IBinder? {
        return null;
    }

    /**
     * 首次创建服务时，系统将调用此方法来执行一次性设置程序（在调用 onStartCommand() 或 onBind() 之前）。
     * 如果服务已在运行，则不会调用此方法。该方法只被调用一次
     */
    override fun onCreate() {
        super.onCreate();
    }

    /**
     * 每次通过startService()方法启动Service时都会被回调。
     * @param intent
     * @param flags
     * @param startId
     * @return
     */
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        while (true) {
            val func = task.poll()
            if (func == null)
                break;
            FileExt.catchLog {
                func();
            }
        }
        if (intent != null) {


        }
        return super.onStartCommand(intent, flags, startId);
    }

    /**
     * 服务销毁时的回调
     */
    override fun onDestroy() {
        super.onDestroy();
    }
}
