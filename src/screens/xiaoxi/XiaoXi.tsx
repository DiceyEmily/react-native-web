import { styles } from '@common/components/styles';
import { colors } from "@common/components/colors";
import { app } from '@common/lib/app';
import { PullList } from '@common/lib/components/custom/PullList';
import { useInit, useObjState } from '@common/lib/hooks';
import React from 'react';
import { StyleSheet } from "react-native";
import { api } from '@src/config/api';
import { HeaderBar } from '@src/components/Header';
import { XiaoXiItem } from './XiaoXiItem';
import { V } from '@src/rn-common/lib/components/custom/V';
import { memoItem } from '@src/rn-common/lib/components/memoItem';
import { FaXian } from '../faxian/FaXian';
import { XiaoXiListData } from '@src/model/msg/XiaoXiListData';


interface XiaoXiProp {

}


export class XiaoXiState {

    //更新组件
    get $update() { return }

    constructor(
        //组件属性
        public prop_: XiaoXiProp,
    ) {

    }

    getList = async (page: number) => {
        let res = await api.news_record({
            page: page - 1, pageSize: app.pageNum,
        }).hideProg.result

        return res.data
    }


}



/**
 * 消息
 * @param prop
 * @returns
 */
export function XiaoXi(prop: XiaoXiProp) {

    //组件状态
    const st = useObjState(() => new XiaoXiState(prop), prop)

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })


    return (
        <V style={{ flex: 1 }}>
            <HeaderBar
                title={"消息中心"}
                disableBack={true}
            />

            <PullList<XiaoXiListData>
                style={[{
                    paddingVertical: 6,
                    backgroundColor: colors.white,
                },]}
                autoLoad={true}
                renderItem={(i) => memoItem(XiaoXiItem, {
                    dat: i.item,
                    onPress: async () => {
                        app.push(FaXian, { title: i.item.typeName })
                    }
                })}
                onGetListByPage={page => st.getList(page)}>
            </PullList>
        </V >
    )


}

const sty = StyleSheet.create({

})
