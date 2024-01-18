package net.xixian.mvvm.util;


import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.ApplicationInfo;

import net.xixian.mvvm.BaseApplication;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.Locale;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

/**
 * @author djm on 2019/03/20.
 * <p>
 * Describe :app安全防御方法类
 */

public class SecurityUtil {


    /**
     * Enables https connections
     */
    @SuppressLint("TrulyRandom")
    public static void handleSSLHandshake() {
        try {
            TrustManager[] trustAllCerts = new TrustManager[]{new X509TrustManager() {
                @Override
                public X509Certificate[] getAcceptedIssuers() {
                    return new X509Certificate[0];
                }

                @Override
                public void checkClientTrusted(X509Certificate[] certs, String authType) {
                }

                @Override
                public void checkServerTrusted(X509Certificate[] certs, String authType) {
                }
            }};

            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new SecureRandom());


            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
            HttpsURLConnection.setDefaultHostnameVerifier(new HostnameVerifier() {
                @Override
                public boolean verify(String arg0, SSLSession arg1) {
                    return true;
                }
            });
        } catch (Exception ignored) {
        }
    }

    /**
     * app安全检测方式
     */
    public static void checkApkSecurity() {
        //检查是否安全的服务
        //app是否为debug版本或是否连上调试器
        if (checkIsDebuggerConnected() || checkIsDebugVersion(BaseApplication.instance)) {
            ComFunUtils.INSTANCE.killApp();
        }
        //TracerPid的方式来检测是否被调试
        if (isUnderTraced()) {
            ComFunUtils.INSTANCE.killApp();
        }
        //包名验证
//        if ("package error".equals(NativeUtil.verificationPackage(BaseApplication.instance))) {
//            killApp(10);
//        }
        //so签名验证
//        if ("sign error".equals(NativeUtil.verificationSign(BaseApplication.instance))) {
//            killApp(33);
//        }
        //签名验证
        if (!new SignCheck(BaseApplication.instance).check()) {
            ComFunUtils.INSTANCE.killApp();
        }
//        //是否运行在模拟器
//        if (readSysProperty(BaseApplication.instance)) {
//            killApp(4);
//        }
//        //检查堆栈信息来判断是否存在XP框架
//        if (isXposedExistByThrow()) {
//            //尝试关闭
//            tryShutdownXposed();
//        }
//        //usb充电辅助广播，app是否为debug版本或是否连上调试器
//        if (checkIsUsbCharging(BaseApplication.instance)) {
//            if (checkIsDebuggerConnected()) {
//                killApp(10);
//            }
//        }
//        try {
//            //唯一确定的名字,检查运行在虚拟的Apk，防多开
//            new LocalServerSocket(BaseApplication.instance.getPackageName());
//        } catch (IOException e) {
//            killApp(5);
//        }
//        //检测app私有目录，多开后的应用路径会包含多开软件的包名
//        if (checkByPrivateFilePath(BaseApplication.instance)) {
//            killApp(6);
//        }
//        //多开应用会hook处理getPackageName方法
//        if (checkByOriginApkPackageName(BaseApplication.instance)) {
//            killApp(7);
//        }
//        //运行被克隆的应用，该应用会加载多开应用的so库
//        //检测已经加载的so里是否包含这些应用的包名
//        if (checkByMultiApkPackageName()) {
//            killApp(8);
//        }
//        //同一uid下有两个进程对应的包名，在"/data/data"下有两个私有目录，则该应用被多开了
//        if (checkByHasSameUid()) {
//            killApp(9);
//        }

//        uninstallSoList();
    }

    /**
     * 通过主动抛出异常，检查堆栈信息来判断是否存在XP框架
     *
     * @return
     */
//    private static boolean isXposedExistByThrow() {
//        try {
//            throw new Exception("gg");
//        } catch (Exception e) {
//            for (StackTraceElement stackTraceElement : e.getStackTrace()) {
//                if (stackTraceElement.getClassName()
//                                     .contains("de.robv.android.xposed.XposedBridge")) {
//                    return true;
//                }
//            }
//            return false;
//        }
//    }

    /**
     * 尝试关闭XP框架
     * 先通过isXposedExistByThrow判断有没有XP框架
     * 有的话先hookXP框架的全局变量disableHooks
     * <p>
     * 漏洞在，如果XP框架先hook了isXposedExistByThrow的返回值，那么后续就没法走了
     * 现在直接先hookXP框架的全局变量disableHooks
     *
     * @return 是否关闭成功的结果
     */
