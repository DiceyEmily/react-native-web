import { styles } from '@common/components/styles';
import { colors } from "@common/components/colors";
import { app } from '@common/lib/app';
import { PullList } from '@common/lib/components/custom/PullList';
import { useInit, useObjState } from '@common/lib/hooks';
import React from 'react';
import { StyleSheet } from "react-native";
import { api } from '@src/config/api';
import { HeaderBar } from '@src/components/Header';
import { V } from '@src/rn-common/lib/components/custom/V';
import { lib } from '@src/rn-common/lib/lib';
import { Container } from '@src/rn-common/lib/components/Container';
import { MyStyles } from '@src/config/MyStyles';
import { memoItem } from '@src/rn-common/lib/components/memoItem';
import { AchieveInqData } from '@src/model/home/AchieveInqData';


interface AchievemInquiryDetailsProp {
    id: string
    dangci: string
    scores: number
    title?: string
}


export class AchievemInquiryDetailsState {

    //更新组件
    get $update() { return }

    constructor(
        //组件属性
        public prop_: AchievemInquiryDetailsProp,
    ) {

    }

    getList = async (page: number) => {

        let res = await api.exam_score_page({
            page: page - 1,
            pageSize: app.pageNum,
            setUuid: this.prop_.id
        }).hideProg.result

        this.$update

        return res
    }


}



/**
 * 考试成绩详情
 * @param prop
 * @returns
 */
export function AchievemInquiryDetails(prop: AchievemInquiryDetailsProp) {

    //组件状态
    const st = useObjState(() => new AchievemInquiryDetailsState(prop), prop)

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })


    return (
        <Container style={{ flex: 1, backgroundColor: colors.white }}>
            <HeaderBar
                title={prop.title ?? '考试详情'}
            />

            <V style={[{ flexDirection: 'row', margin: 20, alignItems: 'center' },]}>
                <V numberOfLines={1} style={[{
                    color: colors.textMain, fontSize: 16,
                },]} >{`整体排名：${prop.dangci}档/第${prop.scores}名`}</V>
            </V>

            <PullList<AchieveInqData>
                style={[{
                    paddingVertical: 6,
                    backgroundColor: colors.white,
                },]}
                autoLoad={true}
                renderItem={(i, ref) => memoItem(AchievemInquiryDetailsItem, {
                    dat: i.item,
                    onPress: async () => {
                        // app.push(DocumentDetail, { dat: i.item.filter() })
                    },
                    list: ref.state.data.length,
                    index: i.index,
                })}
                onGetListByPage={page => st.getList(page)}>
            </PullList>
        </Container >
    )

}


/* 事项item */
function AchievemInquiryDetailsItem(para: { dat: AchieveInqData, onPress: () => void, index: number, list: number }) {

    const st = useObjState(() => ({

    }))

    useInit(async () => {


        return async () => { //组件卸载

        }
    })


    return <V style={[{
        flexDirection: 'row', paddingHorizontal: 12, flex: 1,
    }]}>
        <V style={[{},]}>
            <V style={[MyStyles.item_y, {
                alignSelf: 'center', alignItems: 'center', alignContent: 'center', textAlign: 'center',
                marginTop: 5, marginLeft: 15, width: 15, height: 15, borderRadius: 360,
            }]}></V>
            <V style={[{
                backgroundColor: para.index == para.list - 1 ? colors.transparent : colors.primary, alignSelf: 'center', textAlign: 'center',
                marginRight: 15, marginLeft: 20,
                width: 3, height: '98%', alignItems: 'center', alignContent: 'center',
            }]}></V>
        </V>
        <V style={[{ marginBottom: 25, flex: 1, flexDirection: 'row', marginRight: 12, marginTop: 2, marginLeft: 5, }]}>
            <V style={[{
                fontSize: 15,
                color: colors.grey6,
            },]}>{para.dat.ccName}
            </V>
            <V style={[{ flex: 1 },]}></V>
            <V style={[{
                fontSize: 15,
                color: colors.grey6,
            },]}>{`${para.dat.levelCode}档/${para.dat.score}`}
            </V>
        </V>
    </V>
}

const sty = StyleSheet.create({

})
