package net.xixian.mvvm.util;

import android.app.Activity
import android.content.Intent
import android.graphics.*
import android.graphics.drawable.Drawable
import android.os.Build
import android.os.Environment
import android.view.Gravity
import android.view.KeyCharacterMap
import android.view.KeyEvent
import android.view.ViewConfiguration
import androidx.core.graphics.drawable.RoundedBitmapDrawableFactory
import cn.hutool.core.date.DatePattern
import cn.hutool.core.date.DateUtil
import cn.hutool.core.io.FileUtil
import net.xixian.mvvm.BuildConfig
import net.rxaa.util.Net
import net.xixian.mvvm.BaseApplication
import java.io.*
import java.nio.MappedByteBuffer
import java.nio.channels.FileChannel
import java.security.MessageDigest
import java.security.NoSuchAlgorithmException
import java.util.*
import kotlin.math.min
import kotlin.system.exitProcess


/**
 * @author 123456 on 2017/9/25.
 *
 *
 * Describe :app 公共的方法
 */

object ComFunUtils {

    /**
     * 收集设备参数信息
     * 使用反射来收集设备信息.在Build类中包含各种设备信息,系统版本号,设备生产商 等帮助调试程序的有用信息
     */
    private val crashReport: String
        get() {
            val pInfo = AppUtils.getAppInfo(
                BaseApplication.instance.packageName
            )
            val mInfo = HashMap<String, String>()
            if (null != pInfo) {
                mInfo["App Version："] = pInfo.versionName
                mInfo["App Code："] = pInfo.versionCode.toString() + ""
            }
            try {
                val fields = Build::class.java.declaredFields
                for (f in fields) {
                    f.isAccessible = true
                    mInfo[f.name] = f.get(null)!!.toString()
                }
            } catch (e: Exception) {
                LogUtils.d("occurred", "an error occurred when collect crash info..." + e.message)
            }

            val sb = StringBuilder()
            if (mInfo.size > 0) {
                for ((key, value) in mInfo) {
                    sb.append(key).append("=").append(value).append("\n")
                }
            }

            return sb.toString()
        }

    /**
     * 判断是否存在SDCard
     */
    fun hasSDCard(): Boolean {
        val status = Environment.getExternalStorageState()
        return status == Environment.MEDIA_MOUNTED
    }

    /**
     * 保存路径,在Android/data/应用包名/cache和file文件夹下
     */
    fun getPath(tag: String?): String {
        var tag1 = tag
        if (tag1 == null) {
            tag1 = ""
        }
        return if (hasSDCard()) {
            if (tag1 == LogUtils.TAG) {
                BaseApplication.instance.externalCacheDir!!.path + "/" + LogUtils.TAG
            } else {
                BaseApplication.instance.getExternalFilesDir(tag1)!!.path
            }
        } else {
            if (tag1 == LogUtils.TAG) {
                BaseApplication.instance.cacheDir.path
            } else {
                BaseApplication.instance.filesDir.path
            }
        }
    }


    /**
     * 创建保存的日志文件
     *
     * @param tag 打印日志的题目标志(注：tag的取名不要有空字符)
     * 异常crash 日志logcat 分两文件夹
     * @param msg 打印信息
     */
    fun createFile(tag: String, msg: String?, up: Boolean) {
        var m = msg
        if (m == null) {
            m = "null"
        }
        val fileTime = DateUtil.format(DateUtil.date(), DatePattern.NORM_DATETIME_MS_PATTERN)
        val index = fileTime.lastIndexOf(".")
        val fileTime1 = fileTime.substring(0, index)
        val name = ""
        val filter = FileFilter { file -> file.name.endsWith(".log") }
        val allFiles = FileUtil.loopFiles(getPath(LogUtils.TAG), filter)
        //文件名称
        var fileName: String? = null
        try {
            for (f in allFiles) {
                if (f.name.contains("$name-$tag-")) {
                    //存在这个日志文件
                    val fTime = f.name.substring(
                        f.name.indexOf("$name-$tag-") + "$name-$tag-".length,
                        f.name.length - ".log".length
                    )
                    if (DateUtil.betweenMs(
                            DateUtil.parse(fileTime1),
                            DateUtil.parse(fTime)
                        ) <= 12 * 60 * 60 * 1000
                    ) {
                        //存在12小时内的文件
                        fileName = f.name
                    } else {
                        if (!BuildConfig.DEBUG) {
                            //存在这个久的文件,就上传服务器
                            if (up) upFileServer(f, tag)
                        }
                    }
                }
            }
            //文件夹
            val path = getPath(LogUtils.TAG) + "/"
            val dir = File(path)
            if (!dir.exists()) {
                //创建文件夹
                dir.mkdirs()
            }
            //最新文件名
            val fileName1 = "$name-$tag-$fileTime1.log"
            //需要创建新的文件
            m = if (fileName == null) {
                //添加头信息
                "$crashReport\n$name $fileTime $m\n\n"
            } else {
                "$name $fileTime $m\n\n"
            }
            val newFile = File(path + fileName1)
            if (fileName != null) {
                //存在这个文件，修改文件名到最新时间
                File(path + fileName).renameTo(newFile)
            }

            //true表示在写的时候在文件末尾追加
            val fos = FileOutputStream(newFile, true)
            fos.write(m.toByteArray())
            fos.close()
        } catch (e: Exception) {
            LogUtils.d("fileLog", "an error occurred while writing file..." + e.message)
        }
    }

    /**
     * 上传文件
     */
    fun upFileServer(file: File?, tag: String?) {
        if (file == null) {
            return
        }
        if (!Net.isNetworkConnected()) {
            return
        }
        //有网络
        //发送广播上传日志
        BaseApplication.instance.sendBroadcast(
            Intent("net.xixian.up.log")
                .putExtra("file", file.path)
                .addCategory(AppUtils.appPackageName)
                .addCategory(Intent.CATEGORY_DEFAULT)
        )
    }

