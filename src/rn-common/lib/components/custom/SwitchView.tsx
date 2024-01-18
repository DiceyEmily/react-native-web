import React, { Component } from 'react';
import { Switch, SwitchProps, TextStyle } from "react-native";
import { ObjStateType } from '../../hooks';
import { colors } from "../../../components/colors";

export interface SwitchViewProp<T> extends SwitchProps {
    state?: ObjStateType<T>;
}

export class SwitchViewState {
    constructor(public checked = false) {

    }
}

/**
 * 文本输入框
 */
export class SwitchView<T> extends Component<SwitchViewProp<T>, SwitchViewState> {

    padingVer = (this.props.style as TextStyle)?.paddingVertical ?? 3

    constructor(props: SwitchViewProp<T>) {
        super(props);
        let res = false
        if (this.props.state) {
            res = (this.props.state[0])[this.props.state[1]] as any
        }
        this.state = new SwitchViewState(res);
    }



    componentDidUpdate() {
        if (this.props.state && (this.props.state[0])[this.props.state[1]] as any != this.state.checked) {

            this.setState({
                checked: (this.props.state[0])[this.props.state[1]] as any,
            })
        }
    }


    render() {
        return (
            <Switch
                {...this.props}
                disabled={this.props.disabled}
                thumbColor={colors.white}
                activeThumbColor={colors.white}
                trackColor={{ false: colors.greyC, true: colors.primary }}
                activeTrackColor={colors.primary}
                value={this.props.value ?? this.state.checked}
                style={[{ height: 20 }, this.props.style]}
                onValueChange={res => {
                    if (this.props.disabled) {
                        return;
                    }
                    this.setState({ checked: res })
                    if (this.props.state) {
                        (this.props.state[0])[this.props.state[1]] = res as any
                    }
                    this.props.onValueChange?.(res)
                }} />
        );
    }




}
