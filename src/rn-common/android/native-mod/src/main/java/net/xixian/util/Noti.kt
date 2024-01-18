package net.xixian.util

import android.annotation.TargetApi
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Build
import android.util.SparseArray
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import net.xixian.mod.NotiClickActivity
import net.rxaa.ext.notNull
import net.rxaa.util.df


object Noti {

    @JvmStatic
    @JvmOverloads
    public fun sendEvent(
        reactContext: ReactContext,
        eventName: String,
        params: Any? = null
    ) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }


    val notificationManager by lazy {
        df.context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    }


    var iconImg = 0;


    val icon by lazy {
        BitmapFactory.decodeResource(df.context.resources, iconImg)
    }

    val channelID = "noti"
    val channelIDProg = "prog"

    /**
     * 创建默认通知渠道
     */
    @JvmStatic
    fun createChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            createNotificationChannel(channelID, "系统消息", NotificationManager.IMPORTANCE_HIGH, true);
            createNotificationChannel(
                channelIDProg,
                "进度消息",
                NotificationManager.IMPORTANCE_MIN,
                false
            );
        }
    }

    /**
     * 创建通知渠道(渠道id,名称,重要性
     */
    @JvmStatic
    @TargetApi(Build.VERSION_CODES.O)
    fun createNotificationChannel(
        channelId: String,
        channelName: String,
        importance: Int,
        vibration: Boolean
    ) {
        val channel = NotificationChannel(channelId, channelName, importance);

        channel.enableLights(true);
        if (vibration) {
            channel.vibrationPattern = longArrayOf(100, 100)//震动的模式，震3次，第一次100，第二次100，第三次200毫秒
            channel.enableVibration(true);
        } else {
            channel.vibrationPattern = longArrayOf(0)//震动的模式，震3次，第一次100，第二次100，第三次200毫秒
            channel.enableVibration(false);
        }

        notificationManager.createNotificationChannel(channel);
    }


    /**
     * 所有正在进行通知任务
     */
    val NotifyTask = SparseArray<NotificationCompat.Builder>();

    //通知id
    var NotiId = 0;

    fun getNotiID(): Int {
        return NotiId++;
    }

    /**
     * 创建带进度调通知
     */
    @JvmStatic
    fun createProg(title: String, msg: String, extString: String): Int {
        val mBuilder = NotificationCompat.Builder(df.appContext!!, channelIDProg)
            .setLargeIcon(icon)
            .setContentTitle(title)
            .setContentText(msg)
            .setAutoCancel(false)
        mBuilder.setSmallIcon(iconImg)
        mBuilder.setProgress(100, 0, false)


        val openintent = Intent(df.appContext, NotiClickActivity::class.java)
        //传给NotiClickActivity的额外数据
        openintent.putExtra(NotiClickActivity.push_msg, extString)
        val resultPendingIntent = PendingIntent.getActivity(
            df.appContext,
            0,
            openintent,
            PendingIntent.FLAG_CANCEL_CURRENT
        )
        mBuilder.setContentIntent(resultPendingIntent)

        // NewMessageNotification2.notify(context, text);
        mBuilder.setSound(null);
        mBuilder.setVibrate(longArrayOf(0));
        val noti = mBuilder.build()
        val id = synchronized(NotifyTask) {
            val id = getNotiID();
            NotifyTask.put(id, mBuilder);
            id;
        }
        notificationManager.notify(id, noti)
        return id;
    }

    //更新进度通知
    @JvmStatic
    fun setProg(id: Int, title: String, msg: String, prog: Int) {
        synchronized(NotifyTask) {
            NotifyTask.get(id).notNull { noti ->
                noti.setSound(null);
                noti.setVibrate(longArrayOf(0));
                if (title != "")
                    noti.setContentTitle(title)
                if (msg != "")
                    noti.setContentText(msg)
                noti.setProgress(100, prog, false);

                notificationManager.notify(id, noti.build())
            }
        }
    }

    /**
     * 取消进度通知
     */
    @JvmStatic
    fun cancelProg(id: Int) {
        synchronized(NotifyTask) {
            NotifyTask.get(id).notNull { noti ->
                notificationManager.cancel(id);
                NotifyTask.remove(id);
            }
        }
    }


    val id = 21987


    /**
     * 显示提示通知
     */
    @JvmStatic
    fun showNoti(title: String, msg: String, sound: Int, extString: String) {
        notificationManager.cancel(id);

        df.appContext ?: return

        val soundUri = if (sound > 0) {
            Uri.parse("android.resource://" + df.appContext!!.packageName + "/" + sound);
        } else {
            null
        }

        val mBuilder = NotificationCompat.Builder(df.appContext!!, "noti")
            .setLargeIcon(icon)
            .setContentTitle(title)
            .setContentText(msg)
            .setAutoCancel(true)
            .setSound(soundUri)
            .setVibrate(longArrayOf(100, 100))
        mBuilder.setSmallIcon(iconImg)

        val openintent = Intent(df.appContext, NotiClickActivity::class.java)
        //传给NotiClickActivity的额外数据
        openintent.putExtra(NotiClickActivity.push_msg, extString)

        val resultPendingIntent =
            PendingIntent.getActivity(
                df.appContext,
                0,
                openintent,
                PendingIntent.FLAG_CANCEL_CURRENT
            )
        mBuilder.setContentIntent(resultPendingIntent)
        // NewMessageNotification2.notify(context, text);
        val noti = mBuilder.build()
        notificationManager.notify(id, noti)
    }
}
