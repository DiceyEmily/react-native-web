import { styles } from '@common/components/styles';
import { colors } from "@common/components/colors";
import { app } from '@common/lib/app';
import { V } from '@common/lib/components/custom/V';
import { Icon } from '@common/lib/components/icon/Icon';
import { array, lib } from '@common/lib/lib';
import React, { Component } from 'react'
import { Platform, View, Text, StyleSheet, TouchableOpacity, Pressable, ScrollView, Image, Dimensions } from "react-native";
import { GridItem, SwiperView, SwiperViewState } from '../components/SwiperView';
import { api } from '@src/config/api';
import { cfg } from '@src/config/cfg';
import { findState, useInit, useObjState } from '@src/rn-common/lib/hooks';
import { ContactView } from './contact/ContactView';
import { WeatherResult } from '@src/model/home/Weather';
import { apiBase } from '@src/config/apiBase';
import { DialogList } from '@src/rn-common/lib/components/custom/DialogList';
import { createEvent } from '@src/rn-common/lib/Event';
import { native } from '@src/rn-common/lib/native';
import { Pic } from '@src/rn-common/lib/components/custom/Pic';
import { MySchoolAssi } from './schoolAssignment/MySchoolAssi';
import { MyCurriculum } from './curriculum/MyCurriculum';
import { AchievemInquiry } from './achievementinquiry/AchievemInquiry';
import { LearningResList } from './learningresources/LearningResList';
import { LeaveScreen } from './leave/LeaveScreen';
import { MoralEdueValua } from './deyupingjia/MoralEdueValua';
import { CampusStyle } from './xiaoyuanfengcai/CampusStyle';
import { CampusCafeteria } from './xiaoyuanshitang/CampusCafeteria';
import { CampusAtten } from './xiaoyuankaoqin/CampusAtten';
import { PullScroll } from '@src/rn-common/lib/components/custom/PullScroll';
import { WorkBeanData } from '@src/model/home/WorkBeanData';
import { url } from '@src/config/url';
import { NoticesData } from '@src/model/msg/NoticesData';
import { InformationRecordData } from '@src/model/msg/InformationRecordData';
import { imgs } from '@src/imgs';


export const moduleListID = [
    "44D87FD2389A493681A048AF3C3B234B",
    "7B01A2E9F5FB4D01B0C330C03038894C",
    "3A19611FA4424C0EB38CC7D387EE9EAA",
    "BE8BCB40E3B145D386C6288D8CBF7B3D",
    "EDD774D96EA040438600A90D95FCB63B",
    "A4DD20719F804B0C8B3E952D8E858D06",
    "B3C077A491D04211B887C81976A50F04",
    "C5A9ED89686B4F7995BB9B328B40F8C7",
    "1BF178FC4A3A4F1D98CA23AD86F2612F",
    "7B36CC5AE93A44F789954831508A95C1",
]
interface HomeCProp {

}

/* 首页模块添加监听 */
export const addModule = createEvent((item: WorkBeanData) => {
})

export class HomeCState {

    picList = Array<GridItem>();

    moduleList = Array<WorkBeanData>();

    //所有模块数据
    static moduleLists: Map<string, () => void> = new Map

    //实时通知
    dayAgenda = Array<NoticesData>()

    //咨询推荐
    msgAgenda = Array<InformationRecordData>()

    //天气数据
    weatherResult: WeatherResult = cfg.localConfig.dat.weather
}

export class Home extends Component<HomeCProp, HomeCState> {

    state = new HomeCState();

    constructor(props: HomeCProp) {
        super(props);

        HomeCState.moduleLists.set(moduleListID[0], () => { app.push(MySchoolAssi, {}) })
        HomeCState.moduleLists.set(moduleListID[1], () => { app.push(MyCurriculum, {}) })
        HomeCState.moduleLists.set(moduleListID[2], () => { app.push(AchievemInquiry, {}) })
        HomeCState.moduleLists.set(moduleListID[3], () => { app.push(LearningResList, {}) })
        HomeCState.moduleLists.set(moduleListID[4], () => { app.push(CampusAtten, {}) })
        HomeCState.moduleLists.set(moduleListID[5], () => { app.push(LeaveScreen, {}) })
        HomeCState.moduleLists.set(moduleListID[6], () => { app.push(CampusStyle, {}) })
        HomeCState.moduleLists.set(moduleListID[7], () => { })
        HomeCState.moduleLists.set(moduleListID[8], () => { app.push(MoralEdueValua, {}) })
        HomeCState.moduleLists.set(moduleListID[9], () => { app.push(CampusCafeteria, {}) })

        this.state.moduleList.splice(0)
        this.getModelList(HomeCState.moduleLists)
        this.state.picList.push({
            icon: <Pic
                style={
                    [{
                        width: Dimensions.get('window').width,
                        height: 180,
                    },]}
                source={''}
                defSource={imgs.banner}
            />
            ,
            name: '',
            onPress: () => { },
        })
        this.getDocList(1)
        this.getDayAgenda()

        if (cfg.localConfig.dat.weather.getTime) {
            let lastTime = new Date(cfg.localConfig.dat.weather.getTime)
            if (new Date().getTime() - lastTime.getTime() > 1000 * 60 * 30) {
                //半小时间隔时间
                this.getCityWeather()
            }
        } else {
            this.getCityWeather()
        }

        //添加首页模块监听
        addModule.onEvent(this, (item) => {
            let has = false
            this.state.moduleList.forEach(va => {
                if (va.name == item.name) {
                    has = true
                    app.msg('已经添加在首页')
                }
            })
            if (!has) {
                this.state.moduleList.push(item)
                this.setState({
                    moduleList: this.state.moduleList
                })
                app.msg('添加首页成功')
            }
        })

    }

