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
import { PullList } from '@src/rn-common/lib/components/custom/PullList';
import { Task } from '@src/model/msg/Task';
import { memoItem } from '@src/rn-common/lib/components/memoItem';


interface CampusCafeteriaProp {

}


export class CampusCafeteriaState {

    //更新组件
    get $update() { return }

    constructor(
        //组件属性
        public prop_: CampusCafeteriaProp,
    ) {

    }

    startTime = new Date()
    endTime = new Date()

    getList = async (page: number) => {
        let res = await api.food_plan({
            startDate: lib.dateToY_M_D_H_M_S(lib.getOneDate(this.startTime)),
            endDate: lib.dateToY_M_D_H_M_S(lib.getOneDate(this.startTime, 7)),
        }).hideProg.result

        return []
    }


}



/**
 * 校园食堂
 * @param prop
 * @returns
 */
export function CampusCafeteria(prop: CampusCafeteriaProp) {

    //组件状态
    const st = useObjState(() => new CampusCafeteriaState(prop), prop)

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })


    return (

        <Container style={{ flex: 1, backgroundColor: colors.white }}>
            <HeaderBar
                title={"校园食堂"}
            />

            <V style={[{ flexDirection: 'row', margin: 20, alignItems: 'center' },]}>
                <V numberOfLines={1} style={[{
                    color: colors.textMain, fontSize: 16, fontWeight: 'bold'
                },]} >{'本周菜单'}</V>
            </V>

            <PullList<Task>
                style={[{
                    borderRadius: 3, marginHorizontal: 8, paddingVertical: 5,
                },]}
                autoLoad={true}
                name=' '
                renderItem={(i) => memoItem(TimeItem, {
                    dat: i.item,
                    index: i.index,
                    onPress: () => { },
                    list: [0, 0, 1, 2, 3, 4, 5, 6]
                })}
                onGetListByPage={page => st.getList(page)}>
            </PullList>

            <V style={[{ flexDirection: 'row', margin: 20, alignItems: 'center' },]}>
                <V numberOfLines={1} style={[{
                    color: colors.textMain, fontSize: 16, fontWeight: 'bold'
                },]} >{'明灶亮厨-餐厅工作实时监控'}</V>
            </V>
        </Container>
    )

}


/* 时间item */
function TimeItem(para: { dat: Task, onPress: () => void, index: number, list: number[] }) {

    // const st = useObjState(() => ({

    // }))

    // useInit(async () => {


    //     return async () => { //组件卸载

    //     }
    // })


    return (
        <V style={[{ flexDirection: 'row', width: '100%', flex: 1 },]}>
            {para.index == 0 ?
                para.list.map((va, idx) => {
                    return idx == 0 ? <V style={[{ width: '10%', alignItems: 'center', flex: 1 },]}>
                        <V style={[{ color: colors.textMain, fontSize: 15, fontWeight: 'bold' },]}>{'日期'}</V>
                    </V> :
                        <V style={[{ width: '12.5%', alignItems: 'center', flex: 1 },]}>
                            <V style={[{ color: colors.textMain, fontSize: 15, fontWeight: 'bold' },]}>
                                {lib.dayOfWeek1[va]}
                            </V>
                        </V>
                }) :
                para.list.map((va, idx) => {
                    return idx == 0 ? <V style={[{ width: '10%', marginLeft: 2, textAlign: 'center', alignItems: 'center', flex: 1 },]}>
                        <V style={[{ color: colors.textMain, fontSize: 14, marginTop: 20 },]}>{'早餐'}</V>
                    </V> :
                        <V style={[{ textAlign: 'center', paddingHorizontal: 1, width: '12.5%', alignItems: 'center', marginTop: 10 },]}>
                            <V style={[{ color: colors.white, padding: 2, fontSize: 13, backgroundColor: colors.list[lib.randomInt(7)], borderRadius: 3 },]}>
                                {'宫保鸡丁'}
                            </V>
                        </V>
                })}
        </V>
    )
}


const sty = StyleSheet.create({

})