    /**
     * 大文件获取 SHA1  防止内存溢出
     *
     * @param file
     * @return
     */
    fun getSHA1Value(file: File): String {
        val builder = StringBuilder()
        var fileInputStream: FileInputStream? = null
        try {
            fileInputStream = FileInputStream(file)
            val messageDigest = MessageDigest.getInstance("SHA-1")
            var mappedByteBuffer: MappedByteBuffer?
            //每2M 读取一次，防止内存溢出
            val bufferSize = (1024 * 1024 * 2).toLong()
            //文件大小
            val fileLength = file.length()
            //文件最后不足2M 的部分
            val lastBuffer = fileLength % bufferSize
            val bufferCount = fileLength / bufferSize
            //分块映射
            for (b in 0 until bufferCount) {
                //使用内存映射而不是直接用IO读取文件，加快读取速度
                mappedByteBuffer = fileInputStream.channel
                    .map(FileChannel.MapMode.READ_ONLY, b * bufferSize, bufferSize)
                messageDigest.update(mappedByteBuffer!!)
            }
            if (lastBuffer != 0L) {
                mappedByteBuffer = fileInputStream.channel
                    .map(FileChannel.MapMode.READ_ONLY, bufferCount * bufferSize, lastBuffer)
                messageDigest.update(mappedByteBuffer!!)
            }
            val digest = messageDigest.digest()
            var hexString = ""
            for (i in digest.indices) {
                //转16进制数，再转成哈希码
                hexString = Integer.toHexString(digest[i].toInt() and 0xFF)
                if (hexString.length < 2) {
                    builder.append(0)
                }
                builder.append(hexString)
            }
        } catch (e: FileNotFoundException) {
            e.printStackTrace()
        } catch (e: NoSuchAlgorithmException) {
            e.printStackTrace()
        } catch (e: IOException) {
            e.printStackTrace()
        } finally {
            if (fileInputStream != null) {
                try {
                    fileInputStream.close()
                } catch (e2: Exception) {
                    e2.printStackTrace()
                }

            }
        }
        //内存回收
        System.gc()
        System.runFinalization()
        return builder.toString()
    }

    /**
     * 判断事件连续操作的间隔时间段，是否符合制定的间隔要求
     */
    fun stopDoubleClick(startTime: Long, time: Long = 600): Long {
        var startTime1 = startTime
        try {
            val endTime = System.currentTimeMillis()
            //连续双击
            startTime1 = if (endTime - startTime1 < time) {
                //点击时间小于600ms，防止多开页面
                0
            } else {
                endTime
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        return startTime1
    }

    /**
     * 替换单独的%，防止URLDecoder.decode报错
     *
     * @param string 替换数据
     * @return 替换结果
     */
    fun replaceStr(string: String): String {
        return string.replace("%(?![0-9a-fA-F]{2})".toRegex(), "%25")
    }


    /**
     * 清空空字符
     */
    fun clearTrim(content: String): String {
        val sss: String = content.replace("\\u3000".toRegex(), "")
        val ss = sss.replace("\\u0020".toRegex(), "")
        return ss
    }

    /**
     * 判断虚拟键盘是否显示
     */
    fun isNavigationBarShow(activity: Activity): Boolean {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            val display = activity.windowManager.defaultDisplay
            val size = Point()
            val realSize = Point()
            display.getSize(size)
            display.getRealSize(realSize)
            return realSize.y != size.y
        } else {
            val menu = ViewConfiguration.get(activity).hasPermanentMenuKey()
            val back = KeyCharacterMap.deviceHasKey(KeyEvent.KEYCODE_BACK)
            return !menu && !back
        }
    }

    /**
     * 图片圆形
     *
     * @param bitmap 图片
     * @return drawable
     */
    fun createRoundImageWithBorder(bitmap: Bitmap): Drawable {
        //原图宽度
        val bitmapWidth = bitmap.width
        //原图高度
        val bitmapHeight = bitmap.height
        //边框宽度 pixel
        val borderWidthHalf = 0

        //转换为正方形后的宽高
        val bitmapSquareWidth = min(bitmapWidth, bitmapHeight)

        //最终图像的宽高
        val newBitmapSquareWidth = bitmapSquareWidth + borderWidthHalf

        val roundedBitmap =
            Bitmap.createBitmap(newBitmapSquareWidth, newBitmapSquareWidth, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(roundedBitmap)
        val x = borderWidthHalf + bitmapSquareWidth - bitmapWidth
        val y = borderWidthHalf + bitmapSquareWidth - bitmapHeight

        //裁剪后图像,注意X,Y要除以2 来进行一个中心裁剪
        canvas.drawBitmap(bitmap, (x / 2).toFloat(), (y / 2).toFloat(), null)
        val borderPaint = Paint()
        borderPaint.style = Paint.Style.STROKE
        borderPaint.strokeWidth = borderWidthHalf.toFloat()
        borderPaint.color = Color.WHITE

        //添加边框
        canvas.drawCircle(
            (canvas.width / 2).toFloat(),
            (canvas.width / 2).toFloat(),
            (newBitmapSquareWidth / 2).toFloat(),
            borderPaint
        )

        val roundedBitmapDrawable =
            RoundedBitmapDrawableFactory.create(UIUtils.getResources(), roundedBitmap)
        roundedBitmapDrawable.gravity = Gravity.CENTER
        roundedBitmapDrawable.isCircular = true
        return roundedBitmapDrawable
    }

    /**
     * 关闭app
     */
    fun killApp() {
        android.os.Process.killProcess(android.os.Process.myPid())
        exitProcess(0)
    }

}
