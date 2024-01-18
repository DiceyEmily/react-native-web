
# Disabling obfuscation is useful if you collect stack traces from production crashes
# (unless you are using a system that supports de-obfuscate the stack traces).
# 关闭混淆，默认开启，增大反编译难度，类和类成员会被随机命名，除非用keep保护
#-dontobfuscate

# React Native
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep,allowobfuscation @interface com.facebook.common.internal.DoNotStrip
-keep,allowobfuscation @interface com.facebook.jni.annotations.DoNotStrip

-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keep @com.facebook.common.internal.DoNotStrip class *
-keep @com.facebook.jni.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.common.internal.DoNotStrip *;
    @com.facebook.jni.annotations.DoNotStrip *;
}

-keepclassmembers @com.facebook.proguard.annotations.KeepGettersAndSetters class * {
  void set*(***);
  *** get*();
}

-keep class * implements com.facebook.react.bridge.JavaScriptModule { *; }
-keep class * implements com.facebook.react.bridge.NativeModule { *; }
-keepclassmembers,includedescriptorclasses class * { native <methods>; }
-keepclassmembers class *  { @com.facebook.react.uimanager.annotations.ReactProp <methods>; }
-keepclassmembers class *  { @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>; }

-dontwarn com.facebook.react.**
-keep,includedescriptorclasses class com.facebook.react.bridge.** { *; }

-keep class com.facebook.hermes.unicode.** { *; }

-keep public class com.horcrux.svg.** {*;}

# TextLayoutBuilder uses a non-public Android constructor within StaticLayout.
# See libs/proxy/src/main/java/com/facebook/fbui/textlayoutbuilder/proxy for details.
-dontwarn android.text.StaticLayout

# okio
# Animal Sniffer compileOnly dependency to ensure APIs are compatible with older versions of Java.
-dontwarn org.codehaus.mojo.animal_sniffer.*

#---------------------------------webview------------------------------------
-keepclassmembers class fqcn.of.javascript.interface.for.webview {
   public *;
}
-keepclassmembers class * extends android.webkit.WebViewClient {
	public void *(android.webkit.WebView, java.lang.String, android.graphics.Bitmap);
	public boolean *(android.webkit.WebView, java.lang.String);
}

-keepclassmembers class * extends android.webkit.WebViewClient {
	public void *(android.webkit.WebView, jav.lang.String);
}

#指定代码的压缩级别
-optimizationpasses 5

#包明不混合大小写
-dontusemixedcaseclassnames

#不去忽略非公共的库类
-dontskipnonpubliclibraryclasses

 #优化  不优化输入的类文件
#-dontoptimize
#https://blog.csdn.net/JiangJsf/article/details/83375581
#https://www.jianshu.com/p/a19712c6b19d
#移除log代码
-assumenosideeffects class android.util.Log {
     public static *** d(...);
     public static *** e(...);
     public static *** i(...);
     public static *** v(...);
     public static *** println(...);
     public static *** w(...);
     public static *** wtf(...);
}

#移除Exception代码
-assumenosideeffects class java.lang.Exception{
     public *** printStackTrace(...);
}

#移除print代码
-assumenosideeffects class java.io.PrintStream {
    public *** println(...);
    public *** print(...);
}

 #预校验
-dontpreverify

 #混淆时是否记录日志
-verbose

 # 混淆时所采用的算法
