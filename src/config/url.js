"use strict";


//是否正式环境
let isRelease = process.env.NODE_ENV == "production"


module.exports.url = {

    /* 文件服务 */
    file_url: '',

    //服务资源
    services: '',
    //附件资源
    singlefile: "/api/middleground/v1/file/server/single",//上传照片
    multiplefiles: "/api/middleground/v1/file/server/multiple",//上传多张照片

    authenticate: "/api/authority/oauth/token",//账号密码登录验证
    logout: '/api/authority/oauth/logout',//退出登录

    userInfo: "/api/client/v1/parent/user/getUserInfoByToken",//用户信息
    registerUser: "/api/client/v1/parent/user/save",//注册账号
    updatePassword: "/api/client/v1/parent/user/updatePassword",//修改密码
    updateInfo: "/api/client/v1/parent/user/update",//修改用户信息

    advert: "/api/client/v1/parent/home/advert",//广告轮播图
    module: "/api/client/v1/parent/home/function-module",//获取软件应用
    allmodule: "/api/client/v1/parent/information/get-full-info",//查询所有软件应用
    savemodule: "/api/client/v1/parent/information/save-full-info",//增加首页软件应用
    deletemodule: "/api/client/v1/parent/information/delete-full-info",//删除首页软件应用

    addmodule: "/api/client/v1/parent/information/save-full-info",//增加首页软件应用

    notices: "/api/client/v1/sys/notice/notices",//实时通知

    parents: "/api/client/v1/contact/parents",//家长联系人
    teachers: "/api/client/v1/contact/teachers",//老师联系人

    information_record: "/api/client/v1/classes/information-record/page",//咨询记录

    news_type: "/api/client/v1/classes/news-type/page",//发现
    news_record_collect: "/api/client/v1/classes/news-record-collect/page",//个人收藏
    news_record_collect_save: "/api/client/v1/classes/news-record-collect/save",//收藏

    news_record: "/api/client/v1/classes/news-record/page",//消息
    news_record_praise: "/api/client/v1/classes/news-record-praise/save",//点赞
    news_record_listType: "/api/client/v1/classes/news-record/listType",//获取消息类型
    news_record_save: "/api/client/v1/classes/news-record/save",//新增消息
    news_record_delete: "/api/client/v1/classes/news-record/",//删除消息

    home_work_status: "/api/client/v1/classes/home-work/status",//我的月份作业
    home_work: "/api/client/v1/classes/home-work/page",//我的作业

    exam_score_page: "/api/client/v1/classes/exam-score/page",//成绩查询

    campusAtten: "/api/client/v1/classes/student-attendance/list",//校园考勤
    campusAtten_getDate: "/api/client/v1/classes/student-attendance-record/list",//校园考勤记录

    course_schedule_listAll: "/api/client/v1/classes/course-schedule/listAll",//我的所有课表
    course_schedule_page: "/api/client/v1/classes/course-schedule/page",//我的课表

    leave_record: "/api/client/v1/classes/leave-record/apply",//申请请假
    leave_record_listTypeAll: "/api/client/v1/classes/leave-record/listTypeAll",//获取请假类型
    leave_record_page: "/api/client/v1/classes/leave-record/page",//请假记录

    education_evaluation: "/api/client/v1/education-evaluation/page",//德育评价
    campus_style: "/api/client/v1/campus-style/page",//校园风采

    grade_status: "/api/client/v1/learn-resource/grade-status",//学习资源获取班级
    learn_resource: "/api/client/v1/learn-resource/page",//学习资源

    food_plan: "/api/client/v1/food-plan/page",//校园食堂

}
