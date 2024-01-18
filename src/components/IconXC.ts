import { createIconComponent } from "@common/lib/components/icon/Icon"

export type IconXCnames = keyof typeof IconXCDatas;

const IconXCDatas = {
    //投影仪
    "touyingyi": 59390,
    //联系人
    "lianxiren": 59387,
    //待办
    "daiban": 59388,
    //定位
    "dingwei": 59389,
    //话题主持人
    "huatizhuchiren": 59391,
    //人员
    "renyuan": 59392,
    //添加
    "tianjia1": 58881,
    //第一名
    "diyiming": 59384,
    //第二名
    "dierming": 59385,
    //第三名
    "disanming": 59386,
    //已关注
    "yiguanzhu": 59383,
    //恢复待办
    "huifudaiban": 59354,
    //未关注
    "weiguanzhu": 59356,
    //公文便签
    "gongwenbianqian": 59358,
    //设置主办
    "shezhizhuban": 59359,
    //重发
    "zhongfa": 59360,
    //收回
    "shouhui": 59361,
    //转发文
    "zhuanfawen": 59362,
    //标签
    "biaoqian": 59363,
    //删除人员
    "shanchurenyuan": 59364,
    //传阅
    "chuanyue": 59365,
    //补发
    "bufa": 59366,
    //退回
    "tuihui": 59375,
    //激活
    "jihuo": 59376,
    //查看详情
    "chakanxiangqing": 59377,
    //编辑
    "bianji": 59378,
    //更多
    "gengduo2": 59379,
    //办完
    "banwan": 59380,
    //催办
    "cuiban": 59381,
    //办结
    "banjie": 59382,
    //单选_未选
    "danxuan_weixuan": 59352,
    //单选_选中
    "danxuan_xuanzhong": 59374,
    //意见填写 · 横线
    "yijiantianxiehengxian": 59351,
    //签收
    "qianshou": 59320,
    //未收
    "weishou": 59321,
    //拒收
    "jushou": 59322,
    //答复
    "dafu": 59323,
    //已阅
    "yiyue": 59324,
    //未阅
    "weiyue": 59325,
    //Word
    "Word": 59367,
    //未知文件
    "weizhiwenjian": 59368,
    //压缩包
    "yasuobao": 59369,
    //PDF
    "PDF": 59370,
    //PPT
    "PPT": 59371,
    //Excel
    "Excel": 59372,
    //图片
    "tupian": 59373,
    //输入意见
    "shuruyijian": 59353,
    //返回
    "fanhui1": 59334,
    //跳转
    "tiaozhuan": 59335,
    //清空
    "qingkong": 59336,
    //收起
    "shouqi": 59337,
    //展开
    "zhankai": 59338,
    //问号2
    "wenhao2": 59331,
    //问号
    "wenhao": 59332,
    //清楚  关闭
    "qingchuguanbi": 59326,
    //选中
    "xuanzhong": 59327,
    //删除
    "shanchu1": 59328,
    //添加
    "tianjia": 59329,
    //温馨提示
    "wenxintishi": 59330,
    //日历
    "rili": 59333,
    //卡片删除2
    "kapianshanchu2": 59319,
    //卡片选中
    "kapianxuanzhong": 59318,
    //卡片删除
    "kapianshanchu": 59313,
    //组织树_展开
    "zuzhishu_zhankai": 59314,
    //复选_选中
    "fuxuan_xuanzhong": 59315,
    //组织树_收起
    "zuzhishu_shouqi": 59316,
    //复选_未选
    "fuxuan_weixuan": 59317,
    //工作圈
    "gongzuoquan": 59308,
    //消息
    "xiaoxi": 59309,
    //新建
    "xinjian": 59310,
    //数据
    "shuju": 59312,
    //历史意见
    "lishiyijian": 59295,
    //流程_箭头
    "liucheng_jiantou": 59296,
    //更多
    "gengduo1": 59299,
    //矩形 845 拷贝 8
    "juxing845kaobei8": 59300,
    //分类_选择
    "fenlei_xuanze": 59301,
    //交换_发给
    "jiaohuan_fagei": 59306,
    //删除
    "shanchu": 59307,
    //待阅
    "daiyue": 59294,
    //登录箭头
    "denglujiantou": 59290,
    //更多
    "gengduo": 59282,
    //公文办理
    "gongwenbanli": 59283,
    //会议办理
    "huiyibanli": 59284,
    //通讯录
    "tongxunlu": 59285,
    //返回
    "fanhui": 59274,
    //tab_选中
    "tab_xuanzhong": 59275,
    //搜索_小
    "sousuo_xiao": 59276,
    //搜索_大
    "sousuo_da": 59277,
    //排序
    "paixu": 59278,
    //语音服务
    "yuyinfuwu": 59280,
    //扫码
    "saoma": 59281,

}

export const IconXC = createIconComponent(IconXCDatas, "IconXC", "IconXC.ttf")