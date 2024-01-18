import { styles } from '@common/components/styles';
import { colors } from "@common/components/colors";
import { app } from '@common/lib/app';
import React, { Component, ReactElement } from 'react'
import { Platform, View, Text, StyleSheet } from "react-native";
import { Dialog } from './Dialog';
import { V } from './V';


interface DialogBottomProp {
    onCancel?: () => void;

    content?: (dia: Dialog) => ReactElement;
    onOk?: () => void;

    dialog?: Dialog;
}


class DialogBottomState {

}

/* 右侧弹出框 */
export class DialogSlide extends Component<DialogBottomProp, DialogBottomState> {

    state = new DialogBottomState();


    static show(paras: DialogBottomProp) {
        Dialog.show({
            style: {
                alignSelf: "flex-end"
            },
            disableCancel: false,
            animRight: true,
        }, dia => {
            return <DialogSlide

                {...paras}

                dialog={dia}

                onCancel={() => {
                    paras.onCancel?.()
                    dia.close();
                }}

                onOk={() => {
                    paras.onOk?.()
                    dia.close();
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
                height: app.window.height + app.statusBarHeight,
                backgroundColor: colors.background,
                width: app.window.width / 1.3,
                paddingTop: app.statusBarHeight,
            },]}>
                {this.props.content?.(this.props.dialog!)}
            </V>
        )
    } //render end

}

export const sty = StyleSheet.create({

})