//    private static boolean tryShutdownXposed() {
//        Field xpdisabledHooks = null;
//        try {
//            xpdisabledHooks = ClassLoader.getSystemClassLoader()
//                                         .loadClass("de.robv.android.xposed.XposedBridge")
//                                         .getDeclaredField("disableHooks");
//            xpdisabledHooks.setAccessible(true);
//            xpdisabledHooks.set(null, Boolean.TRUE);
//            return true;
//        } catch (NoSuchFieldException e) {
//            return false;
//        } catch (ClassNotFoundException e) {
//            return false;
//        } catch (IllegalAccessException e) {
//            return false;
//        }
//    }

//    /**
//     * 检查root安全
//     */
//    public static void checkRoot() {
//        //检查root权限
//        if (checkIsRoot()) {
//            df.msg("系统已root，应用私有数据会被读取风险。");
//        }
//    }

    /**
     * 卸载注入的so库
     */
//    public static void uninstallSoList() {
//        try {
//            HashSet<String> hashSet = getSoList(android.os.Process.myPid(), BaseApplication.instance
//                                                                                   .getPackageName());
//            if (hashSet.size() > 0) {
//                for (String path : hashSet) {
////                    NativeUtil.uninstall(path);
//                }
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }

//    /**
//     * 检查root权限
//     *
//     * @return
//     */
//    private static boolean checkIsRoot() {
//        int secureProp;
//        String roSecureObj = CommandUtil.getSingleInstance().getProperty("ro.secure");
//        if (roSecureObj == null) {
//            secureProp = 1;
//        } else {
//            if ("0".equals(roSecureObj)) {
//                secureProp = 0;
//            } else {
//                secureProp = 1;
//            }
//        }
//        if (secureProp == 0) {
//            //eng/userdebug版本，自带root权限
//            return true;
//        } else {
//            //user版本，继续查su文件
//            File file = null;
//            String[] paths = {"/sbin/su", "/system/bin/su", "/system/xbin/su", "/data/local/xbin/su", "/data/local/bin/su", "/system/sd/xbin/su", "/system/bin/failsafe/su", "/data/local/su"};
//            for (String path : paths) {
//                file = new File(path);
//                if (file.exists()) {
//                    return true;
//                }
//            }
//            return false;
//        }
//    }

    /**
     * java读取/proc/uid/status文件里TracerPid的方式来检测是否被调试
     */
    private static boolean isUnderTraced() {
//        try {
//            BufferedReader localBufferedReader =
//                    new BufferedReader(new FileReader("/proc/" + Process.myPid() + "/status"));
//            String tracerPid = "";
//            for (; ; ) {
//                String str = localBufferedReader.readLine();
//                if (str.contains("TracerPid")) {
//                    tracerPid = str.substring(str.indexOf(":") + 1, str.length()).trim();
//                    break;
//                }
//                if (str == null) {
//                    break;
//                }
//            }
//            localBufferedReader.close();
//            if ("0".equals(tracerPid)) return false;
//            else return true;
//        } catch (Exception fuck) {
//            return false;
//        }
        File procInfoFile;
        try {
            String processStatusFilePath = String.format(Locale.US, "/proc/%d/status", android.os.Process
                    .myPid());
            procInfoFile = new File(processStatusFilePath);
        } catch (Exception e) {
            return false;
        }
        try {
            BufferedReader b = new BufferedReader(new FileReader(procInfoFile));
            String readLine;
            while ((readLine = b.readLine()) != null) {
                if (readLine.contains("TracerPid")) {
                    String[] arrays = readLine.split(":");
                    if (arrays.length == 2) {
                        int tracerPid = Integer.parseInt(arrays[1].trim());
                        if (tracerPid != 0) {
                            return true;
                        }
                    }
                }
            }
            b.close();
        } catch (Exception e) {
        }
        return false;
    }

    /**
     * 该函数搜索进程PID被注入的第三方so
     */
