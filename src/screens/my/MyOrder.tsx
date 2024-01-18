import React, { Component, useState } from "react";
import { GestureResponderEvent, Pressable, StyleSheet, View, Text, } from "react-native";
import { app } from "../../rn-common/lib/app";
import { Container } from "../../rn-common/lib/components/Container";
import { colors } from "../../rn-common/components/colors";
import { PullList } from "@src/rn-common/lib/components/custom/PullList";
import { TabViewItem } from "@src/rn-common/model/TabViewItem";
import TabView from "@src/rn-common/lib/components/tabview/TabView";
import { commonTabBar, commonTabLight } from "@src/components/Tab";
import { V } from "@src/rn-common/lib/components/custom/V";
import { Records } from "@src/model/my/Records";
import { array, lib } from "@src/rn-common/lib/lib";
import { useInit, useObjState } from "@src/rn-common/lib/hooks";
import { HeaderBar } from "@src/components/Header";
import { styles } from "@src/rn-common/components/styles";
import { memoItem } from "@src/rn-common/lib/components/memoItem";


enum MyOrderType {
    SHEN_BAN = "chongzhi",
    DAI_BAN = "xufei",
}

//展示出来的列表集合
const typeList = [
    {
        type: MyOrderType.SHEN_BAN,
        name: "我的充值",
    },
    {
        type: MyOrderType.DAI_BAN,
        name: "续费记录",
    },
]


interface MyOrderProp<ItemT> {

}

class MyOrderState {
    index = 0;
    pullList = Array<PullList<Records> | null>();
    routes = Array<TabViewItem>();
}

export default class MyOrder<ItemT> extends Component<MyOrderProp<ItemT>, MyOrderState> {

    state = new MyOrderState();

    constructor(props: MyOrderProp<ItemT>) {
        super(props);

        //初始化tab路由
        typeList.forEach((it, idx) => {
            this.state.routes.push({
                key: it.type,
                title: it.name,
                view: () => (
                    <PullList<Records>
                        //初始化时自动加载数据。
                        autoLoad={true}
                        ref={ref => this.state.pullList[idx] = ref}
                        renderItem={(i, ref) => {
                            return memoItem(MyOrderItem, {
                                dat: i.item,
                                onPress: () => { },
                                ind: i.index,
                                index: idx,
                                type: it.type,
                                list: ref.state.data
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

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {

        return (
            <Container style={{ backgroundColor: colors.white }}>
                <HeaderBar
                    title={'我的订单'}
                />

                <TabView
                    lazy={true}
                    tabBarPosition="top"
                    navigationState={{ index: this.state.index, routes: this.state.routes }}
                    renderScene={({ route }) => route.view()}
                    onIndexChange={(index) => {
                        this.setState({
                            index: index,
                        })
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
            </Container>
        )
    }


    //列表刷新
    refreshData() {
        this.state.pullList[this.state.index]?.onRefresh()
    }

    async getList(page: number, idx: number, type: string) {
        let res = array(Records)
        for (let index = 0; index < lib.randomInt(10); index++) {
            res.push(new Records)
        }
        return res
    }

    sty = StyleSheet.create({
        bgRadius: {
            backgroundColor: colors.greyLight,
            borderRadius: 100,
            flexDirection: "row",
            paddingRight: 10,
            alignItems: 'center',
        }
    });

}

/* 事项item */
function MyOrderItem(para: { dat: Records, onPress: () => void, ind: number, index: number, type: string, list: Array<Records> }) {

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
                    <V numberOfLines={1} style={[{
                        color: colors.textMain, fontSize: 15, fontWeight: 'bold'
                    },]} >{para.type == MyOrderType.SHEN_BAN ? "充值费用" : '续费费用'}</V>
                    <V numberOfLines={1} style={[{
                        color: colors.grey9, fontSize: 12, marginTop: 5
                    },]}>{new Date().toISOString()}</V>
                </V>
                <V style={[{ position: 'absolute', right: 12, flex: 1, },]}>{'+' + lib.randomInt(100)}</V>
            </V>
        </V>
    )
}