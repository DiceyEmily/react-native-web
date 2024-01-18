package net.xixian

import android.annotation.SuppressLint
import android.app.Activity
import android.content.*
import android.os.Bundle
import android.os.Process
import com.reactnative.ivpusic.imagepicker.PickerPackage
import com.facebook.react.*
import com.facebook.react.modules.network.OkHttpClientProvider
import com.facebook.soloader.SoLoader
import com.tencent.bugly.crashreport.CrashReport
import com.tencent.mmkv.MMKV
import net.xixian.mod.NativeModReactPackage
import net.xixian.mvvm.BaseApplication
import net.xixian.mvvm.util.AppUtils
import net.xixian.mvvm.util.LogUtils
import net.xixian.mvvm.util.SecurityUtil
import net.xixian.mvvm.util.ActiUtil
import net.xixian.util.CockroachUtils.installCockroach
import net.xixian.util.CustomClientFactory
import net.xixian.util.HotLoad
import net.xixian.util.Noti
import net.rxaa.ext.FileExt
import net.rxaa.util.df
import java.io.File
import java.lang.reflect.InvocationTargetException


/**
 * @author djm
 */

class MainApplication : BaseApplication(), ReactApplication {

    companion object {
        /**
         * 全局的上下文
         */
        lateinit var mainInstance: MainApplication
        var isBackSys: Boolean = false

        /**
         * 重新加载js文件
         */
        fun reloadReact() {
            FileExt.writeLog("reloadReact")
            val manager: ReactInstanceManager =
                mainInstance.reactNativeHost.reactInstanceManager

            if (manager.hasStartedCreatingInitialContext()) {
                FileExt.writeLog("hasStartedCreatingInitialContext")
                manager.recreateReactContextInBackground()
            }

        }
    }

    override fun attachBaseContext(base: Context?) {
        super.attachBaseContext(base)

    }

    override fun onCreate() {
        df.init(this)
        HotLoad.host = BuildConfig.HOTLOAD_URL
        super.onCreate()
        mainInstance = this

        OkHttpClientProvider.setOkHttpClientFactory(CustomClientFactory()) //add this line


        //初始化mmkv安全组件
        MMKV.initialize(this)
        Noti.iconImg = R.mipmap.icon_app

        if (!BuildConfig.DEBUG) {
            //安全检查
            SecurityUtil.checkApkSecurity()
        }
        //自定义crash工具
        if (!BuildConfig.DEBUG) {
            installCockroach()
        }

        //注册全局activity生命周期回调
        registerActivityLifecycleCallbacks(activityLifecycleCallbacks())

        SoLoader.init(this,  /* native exopackage */false)
        initializeFlipper(this, reactNativeHost.reactInstanceManager)
//        uncaughtExceptionLog(false)

        if (!BuildConfig.DEBUG) {
            val context = this
            // 获取当前包名
            val packageName = context.packageName
            // 获取当前进程名
            val processName = AppUtils.getProcessName(Process.myPid())
            // 设置是否为上报进程
            val strategy = CrashReport.UserStrategy(context)
            strategy.isUploadProcess = processName == null || processName == packageName
            // 初始化Bugly
            CrashReport.initCrashReport(
                context,
                "38e1cecf47",
                BuildConfig.DEBUG,
                strategy
            )
        }

    }

    private fun activityLifecycleCallbacks(): ActivityLifecycleCallbacks {
        return object : ActivityLifecycleCallbacks {

            override fun onActivityStopped(activity: Activity) {
                isBackSys = !AppUtils.isAppForeground(
                    this@MainApplication
                )
                if (isBackSys) {
                    //不是作为插件环境，后台提示统一在主工程处理
                    //df.msg("OA已处于后台")
                    //内存回收
                    System.gc()
                    System.runFinalization()
                }
            }

            override fun onActivityStarted(activity: Activity) {
                LogUtils.w("onActivityStarted", " : $activity")
                isBackSys = false
            }

            override fun onActivitySaveInstanceState(activity: Activity, outState: Bundle) {}

            override fun onActivityResumed(activity: Activity) {
                ActiUtil.onActiResume(activity)
            }

            override fun onActivityPaused(activity: Activity) {}

            override fun onActivityDestroyed(activity: Activity) {
                ActiUtil.onActiDestory(activity)
            }

            @SuppressLint("MissingPermission")
            override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {
                ActiUtil.onActiCreate(activity)
            }
        }
    }

    private val mReactNativeHost: ReactNativeHost = object : ReactNativeHost(this) {
        override fun getUseDeveloperSupport(): Boolean {
            return BuildConfig.DEBUG
        }

        override fun getPackages(): List<ReactPackage> {
            val packages: MutableList<ReactPackage> = PackageList(this).packages
            // Packages that cannot be autolinked yet can be added manually here, for example:
            packages.add(NativeModReactPackage())
            /**
             * 单独添加图片选择库
             */
            packages.add(PickerPackage())
            return packages
        }

        /**
         * 新版本该函数只会在启动时触发一次，
         * 并且触发在热更新之前
         */
        override fun getJSBundleFile(): String? {
            // 这里指定JSBundleFile的入口，从而实现加载不同的模块
            if (BuildConfig.DEBUG) {
                return super.getJSBundleFile()
            }
            //return super.getJSBundleFile();
            val file: File = HotLoad.jsFile()
//            FileExt.writeLog("getJSBundleFile "+file);

            if (!file.exists()) {
                //想要使用热更新文件，就要固定HotLoad目录
                //但同时会遇到缺少图片资源问题
//                HotLoad.copyAssertJs();
//                if (!file.exists()) {

                return super.getJSBundleFile();
//                }
            }
            return file.absolutePath
//            return if (file.exists()){
//                FileExt.writeLog("hotload exist "+ file.absolutePath);
//                file.absolutePath
//            } else{
//                super.getJSBundleFile()
//            }
        }

        override fun getJSMainModuleName(): String {
            return "index"
        }
    }

    override fun getReactNativeHost(): ReactNativeHost {
        return mReactNativeHost
    }

    /**
     * Loads Flipper in React Native templates. Call this in the onCreate method with something like
     * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
     *
     * @param context
     * @param reactInstanceManager
     */
    private fun initializeFlipper(
        context: Context, reactInstanceManager: ReactInstanceManager
    ) {
        if (BuildConfig.DEBUG) {
            try {
                /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
                val aClass = Class.forName("com.rnweb.ReactNativeFlipper")
                aClass
                    .getMethod(
                        "initializeFlipper",
                        Context::class.java,
                        ReactInstanceManager::class.java
                    )
                    .invoke(null, context, reactInstanceManager)
            } catch (e: ClassNotFoundException) {
                e.printStackTrace()
            } catch (e: NoSuchMethodException) {
                e.printStackTrace()
            } catch (e: IllegalAccessException) {
                e.printStackTrace()
            } catch (e: InvocationTargetException) {
                e.printStackTrace()
            }
        }
    }

}
