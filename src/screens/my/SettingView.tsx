import React from 'react'
import { Platform, View, Text, StyleSheet, Image, Pressable, Linking } from "react-native";
import { V } from '@common/lib/components/custom/V';
import { useInit, useObjState } from '@common/lib/hooks';
import { Container } from '@src/rn-common/lib/components/Container';
import { cfg } from '@src/config/cfg';
import { imgs } from '@src/imgs';
import { styles } from '@src/rn-common/components/styles';
import { colors } from '@src/rn-common/components/colors';
import { Icon } from '@src/rn-common/lib/components/icon/Icon';
import { HeaderBar } from '@src/components/Header';
import { app } from '@src/rn-common/lib/app';
import { AboutApp } from './AboutApp';
import { CheckView } from '@src/rn-common/lib/components/custom/CheckView';
import { FontSizeSetting } from './FontSizeSetting';


interface SettingViewProp {

}


export class SettingViewState {


    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: SettingViewProp,
    ) {

    }

    checked = cfg.localConfig.dat.rememberPassword

}



/**
 * 设置
 * @param prop 
 * @returns 
 */
export function SettingView(prop: SettingViewProp) {

    //组件状态
    const st = useObjState(() => new SettingViewState(prop), prop)

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })


    return (
        <Container style={[{},]}>
            <HeaderBar
                title={"设置"}
            />

            <Pressable style={[{ backgroundColor: colors.white, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row', paddingVertical: 15 },]}>
                <V style={[{ fontSize: 16 },]}>{'自动登录'}</V>
                <V style={[{ flex: 1 },]}></V>
                <CheckView
                    onPress={checked => {
                        st.checked = checked
                        st.$update
                        cfg.localConfig.dat.rememberPassword = checked
                        cfg.localConfig.save
                    }}
                    box
                    size={16}
                    style={[{ marginLeft: 10 }]}
                    checked={st.checked} />
            </Pressable>

            <V style={{ backgroundColor: colors.white }}>
                <V style={[styles.lineRow, { marginHorizontal: 20, backgroundColor: colors.lineGrey },]}></V>
            </V>

            <Pressable style={[{ backgroundColor: colors.white, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row', paddingVertical: 15 },]}
                onPress={() => {
                    app.push(FontSizeSetting, {})
                }}
            >
                <V style={[{ fontSize: 16 },]}>{'字体大小'}</V>
                <V style={[{ flex: 1 },]}></V>
                <Icon size={18} color={colors.grey9} name="arrow_forward_ios" />
            </Pressable>

            <V style={{ backgroundColor: colors.white }}>
                <V style={[styles.lineRow, { marginHorizontal: 20, backgroundColor: colors.lineGrey },]}></V>
            </V>

            <Pressable style={[{ backgroundColor: colors.white, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row', paddingVertical: 15 },]}
                onPress={() => {
                    app.push(AboutApp, {})
                }}
            >
                <V style={[{ fontSize: 16 },]}>{'关于'}</V>
                <V style={[{ flex: 1 },]}></V>
                <Icon size={20} color={colors.grey9} name="arrow_forward_ios" />
            </Pressable>

        </Container>
    )


}

const sty = StyleSheet.create({

})