//    private static HashSet<String> getSoList(int pid, String pkg) {
//        HashSet<String> temp = new HashSet<>();
//        File            file = new File("/proc/" + pid + "/maps");
//        if (!file.exists()) {
//            return temp;
//        }
//        try {
//            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(new FileInputStream(file)));
//            String         lineString     = null;
//            while ((lineString = bufferedReader.readLine()) != null) {
//                String tempString = lineString.trim();
//                if (tempString.contains("/data/data") && !tempString.contains("/data/data/" + pkg)) {
//                    int index = tempString.indexOf("/data/data");
//                    temp.add(tempString.substring(index));
//                }
//            }
//            bufferedReader.close();
//        } catch (FileNotFoundException e) {
//        } catch (IOException e) {
//        }
//        return temp;
//    }

    public static final String TAG = "AntiHijackingUtil";

    /**
     * 检测当前Activity是否安全
     */
    /*public static boolean checkActivity(Context context) {
        PackageManager pm = context.getPackageManager();
        // 查询所有已经安装的应用程序
        List<ApplicationInfo> listAppcations = pm.getInstalledApplications(PackageManager.GET_UNINSTALLED_PACKAGES);
        // 排序
        Collections.sort(listAppcations, new ApplicationInfo.DisplayNameComparator(pm));

        // 得到所有的系统程序包名放进白名单里面.
//        List<String> safePackages = new ArrayList<>();
//        for (ApplicationInfo app : listAppcations) {
//            // 这个排序必须有.
//            if ((app.flags & ApplicationInfo.FLAG_SYSTEM) != 0) {
//                safePackages.add(app.packageName);
//            }
//        }

        ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        String          runningActivityPackageName;
        int             sdkVersion;
        try {
            sdkVersion = Integer.valueOf(android.os.Build.VERSION.SDK);
        } catch (NumberFormatException e) {
            sdkVersion = 0;
        }
        if (sdkVersion >= 21) {
            // 获取系统api版本号,如果是5x系统就用这个方法获取当前运行的包名
            runningActivityPackageName = getCurrentPkgName(context);
        } else {
            runningActivityPackageName = activityManager.getRunningTasks(1)
                                                        .get(0).topActivity.getPackageName();
        }
        // 如果是4x及以下,用这个方法.
        if (runningActivityPackageName != null) {
            // 有些情况下在5x的手机中可能获取不到当前运行的包名，所以要非空判断。
            if (runningActivityPackageName.equals(context.getPackageName())) {
                return true;
            }
            // 白名单比对
//            for (String safePack : safePackages) {
//                if (safePack.equals(runningActivityPackageName)) {
//                    return true;
//                }
//            }
        }
        return false;
    }*/

    /*private static String getCurrentPkgName(Context context) {
        // 5x系统以后利用反射获取当前栈顶activity的包名.
        ActivityManager.RunningAppProcessInfo currentInfo         = null;
        Field                                 field               = null;
        int                                   START_TASK_TO_FRONT = 2;
        String                                pkgName             = null;
        try {
            // 通过反射获取进程状态字段.
            field = ActivityManager.RunningAppProcessInfo.class.getDeclaredField("processState");
        } catch (Exception e) {
        }
        ActivityManager                       am      = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List                                  appList = am.getRunningAppProcesses();
        ActivityManager.RunningAppProcessInfo app;
        for (int i = 0; i < appList.size(); i++) {
            //ActivityManager.RunningAppProcessInfo app : appList
            app = (ActivityManager.RunningAppProcessInfo) appList.get(i);
            //表示前台运行进程.
            if (app.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND) {
                Integer state = null;
                try {
                    // 反射调用字段值的方法,获取该进程的状态.
                    state = field.getInt(app);
                } catch (Exception e) {
                }
                // 根据这个判断条件从前台中获取当前切换的进程对象
                if (state != null && state == START_TASK_TO_FRONT) {
                    currentInfo = app;
                    break;
                }
            }
        }
        if (currentInfo != null) {
            pkgName = currentInfo.processName;
        }
        return pkgName;
    }*/

    /**
     * 判断当前是否在桌面
     *
     * @param context 上下文
     */
//    public static boolean isHome(Context context) {
//        ActivityManager                       mActivityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
//        List<ActivityManager.RunningTaskInfo> rti              = mActivityManager.getRunningTasks(1);
//        return getHomes(context).contains(rti.get(0).topActivity.getPackageName());
//    }

    /**
     * 获得属于桌面的应用的应用包名称
     *
     * @return 返回包含所有包名的字符串列表
     */
//    private static List<String> getHomes(Context context) {
//        List<String>   names          = new ArrayList<String>();
//        PackageManager packageManager = context.getPackageManager();
//        Intent         intent         = new Intent(Intent.ACTION_MAIN);
//        intent.addCategory(Intent.CATEGORY_HOME);
//        List<ResolveInfo> resolveInfo = packageManager.queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY);
//        for (ResolveInfo ri : resolveInfo) {
//            names.add(ri.activityInfo.packageName);
//        }
//        return names;
//    }

    /**
     * 判断当前是否在锁屏再解锁状态
     *
     * @param context 上下文
     */
