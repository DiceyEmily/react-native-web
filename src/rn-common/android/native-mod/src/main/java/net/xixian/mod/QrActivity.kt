package net.xixian.mod

import android.content.Context
import android.os.Vibrator
import cn.bingoogolapple.qrcode.core.QRCodeView
import net.rxaa.ext.awaitRequestPermission
import net.rxaa.ext.statusBarTransparent
import net.rxaa.util.df
import net.rxaa.view.ActivityEx
import net.xixian.mod.databinding.ActivityQrBinding
import net.xixian.mvvm.model.Common
import net.xixian.mvvm.view.CommActivity


/**
 * 扫描
 */
class QrActivity : CommActivity<String, String>() {
    val v by binding(R.layout.activity_qr) { ActivityQrBinding.bind(it) }

    override fun onCreateEx() {
        enableSwipeFinish()
        window.statusBarTransparent()
        v.zxingview.setDelegate(scanRes)
    }

    val scanRes = object : QRCodeView.Delegate {
        override fun onScanQRCodeSuccess(res: String?) {
            vibrate()

            if (res.isNullOrEmpty()) {
                df.msg("扫描异常")
                return
            }
            df.launch {
                result = res
                intent.putExtra(ActivityEx.intentRetStr, res)
                setResult(Common.START_NEW_ACTIVITY, intent)
                finish()
            }
        }

        override fun onCameraAmbientBrightnessChanged(isDark: Boolean) {
        }

        override fun onScanQRCodeOpenCameraError() {
            df.msg("打开相机出错")
        }

    }

    fun vibrate() {
        val vibrator = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        vibrator.vibrate(200)
    }


    override fun onStart() {
        super.onStart()
        df.launch {
            val success = awaitRequestPermission(android.Manifest.permission.CAMERA)
            if (!success)
                finish()
            df.runOnUi(100) {
                v.zxingview.startCamera() // 打开后置摄像头开始预览，但是并未开始识别
                v.zxingview.startSpotAndShowRect()// 显示扫描框，并开始识别
            }
        }
    }

    override fun onStopEx() {
        v.zxingview.stopCamera()
    }

    override fun onDestoryEx() = df.launch {
        v.zxingview.onDestroy()
    }

    override fun showView(show: Boolean, msg: String?) {

    }

}