package net.xixian.mvvm.view

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.res.Resources
import android.graphics.Color
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.Message
import android.view.WindowManager
import androidx.core.app.ActivityCompat
import androidx.core.app.ActivityOptionsCompat
import com.billy.android.swipe.SmartSwipe
import com.billy.android.swipe.SmartSwipeWrapper
import com.billy.android.swipe.SwipeConsumer
import com.billy.android.swipe.consumer.BezierBackConsumer
import com.billy.android.swipe.listener.SimpleSwipeListener
import net.xixian.mvvm.BaseApplication
import net.xixian.mvvm.config.localConfig
import net.xixian.mvvm.util.ActiUtil
import net.xixian.mvvm.util.PluginFunc1
import net.xixian.mvvm.util.PluginFunc1Ret
import net.rxaa.ext.FileExt
import net.rxaa.util.df
import net.rxaa.view.ActCompat
import net.rxaa.view.ActivityEx
import java.io.Serializable


/**
 *  公共基activity
 *  ParaT, RetT 分别表示入参类型与返回值类型
 */
abstract class CommActivity<ParaT : Serializable, RetT : Serializable> : ActCompat<ParaT, RetT>() {

    companion object {
        //开启字体缩放
        var enableScale = true
    }

    /**
     * 重写字体缩放比例  api>24
     *
     * @param newBase
     */
    override fun attachBaseContext(newBase: Context) {

        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.N) {

            val res = newBase.resources
            val config = res.configuration
            if (enableScale)
                config.fontScale = localConfig.dat.fontScale
            else
                config.fontScale = if (BaseApplication.instance.isTabletDevice)
                    1.3f
                else
                    1f

            val newContext = newBase.createConfigurationContext(config)
            super.attachBaseContext(newContext)

        } else {
            super.attachBaseContext(newBase)
        }
        enableScale = true
    }

    /**
     * 重写字体缩放比例，api<=24
     */
    override fun getResources(): Resources {

        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.N && super.getResources() != null) {
            val res = super.getResources()
            val conf = res.configuration
            if (enableScale)
                conf.fontScale = localConfig.dat.fontScale
            else
                conf.fontScale = if (BaseApplication.instance.isTabletDevice)
                    1.3f
                else
                    1f
            res.updateConfiguration(conf, res.displayMetrics)
            enableScale = true
            return res
        }

        return super.getResources()
    }

    /**
     * 隐藏显示网络状态布局view
     *
     * @param show true为显示
     * @param msg  显示内容
     */
    protected abstract fun showView(show: Boolean, msg: String?)

    private var mHandle: Handler? = null

    /**
     * 是否显示了网络状态
     */
    private var isShowView: Boolean = false

    private var viewMsg: String? = null

    fun onShowView(str: String?) {
        if (str == null) {
            return
        }
        if (isShowView && str == viewMsg) {
            return
        }
        this.viewMsg = str
        this.runOnUiThread {
            isShowView = true
            showView(true, str)
        }

        if (mHandle == null) {
            val looper = Looper.myLooper()
            mHandle = if (looper != null) {
                object : Handler(looper) {
                    override fun handleMessage(msg: Message) {
                        super.handleMessage(msg)
                        onDismissView()
                    }
                }
            } else null
        } else {
            mHandle?.removeCallbacksAndMessages(null)
        }
        if (str.contains("成功")) {
            mHandle?.sendEmptyMessageDelayed(0, 2000)
        } else {
            mHandle?.sendEmptyMessageDelayed(0, (1000 * 60 * 60 * 12).toLong())
        }
    }

    fun onDismissView() {
        if (!isShowView) {
            return
        }
        this.runOnUiThread {
            isShowView = false
            showView(false, "")
        }
    }

    val cont = getContext()

    /**
     * 手势开关
     */
    var smartSwipeWrapper: SmartSwipeWrapper? = null

    open fun enableSwipeFinish() {
        smartSwipeWrapper = SmartSwipe.wrap(this)
        //监听左右滑动返回监听
        setSwipe(null, object : SimpleSwipeListener() {
            override fun onSwipeOpened(
                wrapper: SmartSwipeWrapper,
                consumer: SwipeConsumer,
                direction: Int
            ) {
                //设置手势是左右滑动关闭activity
                finish()
            }
        })
    }


    final override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        procActivityRes(this, requestCode, resultCode, data)
    }

    /**
     * 开启手势关闭功能
     */
    open fun setSwipe(swipeConsumer: SwipeConsumer?, simpleSwipeListener: SimpleSwipeListener?) {
        //需要侧滑返回功能，其它Activity都采用仿微信侧滑返回效果
        //添加全局透明侧滑返回(5.0以下版本的设备上使用activityStayBack)
        // scrimColor: 玻璃颜色，显示在前一个activity之上的半透明遮罩颜色值, 默认为透明色
        // shadowColor: 在当前activity移动的边缘显示的阴影颜色，默认为透明色
        // shadowSize: shadowColor显示的大小像素值，默认为10dp
        // factor: 关联移动系数
        //        0:         前一个activity保持不动，当前activity随着手势滑动而平移，移动后可透视前一个activity
        //        (0,1):     前一个activity与当前activity有关联移动效果，具体效果如上图所示
        //        1:         前一个activity跟随当前activity一起平移（类似于ViewPager的默认平移效果）
        //在上一个方法的基础上，部分参数采用默认设置：
        //触发区域：左侧边缘20dp
        //遮罩玻璃颜色值: Color.TRANSPARENT
        //边缘阴影颜色值: 0x80000000
        //边缘阴影尺寸: 10dp

        //ActivitySlidingBackConsumer防微信侧滑关闭效果
        //BezierBackConsumer防miui侧滑关闭效果
        if (smartSwipeWrapper != null) {
            val nSwipeConsumer = if (swipeConsumer == null) smartSwipeWrapper!!
                .addConsumer(BezierBackConsumer())
                .setColor(Color.argb(0x11, 0, 0, 0))
                .enableDirection(SwipeConsumer.DIRECTION_LEFT) else smartSwipeWrapper!!.addConsumer(
                swipeConsumer
            )
            //自定义手势关闭逻辑
            if (simpleSwipeListener != null) {
                nSwipeConsumer.addListener(simpleSwipeListener)
            }
        }
    }

    val screenCfg by create {
        if (df.appContext == null) {
            df.init(this)
        }

        //禁止截屏
        if (!localConfig.dat.jieping) {
            window.setFlags(
                WindowManager.LayoutParams.FLAG_SECURE,
                WindowManager.LayoutParams.FLAG_SECURE
            )
        }


    }

}


