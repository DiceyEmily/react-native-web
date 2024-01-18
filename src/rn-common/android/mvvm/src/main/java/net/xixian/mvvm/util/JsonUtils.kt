package net.xixian.mvvm.util

import com.google.gson.Gson
import com.google.gson.JsonObject
import com.google.gson.reflect.TypeToken
import com.google.gson.stream.JsonReader
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.lang.reflect.Type

/**
 * @author djm
 * on 2017/6/14 12:00.
 * describe ：json转换工具类
 */
object JsonUtils {
    private var gson: Gson? = null

    /**
     * 将对象准换为json字符串
     *
     * @param object
     */
    fun <T> serialize(`object`: T): String? {
        var gSonString: String? = null
        if (gson != null) {
            try {
                gSonString = gson!!.toJson(`object`)
            } catch (e: Exception) {
            }
        }
        return gSonString
    }

    fun <T, S> serializeType(json: T): String? {
        var gSonString: String? = null
        if (gson != null) {
            try {
                gSonString = gson!!.toJson(json, object : TypeToken<List<S>>() {}.type)
            } catch (e: Exception) {
            }
        }
        return gSonString
    }

    /**
     * 将json字符串转换为对象
     *
     * @param json
     * @param clz
     * @param <T>
     * @return
    </T> */
    fun <T> deserialize(json: String?, clz: Class<T>?): T? {
        var t: T? = null
        if (gson != null) {
            try {
                t = gson!!.fromJson(json, clz)
            } catch (e: Exception) {
            }
        }
        return t
    }

    /**
     * 将json对象转换为实体对象
     *
     * @param json
     * @param clz
     * @param <T>
     * @return
    </T> */
    fun <T> deserialize(json: JsonObject?, clz: Class<T>?): T? {
        var t: T? = null
        if (gson != null) {
            try {
                t = gson!!.fromJson(json, clz)
            } catch (e: Exception) {
            }
        }
        return t
    }

    /**
     * 将json字符串转换为对象
     *
     * @param json
     * @param type
     * @param <T>
     * @return
    </T> */
    fun <T> deserialize(json: String?, type: Type?): T? {
        var t: T? = null
        if (gson != null) {
            try {
                t = gson!!.fromJson(json, type)
            } catch (e: Exception) {
            }
        }
        return t
    }

    /**
     * 直接把流解析成对象
     *
     * @param reader
     * @param type
     *
     */
    fun <T> deserialize(reader: JsonReader?, type: Type?): T? {
        var t: T? = null
        if (gson != null) {
            try {
                t = gson!!.fromJson(reader, type)
            } catch (e: Exception) {
            }
        }
        return t
    }

    fun <T> deserialize(reader: JsonReader?, clz: Class<T>?): T? {
        var t: T? = null
        if (gson != null) {
            try {
                t = gson!!.fromJson(reader, clz)
            } catch (e: Exception) {
            }
        }
        return t
    }

    fun <S> deserializeType(json: String?): List<S>? {
        var gSonList: List<S>? = null
        if (gson != null) {
            try {
                gSonList = gson!!.fromJson(json, object : TypeToken<List<S>>() {}.type)
            } catch (e: Exception) {
            }
        }
        return gSonList
    }

    fun getJSONString(o: JSONObject, key: String?): String {
        try {
            return o.getString(key)
        } catch (e: JSONException) {
            e.printStackTrace()
        } catch (e: NullPointerException) {
            e.printStackTrace()
        }
        return ""
    }

    fun getJSONObject(jo: JSONObject, key: String?): JSONObject? {
        try {
            return jo.getJSONObject(key)
        } catch (e: JSONException) {
            e.printStackTrace()
        } catch (e: NullPointerException) {
            e.printStackTrace()
        }
        return null
    }

    fun getJsonArray(obj: JSONObject, key: String?): JSONArray? {
        try {
            return obj.getJSONArray(key)
        } catch (e: JSONException) {
            e.printStackTrace()
        } catch (e: NullPointerException) {
            e.printStackTrace()
        }
        return null
    }

    fun getJSONBoolean(jo: JSONObject, key: String?, defalut: Boolean): Boolean {
        try {
            return jo.getBoolean(key)
        } catch (e: JSONException) {
            e.printStackTrace()
        } catch (e: NullPointerException) {
            e.printStackTrace()
        }
        return defalut
    }

    fun getJSONInt(o: JSONObject, key: String?): Int {
        try {
            return o.getInt(key)
        } catch (e: JSONException) {
            e.printStackTrace()
        } catch (e: NullPointerException) {
            e.printStackTrace()
        }
        return -1
    }

    fun getJSONObject(text: String?): JSONObject? {
        try {
            return JSONObject(text)
        } catch (e: JSONException) {
            e.printStackTrace()
        } catch (e: NullPointerException) {
            e.printStackTrace()
        }
        return null
    }

    init {
        gson = Gson()
    }
}