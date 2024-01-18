import { styles } from '@common/components/styles';
import { colors } from "@common/components/colors";
import { app } from '@common/lib/app';
import { useInit, useObjState } from '@common/lib/hooks';
import React from 'react';
import { ScrollView, StyleSheet } from "react-native";
import { api } from '@src/config/api';
import { HeaderBar } from '@src/components/Header';
import { V } from '@src/rn-common/lib/components/custom/V';
import { array, lib } from '@src/rn-common/lib/lib';
import { Container } from '@src/rn-common/lib/components/Container';
import TabView from '@src/rn-common/lib/components/tabview/TabView';
import { commonTabLight } from '@src/components/Tab';
import { TabViewItem } from '@src/rn-common/model/TabViewItem';
import { PullList } from '@src/rn-common/lib/components/custom/PullList';
import { memoItem } from '@src/rn-common/lib/components/memoItem';
import { MyCurriculumData } from '@src/model/home/MyCurriculumData';


interface MyCurriculumProp {

}


export class MyCurriculumState {

    //更新组件
    get $update() { return }

    constructor(
        //组件属性
        public prop_: MyCurriculumProp,
    ) {

    }

    index = 0
    minn = 1
    maxn = 52
    routes = Array<TabViewItem>()

    //开学时间
    startTime = new Date('2021-2-22')
    selectTime = new Date()

    getWeeks = (date: Date) => {
        let time = date.getTime() - this.startTime.getTime()
        //向上取整
        let week = Math.ceil(time / (7 * 24 * 60 * 60 * 1000))

        if (week < 0) {
            week = 52 + week
        }

        // app.msg(week + '')

        return week
    }

    selectWeek = this.getWeeks(this.selectTime)

    isThisWeek = () => {
        let today = new Date()
        return this.selectWeek == this.getWeeks(today)
    }

    getWeekStartTime = (week: number) => {
        let firstTime = new Date(week * 7 * 24 * 60 * 60 * 1000 - 8 * 24 * 60 * 60 * 1000 + this.startTime.getTime())
        return firstTime
    }


    getList = async (page: number) => {
        let res = await api.scheduling({
            // ccUuid: '',
            // scUuid: '',
        }).hideProg.result

        let times = new Map<string, Array<MyCurriculumData>>()
        res.forEach(va => {
            let weeks = times.get(va.courseTimeStartDate)
            if (!weeks) {
                weeks = array(MyCurriculumData)
                //第一个月份的开课和节课时间
                let week = new MyCurriculumData
                week.courseTimeStartDate = va.courseTimeStartDate.substring(0, 5)
                week.courseTimeEndDate = va.courseTimeEndDate.substring(0, 5)
                weeks.push(week)
                weeks.push(va)
                times.set(va.courseTimeStartDate, weeks)
            } else {
                weeks.push(va)
            }
        })

        // console.log(page + '')

        let result = array(array(MyCurriculumData))
        if (page <= 1) {
            result.push(array(MyCurriculumData))
        }
        times.map((va, res) => {
            result.push(res)
        })

        return result
    }


}



/**
 * 我的课表
 * @param prop
 * @returns
 */
export function MyCurriculum(prop: MyCurriculumProp) {

    //组件状态
    const st = useObjState(() => new MyCurriculumState(prop), prop)

    //组件初始化
    useInit(async () => {

        let list = [0, 1, 2, 3, 4, 5, 6, 7]
        st.minn = st.selectWeek - 5 >= st.minn ? st.selectWeek - 5 : st.selectWeek
        st.maxn = st.selectWeek + 5 >= st.maxn ? st.maxn : st.selectWeek + 5
        //前后5周
        for (let index = st.minn; index < st.maxn; index++) {
            let firstTime = st.getWeekStartTime(index)
            let month = firstTime.getMonth() + 1
            st.routes.push({
                key: index + '',
                title: `第${index}周`,
                view: () => <PullList<Array<MyCurriculumData>>
                    style={[{
                        borderRadius: 3,
                        backgroundColor: colors.curriculum,
                        margin: 8,
                        paddingVertical: 5,
                    },]}
                    autoLoad={true}
                    renderItem={(i) => memoItem(TimeItem, {
                        dat: i.item,
                        index: i.index,
                        month: month,
                        firstTime: firstTime,
                        onPress: () => { },
                        list: list
                    })}
                    onGetListByPage={page => st.getList(page)}>
                </PullList>
            })
        }
        st.$update

        return async () => { //组件卸载

        }
    })


    return (

        <Container style={{ flex: 1, backgroundColor: colors.white }}>
            <HeaderBar
                title={"我的课表"}
            />

            <V style={[{
                flexDirection: 'row',
                margin: 20,
                alignItems: 'center'
            },]}>
                <V numberOfLines={1} style={[{
                    color: colors.textMain,
                    fontSize: 16,
                    fontWeight: 'bold'
                },]} >{lib.dateToY_M_D_CN(st.selectTime, false)}</V>
                <V numberOfLines={1} style={[{
                    color: colors.textMain, fontSize: 15, marginLeft: 12,
                },]} >{`第${st.selectWeek}周(${st.isThisWeek() ? '' : '非'}本周)`}</V>
            </V>

            <TabView
                lazy={true}
                tabBarPosition="top"
                navigationState={{ index: st.index, routes: st.routes }}
                renderScene={({ route }) => route.view()}
                onIndexChange={(index) => {
                    st.index = index
                    st.selectWeek = st.minn + index
                    st.selectTime = st.getWeekStartTime(st.selectWeek)
                    st.$update
                }}
                sceneContainerStyle={{}}
                renderTabBar={commonTabLight(dat => <V />, true)}
            />
        </Container>
    )

}


