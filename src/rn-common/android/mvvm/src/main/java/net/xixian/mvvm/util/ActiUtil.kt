package net.xixian.mvvm.util

import android.app.Activity
import java.io.Serializable
import java.lang.ref.WeakReference
import java.util.*

object ActiUtil {

    /**
     * app共享配置数据类
     */
    private val actiList = ArrayList<Activity>()
    private var currentActivity_ = WeakReference<Activity>(null)

    /**
     * 用于保存activity result回调（CommActivity startIntent）
     */
    var actResMap = WeakHashMap<Activity, PluginFunc1<Serializable>>()

    /**
     * 获取所有activity
     */
    val allActivity: ArrayList<Activity>
        get() = actiList

    /**
     * 获取当前显示activity
     */
    val currentActivity: Activity?
        get() = currentActivity_.get()

    fun onActiCreate(acti: Activity) {
        actiList.add(acti)
    }

    fun onActiResume(acti: Activity) {
        currentActivity_ = WeakReference<Activity>(acti)
    }

    fun onActiDestory(acti: Activity) {
        for (i in actiList.size - 1 downTo 0) {
            if (actiList[i] == acti) {
                actiList.removeAt(i)
                break
            }
        }
    }

    fun finishAllActivity(taskAffinity: Boolean) {
        for (act in actiList) {
            if (taskAffinity) {
                //使Activity 不在最近任务栏显示
                act.finishAndRemoveTask()
            } else {
                act.finish()
            }
        }
    }

    /**
     * 查找func参数对应的activity,并执行func
     */
    inline fun <reified T : Activity> findActivity(func: (T) -> Unit) {
        allActivity.forEach {
            if (it is T) {
                func(it)
            }
        }
    }
}

