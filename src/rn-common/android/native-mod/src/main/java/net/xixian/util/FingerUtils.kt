package net.xixian.util

import android.app.KeyguardManager
import android.content.Context
import android.hardware.fingerprint.FingerprintManager
import android.os.Build
import androidx.annotation.RequiresApi
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import net.xixian.mod.MainActivity
import net.rxaa.ext.nope
import net.rxaa.ext.notNull
import net.rxaa.util.df
import java.util.concurrent.Executor

object FingerUtils {
    private var fingerprintManager: FingerprintManager? = null
    private var keyguardManager: KeyguardManager? = null

    private lateinit var executor: Executor
    private var biometricPrompt: BiometricPrompt? = null
    private var promptInfo: BiometricPrompt.PromptInfo? = null

    @RequiresApi(api = Build.VERSION_CODES.M)
    private fun FingerUtils(context: Context) {
        fingerprintManager =
            context.getSystemService(Context.FINGERPRINT_SERVICE) as FingerprintManager
        keyguardManager = context.getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
    }


    fun startBiometric() {
        df.runOnUi {
            init();

            promptInfo.notNull {
                biometricPrompt?.authenticate(it)
            }.nope {
                df.msg("指纹识别初始化失败");
            }
        }

    }

    fun init() {

        if (biometricPrompt != null) {
            return;
        }

        MainActivity.inst.notNull { acti ->
            executor = ContextCompat.getMainExecutor(acti)
            biometricPrompt = BiometricPrompt(
                acti, executor,
                object : BiometricPrompt.AuthenticationCallback() {
                    override fun onAuthenticationError(
                        errorCode: Int,
                        errString: CharSequence
                    ) {
                        super.onAuthenticationError(errorCode, errString)
                        df.msg("Authentication error: $errString")
                    }

                    override fun onAuthenticationSucceeded(
                        result: BiometricPrompt.AuthenticationResult
                    ) {
                        super.onAuthenticationSucceeded(result)
                        df.msg("Authentication succeeded!")

                    }

                    override fun onAuthenticationFailed() {
                        super.onAuthenticationFailed()
                        df.msg("Authentication failed")
                    }
                })

            promptInfo = BiometricPrompt.PromptInfo.Builder()
                .setTitle("指纹登录")
                .setSubtitle("请时所用指纹验证")
                .setNegativeButtonText("使用账号密码")
                .build()
        }
    }


}