    componentDidMount() {
        this.getPicList()

    }

    componentWillUnmount() {
    }

    /* 城市天气 */
    async getCityWeather() {
        let res = await apiBase.cityWeather().hideProg.result;
        if (res.success == '1') {
            this.setState({
                weatherResult: res.result
            })

            res.result.getTime = new Date().toISOString()
            cfg.localConfig.dat.weather = res.result
            cfg.localConfig.save
        }

        // let pm = await apiBase.cityPm().hideProg.result;
        // if (pm.success == '1') {
        //     this.state.weatherResult.aqi_levid = pm.result.aqi_levid
        //     this.state.weatherResult.aqi_levnm = pm.result.aqi_levnm
        //     this.setState({
        //         weatherResult: this.state.weatherResult
        //     })

        //     res.result.getTime = new Date().toISOString()
        //     cfg.localConfig.dat.weather = res.result
        //     cfg.localConfig.save
        // }
    }

    /* 咨询推荐 */
    async getDocList(page: number) {
        let res = await api.information_record({
            page: page - 1, pageSize: app.pageNum,
        }).hideProg.result;

        // let r = new InformationRecordData
        // r.informationTypeName = '数学-算数'
        // r.content = '相关课程资料'
        // r.time = '04-18'
        // r.url = imgs.banner
        // res.data.push(r)

        this.setState({
            msgAgenda: res.data
        })
    }

    /* 实时通知 */
    async getDayAgenda() {
        let res = await api.notices({

        }).hideProg.result

        // console.log(res)

        this.setState({
            dayAgenda: res.data
        })
    }

    /* 轮播数据 */
    async getPicList() {
        let res = await api.advert().hideProg.result
        let moduleList = Array<GridItem>()
        res.map(va => {
            moduleList.push({
                icon: <Pic
                    style={
                        [{
                            width: Dimensions.get('window').width,
                            height: 180,
                        },]}
                    source={va.pic}
                    defSource={imgs.banner}
                />
                ,
                name: '',
                onPress: () => { },
            })
        })
        this.setState({
            picList: moduleList
        })

        findState(SwiperViewState, r => r.refreshNumView())

    }


    /* 模块数据 */
    async getModelList(moduleLists: Map<string, () => void>) {
        let res = await api.module().hideProg.result
        let moduleList = Array<GridItem>()
        /* 设置数据 */
        res.map(va => {
            let da = moduleLists.get(va.pfmUuid)
            moduleList.push({
                icon: <Pic
                    style={
                        [{
                            borderRadius: 2,
                            width: 30,
                            height: 30,
                        },]}
                    source={url.file_url + va.icon}
                    defSource={imgs.ic_launcher_bg}
                />,
                name: va.name,
                onPress: da ?? (() => { }),
            })
        })
        this.setState({
            moduleList: res
        })
    }


    deletemodule = async (id: string) => {
        let res = await api.deletemodule({
            pfmUuid: id
        }).result

        return res
    }


