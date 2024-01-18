import React from 'react'
import { Platform, View, Text, StyleSheet, Image, Pressable, Linking } from "react-native";
import { V } from '@common/lib/components/custom/V';
import { useInit, useObjState } from '@common/lib/hooks';
import { Container } from '@src/rn-common/lib/components/Container';
import { cfg } from '@src/config/cfg';
import { imgs } from '@src/imgs';
import { styles } from '@src/rn-common/components/styles';
import { colors } from '@src/rn-common/components/colors';
import { HeaderBar } from '@src/components/Header';
import { EditView } from '@src/rn-common/lib/components/custom/EditView';
import { api } from '@src/config/api';
import { RegisterUserBean } from "@src/model/zhuce/RegisterUser";
import { app } from '@src/rn-common/lib/app';


interface RegisterUserProp {

}


export class RegisterUserState {


    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: RegisterUserProp,
    ) {

    }

    info = new RegisterUserBean()

}///////////////MyViewState end///////////////////



/**
 * 注册账号
 * @param prop 
 * @returns 
 */
export function RegisterUser(prop: RegisterUserProp) {

    //组件状态
    const st = useObjState(() => new RegisterUserState(prop), prop)

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })




    /////////////////////////////////////////
    //////// MyView view//////////
    /////////////////////////////////////////
    return (
        <Container style={[{},]}>
            <HeaderBar
                title={"注册账号"}
            />

            <V style={[{ alignItems: 'center', paddingHorizontal: 20, backgroundColor: colors.white, flexDirection: 'row', paddingVertical: 20 },]}>
                <V style={[{ fontSize: 16 },]}>{'头像'}</V>
                <V style={[{ flex: 1 },]}></V>
                <Image
                    resizeMode="cover"
                    style={[{ width: 40, height: 40 },]}
                    source={st.info.avatar as any} />
            </V>

            <V style={[{ backgroundColor: colors.white, },]}>
                <V style={[styles.lineRow, { marginHorizontal: 20, },]}></V>
            </V>

            <Pressable style={[{ backgroundColor: colors.white, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row', paddingVertical: 15 },]}
                onPress={() => {
                    // Linking.openURL("tel://" + '')
                }}
            >
                <V style={[{ fontSize: 16 },]}>{'生日：'}</V>
                <EditView
                    placeholder="请输入"
                    placeholderTextColor={colors.grey9}
                    state={[st.info, "birthday"]}
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
                <V style={[{ fontSize: 16 },]}>{'邮箱：'}</V>
                <EditView
                    placeholder="请输入"
                    placeholderTextColor={colors.grey9}
                    state={[st.info, "email"]}
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
                <V style={[{ fontSize: 16 },]}>{'性别：'}</V>
                <EditView
                    placeholder="请输入"
                    placeholderTextColor={colors.grey9}
                    state={[st.info, "gender"]}
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
                <V style={[{ fontSize: 16 },]}>{'家长姓名：'}</V>
                <EditView
                    placeholder="请输入"
                    placeholderTextColor={colors.grey9}
                    state={[st.info, "name"]}
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
                <V style={[{ fontSize: 16 },]}>{'手机号码：'}</V>
                <EditView
                    placeholder="请输入"
                    placeholderTextColor={colors.grey9}
                    state={[st.info, "phone"]}
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
                <V style={[{ fontSize: 16 },]}>{'用户名：'}</V>
                <EditView
                    placeholder="请输入"
                    placeholderTextColor={colors.grey9}
                    state={[st.info, "username"]}
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
                <V style={[{ fontSize: 16 },]}>{'密码：'}</V>
                <EditView
                    placeholder="请输入"
                    placeholderTextColor={colors.grey9}
                    state={[st.info, "password"]}
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
                    if (!st.info.name) {
                        app.msg('请输入家长姓名')
                        return
                    }
                    if (!st.info.name) {
                        app.msg('请输入用户名')
                        return
                    }
                    if (!st.info.name) {
                        app.msg('请输入密码')
                        return
                    }
                    let res = await api.registerUser(st.info).result
                    app.msg('注册成功')
                }}>注册</V>
        </Container>
    )


}///////////////MyView end//////////////////

const sty = StyleSheet.create({

})