
import { Schedule } from "@src/model/home/Schedule";
import { filter } from "@src/model/JHipsterFilter";
import { MsgList } from "@src/model/msg/MsgList";
import { MsgCriteria } from "@src/model/msg/MsgCriteria";
import { PageModel } from "@src/model/PageModel";
import { array, lib } from "@src/rn-common/lib/lib";
import { UserInfo } from "../model/UserInfo";
import { UserReq } from "../model/UserReq";
import { ApiRequestBase } from "./apiBase";
import { cfg } from "./cfg";
import { url } from "./url";
import { Task } from "@src/model/msg/Task";
import { ContactData } from "@src/model/contact/ContactData";
import { OrgType } from "@src/model/org-type.model";
import Config from "react-native-config";
import { app } from "@src/rn-common/lib/app";
import { TokenBeanData } from "@src/model/TokenBean";
import { LeaveBean } from "@src/model/leave/LeaveBean";
import { RegisterUserBean } from "@src/model/zhuce/RegisterUser";
import { AdvertData } from "@src/model/home/AdvertData";
import { WorkBeanData } from "@src/model/home/WorkBeanData";
import { AchieveIn } from "@src/model/home/AchieveIn";
import { SchoolAssiData } from "@src/model/home/SchoolAssiData";
import { CampusAttenData } from "@src/model/home/CampusAttenData";
import { LeaveRecord } from "@src/model/leave/LeaveRecord";
import { LeaveRecordType } from "@src/model/leave/LeaveRecordType";
import { AchieveInqData } from "@src/model/home/AchieveInqData";
import { MoralEdueValuaData } from "@src/model/home/MoralEdueValuaData";
import { MyCurriculumData } from "@src/model/home/MyCurriculumData";
import { SchoolAssiMonth } from "@src/model/home/SchoolAssiMonth";
import { CampusAttenMonth } from "@src/model/home/CampusAttenMonth";
import { CampusStyleData } from "@src/model/home/CampusStyleData";
import { LearningResListData } from "@src/model/home/LearningResListData";
import { MyCurriculumAll } from "@src/model/home/MyCurriculumAll";
import { Notices } from "@src/model/msg/Notices";
import { InformationRecord } from "@src/model/msg/InformationRecord";
import { FaxianList } from "@src/model/msg/FaxianList";
import { XiaoXiList } from "@src/model/msg/XiaoXiList";
import { RocordType } from "@src/model/msg/RocordType";


export class ApiRequest extends ApiRequestBase {

    //注册用户
    registerUser(obj: RegisterUserBean) {
        let http = this.request(url.registerUser, {}).setPara(obj).usePOST
        return http
    }

    //根据用户密码认证
    login(obj: UserReq) {
        let http = this.request(url.authenticate, TokenBeanData).setPara(obj).usePOST
        return http
    }

    //用户信息
    userInfo() {
        let http = this.request(url.userInfo, UserInfo).useGET
        return http
    }

    //修改用户信息
    updateInfo(obj: RegisterUserBean) {
        let http = this.request(url.updateInfo, {}).setPara(obj).usePUT
        return http
    }

    //修改密码
    updatePassword(obj: {
        oldPassword: string,
        newPassword: string
    }) {
        let http = this.request(url.updatePassword, {}).setPara(obj).usePUT
        return http
    }

    //退出登录
    logout() {
        let http = this.request(url.logout, {}).useDELETE
        return http;
    }

    //app更新
    appUpdate() {
        let http = this.request('', '').useGET
        return http;
    }

    /**
     * 获取附件资源url
     * @param path 
     * @returns 
     */
    getFileUrl(path: string) {
        let host = Config.HOST_URL
        if (app.isWeb) {
            host = window.location.origin
        }
        return host + url.services + path?.replace(/\\/g, "/");
    }

    //广告轮播图
    advert() {
        let http = this.request(url.advert, array(AdvertData)).useGET.setContentTypeJSON()
        return http
    }

    //获取软件应用
    module() {
        let http = this.request(url.module, array(WorkBeanData)).useGET.setContentTypeJSON()
        return http
    }

    //查询所有软件应用
    allmodule(para: {
        type?: number
    }) {
        let http = this.request(url.allmodule, array(WorkBeanData)).setPara(para).useGET.setContentTypeJSON()
        return http
    }

    //增加首页软件应用
    savemodule(para: {
        pfmUuid: string
    }) {
        let http = this.request(url.savemodule, {}).setPara(para).usePOST
        return http
    }

    //删除首页软件应用
    deletemodule(para: {
        pfmUuid: string
    }) {
        let http = this.request(url.deletemodule, {}).setPara(para).useDELETE.setContentTypeJSON()
        return http
    }

    //实时通知
    notices(para: {
    }) {
        let http = this.request(url.notices, Notices, false).setPara(para).usePOST.setContentTypeJSON()
        return http
    }

    //咨询记录
    information_record(para: {
    } & PageModel) {
        let http = this.request(url.information_record, InformationRecord, false).setPara(para).usePOST.setContentTypeJSON()
        return http
    }

    //发现
    news_type(para: {
    } & PageModel) {
        let http = this.request(url.news_type, FaxianList, false).setPara(para).usePOST.setContentTypeJSON()
        return http
    }

    //个人收藏
    news_record_collect(para: {
    } & PageModel) {
        let http = this.request(url.news_record_collect, FaxianList, false).setPara(para).usePOST.setContentTypeJSON()
        return http
    }

    //消息
    news_record(para: {
    } & PageModel) {
        let http = this.request(url.news_record, XiaoXiList, false).setPara(para).usePOST.setContentTypeJSON()
        return http
    }

    //消息类型
    news_record_listType() {
        let http = this.request(url.news_record_listType, RocordType, false).usePOST.setContentTypeJSON()
        return http
    }

