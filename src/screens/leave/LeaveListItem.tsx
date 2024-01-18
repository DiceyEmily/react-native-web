import { styles } from '@common/components/styles';
import { colors } from "@common/components/colors";
import { app } from '@common/lib/app';
import { PressView } from '@common/lib/components/custom/PressView';
import { V } from '@common/lib/components/custom/V';
import { useInit, useObjState } from '@common/lib/hooks';
import { lib } from '@common/lib/lib';
import React from 'react';
import { StyleSheet } from "react-native";
import { LeaveDetail } from './LeaveDetail';
import { LeaveBean } from '@src/model/leave/LeaveBean';


interface LeaveListItemProp {
    sms: LeaveBean
    isEditp?: boolean
}


export class LeaveListItemState {


    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: LeaveListItemProp,
    ) {

    }


    onVacationItemClick = () => {
        if (!this.prop_.isEditp) {
            return
        }
        app.push(LeaveDetail, {
            docId: this.prop_.sms.approveUuid,
            isEditp: this.prop_.isEditp
        })
    }


}



/**
 * 休假item样式
 * @param prop 
 * @returns 
 */
export function LeaveListItem(prop: LeaveListItemProp) {

    //组件状态
    const st = useObjState(() => new LeaveListItemState(prop), prop)

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })



    return (
        <PressView
            onPress={() => st.onVacationItemClick()}
            style={[{
                marginTop: 12,
                marginHorizontal: 12,
                padding: 12,
                backgroundColor: colors.white,
            }, styles.roundShadow]}>

            <V style={[{ padding: 4, flexDirection: 'row', paddingTop: 0 },]}>
                <V style={[{ flex: 1, }]}>
                    <V style={[{
                        flexDirection: "row",
                        flex: 1,
                    },]}>
                        <V style={[{
                            fontSize: 14,
                            fontWeight: 'bold',
                            alignSelf: 'center',
                        }]}>{prop.sms.sltName}</V>
                        <V style={[{
                            fontSize: 14,
                            fontWeight: 'bold',
                            alignSelf: 'center',
                        }]}>{prop.sms.duration + '天'}</V>
                        <V style={[{
                            fontSize: 14,
                            fontWeight: 'bold',
                            alignSelf: 'center',
                        }]}>{'：' + prop.sms.reason}</V>
                    </V>

                    <V style={[{
                        flexDirection: "row",
                        flex: 1,
                        marginTop: 8,
                    },]}>
                        <V style={[{
                            fontSize: 13,
                            alignSelf: 'center',
                            color: colors.grey6,
                        }]}>{lib.dateToY_M_D_CN(prop.sms.startDate, false) + '至' + lib.dateToY_M_D_CN(prop.sms.endDate, false)}</V>
                    </V>
                </V>
                <V style={[{ flex: 1, alignItems: 'flex-end', alignSelf: 'center', }]}>
                    <V style={[{
                        flex: 1,
                        textAlign: 'center',
                        color: colors.green,
                    }]}>{prop.sms.statusName}</V>
                </V>
            </V>
        </PressView>
    )


}

const styl = StyleSheet.create({

})