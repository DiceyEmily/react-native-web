
export class wpsFilter {
    static readonly saved = "cn.wps.moffice.broadcast.AfterSaved"
    static readonly closed = "cn.wps.moffice.broadcast.AfterClosed"
}
export class wpsDefine {
    public static PREFS_NAME = "MyPrefsFile";			//用于存取参数的文件名
    public static KEY = "PackageName";					//第三方包名
    public static READ_ONLY = "ReadOnly";				//只读模式
    public static NORMAL = "Normal";					//正常模式
    public static READ_MODE = "ReadMode";		//打开文件直接进入阅读器模式
    public static EDIT_MODE = "EditMode";		//打开文件直接进入编辑模式
    public static SAVE_ONLY = "SaveOnly";			//仅仅用来另存文件
    public static VIEW_SCALE = "ViewScale";			//视图比例
    public static VIEW_PROGRESS = "ViewProgress";		//查看进度百分比
    public static VIEW_SCROLL_X = "ViewScrollX";		//显示的x坐标
    public static VIEW_SCROLL_Y = "ViewScrollY";		//显示的y坐标
    public static CLOSE_FILE = "CloseFile";			//关闭的文件
    public static OPEN_FILE = "OpenFile";				//打开的文件
    public static THIRD_PACKAGE = "ThirdPackage";		//第三方的包名
    public static SAVE_PATH = "SavePath";				//文件保存的路径
    public static CLEAR_BUFFER = "ClearBuffer";		//清除缓冲区,默认为true
    public static CLEAR_TRACE = "ClearTrace";			//清除使用痕迹,默认为false
    public static CLEAR_FILE = "ClearFile";			//删除文件自身,默认为false
    public static CHECK_PACKAGE_NAME = "CheckPackageName";		//企业版华为不固定的应用包名
    public static IS_SCREEN_SHOTFORBID = "isScreenshotForbid"; // 禁止截屏

    // 以下是自己重新定义的
    public static USER_NAME = "UserName";
    public static SEND_CLOSE_BROAD = "SendCloseBroad";	//关闭文件时是否发送广播,默认不发送
    public static SEND_SAVE_BROAD = "SendSaveBroad";		//关闭保存时是否发送广播,默认不发送
    public static IS_VIEW_SCALE = "IsViewScale";		//view scale
    public static OPEN_MODE = "OpenMode";				//阅读器模式
    public static AUTO_JUMP = "AutoJump";				//第三方打开文件时是否自动跳转
    public static IS_CLEAR_BUFFER = "IsClearBuffer";		//清除缓冲区,默认为true
    public static IS_CLEAR_TRACE = "IsClearTrace";			//清除使用痕迹,默认为false
    public static IS_CLEAR_FILE = "IsClearFile";			//删除文件自身,默认为false
    public static HOME_KEY_DOWN = "HomeKeyDown";		//Home 按钮
    public static BACK_KEY_DOWN = "BackKeyDown";		//Back 按钮
    public static CACHE_FILE_INVISIBLE = "CacheFileInvisible";		//缓存文件是否可见，默认可见
    public static ENTER_REVISE_MODE = "EnterReviseMode";		//以修订模式打开文档
    public static ENCRYPT_FILE = "EncrptFile";		//加密方式操作文档
    public static MENU_XML = "MenuXML";			//xml菜单
    public static REVISION_NOMARKUP = "RevisionNoMarkup";//修订模式的无标记
    public static DISPLAY_OPEN_FILE_NAME = "DisplayOpenFileName"; // 第三方设置文档显示名称
    public static SHOW_REVIEWING_PANE_RIGHT_DEFAULT = "ShowReviewingPaneRightDefault";		//打开文档默认侧边栏不显示/显示 默认false
    public static WATERMASK_TEXT = "WaterMaskText";//水印文字
    public static WATERMASK_COLOR = "WaterMaskColor";//水印文字颜色

