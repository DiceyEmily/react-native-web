import { createRoute } from "@common/lib/Router";
import { AboutApp } from "@src/screens/my/AboutApp";
import { MyInformation } from "@src/screens/my/MyInformation";
import { SettingView } from "@src/screens/my/SettingView";
import { MainNavi } from "../screens/MainNavi";
import { Login } from "../screens/Login";
import { cfg } from "./cfg";
import { ContactView } from "@src/screens/contact/ContactView";
import { FontSizeSetting } from "@src/screens/my/FontSizeSetting";
import { ChangePassword } from "@src/screens/my/ChangePassword";
import MyOrder from "@src/screens/my/MyOrder";
import { HelpFbScreen } from "@src/screens/helpAndFeedback/HelpFbScreen";
import { IssuesList } from "@src/screens/helpAndFeedback/IssuesList";
import { ManualsList } from "@src/screens/helpAndFeedback/ManualsList";
import { ManualsDetail } from "@src/screens/helpAndFeedback/ManualsDetail";
import { MySchoolAssi } from "@src/screens/schoolAssignment/MySchoolAssi";
import { SchoolAssiDetails } from "@src/screens/schoolAssignment/SchoolAssiDetails";
import { MyCurriculum } from "@src/screens/curriculum/MyCurriculum";
import { AchievemInquiry } from "@src/screens/achievementinquiry/AchievemInquiry";
import { AchievemInquiryDetails } from "@src/screens/achievementinquiry/AchievemInquiryDetails";
import { LearningResList } from "@src/screens/learningresources/LearningResList";
import { LeaveScreen } from "@src/screens/leave/LeaveScreen";
import { LeaveList } from "@src/screens/leave/LeaveList";
import { LeaveDetail } from "@src/screens/leave/LeaveDetail";
import { AddLeave } from "@src/screens/leave/AddLeave";
import { MoralEdueValua } from "@src/screens/deyupingjia/MoralEdueValua";
import { CampusStyle } from "@src/screens/xiaoyuanfengcai/CampusStyle";
import { CampusStyleDetails } from "@src/screens/xiaoyuanfengcai/CampusStyleDetails";
import { CampusCafeteria } from "@src/screens/xiaoyuanshitang/CampusCafeteria";
import { CampusAtten } from "@src/screens/xiaoyuankaoqin/CampusAtten";
import { CampusAttenDetails } from "@src/screens/xiaoyuankaoqin/CampusAttenDetails";
import { RegisterUser } from "@src/screens/zhuce/RegisterUser";
import { FaXianList } from "@src/screens/faxian/FaXianList";
import { FaXianDetails } from "@src/screens/faxian/FaXianDetails";
import { FaXian } from "@src/screens/faxian/FaXian";
import { NewFaXian } from "@src/screens/faxian/NewFaXian";
import { VedioPlayerDetail } from "@src/screens/learningresources/VedioPlayerDetail";
import { app } from "@src/rn-common/lib/app";


export const routers = createRoute(route => {

    if (cfg.env.shuiyin) {
        //水印
        let now = new Date()
        app.waterText = cfg.user.dat.name + " " + (now.getMonth() + 1) + "-" + now.getDate();
    }

    //未登录，跳转至登录页
    if (!cfg.user.dat.isLogin() && route.name != 'RegisterUser') {
        return [Login, {}]
    }

    return;

}, {
    Login: {
        component: () => Login,
        //默认路由
        default: !cfg.localConfig.dat.rememberPassword,
    },
    MainNavi: {
        component: () => MainNavi,
        //默认路由
        default: cfg.localConfig.dat.rememberPassword,
    },
    RegisterUser: {
        component: () => RegisterUser,
    },
    ContactView: {
        component: () => ContactView,
    },
    FaXianList: {
        component: () => FaXianList,
    },
    NewFaXian: {
        component: () => NewFaXian,
    },
    FaXian: {
        component: () => FaXian,
    },
    FaXianDetails: {
        component: () => FaXianDetails,
    },
    MyInformation: {
        component: () => MyInformation,
    },
    SettingView: {
        component: () => SettingView,
    },
    AboutApp: {
        component: () => AboutApp,
    },
    FontSizeSetting: {
        component: () => FontSizeSetting,
    },
    MyOrder: {
        component: () => MyOrder,
    },
    ChangePassword: {
        component: () => ChangePassword,
    },
    HelpFbScreen: {
        component: () => HelpFbScreen,
    },
    HelpFbList: {
        component: () => IssuesList,
    },
    ManualsList: {
        component: () => ManualsList,
    },
    ManualsDetail: {
        component: () => ManualsDetail,
    },
    MySchoolAssi: {
        component: () => MySchoolAssi,
    },
    SchoolAssiDetails: {
        component: () => SchoolAssiDetails,
    },
    MyCurriculum: {
        component: () => MyCurriculum,
    },
    AchievemInquiry: {
        component: () => AchievemInquiry,
    },
    AchievemInquiryDetails: {
        component: () => AchievemInquiryDetails,
    },
    LearningResList: {
        component: () => LearningResList,
    },
    VedioPlayerDetail: {
        component: () => VedioPlayerDetail,
    },
    CampusAtten: {
        component: () => CampusAtten,
    },
    CampusAttenDetails: {
        component: () => CampusAttenDetails,
    },
    LeaveScreen: {
        component: () => LeaveScreen,
    },
    LeaveList: {
        component: () => LeaveList,
    },
    LeaveDetail: {
        component: () => LeaveDetail,
    },
    AddLeave: {
        component: () => AddLeave,
    },
    MoralEdueValua: {
        component: () => MoralEdueValua,
    },
    CampusStyle: {
        component: () => CampusStyle,
    },
    CampusStyleDetails: {
        component: () => CampusStyleDetails,
    },
    CampusCafeteria: {
        component: () => CampusCafeteria,
    },
});


