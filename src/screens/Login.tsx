import { Image, Pressable, } from 'react-native';
import { colors } from "@common/components/colors";
import { Gradient } from "@common/lib/components/Gradient";
import { Icon } from "@common/lib/components/icon/Icon";
import { api } from "@src/config/api";
import { cfg } from "@src/config/cfg";
import { imgs } from "@src/imgs";
import { UserReq } from "@src/model/UserReq";
import { getHeaderColor, styles } from "@src/rn-common/components/styles";
import { app } from "@src/rn-common/lib/app";
import { Container } from "@src/rn-common/lib/components/Container";
import { CheckView } from "@src/rn-common/lib/components/custom/CheckView";
import { EditView } from "@src/rn-common/lib/components/custom/EditView";
import { V } from "@src/rn-common/lib/components/custom/V";
import { useObjState, useInit } from "@src/rn-common/lib/hooks";
import { native } from "@src/rn-common/lib/native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { MainNavi } from "./MainNavi";
import { RegisterUser } from './zhuce/RegisterUser';


export class LoginState {

    localConfig = cfg.localConfig.dat

    rememberPassword = this.localConfig.rememberPassword

    //zhangsan
    account = this.localConfig.account ?? ""

    //123456
    password = this.rememberPassword ? this.localConfig.password : ""

    //密码不可见
    secureTextEntry = false

    errorMsg = ""

    //更新组件
    get $update() { return }
    constructor(
    ) {
    }




    clearUserName() {
        this.account = "";
        this.$update;
    }


    async clickLogin() {

        if (this.account.length == 0) {
            app.msg('请输入账号')
            return
        }
        if (this.password.length == 0) {
            app.msg('请输入密码')
            return
        }

        this.errorMsg = ""
        let u = this.account
        let p = this.password

        cfg.user.dat.token = ''
        let tok = await api.login(new UserReq(u, p, 'client', 'password')).result
        if (!tok.access_token) {
            this.errorMsg = '登录失败，请联系管理员'
            app.logError(this.errorMsg)
            return
        }
        cfg.user.dat.token = tok.access_token
        cfg.user.save

        let res = await api.userInfo().result
        res.token = tok.access_token
        cfg.user.dat = res
        cfg.user.save

        //记住密码
        cfg.localConfig.dat.account = this.account
        cfg.localConfig.dat.rememberPassword = this.rememberPassword
        cfg.localConfig.dat.password = this.rememberPassword ? this.password : ''
        cfg.localConfig.save

        app.replace(MainNavi, {})
    }

}///////////////LoginState end///////////////////




export function Login() {


    const st = useObjState(() => new LoginState())



    useInit(async () => {



        return async () => {

        }
    })



    return (
        <Container full style={[{}]}>

            <V style={[{
                height: "30%",
                justifyContent: "center", alignItems: "center"
            },]}>
                <Image
                    resizeMode="cover"
                    style={
                        [{
                            position: "absolute",
                            width: "100%",
                            height: '100%',
                        },]}
                    source={imgs.bg} />
            </V>

            <V style={[{
                backgroundColor: colors.background,
                borderTopLeftRadius: 10, borderTopRightRadius: 10,
                padding: 20,
                flex: 1,
            }, styles.column]}>
                <V>
                    <V style={[styles.rowCenter, { padding: 5, marginTop: 10, },]}>
                        <EditView
                            placeholder="请输入账号"
                            placeholderTextColor={colors.primary}
                            state={[st, "account"]}
                            style={[{
                                flex: 1,
                                padding: 10,
                                color: colors.primary,
                                fontSize: 17,
                                borderBottomWidth: 0,
                            }]}
                        />
                        <Icon onPress={() => st.clearUserName()} name="clear" color={colors.grey9} size={16} />
                    </V>
                    <V style={[styles.lineRow, { width: "100%" }]} />
                    <V style={[styles.rowCenter, { padding: 5, marginTop: 30, },]}>

                        <EditView
                            placeholderTextColor={colors.primary}
                            placeholder="请输入密码"
                            secureTextEntry={st.secureTextEntry}
                            state={[st, "password"]}
                            style={[{
                                flex: 1,
                                color: colors.primary,
                                fontSize: 17,
                                borderBottomWidth: 0,
                            }]}
                        />
                        <Icon onPress={() => {
                            st.secureTextEntry = !st.secureTextEntry
                            st.$update
                        }} name={st.secureTextEntry ? "visibility_off" : "visibility"} color={colors.grey9} size={16} />
                        {/* <V style={[{ color: colors.grey9 },]}>忘记密码</V> */}
                    </V>
                    <V style={[styles.lineRow, { width: "100%" }]} />


                    <V style={[{ marginTop: 10 }, styles.rowCenter]}>
                        <CheckView
                            box
                            size={13}
                            textColor={colors.grey9}
                            style={{}}
                            state={[st, "rememberPassword"]}
                            checked={cfg.localConfig.dat.rememberPassword}
                            onPress={(check: boolean) => {
                                st.rememberPassword = check
                                cfg.localConfig.save
                            }}
                        >记住用户名和密码</CheckView>

                        {/* <V style={[{ marginLeft: 20, color: colors.grey9 },]}>常见问题</V> */}
                    </V>
                </V>

                <TouchableOpacity style={[{
                    marginTop: 30,
                    alignSelf: "center",
                },]} onPress={() => { st.clickLogin() }}>
                    <Gradient
                        colors={colors.gradiendPrimary}
                        style={[{
                            width: 64, height: 64,
                            borderRadius: 360,
                        }, styles.center]}>
                        <Icon size={30} color={colors.white} name="arrow_forward" />
                    </Gradient>
                </TouchableOpacity>

                {st.errorMsg.length > 0 ? <V style={{
                    fontSize: 14,
                    marginTop: 30,
                    color: colors.red,
                    alignSelf: "center",
                }}>{st.errorMsg}</V> : null}

                <Pressable style={{
                    marginTop: 30,
                    alignSelf: "center",
                }}
                    onPress={() => app.push(RegisterUser, {})}
                >
                    <V>注册账号</V>
                </Pressable>

                <V style={{
                    fontSize: 12,
                    marginTop: 30,
                    color: colors.greyC,
                    alignSelf: "center",
                }}>版本号：{native.getAppVersion()}</V>

            </V>
        </Container >

    )
}