package net.xixian.mod

import android.content.Intent
import android.content.res.Configuration
import android.os.Bundle
import android.os.PersistableBundle
import com.facebook.react.ReactActivity
import net.xixian.util.SoftHideKeyBoardUtil
import net.rxaa.ext.statusBarTransparent
import net.rxaa.view.ActivityEx

class MainActivity : ReactActivity() {
    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String? {
        return "rnWeb"
    }

    override fun onDestroy() {
        inst = null
        super.onDestroy()
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        val intent = Intent("onConfigurationChanged")
        intent.putExtra("newConfig", newConfig)
        this.sendBroadcast(intent)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        ActivityEx.onActivityResult(this, requestCode, resultCode, data)
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        ActivityEx.onActivityRequestPermissionsResult(requestCode, permissions, grantResults)
    }

    override fun onCreate(savedInstanceState: Bundle?, persistentState: PersistableBundle?) {
//        setDarkStatusIcon(true);
        window.statusBarTransparent()
        super.onCreate(savedInstanceState, persistentState)
        inst = this
        //修复全屏adjustResize无效
        SoftHideKeyBoardUtil.assistActivity(this);
    }

    public override fun onCreate(savedInstanceState: Bundle?) {
//        setDarkStatusIcon(true);
        window.statusBarTransparent()
        super.onCreate(savedInstanceState)
        inst = this

        //修复全屏adjustResize无效
        SoftHideKeyBoardUtil.assistActivity(this);
        //CheckUpdate.startCheck(this);
    }

    companion object {
        var inst: MainActivity? = null
    }
}