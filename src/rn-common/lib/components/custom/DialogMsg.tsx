import React, { Component } from 'react';
import { View } from 'react-native';
import { styles } from '../../../components/styles';
import { colors } from "../../../components/colors";
import { Dialog } from './Dialog';
import { V } from './V';


export interface DialogMsgProp {

    //提示
    placeholder?: string;

    //内容
    text?: string;
}

export class DialogMsgState {
    text = ""
    placeholder = ""
}


export interface DialogMsgRes {
}

/**
 * 提示弹框
 */
export class DialogMsg extends Component<DialogMsgProp, DialogMsgState> {

    constructor(props: DialogMsgProp) {
        super(props);
        let st = new DialogMsgState();
        if (this.props.placeholder) {
            st.placeholder = this.props.placeholder;
        } else {
            st.placeholder = "温馨提醒";
        }
        if (this.props.text) {
            st.text = this.props.text;
        } else {
            st.text = "是否进行下步操作？";
        }
        this.state = st;

    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    static show(paras: DialogMsgProp) {
        return new Promise<DialogMsgRes>((reso) => {
            let resp: DialogMsgRes = {
            }
            Dialog.show({
                style: { justifyContent: "center", alignItems: "center", },
                disableCancel: false,
                // onClose: () => {
                //     resp.ok = false;
                //     resp.text = "";
                //     reso(resp);
                // },
            }, dia => {
                return <DialogMsg
                    text={paras.text}
                    placeholder={paras.placeholder}
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
                    color: colors.black,
                    fontSize: 16,
                    padding: 5,
                    textAlign: 'center'
                },]}>{this.state.placeholder}</V>
                <V style={[{ paddingVertical: 15, color: colors.textMain, paddingHorizontal: 5 },]}>{this.state.text}</V>
            </View>
        );
    }

}