import React, { Component } from 'react';
import { KeyboardTypeOptions, Text, View } from 'react-native';
import { app } from '../../app';
import { styles } from '../../../components/styles';
import { colors } from "../../../components/colors";
import { Dialog } from './Dialog';
import { EditView } from './EditView';
import { PressView } from './PressView';
import { V } from './V';
import { Icon } from '../icon/Icon';



export interface DialogInput1Prop {

    onCancel?: (t: string) => void;

    onOk?: (t: string) => void;

    //提示
    placeholder?: string;

    multiline?: boolean;

    /**
     * 左侧按钮列表
     */
    leftButton?: [
        {
            color?: string,
            text: string,
            onClick: () => void,
        }
    ]

    //确定文本
    okText?: string;
    //取消文本
    cancelText?: string;

    //键盘类型
    keyboardType?: KeyboardTypeOptions;

    //不允许空值
    notEmpty?: boolean;

    secureTextEntry?: boolean;

    //是否禁用,点击背景或返回键关闭对话框
    disableCancel?: boolean,
    /**
     * 确定按钮,校验事件,返回false校验失败
     * @param t 
     */
    onCheck?(t: string): boolean;

    /**
     * 输入框 初始文本
     */
    text?: string;

    dialog?: Dialog;
}

/**
* 
*/
export class DialogInput1State {
    text = ""
}


export interface DialogInput1Res {
    /**
     * 点击确定true,取消false,返回不触发
     */
    ok: boolean;
    /**
     * 输入文本
     */
    text: string;
}

/**
* 
*/
export class DialogInput1 extends Component<DialogInput1Prop, DialogInput1State> {

    constructor(props: DialogInput1Prop) {
        super(props);
        let st = new DialogInput1State();
        if (this.props.text) {
            st.text = this.props.text;
        }
        this.state = st;

    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    static show(paras: DialogInput1Prop) {
        return new Promise<DialogInput1Res>((reso) => {
            let resp: DialogInput1Res = {
                ok: false,
                text: "",
            }
            Dialog.show({
                style: {
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "20%"
                },
                disableCancel: paras.disableCancel ?? true,
                // onClose: () => {
                //     resp.ok = false;
                //     resp.text = "";
                //     reso(resp);
                // },
            }, dia => {
                return <DialogInput1 {...paras}

                    dialog={dia}
                    onCancel={(text) => {
                        resp.ok = false;
                        resp.text = text;
                        reso(resp);
                        dia.close();
                    }}
                    onOk={(text) => {
                        if (paras.onCheck) {
                            if (!paras.onCheck(text))
                                return
                        }
                        if (paras.notEmpty) {
                            if (text === "") {
                                app.msgErr("不能为空!", {
                                    placement: "top",
                                })
                                return;
                            }
                        }
                        resp.ok = true;
                        resp.text = text;
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
                backgroundColor: colors.white,
                padding: 10,
                width: "90%",
                borderRadius: 5,
            }]}>
                <V style={[{
                    paddingBottom: 10, fontSize: 15, fontWeight: 'bold',
                },]}
                    numberOfLines={1}>{this.props.placeholder}</V>
                <EditView
                    placeholder={'请输入'}
                    autoFocus={true}
                    multiline={this.props.multiline}
                    value={this.state.text}
                    style={[{

                    },]}
                    onDone={() => {
                        if (!this.props.multiline) {
                            this.props.onOk?.(this.state.text)
                        }
                    }}
                    secureTextEntry={this.props.secureTextEntry}
                    keyboardType={this.props.keyboardType}
                    onChangeText={t => this.setState({ text: t })} />
                <View style={[{ marginTop: 5 }, styles.row]} >

                    {this.props.leftButton?.map(it =>
                        <PressView style={[{ borderRadius: 5, marginRight: 5 },]}
                            onPress={() => {
                                it.onClick();
                                this.props.dialog?.close();
                            }}>
                            <V style={[{ paddingVertical: 8, paddingHorizontal: 12, color: it.color ?? colors.black },]} >{it.text}</V>
                        </PressView>)}

                    <V style={[{ flex: 1 },]}></V>

                    <PressView style={[{ borderRadius: 5, marginRight: 5 },]}
                        onPress={() => this.props.onCancel ? this.props.onCancel(this.state.text) : null}>
                        <V style={[{ paddingVertical: 8, paddingHorizontal: 12, color: colors.greyText },]} >{this.props.cancelText ?? "取消"}</V>
                    </PressView>
                    <PressView style={[{ borderRadius: 5 },]}
                        onPress={() => this.props.onOk?.(this.state.text)}>
                        <V style={[{ paddingVertical: 8, paddingHorizontal: 12, color: colors.primary },]}>{this.props.okText ?? "确定"}</V>
                    </PressView>
                </View>
            </View>
        );
    }





}