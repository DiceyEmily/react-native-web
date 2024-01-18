package net.xixian.util

import android.content.Context
import android.widget.TextView
import net.rxaa.ext.*
import net.rxaa.http.HttpDown
import net.rxaa.media.BmpBuffer
import net.rxaa.util.df
import java.io.File

/**
 * 下载文件
 */
class DownloadFid(val fid: String) : HttpDown(
    if (fid.startsWith("http"))
        fid
    else if (fid == "")
        ""
    else
        HotLoad.host +
                fid
//&device=${Pack.getDeviceID()}&cid=${Var.user.ccn}
) {

    companion object {
        val bmpBuffer = BmpBuffer()

        fun fidMenu(fid: String): File {
            val path = File(fid);
            return FileExt.getCacheDir() + "/file/${path.name}"
        }
    }

    /**
     * 关联一个activity,当activity关闭时,取消下载
     */
    override fun activity(act: Context): DownloadFid {
        super.activity(act)
        return this
    }

    /**
     * 是否开启文件缓存与断点续传
     */
    override fun temp(temp: Boolean): DownloadFid {
        super.temp(temp)
        return this
    }


    var showMsg = true;
    /**
     * 显示失败消息
     */
    fun faildMsg(show: Boolean): DownloadFid {
        showMsg = show;
        return this
    }

    private var hasMem = false;
    /**
     * 开启内存缓存
     */
    fun memBuf(buf: Boolean): DownloadFid {
        hasMem = buf;
        return this
    }

    private var textViewProg: TextView? = null;
    /**
     * 显示加载进度
     */
    fun textProg(text: TextView): DownloadFid {
        textViewProg = text;
        prog = { transferSize, fileSize ->
            val percent = (transferSize * 100 / fileSize).toInt()
            textViewProg.notNull { textViewProg ->
                df.runOnUi {
                    text.show
                    textViewProg.text = fileSize.toByteString() + "  " + percent + "%"
                }
            }
        }
        return this
    }


    private var loadingShow = true;
    /**
     * 加载动画
     */
    fun loadAnim(show: Boolean): DownloadFid {
        loadingShow = show;
        return this
    }



    /**
     * 文件储存目录
     */
    var fileMenu = fun(): File {
        if (fid.startsWith("http")) {
            return super.FileMenu()
        }
//        if (thum > 0)
////            return df.getCacheDir() + "/file/${fid}_${thum}.jpg"
////        else
        return fidMenu(fid)
    }

    /**
     * 文件储存目录
     */
    override fun FileMenu(): File {
        return fileMenu();
    }
}
