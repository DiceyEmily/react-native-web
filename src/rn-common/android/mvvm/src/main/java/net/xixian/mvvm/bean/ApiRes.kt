package net.xixian.mvvm.bean

import java.io.Serializable

class ApiRes<T>(
    var data: T?,
    var errorCode: String = "",
    var errorMessage: String? = "",
    var success: Boolean = false,
) : Serializable {
}