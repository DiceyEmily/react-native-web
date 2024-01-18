import React, { Component, ReactElement } from 'react';
import { Animated, BackHandler, NativeMethods, Pressable, View, ViewStyle } from 'react-native';
import { colors } from "../../../components/colors";
import { styles } from '../../../components/styles';
import { app } from '../../app';
import { lib } from '../../lib';


export interface DialogProp {

    /**
     *  点击背景回调
     */
    onPressAround: () => void;

    /**
     * 内容显示回调
     */
    onCont: (dia: Dialog) => ReactElement

    //是否显示在底部
    bottom?: boolean;


    /**
     * 是否禁用背景变暗
     */
    disableDim?: boolean;
    /**
     * 背景颜色
     */
    backgroundColor?: string;
    /**
     * 禁用动画
     */
    disableAnim?: boolean;

    //外层View样式
    style?: ViewStyle

    /**
     * 构造函数回调
     */
    onConstructor?: (dia: Dialog) => void
}

export interface ViewLayout {
    //缩放后无单位长宽
    width: number;
    height: number;
    //px原始单位长宽
    pxWidth: number;
    pxHeight: number;
    x: number;
    y: number;
}
export interface DialogCfg {

    //禁用点击背景或返回按键关闭窗口,
    disableCancel?: boolean;

    ///禁用点击背景关闭窗口,
    disableAround?: boolean;

    //外层view样式
    style?: ViewStyle,

    //是否显示在屏幕底部
    bottom?: boolean,

    /**
    * 是否禁用背景变暗
     */
    disableDim?: boolean;
    /**
     * 背景颜色
     */
    backgroundColor?: string;
    /**
     * 禁用动画
     */
    disableAnim?: boolean;

    //关闭窗口回调
    onClose?: () => void



    //显示位置
    position?: (dat: ViewLayout) => {
        x: number, y: number,
    };

    //设置显示位置相关的组件,
    posView?: NativeMethods


    title?: ReactElement | string;

    //右侧滑动anim
    animRight?: boolean;

    //底部滑动anim
    animBottom?: boolean;


    /**
     * 弹出对话框的样式（目前只支持0和1两种样式）
     */
    type?: number;

}

/**
* 
*/
export class DialogState {
    //scale值为0时无效,必须从小数开始
    scaleAnim = new Animated.Value(0);
    tranXAnim = new Animated.Value(0);
    tranYAnim = new Animated.Value(0);
}



/**
* 
*/
export class Dialog extends Component<DialogProp, DialogState> {

    /**
     * Animated view样式
     */
    style?: ViewStyle

    /**
     * 关闭dialog
     */
    close() {

    }


    paras!: DialogCfg;

    constructor(props: DialogProp) {
        super(props);
        this.style = props.style;

        let st = new DialogState();
        this.state = st;
        props.onConstructor?.(this)
    }


    /**
     * 显示弹出式对话框
     * @param paras 对话框参数
     * @param func 主体内容回调
     * @returns 
     */
    static show(paras: DialogCfg, func: (inst: Dialog) => ReactElement) {

        let onClose = () => {
        }

        /**
        * 返回按钮回调
        */
        let backFunc = () => {
            if (!paras.disableCancel) {
                onClose();
                if (paras.onClose)
                    paras.onClose();
            }
            return true;
        }

        let dialog = <Dialog
            key={lib.getUniqueId16()}
            onConstructor={dia => {
                dia.close = onClose;
                dia.paras = paras;
            }}
            style={paras.style}
            disableDim={paras.disableDim}
            backgroundColor={paras.backgroundColor}
            disableAnim={paras.disableAnim}
            onCont={func}
            bottom={paras.bottom}
            onPressAround={() => {
                if (!paras.disableCancel && !paras.disableAround) {
                    onClose();
                    paras.onClose?.();
                }
            }} />

        onClose = () => {
            BackHandler.removeEventListener('hardwareBackPress', backFunc);
            app.rootGroup?.removeView(dialog);
        }

        app.rootGroup?.addView(dialog);

        BackHandler.addEventListener('hardwareBackPress', backFunc);
        return dialog;
    }
    noStart = true;
    w = 0;
    h = 0;

    componentDidMount() {

    }

    componentWillUnmount() {
    }


    setStyle(style: ViewStyle) {


        this.style = style;
        this.setState(this.state);
    }


    animView?: Element
    render() {

        let dia = null as ReactElement | null
        try {
            dia = this.props.onCont(this);
        } catch (e) {
            app.msgErr(e + "");
            dia = null as any;
        }
        let isWeb = app.isWeb;
        return (
            <View
                style={[{
                    position: "absolute",
                    justifyContent: this.props.bottom ? "flex-end" : "center",
                }, styles.full]}>

                {/* 背景 */}
                <Pressable
                    onPress={() => this.props.onPressAround()}
                    style={[{
                        position: "absolute",
                    }, this.props.disableDim ? null : { backgroundColor: this.props.backgroundColor ?? colors.blackTrans, }, styles.full]}>
                </Pressable>

                {/* 主体 */}
                <Animated.View
                    ref={(ref: any) => {
                        if (ref) {
                            this.animView = ref
                        }
                    }}
                    onLayout={(res) => {
                        this.w = res.nativeEvent.layout.width;
                        this.h = res.nativeEvent.layout.height;

                        if (this.noStart) {

                            if (this.paras.animRight) {
                                this.state.tranXAnim.setValue(this.w);
                                this.state.scaleAnim.setValue(1);


                                Animated.timing(this.state.tranXAnim, {
                                    toValue: 0,
                                    duration: 150,
                                    // easing: Easing.inOut(Easing.ease),
                                    useNativeDriver: true,
                                }).start();

                            } else if (this.paras.animBottom) {
                                this.state.tranYAnim.setValue(this.h);
                                this.state.scaleAnim.setValue(1);
                                Animated.timing(this.state.tranYAnim, {
                                    toValue: 0,
                                    duration: 150,
                                    // easing: Easing.inOut(Easing.ease),
                                    useNativeDriver: true,
                                }).start();
                            } else {
                                if (isWeb) {
                                    try {
                                        this.animView!.animate([
                                            // keyframes
                                            { transform: 'scale(0)' },
                                            { transform: 'scale(1)' }
                                        ], 150).addEventListener('finish', () => {
                                            this.state.scaleAnim.setValue(1)
                                        });
                                    } catch (err) {
                                        this.state.scaleAnim.setValue(1)
                                    }
                                } else {
                                    Animated.timing(this.state.scaleAnim, {
                                        toValue: 1,
                                        duration: 150,
                                        // easing: Easing.inOut(Easing.ease),
                                        useNativeDriver: true,
                                    }).start();
                                }

                            }
                            this.noStart = false;

                        }
                    }}
                    style={[
                        // this.props.disableAnim ?
                        //     null
                        //     :
                        {

                            // transform: [{ translateY: this.state.scaleAnim }],
                            // opacity: this.state.scaleAnim,
                            transform: [
                                { scale: this.state.scaleAnim },
                                { translateX: this.state.tranXAnim },
                                { translateY: this.state.tranYAnim },
                            ],
                        },
                        this.style]} >
                    {dia}
                </Animated.View>
            </View >
        );
    }




}