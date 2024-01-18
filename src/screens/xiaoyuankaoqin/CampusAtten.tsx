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
import { AchievemInquiryDetailsItem } from './CampusAttenDetails';
import { PullList } from '@src/rn-common/lib/components/custom/PullList';
import { memoItem } from '@src/rn-common/lib/components/memoItem';
import { cfg } from '@src/config/cfg';
import { CampusAttenData } from '@src/model/home/CampusAttenData';
import { CampusAttenMonth } from '@src/model/home/CampusAttenMonth';


interface CampusAttenProp {
    time?: string
}


export class CampusAttenState {

    //更新组件
    get $update() { return }

    constructor(
        //组件属性
        public prop_: CampusAttenProp,
    ) {

    }

    pull = Array<PullList<CampusAttenData>>();

    selectDate = new Date();

    //储存所有政务标记日期<年-月-日,是否标记>
    signMap = new Map<string, boolean>();

    //月份数据获取记录
    monthMap = new Map<string, boolean>();

    getList = async (date: Date) => {
        if (this.monthMap.get(lib.dateToY_M_D(date, true, false))) {
            return
        }
        let res = await api.campusAtten(lib.dateToY_M_D(date, true, false)).hideProg.result
        this.monthMap.set(lib.dateToY_M_D(date, true, false), true)

        let agendaMap = new Array<{ key: string, value: CampusAttenMonth[] }>()
        let hasAgenda = false
        res.map((va, ia) => {
            //有作业
            hasAgenda = true
            let da = lib.dateToY_M_D(va.attendanceTime)
            this.signMap.set(da, true)
            let hasMap = false
            for (const map of agendaMap) {
                if (map.key == da) {
                    hasMap = true
                    map.value.push(va)
                    break
                }
            }
            if (!hasMap) {
                let list = array(CampusAttenMonth)
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
        let res = await api.campusAtten_date(lib.dateToY_M_D(this.selectDate)).hideProg.result

        return res
    }

    onSelectDate = (date: Date, routeIndex: number) => {
        this.selectDate = date;
        this.pull[routeIndex]?.clearRefresh();
    }

}



/**
 * 校园考勤
 * @param prop
 * @returns
 */
export function CampusAtten(prop: CampusAttenProp) {

    //组件状态
    const st = useObjState(() => new CampusAttenState(prop), prop)

    //组件初始化
    useInit(async () => {

        st.getList(st.selectDate)

        return async () => { //组件卸载

        }
    })


    return (
        <Container style={{ flex: 1, backgroundColor: colors.white }}>
            <HeaderBar
                title={"校园考勤"}
            />

            <PullList<CampusAttenData>
                ref={ref => {
                    if (ref)
                        st.pull[0] = ref
                }}
                disableMore={true}
                renderHeader={() => <V
                    style={{ marginBottom: 30, }}
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
                </V>
                }
                style={[{ padding: 5, },]}
                autoLoad={true}
                renderItem={(i, ref) => memoItem(AchievemInquiryDetailsItem, {
                    dat: i.item,
                    onPress: async () => {

                    },
                    list: ref.state.data.length,
                    index: i.index
                })}
                onGetListByPage={page => st.getListDetails(page)}>
            </PullList>
        </Container>
    )

}


const sty = StyleSheet.create({

})
