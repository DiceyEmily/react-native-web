import { colors } from "@common/components/colors";
import { styles } from '@common/components/styles';
import { Container } from '@common/lib/components/Container';
import { V } from '@common/lib/components/custom/V';
import { useInit, useObjState } from '@common/lib/hooks';
import { array, lib } from '@common/lib/lib';
import { api } from "@src/config/api";
import { LeaveRecordType } from "@src/model/leave/LeaveRecordType";
import { app } from "@src/rn-common/lib/app";
import { PressView } from "@src/rn-common/lib/components/custom/PressView";
import React from 'react';
import { ScrollView, StyleSheet } from "react-native";
import { HeaderBar } from '../../components/Header';


const leave_type = {
    "HUI_YI": "年假",
    "HUI_JIAN": "病假",
    "SHANG_JI_HUI_YI": "调休",
    "QI_TA": "事假",
}

interface LeaveTypeProp {
    onSelect: (data: LeaveRecordType) => void
}

export class LeaveTypeState {

    vacationType = array(LeaveRecordType)

    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: LeaveTypeProp,
    ) { }

    listTypeAll = async () => {
        let res = await api.leave_record_listTypeAll().result;
        this.vacationType = res
        this.$update
    }

}


/**
 * 请假类型
 * @param prop 
 * @returns 
 */
export function LeaveType(prop: LeaveTypeProp) {

    //组件状态
    const st = useObjState(() => new LeaveTypeState(prop), prop)

    //组件初始化
    useInit(async () => {

        st.listTypeAll()

        return async () => { //组件卸载

        }
    })


    return (
        <Container bgHeight={200} style={{ backgroundColor: colors.background }}>
            <HeaderBar
                title={"请假类型"}
            />
            {mainView()}
        </Container>
    )


    function mainView() {
        return <V style={{ flex: 1, }}>
            <ScrollView style={[{
                padding: 20,
                backgroundColor: colors.transparent
            }, styles.scrollFix]}>
                {st.vacationType.map((value, idx) => {
                    return <PressView style={[{ flexDirection: 'row', alignItems: 'center', flex: 1 },]}
                        onPress={() => {
                            prop.onSelect(value)
                            app.pop()
                        }}
                    >
                        <V style={[{ borderRadius: 360, marginLeft: 5, height: 5, width: 5, backgroundColor: colors.list[lib.randomInt(colors.list.length - 1)] },]} ></V>
                        <V style={[{ fontSize: 15, marginLeft: 10, flex: 2 },]} >{value.name}</V>
                        <V style={[{ width: 1, borderStyle: 'dotted', backgroundColor: colors.greyD, minHeight: 25 },]} ></V>
                        <V style={[{ fontSize: 15, marginLeft: 15, flex: 3, marginVertical: 10 },]} >
                            <V style={[{ fontSize: 15, },]} >{'剩余' + value.sltId + '天'}</V>
                            <V style={[{ fontSize: 12, color: colors.grey9 },]} >{value.code}</V>
                        </V>
                    </PressView>
                })}
            </ScrollView >
        </V >;
    }

}

const sty = StyleSheet.create({
    row: {
        marginTop: 25,
        flexDirection: "row",
        alignItems: "center",
    },
})