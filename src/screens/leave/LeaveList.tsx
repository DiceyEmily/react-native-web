import { colors } from "@common/components/colors";
import { RangeDate } from "@common/components/RangeDate";
import { SelectState } from '@common/components/SelectState';
import { app } from '@common/lib/app';
import { PullList } from '@common/lib/components/custom/PullList';
import { V } from '@common/lib/components/custom/V';
import { useInit, useObjState } from '@common/lib/hooks';
import { lib } from '@common/lib/lib';
import { api } from "@src/config/api";
import { LeaveBean } from "@src/model/leave/LeaveBean";
import { memoItem } from "@src/rn-common/lib/components/memoItem";
import React from 'react';
import { Pressable, StyleSheet, ViewProps } from "react-native";
import { LeaveListItem } from './LeaveListItem';
import { LeaveScreenState, LeaveType } from "./LeaveScreen";


interface LeaveListProp extends ViewProps {
    //列表类型
    listType: LeaveType;
    isEditp?: boolean
    stHome?: LeaveScreenState;
}


export class LeaveListState extends SelectState<LeaveBean> {

    //列表
    pull: PullList<LeaveBean> | null = null
    startTime = new Date()
    endTime = new Date()

    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: LeaveListProp,
    ) {
        super(d => d.approveUuid)
    }

    search = false

    refresh = () => {
        this.search = true
        return this.pull?.clearRefresh();
    }

    onSearch = (text: string) => {
        this.pull?.clearRefresh();
    }

    getList = async (page: number) => {
        let res = await api.leave_record_page({
            page: page,
            pageSize: app.pageNum,
            createTime: !this.search ? undefined : lib.dateToY_M_D_H_M_S(this.startTime, false, true),
            updateTime: !this.search ? undefined : lib.dateToY_M_D_H_M_S(this.endTime, false, true),
        }).hideProg.result;

        this.search = false

        return res;
    }


}



/**
 * 请假记录列表
 * @param prop
 * @returns
 */
export function LeaveList(prop: LeaveListProp) {

    //组件状态
    const st = useObjState(() => new LeaveListState(prop), prop)

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })


    return (
        <V style={[{ flex: 1, backgroundColor: colors.background }]}>
            <PullList<LeaveBean>
                ref={ref => st.pull = ref}
                renderHeader={(prop.listType == LeaveType.VAC_JI_LU) ? () =>
                    <RangeDate
                        disableTime
                        startTime={st.startTime} endTime={st.endTime} onSearch={() => {
                            st.refresh()
                        }} />
                    : undefined}
                style={[{},]}
                autoLoad={true}
                renderItem={(it) => memoItem(LeaveListItem, {
                    sms: it.item,
                    isEditp: prop.isEditp
                })}
                onGetListByPage={page => st.getList(page)}>
            </PullList>
        </V>
    )


}

const styl = StyleSheet.create({
    bottomButton: {
        paddingHorizontal: 20,
        paddingVertical: 6,
        flexDirection: "column",
        alignItems: "center",
    }
})
