import React from 'react'
import { Platform, View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { V } from '@common/lib/components/custom/V';
import { useInit, useObjState } from '@common/lib/hooks';
import { Container } from '@common/lib/components/Container';
import { styles } from '@common/components/styles';
import { colors } from "@common/components/colors";
import { HeaderBar } from '../../components/Header';
import { PullScroll } from '@common/lib/components/custom/PullScroll';
import { ButtonView } from '@common/lib/components/custom/ButtonView';
import { app } from '@common/lib/app';
import { DialogAlert } from '@common/lib/components/custom/DialogAlert';
import { DialogList, DialogListItem } from '@common/lib/components/custom/DialogList';
import { LeaveBean } from '@src/model/leave/LeaveBean';


interface LeaveDetailProp {
    docId: string
    isEditp?: boolean
}

export class LeaveDetailState {

    vacation = new LeaveBean();

    sendMenus = new Array<DialogListItem>()

    onSendPress(v: View) {
        this.sendMenus = new Array<DialogListItem>()
        this.sendMenus.push({
            key: "批准",
            onClick: () => {
                let res = DialogAlert.show({
                    placeholder: '确定批准申请?',
                    text: '',
                    onOk: () => {
                        app.msg('审批成功')
                    }
                })
            },
        })
        this.sendMenus.push({
            key: "退回",
            onClick: () => {
                let res = DialogAlert.show({
                    placeholder: '确定不通过申请?',
                    text: '',
                    onOk: () => {
                        app.msg('审批不通过成功')
                    }
                })
            },
        })

        DialogList.show(this.sendMenus, {
            disableDim: true,
            type: 1,
            posView: v,
            position: (dat) => {
                return {
                    x: -40,
                    y: - dat.height - 10,
                }
            }
        })

    }
}

/* 请假详情 */
export function LeaveDetail(prop: React.PropsWithChildren<LeaveDetailProp>) {

    const st = useObjState(() => new LeaveDetailState())

    useInit(async () => {

        // let res = await apiDoc.getDocument({ id: prop.docId }).buffer(res => {
        //     st.doc = res;
        //     st.$update
        // }).result

        st.$update

        return async () => {

        }
    })

    return (
        <Container
            bgHeight={150}
            style={{}}>
            <HeaderBar
                title={"请假详情"}

            />
            <PullScroll>
                <V
                    style={[{
                        marginTop: 10,
                        marginHorizontal: 10,
                        padding: 15,
                        backgroundColor: colors.white,
                    }, styles.roundShadow]}>

                    <V style={[sty.row, {},]}>
                        <V style={[sty.contentSub, sty.titleSub]}>请假类型</V>
                        <V style={[{}, sty.contentSub]}>年休假</V>
                    </V>
                    <V style={[sty.row, { marginTop: 5 },]}>
                        <V style={[{ color: colors.transparent, }, sty.contentSub, sty.titleSub]}>温馨提示</V>
                        <V style={[{ color: colors.grey6, fontSize: 14 }, sty.contentSub]}>2021年应休年假10天，以休5天</V>
                    </V>

                    <V style={[{}, sty.row]}>
                        <V style={[sty.contentSub, sty.titleSub]}>开始时间</V>
                        <V style={[{}, sty.contentSub]}>{st.vacation.startDate.length == 0 ? '2021-05-11 上午' : st.vacation.startDate}</V>
                    </V>

                    <V style={[{}, sty.row]}>
                        <V style={[sty.contentSub, sty.titleSub]}>结束时间</V>
                        <V style={[{}, sty.contentSub]}>{st.vacation.endDate.length == 0 ? '2021-05-12 下午' : st.vacation.endDate}</V>
                    </V>

                    <V style={[{}, sty.row]}>
                        <V style={[sty.contentSub, sty.titleSub]}>总&ensp;时&ensp;长</V>
                        <V style={[{}, sty.contentSub]}>{st.vacation.duration == 0 ? '2天' : st.vacation.duration + '天'}</V>
                    </V>

                    <V style={[{}, sty.row]}>
                        <V style={[sty.contentSub, sty.titleSub]}>请假事由</V>
                        <V style={[{}, sty.contentSub]}>{st.vacation.reason.length == 0 ? '离深去北京参加新型建筑材料研讨会' : st.vacation.reason}</V>
                    </V>
                </V>
            </PullScroll>

            <V style={[{ right: 30, bottom: prop.isEditp ? 60 : 30, position: "absolute" }, styles.rowCenter]}>
                {prop.isEditp ?
                    <V style={[styles.rowCenter]}>
                        <ButtonView
                            onPress={(v) => st.onSendPress(v)}
                            style={[{ width: 55, height: 55, justifyContent: "center", },]}
                        >办理</ButtonView>
                    </V>
                    :
                    <V style={[styles.rowCenter]}>
                        <ButtonView
                            onPress={() => {
                                let res = DialogAlert.show({
                                    placeholder: '确定销假申请?',
                                    text: '',
                                    onOk: () => {
                                        app.msg('销假申请成功')
                                    }
                                })
                            }}
                            style={[{ width: 55, height: 55, justifyContent: "center", },]}
                        >销假</ButtonView>
                    </V>
                }
            </V>
        </Container>
    )

}

const sty = StyleSheet.create({
    roundDot: {
        width: 10,
        height: 10,
        borderRadius: 360,
    },
    row: {
        marginTop: 15,
        flexDirection: "row",
        alignItems: "center",
    },
    titleSub: {
        color: colors.grey6,
        minWidth: 60
    },
    contentSub: {
        fontSize: 15,
        marginRight: 20
    },
})