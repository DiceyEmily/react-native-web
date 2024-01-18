import { vali } from '@common/lib/valid';
import React, { Component } from 'react';
import { Platform, Pressable, TextProps, TextStyle, View, ViewProps } from 'react-native';
import { colors } from "../../../components/colors";
import { app } from '../../app';
import { lib } from '../../lib';
import { libColor } from '../../libColor';
import { getViewProperty, nodeIsString, V } from './V';



export interface ButtonViewProp {
    //点击事件
    onPress?: (v: View) => any;

    onPressIn?: (v: View) => any;
    onPressOut?: (v: View) => any;
    //是否禁用
    disabled?: boolean;

    //是否使用白色样式,灰色边框,灰色字体
    white?: boolean;


    //白色样式,主色边框,主色字体
    whitePrimary?: boolean

    //按钮颜色
    color?: string;

    //禁用阴影
    noShadow?: boolean;

    /**
     * 已废弃，使用style代替
     */
    paddingH?: number
    paddingW?: number

    /**
     * 验证指定对象,失败禁用按钮
     */
    state?: object

}

/**
* 
*/
export class ButtonViewState {
    enable?: boolean;
}

/**
* 圆角，带阴影按钮
*/
export class ButtonView extends Component<ButtonViewProp & Omit<TextProps, "onPress">, ButtonViewState> {

    constructor(props: ButtonViewProp & TextProps) {
        super(props);
        let st = new ButtonViewState();
        this.state = st;
    }


    componentDidMount() {

        if (this.props.state) {
            vali.addObjCheckFunc(this.props.state, this.validFunc)
        }
    }

    validFunc = ([ok, msg]: [boolean, string]) => {
        this.setState({
            enable: ok
        })
    }

    componentWillUnmount() {
        if (this.props.state) {
            vali.removeObjCheckFunc(this.props.state, this.validFunc);
        }
    }


    getMainColor() {
        return this.props.color ?? colors.primary;
    }

    isEnable() {
        return this.state.enable ?? !this.props.disabled
    }

    ref?: HTMLDivElement

    getFontColor() {
        if (this.props.white) {
            return this.isEnable() ? colors.textMain : colors.greyC
        }

        if (this.props.whitePrimary) {
            return this.isEnable() ? colors.primary : colors.greyC
        }


        return this.isEnable() ? colors.white : "#FFFFFF55"
    }



    render() {
        let padH = this.props.paddingH ?? 6;
        let padW = this.props.paddingW ?? 13;
        if (!this.props.white) {
            // padH += 1;
            // padW += 1;
        }

        let styl = app.splitStyle(this.props.style, app.textProps);
        let textStyle = styl[0];
        let buttStyle = styl[1];

        let borderRadius = buttStyle["borderRadius"] ?? colors.borderRadius;
        let color = buttStyle["backgroundColor"] ?? (this.props.white || this.props.whitePrimary ? colors.white : this.getMainColor());


        return (
            <Pressable
                ref={ref => {
                    if (ref && !this.ref) {
                        if (Platform.OS == "web") {
                            this.ref = ref as any;

                            if (this.props.onPressIn) {
                                this.ref?.addEventListener?.('contextmenu', (e) => {
                                    e.preventDefault();
                                });
                                this.ref?.addEventListener?.("touchstart", function (e) {
                                    e.preventDefault();
                                });
                            }
                        }
                    }
                }}
                android_ripple={{
                    color: colors.blackTrans,
                }}
                onPressIn={(ev) => {
                    if (this.isEnable()) this.props.onPressIn?.(ev.currentTarget as unknown as View)
                }}
                onPressOut={(ev) => {
                    if (this.isEnable()) this.props.onPressOut?.(ev.currentTarget as unknown as View)
                }}

                disabled={!this.isEnable()}
                onPress={(ev) => {
                    if (this.isEnable()) this.props.onPress?.(ev.currentTarget as unknown as View)
                }}
                style={(st) => {
                    let c = color

                    if (st.pressed) {
                        c = libColor.addColor(color, -0.09) || ""
                    } else if (st.hovered) {
                        c = libColor.addColor(color, -0.04) || ""
                    }
                    return [
                        {
                            userSelect: "none",
                            paddingVertical: padH,
                            paddingHorizontal: padW,
                            borderRadius: borderRadius,
                            justifyContent: "center",
                            alignItems: "center"
                        },
                        this.props.whitePrimary ? {
                            borderWidth: 1,
                            borderColor: colors.primary,
                        } : null,
                        this.props.noShadow ? null : {
                            shadowColor: colors.shadow,
                            shadowOpacity: 0.8,
                            shadowRadius: this.props.white || this.props.whitePrimary ? 1 : 2,
                            // android (Android +5.0)
                            elevation: this.props.white || this.props.whitePrimary ? 2 : 2
                        },
                        buttStyle,
                        {
                            backgroundColor: c,
                        }
                    ]
                }}
            >
                {
                    nodeIsString(this.props.children) ?
                        <V
                            selectable={false}
                            style={[{
                                color: this.getFontColor(),
                            }, textStyle]} >
                            {this.props.children as string}
                        </V>
                        :
                        this.props.children
                }
            </Pressable>
        );
    }





}