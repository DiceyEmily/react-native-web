package net.xixian.mvvm.util;

import android.annotation.SuppressLint
import android.app.Activity
import android.app.ActivityManager
import android.content.Context
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.content.pm.Signature
import android.content.res.Configuration
import android.os.Build
import android.os.Handler
import android.os.Process
import android.text.TextUtils
import net.xixian.mvvm.BaseApplication
import net.rxaa.util.df
import java.io.BufferedReader
import java.io.File
import java.io.FileReader
import java.io.IOException
import java.util.*

/**
 * <pre>
 * author: Blankj
 * blog  : http://blankj.com
 * time  : 2016/08/02
 * desc  : App相关工具类
</pre> *
 */
object AppUtils {




    /**
     * 区分pad和手机屏幕
     */
    fun isTabletDevice(context: Context): Boolean {
        return context.resources
            .configuration.screenLayout and Configuration.SCREENLAYOUT_SIZE_MASK >= Configuration.SCREENLAYOUT_SIZE_LARGE
    }

    /**
     * 判断App是否安装
     *
     * @param packageName 包名
     * @return `true`: 已安装<br></br>`false`: 未安装
     */
    fun isInstallApp(packageName: String?): Boolean {
        return !isSpace(packageName) && df.context.packageManager.getLaunchIntentForPackage(
            packageName ?: ""
        ) != null
    }

