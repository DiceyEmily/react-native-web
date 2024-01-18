package net.xixian.util

import net.rxaa.ext.FileExt
import net.rxaa.ext.addMenu
import net.rxaa.ext.readAllText
import net.rxaa.http.HttpDown
import net.rxaa.http.HttpEx
import net.rxaa.util.Json
import net.rxaa.util.Pack
import net.rxaa.util.ZipUtils
import net.rxaa.util.df
import java.io.Serializable


class Ver : Serializable {
    var version = 1
    var file = "app.zip";
    var pic_version = 1;
    var pic_file = "assets.zip";

    //最低支持的app版本
    var app_version = "1.0.0";
}

/**
 * 热更新js文件
 */
object HotLoad {
    var host = ""
    val versionUrl get() = host + "android_version.json"
    val appVersion get() = host + "app_version.json"

    @JvmStatic
    fun jsMenu() = FileExt.getFileDir().addMenu("js")

    /**
     * js 文件地址
     */
    @JvmStatic
    fun jsFile() = jsMenu().addMenu("app.hbc")

    @Volatile
    var isLoad = false;

    fun copyAssertPic() {
        val am = df.appContext!!.assets;
        val list = am.list("imgs") ?: return;
        val menu = jsMenu().addMenu("drawable-mdpi")
        menu.mkdirs()
        for (f in list) {
            am.open("imgs/" + f).use {
                val ff = menu.addMenu(f);
                it.copyTo(ff.outputStream())
            }
        }
    }

    fun copyAssertJs() {
        try {
            val am = df.appContext!!.assets;
            jsMenu().mkdirs();
            am.open("index.android.bundle").use {
                it.copyTo(jsFile().outputStream())
            }
        } catch (e: Exception) {
            FileExt.logException(e)
        }
    }

    /**
     * 开始更新js文件
     */
    @JvmStatic
    fun start(onProg: (transferSize: Long, allSize: Long) -> Unit, res: (change: Boolean) -> Unit) {

        if (isLoad)
            return;
        isLoad = true;
        var changed = false;
        HttpDown.runPool {
            HttpEx.disableSSL();
            FileExt.catchLogNoMsg {
                try {
                    val newVersion = jsMenu().addMenu("new.txt")
                    val oldVersion = jsMenu().addMenu("old.txt")

                    //下载并读取版本文件
                    HttpEx(versionUrl, timeOut = 2500).downloadFile(newVersion, false)
                    val newVer = Json.jsonToObj(newVersion.readAllText(), Ver())

                    if (Pack.versionToLong(newVer.app_version) > Pack.versionToLong(Pack.versionName)) {
                        //当远程最低需求版本大于本地时,不做更新
                        return@catchLogNoMsg;
                    }

                    val oldVer = Ver();
                    val oldVerStr = oldVersion.readAllText();
                    if (oldVerStr != "") {
                        Json.jsonToObj(oldVerStr, oldVer);
                    }

                    var transSize = 0L;
                    var allSize = 1000L;

                    //更新图片
                    if (newVer.pic_version > oldVer.pic_version) {
                        if (newVer.version <= oldVer.version) {
                            allSize /= 2;
                        }
                        //copyAssertPic()
                        //下载并解压
                        val picFile = jsMenu().addMenu(newVer.pic_file)
                        HttpEx(host + newVer.pic_file, timeOut = 5 * 1000).downloadFile(
                            picFile,
                            false,
                            { t, f ->
                                onProg(t * 500 / f, allSize)
                            }
                        )
                        try {
                            ZipUtils.upZipFile(picFile, jsMenu().absolutePath)
                        } catch (e: Exception) {

                        }
                        picFile.delete();
                        transSize = 500;
                        allSize = 1000;
                    } else {
                        allSize /= 2;
                    }

                    if (newVer.version <= oldVer.version) {
                        //无需更新
                        return@catchLogNoMsg;
                    }

                    //下载并解压js文件
                    val jsFile = jsMenu().addMenu(newVer.file)
                    HttpEx(host + newVer.file, timeOut = 5 * 1000).downloadFile(
                        jsFile,
                        false,
                        { t, f ->
                            onProg(transSize + t * 500 / f, allSize)
                        }
                    );
                    ZipUtils.upZipFile(jsFile, jsMenu().absolutePath)
                    jsFile.delete();
                    //替换旧版本号
                    newVersion.renameTo(oldVersion)
                    changed = true;
                    //重启
                    //Pack.restartAPP()
                } finally {
                    isLoad = false;
                }
            }
            df.runOnUi {
                res(changed);
            }

        }

    }
}