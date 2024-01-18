import { colors } from "@common/components/colors";
import { app } from '@common/lib/app';
import { useInit, useObjState } from '@common/lib/hooks';
import React from 'react';
import { StyleSheet } from "react-native";
import { api } from '@src/config/api';
import { V } from "@src/rn-common/lib/components/custom/V";
import { Container } from "@src/rn-common/lib/components/Container";
import { HeaderBar } from "@src/components/Header";
import { Pic } from "@src/rn-common/lib/components/custom/Pic";
import { imgs } from "@src/imgs";
import { lib } from "@src/rn-common/lib/lib";
import { CampusStyleData } from "@src/model/home/CampusStyleData";
import { HtmlView } from "@src/rn-common/lib/components/HtmlView";


interface CampusStyleDetailsProp {
    dat: CampusStyleData
}


export class CampusStyleDetailsState {

    //更新组件
    get $update() { return }

    constructor(
        //组件属性
        public prop_: CampusStyleDetailsProp,
    ) {

    }

    getList = async (page: number) => {
        let res = await api.getAllMsgResource({
            page: page - 1, pageSize: app.pageNum,
        }).hideProg.result

        return res.content
    }


}



/**
 * 校园风采详情
 * @param prop
 * @returns
 */
export function CampusStyleDetails(prop: CampusStyleDetailsProp) {

    //组件状态
    const st = useObjState(() => new CampusStyleDetailsState(prop), prop)

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })


    return (
        <Container
            style={{ flex: 1, backgroundColor: colors.background, }}>

            <HeaderBar
                title={"校园风采详情"}
            />

            <V style={[{ paddingHorizontal: 20 },]}>
                <V style={[{
                    color: colors.textMain, fontSize: 16, marginTop: 20, marginBottom: 3,
                },]} >{prop.dat.title}</V>
                <V style={[{ flexDirection: 'row', },]}>
                    <V numberOfLines={1} style={[{
                        color: colors.grey9, marginVertical: 8, fontSize: 12
                    },]}>{'发布时间：' + prop.dat.createTime}</V>
                    <V style={[{ flex: 1 },]}></V>
                    <V numberOfLines={1} style={[{
                        color: colors.grey9, marginVertical: 8, fontSize: 12
                    },]}>{'发布人：' + prop.dat.releasePerson}</V>
                </V>

                <V style={[{
                    color: colors.textMain, fontSize: 16, marginTop: 20, marginBottom: 3,
                },]} >
                    <HtmlView style={[{ flex: 1 },]} html={prop.dat.content} />
                </V>

            </V>
        </Container >
    )


}

const sty = StyleSheet.create({

})
