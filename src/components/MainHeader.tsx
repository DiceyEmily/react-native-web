import React from 'react'
import { Platform, View, Text, StyleSheet } from "react-native";
import { V } from '@common/lib/components/custom/V';
import { Icon } from '@common/lib/components/icon/Icon';
import { colors } from "@common/components/colors";
import { IconXC } from './IconXC';
import { app } from '@common/lib/app';


interface DocHeaderProp {
    title?: string;
    personal?: () => void;
    search?: () => void;
    yuyin?: () => void;
    saoma?: () => void;
}


/* 首页头 */
export function MainHeader(prop: React.PropsWithChildren<DocHeaderProp>) {

    let num = 0
    if (prop.personal) {
        num++
    }
    if (prop.search) {
        num++
    }
    if (prop.yuyin) {
        num++
    }
    if (prop.saoma) {
        num++
    }

    //个人中心
    let personalView = prop.personal ? <Icon name="account_circle" size={24} color={colors.white} style={{
        paddingVertical: 3,
        paddingRight: 15,
    }} onPress={prop.personal} /> : null
    //搜索
    let searchView = prop.search ? <IconXC name="sousuo_da" size={24} color={colors.white} style={{
        paddingVertical: 3,
        paddingRight: 15,
    }} onPress={prop.search} /> : null
    //语音
    let yuyinView = prop.yuyin ? <IconXC name="yuyinfuwu" size={24} color={colors.white} style={{
        paddingVertical: 3,
        paddingRight: 15,
    }} onPress={prop.yuyin} /> : null
    //扫码
    let saomaView = prop.saoma ? <IconXC name="saoma" size={24} color={colors.white} style={{
        paddingVertical: 3,
        paddingRight: 15,
    }} onPress={prop.saoma} /> : null

    return (
        <View
            style={[{
                height: 50,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.primary,
            },
            ]}>
            <V style={{ flex: 1 }}></V>
            <V style={{ marginLeft: 39 * num, fontSize: 18, alignItems: 'center', textAlign: 'center', color: colors.white }}>{prop.title}</V>
            <V style={{ flex: 1 }}></V>
            <V style={{
                paddingLeft: 15, marginVertical: 10, flexDirection: 'row'
            }}>
                {searchView}
                {yuyinView}
                {saomaView}
                {personalView}
            </V>
        </View >
    )

}

const sty = StyleSheet.create({

})