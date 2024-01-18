import React, { Component, useState } from "react";
import { GestureResponderEvent, Pressable, StyleSheet, View, Text, } from "react-native";
import { app } from "../../rn-common/lib/app";
import { colors } from "../../rn-common/components/colors";
import { PullList } from "@src/rn-common/lib/components/custom/PullList";
import { TabViewItem } from "@src/rn-common/model/TabViewItem";
import TabView from "@src/rn-common/lib/components/tabview/TabView";
import { commonTabBar, commonTabLight } from "@src/components/Tab";
import { V } from "@src/rn-common/lib/components/custom/V";
import { FaXianItem } from "./FaXianItem";
import { api } from "@src/config/api";
import { useInit, useObjState } from "@src/rn-common/lib/hooks";
import { memoItem } from "@src/rn-common/lib/components/memoItem";
import { Container } from "@src/rn-common/lib/components/Container";
import { HeaderBar, headerPaddingRight, iconPadV } from "@src/components/Header";
import { Icon } from "@src/rn-common/lib/components/icon/Icon";
import { FaXianDetails } from "./FaXianDetails";
import { NewFaXian } from "./NewFaXian";
import { FaxianListData } from "@src/model/msg/FaxianListData";


export enum FaXianType {
    ALL = "all",
    SHOU_CANG = "shoucang",
    FA_BU = "fabu",
}

//展示出来的列表集合
export const typeList = [
    {
        type: FaXianType.ALL,
        name: "全部",
    },
    {
        type: FaXianType.SHOU_CANG,
        name: "我的收藏",
    },
    {
        type: FaXianType.FA_BU,
        name: "我的发布",
    },
]


interface FaXianProp {

}

export class FaXianState {

    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: FaXianProp,
    ) {
        //初始化tab路由
        typeList.forEach((it, idx) => {
            this.routes.push({
                key: it.type,
                title: it.name,
                view: () => (
                    <PullList<FaxianListData>
                        //初始化时自动加载数据。
                        autoLoad={true}
                        ref={ref => this.pullList[idx] = ref}
                        renderItem={(i, ref) => {
                            return memoItem(FaXianItem, {
                                dat: i.item,
                                onPress: () => {
                                    app.push(FaXianDetails, { dat: i.item })
                                }
                            })
                        }}
                        onGetListByPage={(page) => {
                            return this.getList(page, idx, it.type)
                        }}
                    />
                )
            })
        })
    }

    index = 0;
    pullList = Array<PullList<FaxianListData> | null>();
    routes = Array<TabViewItem>();

    //列表刷新
    refreshData() {
        this.pullList[this.index]?.onRefresh()
    }

    async getList(page: number, idx: number, type: string) {
        let res
        if (type == FaXianType.SHOU_CANG) {
            res = await api.news_record_collect({
                page: page - 1, pageSize: app.pageNum,
            }).hideProg.result
        } else {
            res = await api.news_type({
                page: page - 1, pageSize: app.pageNum,
            }).hideProg.result
        }

        return res.data
    }

}



/* 发现 */
export function FaXianList(prop: FaXianProp) {

    //组件状态
    const st = useObjState(() => new FaXianState(prop), prop)

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })


    return (
        <V style={{ flex: 1, backgroundColor: colors.background }}>
            <HeaderBar
                title={"发现"}
                disableBack
                morelist={[{
                    iconName: 'add',
                    click: (v) => app.push(NewFaXian, {})
                },]}
            />

            <TabView
                lazy={true}
                tabBarPosition="top"
                navigationState={{ index: st.index, routes: st.routes }}
                renderScene={({ route }) => route.view()}
                onIndexChange={(index) => {
                    st.index = index
                    st.$update
                }}
                sceneContainerStyle={{ paddingTop: 10 }}
                renderTabBar={commonTabLight(dat => <V
                    style={[{
                        color: dat.focused ? colors.white : colors.TabTrans,
                        textAlign: 'center',
                        fontSize: 17,
                    }]}
                    numberOfLines={1}
                >
                </V>, false)}
            />
        </V>
    )


    const sty = StyleSheet.create({
        bgRadius: {
            backgroundColor: colors.greyLight,
            borderRadius: 100,
            flexDirection: "row",
            paddingRight: 10,
            alignItems: 'center',
        }
    });

}