//    public static boolean isReflectScreen(Context context) {
//        KeyguardManager mKeyguardManager = (KeyguardManager) context.getSystemService(Context.KEYGUARD_SERVICE);
//        return mKeyguardManager.inKeyguardRestrictedInputMode();
//    }

    /**
     * 检测app是否为debug版本
     *
     * @param context
     * @return
     */
    public static boolean checkIsDebugVersion(Context context) {
        return (context.getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0;
    }

    /**
     * java法检测是否连上调试器
     *
     * @return
     */
    public static boolean checkIsDebuggerConnected() {
        return android.os.Debug.isDebuggerConnected();
    }

    /**
     * usb充电辅助判断
     *
     * @param context
     * @return
     */
//    private static boolean checkIsUsbCharging(Context context) {
//        IntentFilter filter        = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
//        Intent       batteryStatus = context.registerReceiver(null, filter);
//        if (batteryStatus == null) {
//            return false;
//        }
//        int chargePlug = batteryStatus.getIntExtra(BatteryManager.EXTRA_PLUGGED, -1);
//        return chargePlug == BatteryManager.BATTERY_PLUGGED_USB;
//    }

    /**
     * 是否是模拟器
     */
    /*private static boolean readSysProperty(Context context) {
        if (context == null) {
            return false;
        }

        int suspectCount = 0;

        String baseBandVersion = getProperty("gsm.version.baseband");
        if (null == baseBandVersion || baseBandVersion.contains("1.0.0.0")) {
            ++suspectCount;
        }

        String buildFlavor = getProperty("ro.build.flavor");
        if (null == buildFlavor || buildFlavor.contains("vbox") || buildFlavor.contains("sdk_gphone")) {
            ++suspectCount;
        }

        String productBoard = getProperty("ro.product.board");
        if (null == productBoard || productBoard.contains("android") | productBoard.contains("goldfish")) {
            ++suspectCount;
        }

        String boardPlatform = getProperty("ro.board.platform");
        if (null == boardPlatform || boardPlatform.contains("android")) {
            ++suspectCount;
        }

        String hardWare = getProperty("ro.hardware");
        if (null == hardWare) {
            ++suspectCount;
        } else if (hardWare.toLowerCase().contains("ttvm")) {
            suspectCount += 10;
        } else if (hardWare.toLowerCase().contains("nox")) {
            suspectCount += 10;
        }

        String cameraFlash;
        String sensorNum = "sensorNum";
        boolean isSupportCameraFlash = context.getPackageManager()
                                              .hasSystemFeature("android.hardware.camera.flash");
        if (!isSupportCameraFlash) {
            ++suspectCount;
        }
        cameraFlash = isSupportCameraFlash ? "support CameraFlash" : "unsupport CameraFlash";

        SensorManager sm         = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE);
        int           sensorSize = sm.getSensorList(Sensor.TYPE_ALL).size();
        if (sensorSize < 7) {
            ++suspectCount;
        }
        sensorNum = sensorNum + sensorSize;


        String userApps    = CommandUtil.getSingleInstance().exec("pm list package -3");
        String userAppNum  = "userAppNum";
        int    userAppSize = getUserAppNum(userApps);
        if (userAppSize < 5) {
            ++suspectCount;
        }
        userAppNum = userAppNum + userAppSize;

        String filter = CommandUtil.getSingleInstance().exec("cat /proc/self/cgroup");
        if (null == filter) {
            ++suspectCount;
        }

        return suspectCount > 3;
    }*/

//    private static int getUserAppNum(String userApps) {
//        String[] result = userApps.split("package:");
//        return result.length;
//    }

//    private static String getProperty(String propName) {
//        String property = CommandUtil.getSingleInstance().getProperty(propName);
//        return TextUtils.isEmpty(property) ? null : property;
//    }

    /**
     * 检测原始的包名，多开应用会hook处理getPackageName方法
     * 顺着这个思路，如果在应用列表里出现了同样的包，那么认为该应用被多开了
     *
     * @param context
     * @return
     */
//    private static boolean checkByOriginApkPackageName(Context context) {
//        try {
//            if (context == null) {
//                return false;
//            }
//            int               count       = 0;
//            String            packageName = context.getPackageName();
//            PackageManager    pm          = context.getPackageManager();
//            List<PackageInfo> pkgs        = pm.getInstalledPackages(0);
//            for (PackageInfo info : pkgs) {
//                if (packageName.equals(info.packageName)) {
//                    count++;
//                }
//            }
//            return count > 1;
//        } catch (Exception ignore) {
//        }
//        return false;
//    }

    /**
     * 运行被克隆的应用，该应用会加载多开应用的so库
     * 检测已经加载的so里是否包含这些应用的包名
     *
     * @return
     */
//    private static boolean checkByMultiApkPackageName() {
//        BufferedReader bufr = null;
//        try {
//            bufr = new BufferedReader(new FileReader("/proc/self/maps"));
//            String line;
//            while ((line = bufr.readLine()) != null) {
//                for (String pkg : virtualPkgs) {
//                    if (line.contains(pkg)) {
//                        return true;
//                    }
//                }
//            }
//        } catch (Exception ignore) {
//
//        } finally {
//            if (bufr != null) {
//                try {
//                    bufr.close();
//                } catch (IOException e) {
//
//                }
//            }
//        }
//        return false;
//    }

    /**
     * Android系统一个app一个uid
     * 如果同一uid下有两个进程对应的包名，在"/data/data"下有两个私有目录，则该应用被多开了
     *
     * @return
     */
//    private static boolean checkByHasSameUid() {
//        String filter = getUidStrFormat();
//        if (TextUtils.isEmpty(filter)) {
//            return false;
//        }
//
//        String result = CommandUtil.getSingleInstance().exec("ps");
//        if (TextUtils.isEmpty(result)) {
//            return false;
//        }
//
//        String[] lines = result.split("\n");
//        if (lines.length <= 0) {
//            return false;
//        }
//
//        int exitDirCount = 0;
//
//        for (int i = 0; i < lines.length; i++) {
//            if (lines[i].contains(filter)) {
//                int pkgStartIndex = lines[i].lastIndexOf(" ");
//                String processName = lines[i].substring(pkgStartIndex <= 0 ? 0 : pkgStartIndex + 1, lines[i]
//                        .length());
//                File dataFile = new File(String.format("/data/data/%s", processName, Locale.CHINA));
//                if (dataFile.exists()) {
//                    exitDirCount++;
//                }
//            }
//        }
//        return exitDirCount > 1;
//    }

//    private static String getUidStrFormat() {
//        String filter = CommandUtil.getSingleInstance().exec("cat /proc/self/cgroup");
//        if (filter == null || filter.length() == 0) {
//            return null;
//        }
//
//        int uidStartIndex = filter.lastIndexOf("uid");
//        int uidEndIndex   = filter.lastIndexOf("/pid");
//        if (uidStartIndex < 0) {
//            return null;
//        }
//        if (uidEndIndex <= 0) {
//            uidEndIndex = filter.length();
//        }
//
//        filter = filter.substring(uidStartIndex + 4, uidEndIndex);
//        try {
//            String strUid = filter.replaceAll("\n", "");
//            if (isNumber(strUid)) {
//                int uid = Integer.valueOf(strUid);
//                filter = String.format("u0_a%d", uid - 10000);
//                return filter;
//            }
//            return null;
//        } catch (Exception e) {
//            return null;
//        }
//    }

//    private static boolean isNumber(String str) {
//        if (str == null || str.length() == 0) {
//            return false;
//        }
//        for (int i = 0; i < str.length(); i++) {
//            if (!Character.isDigit(str.charAt(i))) {
//                return false;
//            }
//        }
//        return true;
//    }

    /**
     * 通过检测app私有目录，多开后的应用路径会包含多开软件的包名
     *
     * @param context
     * @return
     */
//    private static boolean checkByPrivateFilePath(Context context) {
//        String path = context.getFilesDir().getPath();
//        for (String virtualPkg : virtualPkgs) {
//            if (path.contains(virtualPkg)) {
//                return true;
//            }
//        }
//        return false;
//    }

    /**
     * 维护一份市面多开应用的包名列表
     */
//    private static String[] virtualPkgs = {
//            //多开分身本身的包名
//            "com.bly.dkplat",
////            "dkplugin.pke.nnp",//多开分身克隆应用的包名会随机变换
//            //chaos引擎
//            "com.by.chaos",
//            //平行空间
//            "com.lbe.parallel",
//            //双开助手
//            "com.excelliance.dualaid",
//            //VirtualXposed，VirtualApp
//            "com.lody.virtual",
//            //360分身大师
//            "com.qihoo.magic"};

}
