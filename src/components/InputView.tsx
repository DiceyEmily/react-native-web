import { colors } from '@common/components/colors';
import { app } from '@common/lib/app';
import { EditView } from '@common/lib/components/custom/EditView';
import { V } from '@common/lib/components/custom/V';
import { Icon } from '@common/lib/components/icon/Icon';
import { ObjStateType } from '@common/lib/hooks';
import React, { Component } from 'react'
import { Platform, View, Text, StyleSheet, TextInputProps, StyleProp, TextStyle } from "react-native";


interface InputViewProp<T extends object> extends TextInputProps {
    //输入状态
    state?: ObjStateType<T>;

    //提交事件
    onCommit?: () => void;

    style?: StyleProp<TextStyle>;

    buttonStyle?: StyleProp<TextStyle>;

    buttonText?: string

    /**
     *  禁用编辑, 开启点击事件
     */
    onPress?: () => void

}


class InputViewState {

}

export class InputView<T extends object> extends Component<InputViewProp<T>, InputViewState> {

    state = new InputViewState();

    componentDidMount() {
    }

    componentWillUnmount() {
    }


    getText(): string {
        if (!this.props.state) {
            return ""
        }
        return this.props.state[0][this.props.state[1]] as unknown as string
    }

    render() {
        return (
            <V
                onPress={() => this.props.onPress?.()}
                style={[{
                    flexDirection: 'row',
                    borderRadius: 20, paddingLeft: 14,
                    backgroundColor: colors.greyE,
                    alignItems: 'center',
                }, this.props.style]}>
                <Icon name="edit" color={colors.greyC} size={14} />

                <EditView
                    editable={this.props.onPress ? false : true}
                    placeholderTextColor={colors.greyC}

                    multiline={true}
                    {...this.props}
                    style={[{
                        flex: 1,
                        color: colors.grey3,
                        fontSize: 15,
                        borderBottomColor: colors.transparent,
                        alignSelf: 'center',
                    }]}
                    onChangeText={res => {
                        this.setState(this.state);
                    }}
                />

                {this.getText().length == 0 ? null : <V style={[{
                    color: colors.white, fontSize: 14, paddingVertical: 5,
                    paddingHorizontal: 12, borderRadius: 20,
                    backgroundColor: colors.primary,

                }, this.props.buttonStyle]}
                    onPress={() => {
                        if (this.getText().length == 0) {
                            app.msg("请输入内容");
                            return
                        }
                        this.props.onCommit?.()
                    }}
                >{this.props.buttonText ?? '提交'}</V>}
            </V>
        )
    } //render end

}

export const sty = StyleSheet.create({

})