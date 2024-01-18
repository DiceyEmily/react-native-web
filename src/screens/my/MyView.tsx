import { V } from '@common/lib/components/custom/V';
import { useInit, useObjState } from '@common/lib/hooks';
import { HeaderBar } from '@src/components/Header';
import { api } from '@src/config/api';
import { cfg } from '@src/config/cfg';
import { imgs } from '@src/imgs';
import { colors } from '@src/rn-common/components/colors';
import { app } from '@src/rn-common/lib/app';
import { DialogAlert } from '@src/rn-common/lib/components/custom/DialogAlert';
import { Pic } from '@src/rn-common/lib/components/custom/Pic';
import { Icon } from '@src/rn-common/lib/components/icon/Icon';
import { lib } from '@src/rn-common/lib/lib';
import { native } from '@src/rn-common/lib/native';
import React from 'react';
import { Pressable, StyleSheet } from "react-native";
import { HelpFbScreen } from '../helpAndFeedback/HelpFbScreen';
import { ChangePassword } from './ChangePassword';
import { MyInformation } from './MyInformation';
import MyOrder from './MyOrder';
import { SettingView } from './SettingView';


interface MyViewProp {

}


export class MyViewState {


    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: MyViewProp,
    ) {

    }



}///////////////MyViewState end///////////////////



/**
 * 我的
 * @param prop 
 * @returns 
 */
export function MyView(prop: MyViewProp) {

    //组件状态
    const st = useObjState(() => new MyViewState(prop), prop)

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })




    /////////////////////////////////////////
    //////// MyView view//////////
    /////////////////////////////////////////
    return (
        <V style={[{ flex: 1, backgroundColor: colors.white, },]}>
            <HeaderBar
                title={"我的"}
                disableBack
            />

            <V style={[{ borderTopLeftRadius: 5, borderTopRightRadius: 5, flex: 1 },]}>
                <V style={[{
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    flexDirection: 'row',
                    paddingVertical: 30,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                },]}>
                    <Pressable onPress={() => {
                        app.push(MyInformation, {})
                    }}>
                        <Pic
                            resizeMode="cover"
                            style={[{
                                width: 50,
                                height: 50,
                                borderRadius: 360
                            },]}
                            source={cfg.user.dat.avatar.length == 0 ? (!cfg.user.dat.gender ? imgs.male : imgs.female) : cfg.user.dat.avatar} />
                    </Pressable>
                    <V style={[{ marginLeft: 16 },]}>
                        <V style={[{ flexDirection: 'row' },]}>
                            <V style={[{},]}>姓名：</V>
                            <V style={[{},]}>{cfg.user.dat.name}</V>
                        </V>
                        <V style={[{ flexDirection: 'row', marginTop: 5 },]}
                            onPress={() => {

                            }}
                        >
                            <V style={[{},]}>等级：</V>
                            <V style={[{},]}>{'**'}</V>
                            <V style={[{},]}>（点击开通/续费）</V>
                        </V>
                    </V>
                </V>

                <Pressable style={[{ marginBottom: 2, backgroundColor: colors.white, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row', paddingVertical: 15 },]}
                    onPress={() => {
                        app.push(MyOrder, {})
                    }}
                >
                    <V style={[{ fontSize: 16 },]}>{'我的订单'}</V>
                    <V style={[{ flex: 1 },]}></V>
                    <Icon size={18} color={colors.grey9} name="arrow_forward_ios" />
                </Pressable>

                <Pressable style={[{ marginBottom: 2, backgroundColor: colors.white, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row', paddingVertical: 15 },]}
                    onPress={() => {
                        app.push(ChangePassword, {})
                    }}
                >
                    <V style={[{ fontSize: 16 },]}>{'修改登录密码'}</V>
                    <V style={[{ flex: 1 },]}></V>
                    <Icon size={18} color={colors.grey9} name="arrow_forward_ios" />
                </Pressable>

                <Pressable style={[{ marginBottom: 2, backgroundColor: colors.white, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row', paddingVertical: 15 },]}
                    onPress={() => {
                        app.push(SettingView, {})
                    }}
                >
                    <V style={[{ fontSize: 16 },]}>{'系统设置'}</V>
                    <V style={[{ flex: 1 },]}></V>
                    <Icon size={18} color={colors.grey9} name="arrow_forward_ios" />
                </Pressable>

                <Pressable style={[{ marginBottom: 2, backgroundColor: colors.white, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row', paddingVertical: 15 },]}
                    onPress={() => {
                        app.push(HelpFbScreen, {})
                    }}
                >
                    <V style={[{ fontSize: 16 },]}>{'投诉建议'}</V>
                    <V style={[{ flex: 1 },]}></V>
                    <Icon size={18} color={colors.grey9} name="arrow_forward_ios" />
                </Pressable>

                <Pressable style={[{ marginBottom: 2, backgroundColor: colors.white, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row', paddingVertical: 15 },]}
                    onPress={() => {
                        app.msg('暂未开放')
                    }}
                >
                    <V style={[{ fontSize: 16 },]}>{'用户服务及隐私'}</V>
                    <V style={[{ flex: 1 },]}></V>
                    <Icon size={18} color={colors.grey9} name="arrow_forward_ios" />
                </Pressable>

                <Pressable style={[{ marginBottom: 2, backgroundColor: colors.white, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row', paddingVertical: 15 },]}
                    onPress={() => {
                        app.msg('暂未开放')
                    }}
                >
                    <V style={[{ fontSize: 16 },]}>{'用户须知'}</V>
                    <V style={[{ flex: 1 },]}></V>
                    <Icon size={18} color={colors.grey9} name="arrow_forward_ios" />
                </Pressable>

            </V>

            <V
                style={[{ margin: 30, backgroundColor: colors.primary, color: colors.white, borderRadius: 30, padding: 10, textAlign: 'center' },]}
                onPress={async () => {
                    let res = await DialogAlert.show({
                        text: "确定要退出登录?"
                    })
                    if (res.ok) {
                        try {
                            let res = await api.logout().result
                        } catch (error) {
                            app.msg('注销失败，将强制退出')
                            await lib.sleep(1000)
                        }
                        //关闭app
                        cfg.user.clear()
                        await lib.sleep(200)
                        native.exitApp()
                    }
                }}>退出登录</V>
        </V>
    )


}///////////////MyView end//////////////////

const sty = StyleSheet.create({

})