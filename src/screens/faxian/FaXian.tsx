import { colors } from "@common/components/colors";
import { app } from '@common/lib/app';
import { PullList } from '@common/lib/components/custom/PullList';
import { useInit, useObjState } from '@common/lib/hooks';
import React from 'react';
import { StyleSheet } from "react-native";
import { api } from '@src/config/api';
import { FaXianItem } from './FaXianItem';
import { memoItem } from "@src/rn-common/lib/components/memoItem";
import { Container } from "@src/rn-common/lib/components/Container";
import { HeaderBar } from "@src/components/Header";
import { FaXianDetails } from "./FaXianDetails";
import { FaxianListData } from "@src/model/msg/FaxianListData";


interface FaXianProp {
    title: string
}


export class FaXianState {

    //更新组件
    get $update() { return }

    constructor(
        //组件属性
        public prop_: FaXianProp,
    ) {

    }

    pullList: PullList<FaxianListData> | null = null

    getList = async (page: number) => {
        let res = await api.news_type({
            page: page - 1, pageSize: app.pageNum,
        }).hideProg.result

        return res.data
    }

    //列表刷新
    async refreshListData() {
        await this.pullList?.onRefresh()
    }

}



/**
 * 发现消息分类
 * @param prop
 * @returns
 */
export function FaXian(prop: FaXianProp) {

    //组件状态
    const st = useObjState(() => new FaXianState(prop), prop)

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })


    return (
        <Container style={{ flex: 1, backgroundColor: colors.white }}>
            <HeaderBar
                title={prop.title}
            />

            <PullList<FaxianListData>
                style={[{},]}
                ref={ref => {
                    st.pullList = ref
                }}
                autoLoad={true}
                renderItem={(it) => memoItem(FaXianItem, {
                    dat: it.item,
                    onPress: () => {
                        app.push(FaXianDetails, { dat: it.item })
                    }
                })}
                onGetListByPage={page => st.getList(page)}>
            </PullList>
        </Container>
    )


}

const sty = StyleSheet.create({

})
