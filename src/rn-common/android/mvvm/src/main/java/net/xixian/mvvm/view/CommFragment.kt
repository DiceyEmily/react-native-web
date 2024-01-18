package net.xixian.mvvm.view

import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import net.rxaa.ext.FileExt
import net.rxaa.util.df
import net.rxaa.view.BindView
import java.lang.ref.WeakReference
import java.util.*

/**
 * 公共基Fragment
 */
abstract class CommFragment : Fragment() {

    //NavView缓存
    var cache = false;

    companion object {
        private val fragmentList = ArrayList<CommFragment>()

        private var currentFragment_ = WeakReference<CommFragment>(null)


        /**
         * 获取所有Fragment
         */
        val allFragment: ArrayList<CommFragment>
            get() = fragmentList

        /**
         * 获取当前显示Fragment
         */
        val currentActivity: CommFragment?
            get() = currentFragment_.get()

        /**
         * 查找func参数对应的activity,并执行func
         */
        inline fun <reified T : CommFragment> findFragment(func: (T) -> Unit) {
            allFragment.forEach {
                if (it is T) {
                    func(it)
                }
            }
        }
    }

    //layout 资源id
    private var viewId = 0;

    private val createList = ArrayList<() -> Unit>();


    private var rootVi: View? = null


    val cont
        get() = requireContext()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.w("wwwwwwwwww", "fragment onCreate: " + this.javaClass.name)
        fragmentList.add(this)
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.w("wwwwwwwwww", "fragment onDestroy: " + this.javaClass.name)
        for (i in fragmentList.size - 1 downTo 0) {
            if (fragmentList[i] == this) {
                fragmentList.removeAt(i)
                break
            }
        }
    }

    override fun onPause() {
        super.onPause()
        Log.w("wwwwwwwwww", "fragment onPause: " + this.javaClass.name)
    }

    override fun onResume() {
        super.onResume()
        Log.w("wwwwwwwwww", "fragment onResume: " + this.javaClass.name)
        currentFragment_ = WeakReference(this)
    }

    /**
     * 获取对应view
     */
    fun getRootView()
            : View {
        return rootVi!!;
    }


    fun launch(block: suspend () -> Unit) {
        df.launchMain(block)
    }

    /**
     * 延迟加载(在onCreateView之后调用)
     */
    fun <T> create(func: () -> T): BindView<T> {
        return BindView(func, createList);
    }

    /**
     * Set the Fragment's content view to the given layout and return the associated binding.
     */
    fun <T> binding(
        resId: Int,
        func: (v: View) -> T,
    ): BindView<T> {
        viewId = resId;
        return BindView({
            func(getRootView())
        }, createList);
    }


    override fun onAttach(context: Context) {
        if (df.appContext == null)
            df.init(context)

        super.onAttach(context)

    }


    /**
     * onCreateView成功后的回调，在此界面初始化
     */
    abstract fun onInit(view: View);


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        //处理viewpager中fragment反复销毁创建问题
        if (rootVi == null) {
            FileExt.catchLog {
                rootVi = inflater.inflate(viewId, container, false)
                if (context != null && isAdded && !isDetached) {
                    createList.forEach { it() }
                    createList.clear()
                    onInit(rootVi!!)
                }

            }
        } else {
            if (rootVi!!.parent != null) {
                val viewGroup = rootVi!!.parent as ViewGroup
                viewGroup.removeView(rootVi)
            }
        }
        if (rootVi == null)
            rootVi = View(cont)
        return rootVi
    }


    open override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
    }


}