    /**
     * 获取app对应的版本号
     *
     * @param appPackageName 包名
     */
    @JvmStatic
    fun getAppLocalVersionCode(appPackageName: String?): Int {
        val packageInfo = getAppInfo(appPackageName)
        return if (packageInfo != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) packageInfo.longVersionCode
                .toInt() else packageInfo.versionCode
        } else 0
    }

    /**
     * 获取App包名
     *
     * @return App包名
     */
    val appPackageName: String
        get() = df.context.packageName

    /**
     * 获取App名称
     *
     * @param packageName 包名
     * @return App名称
     */
    fun getAppName(packageName: String?): String? {
        return if (isSpace(packageName)) {
            null
        } else try {
            val pm = df.context.packageManager
            val pi = pm.getPackageInfo(packageName?:"", 0)
            pi?.applicationInfo?.loadLabel(pm)?.toString()
        } catch (e: PackageManager.NameNotFoundException) {
            e.printStackTrace()
            null
        }
    }

    /**
     * 获取App签名
     *
     * @param packageName 包名
     * @return App签名
     */
    fun getAppSignature(packageName: String?): Array<Signature>? {
        return if (isSpace(packageName)) {
            null
        } else try {
            val pm = df.context
                .packageManager
            @SuppressLint("PackageManagerGetSignatures") val pi =
                pm.getPackageInfo(packageName?:"", PackageManager.GET_SIGNATURES)
            pi?.signatures
        } catch (e: PackageManager.NameNotFoundException) {
            e.printStackTrace()
            null
        }
    }

    /**
     * 获取App信息
     *
     * AppInfo（名称，图标，包名，版本号，版本Code，是否系统应用）
     *
     * @param packageName 包名
     * @return 当前应用的AppInfo
     */
    @JvmStatic
    fun getAppInfo(packageName: String?): PackageInfo? {
        return try {
            val pm = BaseApplication.instance.packageManager
            pm.getPackageInfo(packageName?:"", 0)
        } catch (e: PackageManager.NameNotFoundException) {
            null
        }
    }// 获取系统中安装的所有软件信息

    /**
     * 获取所有已安装App信息
     *
     * 依赖上面的getBean方法
     *
     * @return 所有已安装的AppInfo列表
     */
    val appsInfo: List<PackageInfo>
        get() {
            val list: MutableList<PackageInfo> = ArrayList()
            val pm = BaseApplication.instance.packageManager
            // 获取系统中安装的所有软件信息
            val installedPackages = pm.getInstalledPackages(0)
            for (pi in installedPackages) {
                if (pi == null) {
                    continue
                }
                list.add(pi)
            }
            return list
        }

    /**
     * 清除App所有数据
     *
     * @param dirPaths 目录路径
     * @return `true`: 成功<br></br>`false`: 失败
     */
    fun cleanAppData(vararg dirPaths: String?): Boolean {
        val dirs = arrayOfNulls<File>(dirPaths.size)
        var i = 0
        for (dirPath in dirPaths) {
            dirs[i++] = File(dirPath)
        }
        return cleanAppData(*dirs)
    }

    /**
     * 清除App所有数据
     *
     * @param dirs 目录
     * @return `true`: 成功<br></br>`false`: 失败
     */
    fun cleanAppData(vararg dirs: File?): Boolean {
        var isSuccess = CleanUtils.cleanInternalCache()
        isSuccess = isSuccess and CleanUtils.cleanInternalDbs()
        isSuccess = isSuccess and CleanUtils.cleanInternalSP()
        isSuccess = isSuccess and CleanUtils.cleanInternalFiles()
        isSuccess = isSuccess and CleanUtils.cleanExternalCache()
        for (dir in dirs) {
            isSuccess = isSuccess and CleanUtils.cleanCustomCache(dir)
        }
        return isSuccess
    }

    private fun isSpace(s: String?): Boolean {
        if (s == null) {
            return true
        }
        var i = 0
        val len = s.length
        while (i < len) {
            if (!Character.isWhitespace(s[i])) {
                return false
            }
            ++i
        }
        return true
    }

    /**
     * 获取进程号对应的进程名
     *
     * @param pid 进程号
     * @return 进程名
     */
    fun getProcessName(pid: Int): String? {
        var reader: BufferedReader? = null
        try {
            reader = BufferedReader(FileReader("/proc/$pid/cmdline"))
            var processName = reader.readLine()
            if (!TextUtils.isEmpty(processName)) {
                processName = processName.trim { it <= ' ' }
            }
            return processName
        } catch (throwable: Throwable) {
            throwable.printStackTrace()
        } finally {
            try {
                reader?.close()
            } catch (exception: IOException) {
                exception.printStackTrace()
            }
        }
        return null
    }

    /**
     * 判断本应用是否已经位于最前端
     *
     * getRunningTask方法在5.0以上已经被废弃，只会返回自己和系统的一些不敏感的task，不再返回其他应用的task，
     * 用CI方法来判断自身App是否处于后台仍然有效，但是无法判断其他应用是否位于前台，因为不能再获取信息
     *
     * @param context
     * @return 位于最前端的app包名
     */
    fun isAppForeground(context: Context): Boolean {
        val activityManager = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
            val rti = activityManager.getRunningTasks(1)
            return context.packageName == rti[0]?.topActivity?.packageName
        } else {
            val appProcessInfoList = activityManager.runningAppProcesses
            /*枚举进程*/
            for (appProcessInfo in appProcessInfoList) {
                if (appProcessInfo.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND) {
                    if (appProcessInfo.processName == context.applicationInfo.processName) {
                        return true
                    }
                }
            }
        }
        return false
    }

    /**
     * 将本应用置顶到最前端
     * 当本应用位于后台时，则将它切换到最前端
     *
     * @param context
     */
    @SuppressLint("NewApi", "MissingPermission")
    fun setTopApp(context: Context) {
        /*获取ActivityManager*/
        val activityManager =
            context.getSystemService(Activity.ACTIVITY_SERVICE) as ActivityManager

        /*获得当前运行的task(任务)*/
        val taskInfoList = activityManager.getRunningTasks(100)
        for (taskInfo in taskInfoList) {
            /*找到本应用的 task，并将它切换到前台*/
            if (taskInfo.topActivity?.packageName == context.packageName) {
                activityManager.moveTaskToFront(taskInfo.id, 0)
                break
            }
        }
    }

    // 最近开的task，HOME键长按会看到这个
    fun showRecentTask(context: Context): List<ActivityManager.RecentTaskInfo> {
        val mAm = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        val mPM = context.packageManager
        return mAm.getRecentTasks(100, 0);
    }

    // 运行中的作为app容器的process。
    fun showRunningAppProcesses(context: Context): List<ActivityManager.RunningAppProcessInfo> {
        val mAm = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        return mAm.runningAppProcesses
    }

    /**
     * 安全的执行一个task
     *
     * @param tag 直接执行
     */
    fun postTaskSafely(task: Runnable, time: Long, tag: Boolean) {
        // 得到当前线程的id
        val curThreadId = Process.myTid()
        val mainThreadId: Int = BaseApplication.instance.mainThreadId
        if (curThreadId == mainThreadId && tag) {
            // 如果调用该方法的线程是在主线程-->直接执行任务
            task.run()
        } else {
            // 如果调用该方法的线程是在子线程-->把任务post到主线程handler去执行
            // 主线程的handler
            val handler: Handler = BaseApplication.instance.mainHandler
            handler.postDelayed(task, time)
        }
    }

}