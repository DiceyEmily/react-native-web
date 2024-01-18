package net.xixian

import android.Manifest
import android.content.Intent
import com.hjq.permissions.OnPermission
import com.hjq.permissions.XXPermissions
import net.xixian.databinding.ActivityLaunchBinding
import net.xixian.mvvm.config.localConfig
import net.xixian.mvvm.util.ComFunUtils
import net.xixian.util.HotLoad
import net.rxaa.ext.FileExt
import net.rxaa.ext.hide
import net.rxaa.ext.show
import net.rxaa.util.df
import net.xixian.mod.MainActivity
import net.xixian.mvvm.view.CommActivity


/**
 * 引导页
 */
class LaunchActivity : CommActivity<String, String>() {

    val b by create {
//        window.statusBarTransparent()
    }
    private val v by binding(R.layout.activity_launch) {
        ActivityLaunchBinding.bind(it)
    }

    override fun onCreateEx() {

        super.onCreateEx()
        if (intent != null) {
            // 处理某些手机按 home 键重新进入会重新打开初始化的页面
            if (!this.isTaskRoot) {
                val mainIntent = intent
                val action = mainIntent.action
                if (mainIntent.hasCategory(Intent.CATEGORY_LAUNCHER) && action == Intent.ACTION_MAIN) {
                    finish()
                    return
                }
            }
            if (intent.flags and Intent.FLAG_ACTIVITY_BROUGHT_TO_FRONT != 0) {
                finish()
                return
            }
        }

        //暂时默认可截屏
        localConfig.edit {
            it.jieping = true
        }

        //防重开
//        if (ActiUtil.comShareData.isLogin) {
//            val intent = Intent(this, LoginActivity::class.java)
//            startActivity(intent)
//            finish()
//            return
//        }

        XXPermissions.with(this)
            // 申请网络权限
            .permission(Manifest.permission.INTERNET)
            //设备信息和电话权限
            .permission(Manifest.permission.READ_PHONE_STATE)
            // 申请悬浮窗权限
//            .permission(Manifest.permission.SYSTEM_ALERT_WINDOW)
            // 申请写外存储权限
//            .permission(Manifest.permission.WRITE_EXTERNAL_STORAGE)
            // 申请wifi状态权限
            .permission(Manifest.permission.ACCESS_WIFI_STATE)
            // 申请网络状态权限
            .permission(Manifest.permission.ACCESS_NETWORK_STATE)
            .request(object : OnPermission {
                override fun hasPermission(granted: List<String?>?, all: Boolean) {
                    if (all) {
                        init()
                    } else {
                        //不是所有都授权
                        df.msg(getString(R.string.permission_denied))
                        finish()
                        ComFunUtils.killApp()
                    }
                }

                override fun noPermission(denied: List<String?>?, never: Boolean) {
                    if (never) {
                        // 如果是被永久拒绝就跳转到应用权限系统设置页面
                        XXPermissions.startPermissionActivity(this@LaunchActivity, denied)
                        df.msg("请手动开启权限")
                    } else {
                        //获取权限失败
                        df.msg(getString(R.string.permission_denied))
                        finish()
                        ComFunUtils.killApp()
                    }
                }
            })
    }

    private fun init() {
//        var res = KeyStoreUtils.encrypt("123456")
//        Log.e("wwwwww", "加密内容" + res)
//
//        res = KeyStoreUtils.decrypt("AAAADErTLInNr+2na3smFdDoDyrg3/zVz3H2xLsjdP58ykkiaQU=")
//        Log.e("wwwwww", "解密内容" + res)

        v.progLoad.hide
        v.textInfo.hide
        FileExt.writeLog("HotLoad.start")
        HotLoad.start({ transferSize: Long, fileSize: Long ->
            df.runOnUi {
                v.progLoad.show
                v.textInfo.show
                val percent = transferSize * 1000 / fileSize;
                v.progLoad.progress = percent.toInt();
            }
        }) { changed ->
            if (changed)
                MainApplication.reloadReact()
            //登录
//          val intent = Intent(this, LoginActivity::class.java)
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)

            finish()
        }


    }

    override fun showView(show: Boolean, msg: String?) {

    }
}