    //新增消息
    news_record_save(para: {
        content: string,
        sntUuid: string,
        urls: Array<string>,
    }) {
        let http = this.request(url.news_record_save, RocordType, false).setPara(para).usePOST
        return http
    }

    //删除消息
    news_record_delete(id: string) {
        let http = this.request(url.news_record_delete + id, RocordType, false).useDELETE.setContentTypeJSON()
        return http
    }

    //消息点赞
    news_record_praise(para: {
        snrUuid: string,
        sntUuid: string,
    }) {
        let http = this.request(url.news_record_praise, XiaoXiList, false).setPara(para).usePOST.setContentTypeJSON()
        return http
    }

    //消息收藏
    news_record_collect_save(para: {
        snrUuid: string,
        sntUuid: string,
    }) {
        let http = this.request(url.news_record_collect_save, XiaoXiList, false).setPara(para).usePOST.setContentTypeJSON()
        return http
    }

    // 发现所有列表数据
    getAllMsgResource(paras: MsgCriteria & PageModel) {
        paras.userId = filter.equals(cfg.user.dat.getUserId())
        let req = this.request(`/api/tasks`, MsgList).setPara(paras).useGET
        req.onMock = async () => {
            let ret = new MsgList();
            let content = Array<Task>();
            let size = lib.randomInt(10)
            ret.content = content
            ret.size = size
            for (let index = 0; index < size; index++) {
                content.push({
                    id: '' + lib.randomInt(100),
                    biaoti: '工作事宜',
                    num: lib.randomInt(100),
                    description: '关于开展计算机外接设备关键技术和产品攻关任务揭榜工作事宜',
                    limitedDate: new Date().toISOString(),
                } as Task)
            }
            return ret;
        }
        return req;
    }

    /* 申请请假 */
    leave_record(para: LeaveRecord) {
        let http = this.request(url.leave_record, {}).setPara(para).usePOST
        return http;
    }

    /* 申请类型 */
    leave_record_listTypeAll() {
        let http = this.request(url.leave_record_listTypeAll, array(LeaveRecordType)).useGET.setContentTypeJSON()
        return http;
    }

    /* 申请记录 */
    leave_record_page(para: {
        createTime?: string,
        updateTime?: string,
    } & PageModel) {
        let http = this.request(url.leave_record_page, array(LeaveBean)).setPara(para).usePOST
        return http;
    }

    /**
     * 获取家长通讯录
     */
    getContactParents() {
        let params = {
            entity: '',
        };
        let http = this.request(url.parents, array(ContactData)).setPara(params).usePOST
        return http;
    }

    /**
     * 获取老师通讯录
     */
    getContactTeachers() {
        let params = {
            entity: '',
        };
        let http = this.request(url.teachers, array(ContactData)).setPara(params).usePOST
        return http;
    }

    /* 通讯录搜索 */
    search(paras: { name: string, orgTypes?: string }) {
        let http = this.request('/api/admin/orgUnit/treeSearch', array(ContactData)).setPara(paras).usePOST.setSendForm
        return http;
    }

    /* 我的月份作业 */
    home_work_status(yearMonth: string) {
        let http = this.request(url.home_work_status, array(SchoolAssiMonth)).setPara({
            yearMonth: yearMonth
        }).usePOST
        return http;
    }

    /* 我的作业 */
    home_work(para?: AchieveIn & PageModel) {
        let http = this.request(url.home_work, array(SchoolAssiData)).setPara(para ?? {}).usePOST
        return http;
    }

    /* 成绩查询 */
    exam_score_page(para?: AchieveIn & PageModel) {
        let http = this.request(url.exam_score_page, array(AchieveInqData)).setPara(para ?? {}).usePOST
        return http;
    }

    /* 校园考勤 */
    campusAtten(yearMonth: string) {
        let http = this.request(url.campusAtten, array(CampusAttenMonth)).setPara({
            yearMonth: yearMonth
        }).usePOST
        return http;
    }

    /* 校园考勤记录 */
    campusAtten_date(attendanceDate: string) {
        let http = this.request(url.campusAtten_getDate, array(CampusAttenData)).setPara({
            attendanceDate: attendanceDate
        }).usePOST
        return http;
    }

    /* 德育评价 */
    education_evaluation(para: PageModel) {
        let http = this.request(url.education_evaluation, array(MoralEdueValuaData)).setPara(para).usePOST
        return http;
    }

    /* 校园风采 */
    campus_style(para: PageModel) {
        let http = this.request(url.campus_style, array(CampusStyleData)).setPara(para).usePOST
        return http;
    }

    /* 我的课表 */
    scheduling_all() {
        let http = this.request(url.course_schedule_listAll, array(MyCurriculumAll)).useGET
        return http;
    }
    scheduling(para: {
        ccUuid?: string,
        scUuid?: string,
    }) {
        let http = this.request(url.course_schedule_page, array(MyCurriculumData)).usePOST.setPara(para)
        return http;
    }

    /* 校园食堂 */
    food_plan(para: {
        startDate: string,
        endDate: string,
    }) {
        let http = this.request(url.food_plan, array(MyCurriculumData)).setPara(para).usePOST
        return http;
    }

    /* 学习资源 */
    learn_resource(para: {
        ccUuid?: string,
        scUuid?: string,
    } & PageModel) {
        let http = this.request(url.learn_resource, array(LearningResListData)).setPara(para).usePOST
        return http;
    }
    grade_status() {
        let http = this.request(url.grade_status, new Array<{ code: string, name: string }>()).useGET
        return http;
    }


    getUrl(urlPath: string) {
        return super.getUrl(url.services + urlPath)
    }

}
export const api = new ApiRequest();