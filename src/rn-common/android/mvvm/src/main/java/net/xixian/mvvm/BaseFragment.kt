package net.xixian.mvvm

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment

/**
 * @author djm
 * on 2017/6/14 16:01.
 * describe ：fragment基类
 */

abstract class BaseFragment : Fragment() {

    private var v: View? = null

    /**
     * 布局view id
     *
     * @return id
     */
    protected abstract fun setView(): Int

    /**
     * 初始化操作
     *
     * @param view 视图
     */
    protected abstract fun initView(view: View)

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        //处理viewpager中fragment反复销毁创建问题
        if (v == null) {
            v = inflater.inflate(setView(), container, false)
            initView(v!!)
        } else {
            if (v?.parent != null) {
                val viewGroup = v?.parent as ViewGroup
                viewGroup.removeView(v)
            }
        }
        return v
    }

}

