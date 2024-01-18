package net.xixian.mod

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import net.xixian.util.Noti
import net.rxaa.ext.notEmpty
import net.rxaa.util.df


//接收通知点击事件
class NotiClickActivity : Activity() {
    companion object {
        @JvmStatic
        val push_msg = "push_msg"
    }

    fun noti() {
        //获取通知内容
        val msg = intent.getStringExtra(push_msg);

        msg.notEmpty {
            val send = {
                //发送给React Native
                if (NativeModContext != null)
                    Noti.sendEvent(NativeModContext!!, "onNotiClick", msg);
            }
            if (MainActivity.inst == null) {//主界面未启动
                val inte = Intent(this, MainActivity::class.java)
                startActivity(inte)
                df.runOnUi(100) { send() }
            } else {
                send();
            }
        }
        finish();
    }

    public override fun onCreate(savedInstanceState: Bundle?) {
        //        setDarkStatusIcon(true);
        super.onCreate(savedInstanceState)
        noti()
    }
}