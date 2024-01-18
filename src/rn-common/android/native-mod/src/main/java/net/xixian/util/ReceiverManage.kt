package net.xixian.util

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReadableMap
import net.xixian.mod.sendEvent
import net.rxaa.ext.notEmpty
import net.rxaa.ext.notNull


val receiverMap = HashMap<Int, BroadcastReceiver>();

object ReceiverManage {

    fun unregisterReceiver(cont: Context, id: Int, res: Promise) {
        val cb = receiverMap.get(id) ?: kotlin.run {
            res.resolve(false)
            return;
        }

        receiverMap.remove(id);
        cont.unregisterReceiver(cb) //注销广播

        res.resolve(true)
    }


    fun registerReceiver(cont: ReactContext, filterParas: ReadableMap, eventId: Int, res: Promise) {

        val filter = IntentFilter()

        filterParas.getArray("action").notNull {
            for (i in 0 until it.size()) {
                it.getString(i).notEmpty {
                    filter.addAction(it)
                }
            }
        }

        filterParas.getArray("category").notNull {
            for (i in 0 until it.size()) {
                it.getString(i).notEmpty {
                    filter.addCategory(it)
                }
            }
        }

        filterParas.getArray("dataScheme").notNull {
            for (i in 0 until it.size()) {
                it.getString(i).notEmpty {
                    filter.addDataScheme(it)
                }
            }
        }

        filterParas.getArray("dataType").notNull {
            for (i in 0 until it.size()) {
                it.getString(i).notEmpty {
                    filter.addDataType(it)
                }
            }
        }

        filterParas.getArray("dataAuthority").notNull {
            for (i in 0 until it.size()) {
                it.getMap(i).notNull {
                    filter.addDataAuthority(it.getString("host"), it.getString("port"))
                }
            }
        }

        filterParas.getArray("dataPath").notNull {
            for (i in 0 until it.size()) {
                it.getMap(i).notNull {
                    filter.addDataPath(it.getString("path"), it.getInt("type"))
                }
            }
        }

        val cb = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                sendEvent(cont, eventId) {
                    val dats = Arguments.createMap();
                    dats.putString("action", intent?.action ?: "")
                    val extras = Arguments.createMap();


                    intent?.extras.notNull {
                        for (k in it.keySet()) {
                            try {
                                val v = it.get(k)
                                if (v is String) {
                                    extras.putString(k, v)
                                } else if (v is Int) {
                                    extras.putInt(k, v)
                                } else if (v is Boolean) {
                                    extras.putBoolean(k, v)
                                } else if (v is Double) {
                                    extras.putDouble(k, v)
                                } else if (v is Float) {
                                    extras.putDouble(k, v.toDouble())
                                }
                            } catch (e: Exception) {
                            }
                        }
                    }
                    dats.putMap("extras", extras);
                    it.pushMap(dats)
                }
            }
        }



        receiverMap.put(eventId, cb)

        cont.registerReceiver(cb, filter) //注册广播

        res.resolve(eventId)

    }
}