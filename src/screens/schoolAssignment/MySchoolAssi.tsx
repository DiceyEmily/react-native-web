import { styles } from '@common/components/styles';
import { colors } from "@common/components/colors";
import { app } from '@common/lib/app';
import { findState, useInit, useObjState } from '@common/lib/hooks';
import React from 'react';
import { StyleSheet } from "react-native";
import { api } from '@src/config/api';
import { HeaderBar } from '@src/components/Header';
import { V } from '@src/rn-common/lib/components/custom/V';
import { array, lib } from '@src/rn-common/lib/lib';
import { Container } from '@src/rn-common/lib/components/Container';
import { Calendar, CalendarState } from '@src/rn-common/components/Calendar';
import { MySchoolAssiItem } from './SchoolAssiDetails';
import { PullList } from '@src/rn-common/lib/components/custom/PullList';
import { memoItem } from '@src/rn-common/lib/components/memoItem';
import { SchoolAssiData } from '@src/model/home/SchoolAssiData';
import { SchoolAssiMonth } from '@src/model/home/SchoolAssiMonth';


interface MySchoolAssiProp {
    time?: string
}


export class MySchoolAssiState {

    //更新组件
    get $update() { return }

    constructor(
        //组件属性
        public prop_: MySchoolAssiProp,
    ) {

    }

    pull = Array<PullList<SchoolAssiData>>();

    selectDate = new Date();

    total = 0

    //储存所有政务标记日期<年-月-日,是否标记>
    signMap = new Map<string, boolean | string>();

    //月份数据获取记录
    monthMap = new Map<string, boolean>();

    getList = async (date: Date) => {
        if (this.monthMap.get(lib.dateToY_M_D(date, true, false))) {
            return
        }
        let res = await api.home_work_status(lib.dateToY_M_D(date, true, false)).hideProg.result
        this.monthMap.set(lib.dateToY_M_D(date, true, false), true)

        let agendaMap = new Array<{ key: string, value: SchoolAssiMonth[] }>()
        let hasAgenda = false
        res.map((va, ia) => {
            //有作业
            hasAgenda = true
            let da = lib.dateToY_M_D(va.deadline)
            this.signMap.set(da, va.ready == 2 ? "" : true,)
            let hasMap = false
            for (const map of agendaMap) {
                if (map.key == da) {
                    hasMap = true
                    map.value.push(va)
                    break
                }
            }
            if (!hasMap) {
                let list = array(SchoolAssiMonth)
                list.push(va)
                agendaMap.push({ key: da, value: list })
            }
        })
        if (hasAgenda) {
            findState(CalendarState, it => it.prop_.signMap == this.signMap && it.refresh())
        }

        this.$update
    }

    getListDetails = async (page: number) => {
        let res = await api.home_work({
            page: page - 1,
            pageSize: app.pageNum,
            deadline: lib.dateToY_M_D(this.selectDate, true),
        }).hideProg.result

        this.total = res.length
        this.$update

        this.signMap.set(lib.dateToY_M_D(this.selectDate), "",)
        findState(CalendarState, it => it.prop_.signMap == this.signMap && it.refresh())

        return res
    }

    onSelectDate = (date: Date, routeIndex: number) => {
        this.selectDate = date;
        this.pull[routeIndex]?.clearRefresh();
    }


}



/**
 * 我的作业
 * @param prop
 * @returns
 */
export function MySchoolAssi(prop: MySchoolAssiProp) {

    //组件状态
    const st = useObjState(() => new MySchoolAssiState(prop), prop)

    //组件初始化
    useInit(async () => {

        st.getList(st.selectDate)

        return async () => { //组件卸载

        }
    })


    return (
        <Container style={{ flex: 1, backgroundColor: colors.white }}>
            <HeaderBar
                title={"我的作业"}
            />

            <PullList<SchoolAssiData>
                ref={ref => {
                    if (ref)
                        st.pull[0] = ref
                }}
                disableMore={true}
                renderHeader={() => <V
                    style={{ padding: 12, marginBottom: 10, }}
                ><Calendar
                        disableScroll
                        disableTime
                        expand
                        date={st.selectDate}
                        style={styles.roundBackShadow}
                        onChangeMonth={(date) => {
                            st.getList(date)
                        }}
                        onSelect={(date) => {
                            st.onSelectDate(date, 0)
                        }}
                        signMap={st.signMap} />

                    <V style={[{
                        flexDirection: 'row',
                        marginTop: 10,
                        marginHorizontal: 10,
                        alignItems: 'center'
                    },]}>
                        {/* <V numberOfLines={1} style={[{
                            color: colors.textMain, fontSize: 15, fontWeight: 'bold'
                        },]} >{prop.time ?? lib.dateToY_M_D_CN(st.zhengWuDate)}</V>
                        <V style={[{ flex: 1 },]}></V> */}
                        <V numberOfLines={1} style={[{
                            color: colors.textMain, fontSize: 15, fontWeight: 'bold'
                        },]} >{`共${st.total}项作业`}</V>
                    </V>
                </V>
                }
                style={[{},]}
                autoLoad={true}
                renderItem={(i, ref) => memoItem(MySchoolAssiItem, {
                    dat: i.item,
                    onPress: async () => {

                    },
                    // list: ref.state.data.length,
                    index: i.index
                })}
                onGetListByPage={page => st.getListDetails(page)}>
            </PullList>
        </Container>
    )

}


const sty = StyleSheet.create({

})
