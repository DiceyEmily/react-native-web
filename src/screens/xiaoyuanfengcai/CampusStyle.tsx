import { colors } from "@common/components/colors";
import { app } from '@common/lib/app';
import { PullList } from '@common/lib/components/custom/PullList';
import { useInit, useObjState } from '@common/lib/hooks';
import React from 'react';
import { StyleSheet } from "react-native";
import { api } from '@src/config/api';
import { Container } from "@src/rn-common/lib/components/Container";
import { HeaderBar } from "@src/components/Header";
import { CampusStyleItem } from "./CampusStyleItem";
import { CampusStyleDetails } from "./CampusStyleDetails";
import { memoItem } from "@src/rn-common/lib/components/memoItem";
import { CampusStyleData } from "@src/model/home/CampusStyleData";


interface CampusStyleProp {

}


export class CampusStyleState {

    //更新组件
    get $update() { return }

    constructor(
        //组件属性
        public prop_: CampusStyleProp,
    ) {

    }

    pullList: PullList<CampusStyleData> | null = null

    tag = 'all'

    getList = async (page: number) => {
        let res = await api.campus_style({
            page: page - 1, pageSize: app.pageNum,
        }).hideProg.result

        return res
    }

    //列表刷新
    async refreshListData() {
        await this.pullList?.onRefresh()
    }

}



/**
 * 校园风采
 * @param prop
 * @returns
 */
export function CampusStyle(prop: CampusStyleProp) {

    //组件状态
    const st = useObjState(() => new CampusStyleState(prop), prop)

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })


    return (
        <Container
            style={{ backgroundColor: colors.background }}>

            <HeaderBar
                title={"校园风采"}
            />

            <PullList<CampusStyleData>
                style={[{},]}
                ref={ref => {
                    st.pullList = ref
                }}
                autoLoad={true}
                renderItem={(it) => memoItem(CampusStyleItem, {
                    dat: it.item,
                    onPress: () => {
                        app.push(CampusStyleDetails, { dat: it.item })
                    }
                })}
                onGetListByPage={page => st.getList(page)}>
            </PullList>
        </Container>
    )


}

const sty = StyleSheet.create({

})
