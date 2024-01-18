import React from 'react'
import { Platform, View, Text, StyleSheet, Image, Pressable, Linking } from "react-native";
import { V } from '@common/lib/components/custom/V';
import { useInit, useObjState } from '@common/lib/hooks';
import { Container } from '@src/rn-common/lib/components/Container';
import { styles } from '@src/rn-common/components/styles';
import { colors } from '@src/rn-common/components/colors';
import { HeaderBar } from '@src/components/Header';
import { EditView } from '@src/rn-common/lib/components/custom/EditView';
import { app } from '@src/rn-common/lib/app';
import { api } from '@src/config/api';
import { cfg } from '@src/config/cfg';
import { lib } from '@src/rn-common/lib/lib';


interface ChangePasswordProp {

}


export class ChangePasswordState {


    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: ChangePasswordProp,
    ) {

    }

    info = {
        old_password: '',
        new_password: '',
        rep_password: '',
        yanzhengma: '',
    }

}



/**
 * 修改密码
 * @param prop 
 * @returns 
 */
export function ChangePassword(prop: ChangePasswordProp) {

    //组件状态
    const st = useObjState(() => new ChangePasswordState(prop), prop)

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })



    return (
        <Container style={[{},]}>
            <HeaderBar
                title={"修改密码"}
            />

            <Pressable style={[{ backgroundColor: colors.white, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row', paddingVertical: 15 },]}
                onPress={() => {
                    // Linking.openURL("tel://" + '')
                }}
            >
                <V style={[{ fontSize: 16 },]}>{'原密码：'}</V>
                <EditView
                    placeholder="请输入"
                    placeholderTextColor={colors.grey9}
                    state={[st.info, "old_password"]}
                    style={[{
                        flex: 1,
                        padding: 10,
                        color: colors.grey3,
                        textAlign: 'right',
                        borderBottomWidth: 0,
                    }]}
                />
            </Pressable>

            <V style={[{ backgroundColor: colors.white, },]}>
                <V style={[styles.lineRow, { marginHorizontal: 20, },]}></V>
            </V>

            <Pressable style={[{ backgroundColor: colors.white, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row', paddingVertical: 15 },]}
                onPress={() => {
                    // Linking.openURL("tel://" + '')
                }}
            >
                <V style={[{ fontSize: 16 },]}>{'新密码：'}</V>
                <EditView
                    placeholder="请输入"
                    placeholderTextColor={colors.grey9}
                    state={[st.info, "new_password"]}
                    style={[{
                        flex: 1,
                        padding: 10,
                        color: colors.grey3,
                        textAlign: 'right',
                        borderBottomWidth: 0,
                    }]}
                />
            </Pressable>

            <V style={[{ backgroundColor: colors.white, },]}>
                <V style={[styles.lineRow, { marginHorizontal: 20, },]}></V>
            </V>

            <Pressable style={[{ backgroundColor: colors.white, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row', paddingVertical: 15 },]}
                onPress={() => {

                }}
            >
                <V style={[{ fontSize: 16 },]}>{'再次确认：'}</V>
                <EditView
                    placeholder="请输入"
                    placeholderTextColor={colors.grey9}
                    state={[st.info, "rep_password"]}
                    style={[{
                        flex: 1,
                        padding: 10,
                        color: colors.grey3,
                        textAlign: 'right',
                        borderBottomWidth: 0,
                    }]}
                />
            </Pressable>

            <V style={[{ backgroundColor: colors.white, },]}>
                <V style={[styles.lineRow, { marginHorizontal: 20, },]}></V>
            </V>

            <Pressable style={[{ backgroundColor: colors.white, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row', paddingVertical: 15 },]}
                onPress={() => {

                }}
            >
                <V style={[{ fontSize: 16 },]}>{'手机验证码：'}</V>
                <EditView
                    placeholder="请输入"
                    placeholderTextColor={colors.grey9}
                    state={[st.info, "yanzhengma"]}
                    style={[{
                        flex: 1,
                        padding: 10,
                        color: colors.grey3,
                        textAlign: 'right',
                        borderBottomWidth: 0,
                    }]}
                />
            </Pressable>

            <V style={[{ margin: 30, backgroundColor: colors.primary, color: colors.white, borderRadius: 30, padding: 10, textAlign: 'center' },]}
                onPress={async () => {
                    if (!st.info.old_password) {
                        app.msg('请输入原密码')
                        return
                    }
                    if (!st.info.new_password) {
                        app.msg('请输入新密码')
                        return
                    }
                    if (!st.info.rep_password) {
                        app.msg('请再次输入新密码')
                        return
                    }
                    if (st.info.rep_password != st.info.new_password) {
                        app.msg('两次密码不一致')
                        return
                    }
                    // if (!st.info.yanzhengma) {
                    //     app.msg('请输入验证码')
                    //     return
                    // }

                    let res = await api.updatePassword({
                        oldPassword: st.info.old_password,
                        newPassword: st.info.new_password,
                    }).result

                    try {
                        let res = await api.logout().result
                    } catch (error) {
                    }
                    app.msg('修改成功')
                    //关闭app
                    cfg.user.clear()
                    await lib.sleep(200)

                    cfg.toLogin()
                }}>确认</V>
        </Container>
    )


}

const sty = StyleSheet.create({

})