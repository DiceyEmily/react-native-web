import React from 'react'
import { Platform, View, Text, StyleSheet, ViewProps, TouchableOpacity, Animated, Image } from "react-native";
import { V } from '@common/lib/components/custom/V';
import { useInit, useObjState, WithProp, WithUpadte } from '@common/lib/hooks';
import { getHeaderColor, styles } from '@common/components/styles';
import { TabViewItem } from '@common/model/TabViewItem';
import { app } from '@common/lib/app';
import { colors } from '@common/components/colors';
import TabView from '@common/lib/components/tabview/TabView';
import { Pic } from '@src/rn-common/lib/components/custom/Pic';
import { imgs } from '@src/imgs';


export interface GridItem {
    icon: JSX.Element
    name: string
    onPress: () => void
}

interface SwiperViewProp extends ViewProps {
    list: Array<GridItem>
    maxShow?: number
    refresh?: () => void
}


export class SwiperViewState {
    //tabView索引
    index = 0;
    routes = Array<TabViewItem>()
    maxShow = 8

    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: SwiperViewProp,
    ) {
    }

    refreshNumView() {
        this.getNumView()
        this.$update
    }

    getNumView() {
        //每页数量
        let num = this.prop_.maxShow ?? this.maxShow
        let u = (this.prop_.list.length / num) << 0
        let n = this.prop_.list.length % num == 0 ? 0 : 1
        this.routes.splice(0)
        for (let i = 0; i < u + n; i++) {
            this.routes.push({
                key: i + '',
                title: '',
                view: () => (
                    [
                        <V style={[{ borderRadius: 2, }, styles.row, this.prop_.style]}>
                            {this.prop_.list.slice(num * i, num * i + num).map((it, idx) => this.getItem(it, idx))}
                        </V>
                    ]
                )
            })
        }
    }

    getItem(it: GridItem, idx: number) {
        return (
            <V onPress={it.onPress}
                key={idx}
                style={[{
                    flex: 1,
                },]}>
                {it.icon}
            </V>
        )
    }

    timer: any

    /* idx跳转目标tab */
    autoChangePage(idx: number) {
        this.timer = setTimeout(() => {
            if (idx >= this.routes.length) {
                //回到第一页
                this.index = 0
                this.$update
            } else {
                this.index = idx
            }
            // app.msg(this.index + '')
            this.$update
            this.autoChangePage(this.index + 1)
        }, 4000)
    }


}///////////////SwiperViewState end///////////////////



/* 轮播控件 */
export function SwiperView(prop: React.PropsWithChildren<SwiperViewProp>) {

    const st = useObjState(() => new SwiperViewState(prop), prop)

    useInit(async () => {

        st.getNumView()
        st.autoChangePage(1)

        return async () => { //组件卸载
            clearTimeout(st.timer)
        }
    })

    return (
        <V style={[{ height: 180, },]}>
            <TabView
                lazy={true}
                tabBarPosition="top"
                navigationState={{ index: st.index, routes: st.routes }}
                renderScene={({ route }) => route.view()}
                onIndexChange={(idx) => {
                    st.index = idx
                    st.$update
                    clearTimeout(st.timer)
                    st.autoChangePage(st.index + 1)
                }}
                style={{
                    backgroundColor: colors.transparent,
                }}
                renderTabBar={() => <V style={{ marginTop: -6 }}></V>}
            />

            {st.routes.length > 1 ? <V style={[{
                flexDirection: 'row', justifyContent: 'center', width: '100%', alignItems: 'center',
                backgroundColor: colors.transparent, position: 'absolute', bottom: 6
            },]}>
                {st.routes.map((v, i) => {
                    return i == st.index ?
                        <Pic style={[{
                            width: 8, height: 5, marginBottom: 10, marginHorizontal: 5, borderRadius: 10,
                        },]}
                            source={imgs.banner_sct}
                        />
                        : <Pic style={[{
                            width: 5, height: 5, marginBottom: 10, marginHorizontal: 5, borderRadius: 10,
                        },]}
                            source={imgs.banner_ns}
                        />
                })}
            </V> : null}
        </V>

    )

}

const sty = StyleSheet.create({

})