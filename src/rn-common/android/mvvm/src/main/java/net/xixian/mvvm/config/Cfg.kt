package net.xixian.mvvm.config

import net.xixian.mvvm.model.MMKVObject
import net.xixian.mvvm.bean.LocalConfig




/**
 * 本都配置信息
 */
val localConfig by lazy { MMKVObject(LocalConfig::class.java) }




