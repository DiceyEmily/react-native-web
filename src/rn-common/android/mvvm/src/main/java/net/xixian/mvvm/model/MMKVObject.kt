package net.xixian.mvvm.model

import com.google.gson.Gson
import com.tencent.mmkv.MMKV
import net.rxaa.ext.FileExt
import net.rxaa.util.FileObject
import java.io.Serializable

/**
 * MMKV文件对象映射
 * @param clas 对象class
 * @param cryptKey 加密key,不加密传null
 */
class MMKVObject<T : Serializable> @JvmOverloads constructor(
    clas: Class<T>,
    private val cryptKey: String? = "hsoa"
) :
    FileObject<T>(clas) {

    companion object {
        val gson = Gson()
    }

    private fun getMMKV() = MMKV.mmkvWithID(clas.name, MMKV.SINGLE_PROCESS_MODE, cryptKey)

    override fun load(): T {
        FileExt.catchLog {
            val str = getMMKV()?.decodeString("obj_", "")
            if (!str.isNullOrEmpty()) {
                val obj = gson.fromJson(str, clas)
                inst = obj;
                return obj
            }
        }
        getMMKV()?.removeValueForKey("obj_")
        val obj = clas.newInstance();
        inst = obj;
        return obj
    }

    override fun save() {
        FileExt.catchLog {
            val str = gson.toJson(inst ?: return)
            getMMKV()?.encode("obj_", str)
        }
    }
}