    public static PACKAGE_NAME_ENG = "cn.wps.moffice_eng";    //个人版的包名
    public static PACKAGE_NAME_ENT = "cn.wps.moffice_ent";    //企业版的包名
    public static PACKAGE_NAME = "cn.wps.moffice";            //测试用
    public static PACKAGE_NAME_KING_ENT = "com.kingsoft.moffice_ent";
    public static PACKAGE_NAME_KING_PRO = "com.kingsoft.moffice_pro";
    public static PACKAGE_NAME_KING_PRO_HS = "com.kingsoft.moffice_pro_hs";        //华思定制包名

    public static TRACES_MODE = "tracesMode";//查看修订痕迹

    public static CLASSNAME = "cn.wps.moffice.documentmanager.PreStartActivity2";		//wps类名，标准版本
    //	public static    CLASSNAME = "cn.wps.moffice.emm.EmmOpenFileActivity";		//wps类名，EMM版本
    public static OFFICE_SERVICE_ACTION = "cn.wps.moffice.service.OfficeService";
    public static PRO_OFFICE_SERVICE_ACTION = "cn.wps.moffice.service.ProOfficeService";
    public static OFFICE_ACTIVITY_NAME = "cn.wps.moffice.service.MOfficeWakeActivity";
    public static OFFICE_READY_ACTION = "cn.wps.moffice.service.startup";

    public static WPS_OPEN_MODE = "WPSOPENMODE";
    public static WPS_OPEN_AIDL = "AIDL";
    public static WPS_OPEN_THIRD = "THIRD";

    public static FAIR_COPY = "FairCopy";		//清稿
    public static FAIR_COPY_PW = "FairCopyPw";		//清稿密码

    public static IS_SHOW_VIEW = "IsShowView";   //是否显示wps界面

    //自动播放控制
    public static AUTO_PLAY = "AutoPlay";      // PPT直接进入自动播放
    public static AUTO_PLAY_INTERNAL = "AutoPlayInternal";  // PPT自动播放间隔


    public static AT_SAVE = "AT_SAVE";                   //保存
    public static AT_SAVEAS = "AT_SAVEAS";               //另存为
    public static AT_COPY = "AT_COPY";                   //复制
    public static AT_CUT = "AT_CUT";                      //剪切
    public static AT_PASTE = "AT_PASTE";                  //粘贴
    //	public static    AT_EDIT_TEXT = "AT_EDIT_TEXT";          //插入文字
    //	public static    AT_EDIT_PICTURE = "AT_EDIT_PICTURE";      //插入图片
    //	public static    AT_EDIT_SHAPE = "AT_EDIT_SHAPE";         //插入浮动图片
    //	public static    AT_EDIT_CHART = "AT_EDIT_CHART";         //编辑图表
    public static AT_SHARE = "AT_SHARE";                    //分享
    public static AT_PRINT = "AT_PRINT";                    //输出
    public static AT_SPELLCHECK = "AT_SPELLCHECK";          //拼写检查
    public static AT_QUICK_CLOSE_REVISEMODE = "AT_QUICK_CLOSE_REVISEMODE";          //快速关闭修订
    public static AT_MULTIDOCCHANGE = "AT_MULTIDOCCHANGE";          //多文档切换
    public static AT_EDIT_REVISION = "AT_EDIT_REVISION";
    public static AT_CURSOR_MODEL = "AT_CURSOR_MODEL";
    public static AT_PATH = "at_path";                             //编辑路径
    public static AT_CHANGE_COMMENT_USER = "AT_CHANGE_COMMENT_USER";
    public static AT_SHARE_PLAY = "AT_SHARE_PLAY";
    public static AT_GRID_BACKBOARD = "AT_GRID_BACKBOARD";
    public static SERIAL_NUMBER_OTHER = "SerialNumberOther"; // android 激活外部传入序列号
    public static SERIAL_NUMBER_OTHERPC = "SerialNumberOtherPc"; // PC 激活外部传入序列号
    public static SCREEN_ORIENTATION = "ScreenOrientation";
    public static ZOOM_OTHER = "zoom";


}