-optimizations !code/simplification/arithmetic,!field/*,!class/merging/*

#保护注解
-keepattributes *Annotation*,InnerClasses

# 保持哪些类不被混淆
-keep public class * extends android.app.Fragment
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Application
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.preference.Preference
-keep public class * extends android.content.ContentProvider
-keep public class * extends android.support.v4.**
-keep public class * extends android.support.annotation.**
-keep public class * extends android.support.v7.**
-keep public class * extends android.app.backup.BackupAgentHelper
-keep public class * extends android.view.View
-keep public class com.android.vending.licensing.ILicensingService
-keep class android.support.** {*;}

#忽略警告
-ignorewarnings

##记录生成的日志数据,gradle build时在本项目根目录输出##
#apk 包内所有 class 的内部结构
#-dump proguard/class_files.txt
#未混淆的类和成员
#-printseeds proguard/seeds.txt
#列出从 apk 中删除的代码
#-printusage proguard/unused.txt
#混淆前后的映射
#-printmapping proguard/mapping.txt
########记录生成的日志数据，gradle build时 在本项目根目录输出-end######

#如果引用了v4包
-dontwarn android.support.v4.**
-keep class android.support.v4.app.** { *; }
-keep interface android.support.v4.app.** { *; }
-keep class android.support.v4.** { *; }

#如果引用了v7包
-dontwarn android.support.v7.**
-keep class android.support.v7.internal.** { *; }
-keep interface android.support.v7.internal.** { *; }
-keep class android.support.v7.** { *; }

#support design
-dontwarn android.support.design.**
-keep class android.support.design.** { *; }
-keep interface android.support.design.** { *; }
-keep public class android.support.design.R$* { *; }

-keep class org.apache.tools.**{*;}
-keep class de.measite.smack.**{*;}
-keep class de.innosystec.unrar.**{*;}

-keepattributes SourceFile,LineNumberTable

#保持 native 方法不被混淆
-keepclasseswithmembernames class * {
    native <methods>;
}

#保持自定义控件类不被混淆
-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet);
    public <init>(android.content.Context, android.util.AttributeSet, int);
}

#保持自定义控件类不被混淆，#这个主要是在layout 中写的onclick方法android:onclick="onClick"，不进行混淆
-keepclassmembers class * extends android.app.Activity {
   public void *(android.view.View);
}

-keep public class * extends android.view.View {
    public <init>(android.content.Context);
    public <init>(android.content.Context, android.util.AttributeSet);
    public <init>(android.content.Context, android.util.AttributeSet, int);
    public void set*(...);
}

#保持 Parcelable 不被混淆
-keep class * implements android.os.Parcelable {
  public static final android.os.Parcelable$Creator *;
}

#保持 Serializable 不被混淆
-keepnames class * implements java.io.Serializable

#保持 Serializable 不被混淆并且enum 类也不被混淆
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    !static !transient <fields>;
    !private <fields>;
    !private <methods>;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

#保持枚举 enum 类不被混淆
-keepclassmembers enum * {
  public static **[] values();
  public static ** valueOf(java.lang.String);
}

-keepclassmembers class * {
    public void *ButtonClicked(android.view.View);
}

#不混淆资源类
-keepclassmembers class **.R$* {
    public static <fields>;
}
-keep class **.R$* {
 *;
}
-keepclassmembers class * {
    void *(*Event);
}

#确保openFileChooser方法不被混淆
-keepclassmembers class * extends android.webkit.WebChromeClient{
 public void openFileChooser(...);
 }

#fresco混淆
# Keep native methods
-keepclassmembers class * {
    native <methods>;
}

#---------------------------------2.与js互相调用的类------------------------
-keepattributes *JavascriptInterface*

#eg:如果你在WebViewActivity定义一个和Js交互的接口JsCallback，那么可以按照下面的格式写
#-keepclassmembers class cn.xx.xx.WebViewActivity$JsCallback {
#  public *;
#}

#----------------------------手动启用support keep注解------------------------
-dontskipnonpubliclibraryclassmembers
-printconfiguration
-keep,allowobfuscation @interface android.support.annotation.Keep
-keep @android.support.annotation.Keep class *
-keepclassmembers class * {
    @android.support.annotation.Keep *;
}

#为了插件共用主工程代码
-keep class com.facebook.react.** {*;}
-keep class com.facebook.dubug.** {*;}
-keep class com.facebook.hermes.** {*;}
-keep class com.facebook.jni.** {*;}
-keep class com.facebook.perftest.** {*;}
-keep class com.facebook.proguard.annotations.** {*;}
-keep class com.facebook.systrace.** {*;}
-keep class com.facebook.yoga.** {*;}
-keep class com.tencent.smtt.** {*;}
-keep class com.tencent.tbs.video.interfaces.** {*;}
-keep class com.tencent.mmkv.** {*;}
-keep class com.heytap.mcssdk.** {*;}
-keep class com.mcs.aidl.** {*;}
-keep class com.mcs.aidl.** {*;}
-keep class com.meizu.cloud.** {*;}
-keep class com.tencent.imsdk.** {*;}
-keep class com.tencent.liteav.** {*;}
-keep class com.tencent.** {*;}
-keep class com.xiaomi.** {*;}


-dontwarn dalvik.**
-dontwarn com.tencent.smtt.**

-dontwarn com.tencent.bugly.**
-keep public class com.tencent.bugly.**{*;}

#vivo推送
-dontwarn com.vivo.push.**
-keep class com.vivo.push.**{*;   }
-keep class com.vivo.vms.**{*; }
#-keep class * extends android.content.BroadcastReceiver

#oppo推送
-keep public class * extends android.app.Service
-keep class com.heytap.msp.** { *;}

#腾讯云sdk
-keep class com.tencent.imsdk.** { *; }
-keep class com.tencent.** { *; }
#ijkplayer
-keep class tv.danmaku.ijk.media.player.** {*;}
-keep class tv.danmaku.ijk.media.player.IjkMediaPlayer{*;}
-keep class tv.danmaku.ijk.media.player.ffmpeg.FFmpegApi{*;}

-keep class simijkplayer.**{
    public <fields>;
    public <methods>;
}
-keep class tv.danmaku.ijk.media.**{
    <fields>;
    <methods>;
}

#SuperTextView
-keep class com.coorchice.library.gifdecoder.JNI { *; }
-keep class com.facebook.react.turbomodule.** { *; }


-dontwarn com.yalantis.ucrop**
-keep class com.yalantis.ucrop** { *; }
-keep interface com.yalantis.ucrop** { *; }

#react-native-device-info
-keepclassmembers class com.android.installreferrer.api.** {
  *;
}

#自定义字典
-obfuscationdictionary proguard-tradition.txt
-packageobfuscationdictionary proguard-tradition.txt
-classobfuscationdictionary proguard-tradition.txt

#rn config
-keep class net.xixian.BuildConfig { *; }