import React, { Component } from 'react';
import { GestureResponderEvent, Platform, Pressable, StyleProp, TextStyle, ViewProps } from "react-native";
import { colors } from "../../../components/colors";
import { nodeIsString, V } from './V';

export interface PressViewProp extends ViewProps {
    //点击事件
    onPress?: (event: GestureResponderEvent) => any;

    //长按事件
    onLongPress?: (event: GestureResponderEvent) => any;

    /**
   * Called when a touch is engaged before `onPress`.
   */
    onPressIn?: null | ((event: GestureResponderEvent) => void);

    /**
     * Called when a touch is released before `onPress`.
     */
    onPressOut?: null | ((event: GestureResponderEvent) => void);

    //按下的背景颜色
    colorPress?: string | null

    //成员文本样式
    textStyle?: StyleProp<TextStyle>

    //android无边框样式
    borderless?: boolean;

    disablePress?: boolean;
}

export class PressViewState {

}

/**
 * 可点击View, 按下背景变灰
 */
export class PressView extends Component<PressViewProp, PressViewState> {

    onPress = (obj: {
        pressed: boolean,
        hovered?: boolean,
        focused?: boolean,
    }) => {

        if (Platform.OS === "android") {
            return this.props.style;
        }

        if (obj.pressed) {
            return [
                this.props.style,
                {
                    backgroundColor: this.colorPress,
                },
            ]
        }

        if (obj.hovered) {
            return [
                this.props.style,
                {
                    backgroundColor: colors.hoverColor,
                },
            ]
        }


        return [
            this.props.style,
        ]
    }

    isPress = false;

    onPressIn = (event: GestureResponderEvent) => {
        this.isPress = true;
        this.props.onPressIn?.(event)


    }
    onPressOut = (event: GestureResponderEvent) => {
        this.isPress = false;
        this.props.onPressOut?.(event)
    }

    constructor(props: PressViewProp) {
        super(props);
        // this.state = new PressViewState();

    }

    colorPress = this.props.colorPress ?? colors.blackTrans


    render() {

        if (this.props.disablePress) {
            return <V
                {...this.props}>
                {nodeIsString(this.props.children) ?
                    <V style={this.props.textStyle} >
                        {this.props.children as string}
                    </V>
                    :
                    this.props.children}
            </V>
        }


        return (
            <Pressable

                {...this.props}

                onPressIn={this.onPressIn}

                onPressOut={this.onPressOut}

                android_ripple={
                    {
                        color: this.colorPress,
                        borderless: this.props.borderless,
                    }
                }
                style={this.onPress}
            >
                {({ pressed }) => {
                    return (

                        this.props.children
                    )
                }
                }
            </Pressable>
        );
    }




}
