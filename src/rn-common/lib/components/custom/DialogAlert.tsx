import React, { Component } from 'react';
import { ReactElement } from 'react';
import { View } from 'react-native';
import { styles } from '../../../components/styles';
import { colors } from "../../../components/colors";
import { Dialog } from './Dialog';
import { PressView } from './PressView';
import { V } from './V';


export interface DialogAlertProp {

    onCancel?: () => void;

    onOk?: () => void;

    //提示
    placeholder?: string;

    //内容
    text?: string | ReactElement;

    /**
     *隐藏取消按钮 
     */
    hideCancel?: boolean

}

export class DialogAlertState {
}


export interface DialogAlertRes {
    ok: boolean;
}

/**
 * 提示弹框
 */
export class DialogAlert extends Component<DialogAlertProp, DialogAlertState> {

    constructor(props: DialogAlertProp) {
        super(props);
        let st = new DialogAlertState();
        this.state = st;

    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    static show(paras: DialogAlertProp) {
        return new Promise<DialogAlertRes>((reso) => {
            let resp: DialogAlertRes = {
                ok: false,
            }
            Dialog.show({
                style: { justifyContent: "center", alignItems: "center", },
                disableCancel: true,
                // onClose: () => {
                //     resp.ok = false;
                //     resp.text = "";
                //     reso(resp);
                // },
            }, dia => {
                return <DialogAlert
                    text={paras.text}
                    placeholder={paras.placeholder}
                    hideCancel={paras.hideCancel}
                    onCancel={() => {
                        paras.onCancel?.()
                        reso(resp);
                        dia.close();
                    }}
                    onOk={() => {
                        resp.ok = true;
                        paras.onOk?.()
                        reso(resp);
                        dia.close();
                    }}
                />
            })
        });

    }

    render() {
        return (
            <View style={[{
                padding: 10,
                width: "80%",
            }, styles.roundBackShadow]}>
                <V style={[{
                    color: colors.textGrey,
                    alignSelf: "center",
                    fontSize: 15, padding: 5
                },]}>{this.props.placeholder ?? "温馨提醒"}</V>

                <V style={[{
                    paddingVertical: 15,
                    fontSize: 15,
                    alignSelf: "center",
                    color: colors.textMain, paddingHorizontal: 5
                },]}>{this.props.text ?? "是否进行下步操作？"}</V>


                <View style={[{ alignSelf: "flex-end", marginTop: 5 }, styles.row]} >
                    {
                        this.props.hideCancel ? null :
                            <PressView style={[{ borderRadius: 5, marginRight: 5 },]}
                                onPress={() => this.props.onCancel ? this.props.onCancel() : null}>
                                <V style={[{ paddingVertical: 8, fontSize: 15, paddingHorizontal: 15, color: colors.red },]} >取消</V>
                            </PressView>
                    }

                    <PressView style={[{ borderRadius: 5 },]}
                        onPress={() => this.props.onOk ? this.props.onOk() : null}>
                        <V style={[{ paddingVertical: 8, fontSize: 15, paddingHorizontal: 15, color: colors.primary },]}>确定</V>
                    </PressView>
                </View>
            </View>
        );
    }

}