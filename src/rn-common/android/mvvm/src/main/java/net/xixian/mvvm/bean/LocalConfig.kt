package net.xixian.mvvm.bean

import net.xixian.mvvm.BaseApplication
import java.io.Serializable


class LocalConfig : Serializable {

    //禁止截屏
    var jieping = true

    //字体大小
    var fontScale = if (BaseApplication.instance.isTabletDevice)
        1.3f
    else
        1f
}