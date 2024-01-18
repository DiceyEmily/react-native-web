import { Dialog, DialogCfg } from '@common/lib/components/custom/Dialog';
import { PressView } from '@common/lib/components/custom/PressView';
import { V } from '@common/lib/components/custom/V';
import React, { Component } from 'react';
import { StyleSheet, View } from "react-native";
import { Calendar, CalendarProp } from './Calendar';
import { colors } from "./colors";
import { styles } from './styles';


interface DialogDateProp {

    dialog?: Dialog

    onCancel?: () => void;

    onOk?: () => void;

    resolve: (res: DialogDateRes) => void

    cfg: DialogCfg & CalendarProp & { onSelect?: (dat: Date) => void }
}

interface DialogDateRes {
    date: Date
    ok: boolean;
}


class DialogDateState {

}

export class DialogDate extends Component<DialogDateProp, DialogDateState> {

    state = new DialogDateState();

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    /**
    * 弹出显示列表对话框
    * @param data 
    * @param cfg
    */
    static show(cfg: DialogCfg & CalendarProp & { onSelect?: (dat: Date) => void } = {}): Promise<DialogDateRes> {

        return new Promise((reso) => {

            Dialog.show({

                ...cfg,
                style: {
                    justifyContent: "center",
                    alignItems: "center",
                }
            }, (dia) => <DialogDate
                cfg={cfg}
                resolve={reso}
                dialog={dia}
            />)

        });
    }


    onCancel() {
        this.props.dialog?.close();
        this.props.resolve({
            ok: false,
            date: this.date,
        })
    }

    onOK() {
        this.props.dialog?.close();

        this.props.cfg?.onSelect?.(this.date);

        this.props.resolve({
            ok: true,
            date: this.date,
        })
    }

    date = this.props.cfg.date ?? new Date();

    render() {
        return (
            <View style={[{
                width: "92%", maxWidth: 400,
            }, styles.roundBackShadow]}>
                <Calendar
                    {...this.props.cfg}
                    date={this.date}
                    onSelect={res => {
                        this.date = res;
                    }}
                />
                <View style={[{ width: "100%" }, styles.row, styles.borderTopLine]} >
                    <PressView style={[{ flex: 1 }, styles.center]}
                        onPress={() => this.onCancel()}>
                        <V style={[{ paddingVertical: 8, paddingHorizontal: 12, color: colors.red },]} >取消</V>
                    </PressView>
                    <PressView style={[{ flex: 1 }, styles.center]}
                        onPress={() => this.onOK()}>
                        <V style={[{ paddingVertical: 8, paddingHorizontal: 12, color: colors.primary },]}>确定</V>
                    </PressView>
                </View>
            </View>
        )
    } //render end

}

const styl = StyleSheet.create({

})