/**
 * 初始化intent
 * 序列化activity 入参
 * 并将获取返回值回调保存至 ActiUtil.actResMap
 * @param act 目标调用者activity
 * @param inten 待初始化的intent
 * @param para 序列化参数
 * @param onResult 返回值回调
 */
fun <ParaT : Serializable, RetT : Serializable> initIntent(
    act: Activity,
    inten: Intent,
    para: ParaT?,
    onResult: PluginFunc1<RetT>? = null
) {
    if (para != null) {
        inten.putExtra(ActivityEx.intentParaStr, para as Serializable);
    }
    if (onResult != null) {

        ActiUtil.actResMap[act] = PluginFunc1 { seri ->
            FileExt.catchLog {
                onResult.run(seri as RetT)
            }

        };
    }
}


/**
 * onActivityResult中调用，解析对应activity返回值
 * 触发ActiUtil.actResMap
 */
fun procActivityRes(
    act: Activity, requestCode: Int,
    resultCode: Int, data: Intent?
) {
    if (requestCode == ActivityEx.actReqCode && resultCode == ActivityEx.actResCode) {
        if (data == null)
            return;
        val ret = data.getSerializableExtra(ActivityEx.intentRetStr) ?: return
        FileExt.catchLog {
            ActiUtil.actResMap[act]?.run(ret)
        }
        ActiUtil.actResMap.remove(act)
        return;
    }

}

/**
 * 打开activity
 * @param actClass 目标activity
 * @param para activity入参
 * @param onResult activity返回值回调
 */
fun <ParaT : Serializable, RetT : Serializable, T : ActCompat<ParaT, RetT>> Activity.startIntent(
    actClass: Class<T>,
    para: ParaT?,
    onResult: PluginFunc1<RetT>?
): Intent {
    val inte = Intent(this, actClass)
    initIntent(this, inte, para, onResult)
    df.runOnUi {
        if (onResult == null) {
            this.startActivity(inte)
        } else {
            this.startActivityForResult(inte, ActivityEx.actReqCode)
        }
    }
    return inte
}


/**
 * 打开activity
 * @param actClass 目标activity
 * @param onOptionResult 动画
 * @param para activity入参
 */
inline fun <ParaT : Serializable, reified RetT : Serializable, T : ActCompat<ParaT, RetT>> Context.startIntent(
    actClass: Class<T>,
    onOptionResult: PluginFunc1Ret<Activity, ActivityOptionsCompat>?,
    para: ParaT?,
): Intent {
    val intent = Intent(this, actClass)
    intent.putExtra(ActivityEx.intentParaStr, para as Serializable)
    df.runOnUi {
        if (onOptionResult != null && this is Activity)
            onOptionResult.run(this).also {
                //转场动画
                ActivityCompat.startActivity(
                    this,
                    intent,
                    it.toBundle()
                )
            }
        else
            this.startActivity(intent)
    }
    return intent
}