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
import { memoItem } from '@src/rn-common/lib/components/memoItem';
import { SchoolAssiData } from '@src/model/home/SchoolAssiData';


interface SchoolAssiDetailsProp {
    time?: string
}


export class SchoolAssiDetailsState {

    //更新组件
    get $update() { return }

    constructor(
        //组件属性
        public prop_: SchoolAssiDetailsProp,
    ) {

    }

    total = 0

    getList = async (page: number) => {
        let res = await api.home_work({
            page: page - 1,
            pageSize: app.pageNum,
            createTime: this.prop_.time,
        }).result

        this.total = res.length
        this.$update

        return res
    }


}



/**
 * 作业详情
 * @param prop
 * @returns
 */
export function SchoolAssiDetails(prop: SchoolAssiDetailsProp) {

    //组件状态
    const st = useObjState(() => new SchoolAssiDetailsState(prop), prop)

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })


    return (
        <Container style={{ flex: 1, backgroundColor: colors.white }}>
            <HeaderBar
                title={"作业详情"}
            />

            <V style={[{ flexDirection: 'row', margin: 20, alignItems: 'center' },]}>
                <V numberOfLines={1} style={[{
                    color: colors.textMain, fontSize: 15, fontWeight: 'bold'
                },]} >{prop.time ?? lib.dateToY_M_D_CN(new Date())}</V>
                <V style={[{ flex: 1 },]}></V>
                <V numberOfLines={1} style={[{
                    color: colors.textMain, fontSize: 15, fontWeight: 'bold'
                },]} >{`共${st.total}项作业`}</V>
            </V>

            <PullList<SchoolAssiData>
                style={[{
                    paddingVertical: 6,
                    backgroundColor: colors.white,
                },]}
                autoLoad={true}
                renderItem={(i) => memoItem(MySchoolAssiItem, {
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
export function MySchoolAssiItem(para: { dat: SchoolAssiData, onPress: () => void, index: number }) {

    const st = useObjState(() => ({

    }))

    useInit(async () => {


        return async () => { //组件卸载

        }
    })


    return (
        <V style={[{ flex: 1, },]}>
            <V onPress={para.onPress} style={[
                { flexDirection: 'row', alignItems: 'center', padding: 12, marginHorizontal: 12, marginBottom: 8 },
                styles.roundBackShadow]}>
                <V style={[{},]}>
                    <V style={[{
                        color: colors.textMain, fontSize: 15,
                    },]} >{para.dat.claName + '：' + para.dat.remark}</V>
                    {/* <V style={[{
                        color: colors.grey9, fontSize: 13, marginTop: 5,
                    },]} >{para.dat.remark}</V> */}
                </V>
            </V>
        </V>
    )
}

const sty = StyleSheet.create({

})
