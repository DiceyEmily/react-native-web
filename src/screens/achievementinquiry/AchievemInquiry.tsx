import { styles } from '@common/components/styles';
import { colors } from "@common/components/colors";
import { app } from '@common/lib/app';
import { PullList } from '@common/lib/components/custom/PullList';
import { useInit, useObjState } from '@common/lib/hooks';
import React from 'react';
import { StyleSheet } from "react-native";
import { api } from '@src/config/api';
import { HeaderBar } from '@src/components/Header';
import { Task } from '@src/model/msg/Task';
import { V } from '@src/rn-common/lib/components/custom/V';
import { lib } from '@src/rn-common/lib/lib';
import { Container } from '@src/rn-common/lib/components/Container';
import { AchievemInquiryDetails } from './AchievemInquiryDetails';
import { memoItem } from '@src/rn-common/lib/components/memoItem';
import { AchieveInqData } from '@src/model/home/AchieveInqData';


interface AchievemInquiryProp {
    time?: string
}


export class AchievemInquiryState {

    //更新组件
    get $update() { return }

    constructor(
        //组件属性
        public prop_: AchievemInquiryProp,
    ) {

    }

    total = 0

    getList = async (page: number) => {
        let res = await api.exam_score_page({
            page: page - 1,
            pageSize: app.pageNum,
        }).hideProg.result

        this.total = res.length
        this.$update

        return res
    }


}



/**
 * 成绩查询
 * @param prop
 * @returns
 */
export function AchievemInquiry(prop: AchievemInquiryProp) {

    //组件状态
    const st = useObjState(() => new AchievemInquiryState(prop), prop)

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })


    return (
        <Container style={{ flex: 1, backgroundColor: colors.white }}>
            <HeaderBar
                title={"成绩查询"}
            />

            <PullList<AchieveInqData>
                style={[{
                    paddingVertical: 12,
                    backgroundColor: colors.white,
                },]}
                autoLoad={true}
                renderItem={(i) => memoItem(AchievemInquiryItem, {
                    dat: i.item,
                    onPress: async () => {
                        // app.push(DocumentDetail, { dat: i.item.filter() })
                    },
                    index: i.index
                })}
                onGetListByPage={page => st.getList(page)}>
            </PullList>
        </Container>
    )

}


/* 事项item */
function AchievemInquiryItem(para: { dat: AchieveInqData, onPress: () => void, index: number }) {

    const st = useObjState(() => ({

        ys: lib.randomInt(4),
        dan: para.index % 2 != 0,

        gotoDetails() {
            app.push(AchievemInquiryDetails, {
                id: para.dat.setUuid,
                dangci: para.dat.levelCode,
                scores: para.dat.score,
                title: para.dat.setName
            })
        },
    }))

    useInit(async () => {


        return async () => { //组件卸载

        }
    })

    return (

        <V style={[{ flex: 1, },]}>
            <V onPress={para.onPress} style={[
                { alignItems: 'center', marginHorizontal: 12, paddingVertical: 3, },]}>
                <V style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', },]}>
                    <V numberOfLines={1} style={[{
                        marginBottom: -10, width: '50%',
                        textAlign: st.dan ? 'right' : 'center',
                        paddingRight: st.dan ? 40 : undefined,
                        paddingLeft: st.dan ? 40 : undefined,
                        color: st.dan ? colors.grey3 : colors.transparent, fontSize: 15,
                    },]}
                        onPress={() => {
                            if (st.dan) {
                                st.gotoDetails()
                            }
                        }}
                    >{st.dan ? para.dat.setName : ''}</V>

                    <V numberOfLines={1} style={[{
                        marginBottom: -10, width: '50%',
                        textAlign: !st.dan ? 'left' : 'center',
                        paddingRight: !st.dan ? 40 : undefined,
                        paddingLeft: !st.dan ? 40 : undefined,
                        color: !st.dan ? colors.grey3 : colors.transparent, fontSize: 15,
                    },]}
                        onPress={() => {
                            if (!st.dan) {
                                st.gotoDetails()
                            }
                        }}
                    >{!st.dan ? para.dat.setName : ''}</V>
                </V>
                <V style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', },]}>
                    <V numberOfLines={1} style={[{
                        color: st.dan ? colors.charts[st.ys] : colors.transparent, fontSize: 20, fontWeight: '900', marginRight: 10,
                    },]}
                        onPress={() => {
                            if (st.dan) {
                                st.gotoDetails()
                            }
                        }}
                    >{'-----------'}</V>
                    <V style={[{
                        width: 40, height: 40,
                        backgroundColor: colors.charts[st.ys],
                        borderRadius: 360,
                        justifyContent: 'center',
                    },]} >
                        <V style={[{
                            fontSize: 13,
                            color: colors.white,
                            textAlign: 'center',
                        },]}>{new Date(para.dat.createDate).getFullYear()}</V>
                    </V>
                    <V numberOfLines={1} style={[{
                        color: !st.dan ? colors.charts[st.ys] : colors.transparent, fontSize: 20, fontWeight: '900', marginLeft: 10,
                    },]}
                        onPress={() => {
                            if (!st.dan) {
                                st.gotoDetails()
                            }
                        }}
                    >{'-----------'}</V>
                </V>
            </V>
        </V>
    )
}

const sty = StyleSheet.create({

})
