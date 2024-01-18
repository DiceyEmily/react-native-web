package net.xixian.mvvm.util


/**
 * 单参无返回值函数
 */
fun interface PluginFunc1<T> {
    fun run(arg: T);
}

/**
 * 单参有返回值函数
 */
fun interface PluginFunc1Ret<T, R> {
    fun run(arg: T): R;
}

fun interface PluginFunc2<T, T2> {
    fun run(arg: T, arg2: T2);
}

fun interface PluginFunc2Ret<T, T2, R> {
    fun run(arg: T, arg2: T2): R;
}

fun interface PluginFunc3<T, T2, T3> {
    fun run(arg: T, arg2: T2, arg3: T3);
}