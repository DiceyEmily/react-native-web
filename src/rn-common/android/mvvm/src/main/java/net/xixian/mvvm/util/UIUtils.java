package net.xixian.mvvm.util;

import android.content.Context;
import android.content.res.Resources;
import android.os.Handler;

import net.xixian.mvvm.BaseApplication;


/**
 * @author djm
 * on 2017/6/14 13:00.
 * describe ：与UI相关的工具类
 */

public class UIUtils {

    /**
     * 得到上下文
     */
    public static Context getContext() {
        return BaseApplication.Companion.getInstance();
    }

    /**
     * 得到Resource对象
     */
    public static Resources getResources() {
        return getContext().getResources();
    }

    /**
     * 得到int.xml中的字符
     */
    public static int getInt(int resId) {
        return getResources().getInteger(resId);
    }

    /**
     * 得到string.xml中的字符
     */
    public static String getString(int resId) {
        return getResources().getString(resId);
    }

    /**
     * 得到string.xml中的字符,带占位符
     */
    public static String getString(int resId, Object... formatArgs) {
        return getResources().getString(resId, formatArgs);
    }

    /**
     * 得到string.xml中的字符数组
     */
    public static String[] getStringArr(int resId) {
        return getResources().getStringArray(resId);
    }

    /**
     * 得到color.xml中的颜色值
     */
    public static int getColor(int resId) {
        return getResources().getColor(resId);
    }

    /**
     * 得到主线程的id
     */
    public static int getMainThreadId() {
        return BaseApplication.Companion.getInstance().getMainThreadId();
    }

    /**
     * 安全的执行一个task
     *
     * @param tag 直接执行
     */
    public static void postTaskSafely(Runnable task, long time, boolean tag) {
        // 得到当前线程的id
        int curThreadId = android.os.Process.myTid();
        int mainThreadId = getMainThreadId();

        if (curThreadId == mainThreadId && tag) {
            // 如果调用该方法的线程是在主线程-->直接执行任务
            task.run();
        } else {
            // 如果调用该方法的线程是在子线程-->把任务post到主线程handler去执行
            // 主线程的handler
            Handler handler = BaseApplication.Companion.getInstance().getMainHandler();
            handler.postDelayed(task, time);
        }
    }

}
