import { HeaderBar } from "@src/components/Header";
import { imgs } from "@src/imgs";
import { colors } from "@src/rn-common/components/colors";
import { app } from "@src/rn-common/lib/app";
import { Container } from "@src/rn-common/lib/components/Container";
import { ButtonView } from "@src/rn-common/lib/components/custom/ButtonView";
import { Pic } from "@src/rn-common/lib/components/custom/Pic";
import { V } from "@src/rn-common/lib/components/custom/V";
import QRCode from "@src/rn-common/lib/components/QRCode";
import { native } from "@src/rn-common/lib/native";
import React, { useRef, Component } from "react";

import { Platform, View, Text, StyleSheet } from "react-native";
import Config from "react-native-config";


interface AboutAppProp {

}


class AboutAppState {

}

export class AboutApp extends Component<AboutAppProp, AboutAppState> {

    state = new AboutAppState();

    componentDidMount() {
    }

    componentWillUnmount() {
    }



    render() {
        return (
            <Container style={{ backgroundColor: colors.background }}>
                <HeaderBar
                    title="关于"
                />

                <V
                    style={[{
                        marginTop: 40,
                        alignSelf: 'center',
                        alignItems: 'center'
                    },]}
                >
                    <QRCode
                        size={100}
                        color={colors.blue}
                        value="下载链接"
                    />
                </V>

                <V style={{
                    color: colors.grey3,
                    textAlign: 'center',
                    marginTop: 15,
                    fontSize: 18,
                }} >{Config.APP_NAME}</V>

                <V style={{
                    color: colors.grey3,
                    textAlign: 'center',
                    marginTop: 20,
                    fontSize: 16,
                }} >V{native.getAppVersion()}</V>

                <ButtonView
                    style={{
                        marginTop: 60,
                        borderRadius: 5,
                        backgroundColor: colors.green,
                        marginHorizontal: 80,
                    }}
                    onPress={async () => {
                        // let res = await api.appUpdate().result
                        // if (res.RESULT) {
                        //     if (res.RESULT.versionCode > native.getAppVersionCode()) {

                        //     } else {
                        app.msg("已经是最新版了")
                        // }
                        // }
                    }}>检查更新</ButtonView>

            </Container >
        )
    } //render end

}

export const sty = StyleSheet.create({

})
