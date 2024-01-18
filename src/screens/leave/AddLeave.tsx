import { colors } from "@common/components/colors";
import { RangeDate } from "@common/components/RangeDate";
import { leng, styles } from '@common/components/styles';
import { app } from '@common/lib/app';
import { ButtonView } from '@common/lib/components/custom/ButtonView';
import { EditView } from '@common/lib/components/custom/EditView';
import { V } from '@common/lib/components/custom/V';
import { findState, useInit, useObjState } from '@common/lib/hooks';
import { lib } from '@common/lib/lib';
import { vali } from '@common/lib/valid';
import React from 'react';
import { ScrollView, StyleSheet } from "react-native";
import { PressView } from "@src/rn-common/lib/components/custom/PressView";
import { Icon } from "@src/rn-common/lib/components/icon/Icon";
import { LeaveType } from "./LeaveType";
import { LeaveRecord } from "@src/model/leave/LeaveRecord";
import { api } from "@src/config/api";
import { LeaveListState } from "./LeaveList";

interface AddLeaveProp {
    //显示header与Container
    showHeader?: boolean
}

export class AddLeaveState {

    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: AddLeaveProp,
    ) {

    }

    leaveRecord = new LeaveRecord();
    sltName = ''

    onAdd = async () => {
        let [ok, msg] = await vali.check(this.leaveRecord)
        if (!ok) {
            app.msgErr(msg)
            return;
        }

        let res = await api.leave_record(this.leaveRecord).result

        //刷新记录列表
        findState(LeaveListState, it => it.refresh())
        app.msg('提交成功');
    }


}


/**
 * 请假申请
 * @param prop 
 * @returns 
 */
export function AddLeave(prop: AddLeaveProp) {

    //组件状态
    const st = useObjState(() => new AddLeaveState(prop), prop)

    //组件初始化
    useInit(async () => {

        st.leaveRecord.startDate = new Date()
        st.$update

        return async () => { //组件卸载

        }
    })


    return (
        mainView()
    )


    function mainView() {
        return <V style={{ flex: 1, }}>
            <ScrollView style={[{
                padding: 20,
                backgroundColor: colors.transparent
            }, !prop.showHeader && styles.topRound, styles.scrollFix]}>

                <V style={[sty.row, { marginTop: 10, }]}>
                    <V style={[{}, sty.titleSub]}>假单类型<V style={sty.titleRed}>*</V></V>
                    <PressView
                        onPress={() =>
                            app.push(LeaveType, {
                                onSelect: (data) => {
                                    st.leaveRecord.sltUuid = data.sltUuid
                                    st.sltName = data.code
                                    st.$update
                                }
                            })
                        }
                        style={[{
                            flex: 1, alignSelf: 'center',
                            paddingVertical: 4,
                            paddingHorizontal: 12,
                            borderRadius: 360,
                            borderWidth: leng.pixel1,
                            borderColor: colors.lineGrey,
                        }, styles.rowCenter,]}>
                        <V style={[{ flex: 1, color: colors.greyText, marginRight: 10 },]}>{st.sltName}</V>

                        <Icon
                            style={[{},]}
                            name="arrow_forward_ios" size={18} color={colors.grey8}
                        />
                    </PressView>
                </V>

                <RangeDate
                    column={["开始时间", "结束时间"]}
                    dateRange={[lib.newDate(new Date(), -1, 0), lib.newDate(new Date(), 10, 0)]}
                    selectType={["year", "month", "day", "hour"]}
                    onSelectStart={res => {
                        st.leaveRecord.startDate = res
                        setAllTime()
                    }}
                    onSelectEnd={res => {
                        st.leaveRecord.endDate = res
                        setAllTime()
                    }}
                />


                <V style={[{}, sty.row]}>
                    <V style={[{}, sty.titleSub]}>共计时长<V style={sty.titleRed}>*</V></V>
                    <EditView
                        editable={false}
                        state={[st.leaveRecord, "duration"]}
                        style={[{ color: colors.grey3, flex: 1 }, sty.editSty]}
                        placeholder="选择开始和结束时间自动填充时长" />
                </V>

                <V style={[{ marginTop: 25 }]}>
                    <V style={[{ fontWeight: 'bold' }, sty.titleSub]}>请假原因</V>
                    <EditView
                        multiline={true}
                        state={[st.leaveRecord, "reason"]}
                        style={[sty.editSty, { marginTop: 10 },]}
                        placeholder="输入请假原因" />
                </V>

            </ScrollView>

            <V style={[{ right: 30, bottom: 30, position: "absolute" }, styles.rowCenter]}>
                <ButtonView
                    onPress={() => {
                        st.onAdd()
                    }}
                    style={[{ width: 55, height: 55, justifyContent: "center", },]}>提交</ButtonView>
            </V>
        </V>;
    }

    /* 根据开始和结束时间，计算总的休假时间 */
    function setAllTime() {
        // if (st.leaveRecord.startDate.length == 0 || st.leaveRecord.endDate.length == 0) {
        //     return
        // }
        let bet = st.leaveRecord.endDate.getDate() - st.leaveRecord.startDate.getDate();
        let day = 0;
        if (bet < 0) {
            if (new Date(st.leaveRecord.endDate).getHours() < 12) {
                //结束时间是上午的属于一天
                day += 1;
            } else {
                day += 0.5;
            }
            if (new Date(st.leaveRecord.startDate).getHours() < 12) {
                //开始时间是上午的属于半天
                day += 0.5;
            } else {
                day += 1;
            }
        } else {
            if (new Date(st.leaveRecord.startDate).getHours() < 12) {
                //开始时间是上午的属于一天
                day += 1;
            } else {
                day += 0.5;
            }
            if (new Date(st.leaveRecord.endDate).getHours() < 12) {
                //结束时间是上午的属于半天
                day += 0.5;
            } else {
                day += 1;
            }
        }

        //间隔时间
        let betd = Date.parse(lib.dateToY_M_D(st.leaveRecord.endDate)) - Date.parse(lib.dateToY_M_D(st.leaveRecord.startDate));
        if (betd < 0) {
            betd = Math.abs(betd)
        }
        day += ((betd / (24 * 60 * 60 * 1000)) << 0) - 1;
        st.leaveRecord.duration = Math.ceil(day) + '';
        st.$update;
    }
}

const sty = StyleSheet.create({
    titleRed: {
        fontSize: 17,
        color: colors.red,
    },
    row: {
        marginTop: 25,
        flexDirection: "row",
        alignItems: "center",
    },
    titleSub: {
        fontSize: 15,
        marginRight: 20
    },
    editSty: {
        marginTop: 5,
    },
    tb_head: {
        color: colors.grey3,
        paddingVertical: 10,
        flexDirection: 'row',
    }
})