/* 时间item */
function TimeItem(para: { dat: Array<MyCurriculumData>, onPress: () => void, index: number, month: number, firstTime: Date, list: number[] }) {

    const st = useObjState(() => ({

        getKec: (idx: number) => {
            let weekDay
            for (let index = 0; index < para.dat.length; index++) {
                const va = para.dat[index];
                if (va.weekDay == idx + '') {
                    weekDay = va
                    break
                }
            }
            return weekDay
        }

    }))

    useInit(async () => {


        return async () => { //组件卸载

        }
    })


    return (
        <V style={[{
            flexDirection: 'row',
            width: '100%',
            flex: 1,
            alignSelf: 'center',
        },]}>
            {para.index == 0 ?
                para.list.map((va, idx) => {
                    let week = para.firstTime.getDayOfWeek()
                    if (week + idx - 7 >= 0) {
                        week = week + idx - 7
                    } else {
                        week = week + idx
                    }
                    let nDate = new Date(para.firstTime)
                    nDate.setDate(para.firstTime.getDate() + idx)

                    return idx == 0 ? <V style={[{ width: '10%', alignItems: 'center', flex: 1 },]}>
                        <V style={[{ color: colors.textMain, fontSize: 15, fontWeight: 'bold' },]}>{para.month}</V>
                        <V style={[{ color: colors.textMain, fontSize: 15, fontWeight: 'bold', marginTop: 3 },]}>{'月'}</V>
                    </V> :
                        <V style={[{ width: '12.5%', alignItems: 'center', flex: 1 },]}>
                            <V style={[{ color: colors.textMain, fontSize: 15, fontWeight: 'bold' },]}>
                                {lib.dayOfWeek1[week]}
                            </V>
                            <V style={[{ color: colors.textMain, fontSize: 15, marginTop: 3 },]}>
                                {nDate.getDate()}
                            </V>
                        </V>
                }) :
                <V style={[{
                    alignItems: 'center',
                    flexDirection: 'row',
                    flex: 1,
                },]}>{
                        para.list.map((va, idx) => {
                            let data = st.getKec(idx)

                            return idx == 0 ? <V style={[{
                                width: '10%',
                                marginLeft: 2,
                                textAlign: 'center',
                                alignItems: 'center',
                                flex: 1
                            },]}>
                                <V style={[{
                                    color: colors.textMain,
                                    fontSize: 14,
                                    marginTop: 10,
                                },]}>{para.dat[0]?.courseTimeStartDate}</V>

                                <V style={[{
                                    color: colors.textMain,
                                    fontSize: 14,
                                },]}>{para.dat[0]?.courseTimeEndDate}</V>
                            </V> :
                                <V style={[{
                                    textAlign: 'center',
                                    paddingHorizontal: 1,
                                    width: '12.5%',
                                    alignItems: 'center',
                                    marginTop: 10,
                                },]}>
                                    <V style={[{
                                        borderRadius: 3,
                                        backgroundColor: data ? colors.list[lib.randomInt(7)] : colors.transparent,
                                    },]}>
                                        <V style={[{
                                            color: colors.white,
                                            padding: 2,
                                            fontSize: 13,
                                        },]}>
                                            {data?.ccName}
                                        </V>
                                        <V style={[{
                                            color: colors.white,
                                            padding: 2,
                                            fontSize: 13,
                                            paddingTop: 3,
                                        },]}>
                                            {data?.teacherName}
                                        </V>
                                    </V>
                                </V>
                        })}
                </V>
            }
        </V>
    )
}


const sty = StyleSheet.create({

})