    render() {
        return <V style={[{ backgroundColor: colors.backgroundContainer, flex: 1 },]}>
            <V style={[{},]}>
                <SwiperView list={this.state.picList} maxShow={1} />

                <V style={[{
                    position: 'absolute', flexDirection: 'row', width: '100%',
                    paddingHorizontal: 16, alignItems: 'center', marginTop: 5,
                },]}>
                    <V style={[{
                        color: colors.primary, fontSize: 17,
                        backgroundColor: "#ffffffcc", borderRadius: 360,
                        paddingHorizontal: 12, paddingVertical: 2, textAlign: 'center',
                    },]}>{this.state.weatherResult.weather + '/' + this.state.weatherResult.temperature_curr}
                    </V>

                    <V style={[{ flex: 1, },]}></V>

                    <Pressable onPress={() => {
                        native.rnQrActivity()
                    }}>
                        <Pic style={[{
                            width: 28, height: 28, marginVertical: 5,
                        },]}
                            source={imgs.saoma}
                        />
                    </Pressable>

                    <Pressable onPress={() => {
                        app.push(ContactView, {})
                    }}>
                        <Pic style={[{
                            width: 28, height: 28, marginLeft: 15,
                        },]}
                            source={imgs.min}
                        />
                    </Pressable>
                </V>
            </V>

            <PullScroll style={[{ marginTop: -6 },]}
                onRefresh={async () => {
                    this.state.moduleList.splice(0)
                    this.getModelList(HomeCState.moduleLists)
                    this.getPicList()
                    this.getDocList(1)
                    this.getDayAgenda()
                }} >

                <V style={[{ flexWrap: "wrap", paddingVertical: 10, backgroundColor: colors.white }, styles.row,]}>
                    {this.state.moduleList.map((va, idx) => {
                        return <Pressable
                            key={idx}
                            style={[{
                                width: "25%",
                                alignItems: "center",
                                backgroundColor: colors.whiteTrans,
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                                borderRadius: 360
                            },]}
                            onPress={() => {
                                let da = HomeCState.moduleLists.get(va.pfmUuid)
                                da?.()
                            }}
                            onLongPress={(ev) => {
                                let target = (app.isWeb ? ev.currentTarget : ev.target) as unknown as View

                                DialogList.show([
                                    {
                                        key: '取消放入首页',
                                        onClick: async () => {
                                            let res = await this.deletemodule(va.pfmUuid)
                                            this.setState({
                                                moduleList: this.state.moduleList.filter((va, i) => {
                                                    return idx != i
                                                })
                                            })
                                        }
                                    },
                                ],
                                    {
                                        disableDim: false, posView: target,
                                        position: () => ({
                                            x: 0,
                                            y: 30,
                                        })
                                    }
                                )
                            }}>
                            <Pic style={[{
                                borderRadius: 2, width: 39, height: 39, marginVertical: 5,
                            },]}
                                source={url.file_url + va.icon}
                                defSource={imgs.ic_launcher_bg}
                            />

                            <V style={[{ color: colors.grey3, fontSize: 13, },]}>{va.name}</V>

                            <V style={{
                                position: 'absolute', right: 10, borderRadius: 360,
                                fontSize: 12, color: colors.white, paddingHorizontal: 5,
                                backgroundColor: colors.red, alignItems: 'center'
                            }}>
                                { }
                            </V>
                        </Pressable>
                    })}
                </V>

                {this.state.dayAgenda.length == 0 ? null :
                    <V style={[{ marginTop: 8, paddingVertical: 8, backgroundColor: colors.white, flex: 1 },]}>
                        <V style={[{
                            fontSize: 17, color: colors.grey3,
                            paddingVertical: 8, paddingHorizontal: 16,
                        },]}>消息通知
                        </V>

                        {this.state.dayAgenda.map((dat, idx) => {
                            return <V onPress={() => {

                            }}
                                style={[{ paddingVertical: 8, paddingHorizontal: 16, flex: 1 },]}>

                                <V style={{
                                    color: colors.grey6, fontSize: 15,
                                    flexDirection: 'row', alignItems: 'center',
                                }}>
                                    <Pic style={[{ width: 14, height: 14, },]}
                                        source={imgs.tixing}
                                    />
                                    <V style={{
                                        color: colors.grey3, fontSize: 14, flex: 1, marginLeft: 8,
                                    }}>{'考勤'}
                                    </V>
                                    <V style={{
                                        color: colors.grey9, fontSize: 12,
                                    }}>{dat.time}
                                    </V>
                                </V>

                                <V numberOfLines={2}
                                    style={{
                                        color: colors.grey6, fontSize: 14,
                                        marginTop: 1, marginLeft: 22,
                                    }}>{dat.centent}
                                </V>
                            </V >
                        })}
                    </V>}

                {this.state.msgAgenda.length == 0 ? null :
                    <V style={[{ marginTop: 8, paddingVertical: 8, backgroundColor: colors.white, flex: 1 },]}>
                        <V style={[{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, },]}>
                            <V style={[{
                                fontSize: 17, color: colors.grey3, flex: 1,
                            },]}>咨询推荐
                            </V>
                            <V style={[{ fontSize: 13, color: colors.grey9 },]}>更多</V>
                        </V>

                        {this.state.msgAgenda.map((dat) => {
                            return <V onPress={() => {

                            }}
                                style={[{
                                    flex: 1,
                                    paddingVertical: 8, paddingHorizontal: 16,
                                    flexDirection: 'row', alignItems: 'center',
                                },]}>

                                <Pic style={[{ width: 114, height: 82, borderRadius: 10 },]}
                                    source={dat.url}
                                />
                                <V style={[{ marginLeft: 16, },]}>
                                    <V numberOfLines={2}
                                        style={{
                                            color: colors.grey6, fontSize: 15,
                                        }}>{dat.content}
                                    </V>

                                    <V style={{
                                        color: colors.grey6, fontSize: 13, marginTop: 12,
                                    }}>{dat.informationTypeName}
                                    </V>

                                    <V style={{
                                        color: colors.grey9, fontSize: 12, marginTop: 12,
                                    }}>{dat.time}
                                    </V>
                                </V>
                            </V >
                        })}
                    </V>}
            </PullScroll>
        </V>
    }

}


export const sty = StyleSheet.create({

})
