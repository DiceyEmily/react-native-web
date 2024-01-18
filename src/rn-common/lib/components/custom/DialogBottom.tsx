import { styles } from '@common/components/styles';
import { colors } from "@common/components/colors";
import { app } from '@common/lib/app';
import React, { Component, ReactElement } from 'react'
import { Platform, View, Text, StyleSheet } from "react-native";
import { ScrollView } from 'react-native-gesture-handler';
import { Dialog } from './Dialog';
import { PressView } from './PressView';
import { V } from './V';
import { lib } from '../../lib';


interface DialogBottomProp {
    onCancel?: () => void;
    onCancelText?: string
    content?: (dia: Dialog) => ReactElement;
    onOk?: () => void;
    onOkText?: string
    dialog?: Dialog;
    //dialog创建回调
    onDialog?: (dialog: Dialog) => void

    //隐藏关闭按钮
    hideClose?: boolean;
}


class DialogBottomState {

}

/* 从底部弹出的view */
export class DialogBottom extends Component<DialogBottomProp, DialogBottomState> {

    state = new DialogBottomState();


    static show(paras: DialogBottomProp) {
        Dialog.show({
            bottom: true,
            style: {},
            disableCancel: false,
            animBottom: true,
            onClose: () => {
                paras.onCancel?.()
            }
        }, dia => {
            paras.onDialog?.(dia);
            return <DialogBottom

                {...paras}

                dialog={dia}
                onDialog={paras.onDialog}

                onCancel={() => {
                    paras.onCancel?.()
                    dia.close();
                }}


                onOk={() => {
                    paras.onOk?.()
                    if (!paras.onDialog) {
                        dia.close();
                    }
                }}
            />
        })

    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }



    render() {
        return (
            <V style={[{
                width: "100%",
                backgroundColor: colors.background,

            }, styles.topRound]}>
                <ScrollView
                    contentContainerStyle={{
                        maxHeight: lib.getPx(app.window.height / 1.5)
                    }}
                    style={[{},]}>
                    {
                        this.props.content?.(this.props.dialog!)
                    }
                </ScrollView>
                <V style={[{ flexDirection: 'row', width: "100%" },]}>
                    {
                        this.props.hideClose ? null
                            : <PressView onPress={() => {
                                this.props.onCancel?.()
                                this.props.dialog?.close()
                            }} style={[{
                                alignItems: "center",
                                flex: 1,
                                padding: 10,
                                borderTopWidth: 1,
                                borderColor: colors.greyD,
                            },]}>
                                <V>{this.props.onCancelText ?? '关闭'}</V>
                            </PressView>
                    }

                    {this.props.onOkText ? <PressView onPress={() => {
                        this.props.onOk?.()
                        if (!this.props.onDialog) {
                            this.props.dialog?.close()
                        }
                    }} style={[{
                        alignItems: "center",
                        flex: 1,
                        padding: 10,
                        borderTopWidth: 1,
                        borderLeftWidth: 1,
                        borderColor: colors.greyD,
                    },]}>
                        <V>{this.props.onOkText}</V>
                    </PressView> : null}
                </V>
            </V>
        )
    } //render end

}

export const sty = StyleSheet.create({

})