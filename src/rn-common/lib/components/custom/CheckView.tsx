import React, { Component } from 'react';
import { Animated, Platform, View, ViewProps } from 'react-native';
import { colors } from "../../../components/colors";
import { styles } from '../../../components/styles';
import { ObjStateType } from '../../hooks';
import { lib } from '../../lib';
import { Icon } from '../icon/Icon';
import { PressView } from './PressView';
import { V } from './V';



export interface CheckViewProp<T> extends ViewProps {

    /**
     * 点击事件
     */
    onPress?: (checked: boolean) => void;

    /**
     * 长按
     */
    onLongPress?: () => void;

    state?: ObjStateType<T>;

    editable?: boolean;

    disable?: boolean;

    /**
     * 是否选中
     */
    checked?: boolean;


    //文本颜色
    textColor?: string;
    /**
     * 组件颜色
     */
    color?: string;
    /**
     * 是否将checkBox显示在右边(默认左边)
     */
    rightPos?: boolean;

    /**
     * 大小,默认18
     */
    size?: number;

    /**
     * 使用带边框的选项代替,checkbox
     */
    border?: boolean;

    /**
     * 使用方形check样式
     */
    box?: boolean;

    disablePress?: boolean;
}

export class CheckViewState {

    /**
     * 缩放动画
     */
    scaleAnim = new Animated.Value(1);

    constructor() {

    }
}

/**
 * 点击切换状态CheckBox
 */
export class CheckView<T> extends Component<CheckViewProp<T>, CheckViewState> {

    size = 16;

    constructor(props: CheckViewProp<T>) {
        super(props);
        this.state = new CheckViewState();
        if (this.props.size) {
            this.size = this.props.size;
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    getValue(): boolean {
        if (this.props.state) {
            return !!(this.props.state[0])[this.props.state[1]]

        }
        if (this.props.checked != null) {
            return this.props.checked
        }


        return false
    }


    animing = false;



    onPress() {
        if (this.props.editable === false) {
            return;
        }

        if (this.props.disable == true) {
            return;
        }

        this.animing = true;
        this.state.scaleAnim.setValue(0.01);

        let checked = !this.getValue()

        if (this.props.state) {
            (this.props.state[0])[this.props.state[1]] = checked as any;
        }

        // this.setState({ checked: checked });

        if (this.props.onPress)
            this.props.onPress(checked);


        this.startAnim();

        this.forceUpdate();

    }

    startAnim() {
        Animated.timing(this.state.scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: Platform.OS == "web" ? false : true, // 使用原生动画驱动
        }).start(() => {
            this.animing = false;
        });
    }

    componentDidUpdate(prevProps: CheckViewProp<T>) {
        if (this.props.state == null && this.props.checked != null) {
            if (this.props.checked != prevProps.checked && !this.animing) {
                this.animing = true;
                this.state.scaleAnim.setValue(0.01);
                this.startAnim();
            }
        }
    }

    renderCheck() {

        if (this.props.box) {
            return <Animated.View style={[{
                width: this.size, height: this.size,
                backgroundColor: this.props.color ? this.props.color : colors.primary,
                borderRadius: 2,
                alignItems: "center",
                justifyContent: "center",
                transform: [{ scale: this.state.scaleAnim }]
            }]}
            >
                <Icon name="done" size={this.size / 1} color={colors.contraPrimary} />
            </Animated.View>
        }


        let offset = this.size / 4;
        return <Animated.View style={[{
            // width: this.size,
            // height: this.size,
            // backgroundColor: colors.contraPrimary,
            borderColor: this.props.color ? this.props.color : colors.primary,
            borderWidth: 1,
            borderRadius: 360,
            transform: [{ scale: this.state.scaleAnim }]
        },]}
        >
            <View style={[{
                margin: offset,
                aspectRatio: 1,
                borderRadius: 360,
                width: this.size / 2,
                height: this.size / 2,
                backgroundColor: this.props.color ? this.props.color : colors.primary,

            }, styles.shadow1]} >
            </View>
        </Animated.View>
    }

    renderUnCheck() {
        if (this.props.box) {
            return <Animated.View style={[{
                width: this.size,
                height: this.size,
                borderColor: colors.greyC,
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: this.props.box ? 2 : 360,
                transform: [{ scale: this.state.scaleAnim }]
            }]}
            />
        }

        let offset = this.size / 4;
        return <Animated.View style={[{
            // width: this.size,
            // height: this.size,
            borderColor: colors.greyC,
            borderWidth: 1,
            borderRadius: this.props.box ? 2 : 360,
            transform: [{ scale: this.state.scaleAnim }]
        }]}
        >
            <View style={[{
                margin: offset,
                aspectRatio: 1,
                borderRadius: 360,
                width: this.size / 2,
                height: this.size / 2,
                // backgroundColor: this.props.color ? this.props.color : colors.primary,
            },]} >
            </View>
        </Animated.View>
    }

    render() {
        let checked = this.getValue();


        if (this.props.border) {
            return <PressView
                disablePress={this.props.disablePress}
                style={[{
                    borderRadius: 10, borderWidth: 1,
                    padding: 10,
                    backgroundColor: checked ? "#FFFBF3FF" : colors.white,
                    borderColor: checked ? colors.orange : colors.greyE,
                    alignItems: "center",
                    flexDirection: "row",
                }, this.props.style]}
                onPress={() => {
                    this.onPress();
                }}>
                {this.props.children}
            </PressView>
        }

        return (
            this.props.rightPos ?

                <PressView
                    disablePress={this.props.disablePress}
                    style={[{ flexDirection: "row", alignItems: "center" }, this.props.style]}
                    onLongPress={this.props.onLongPress}
                    onPress={() => {
                        this.onPress();
                    }}>
                    {
                        typeof this.props.children === "string" ?
                            <V style={{ marginRight: 3 }}>{this.props.children}</V>
                            : this.props.children
                    }
                    {checked ?
                        this.renderCheck()
                        :
                        this.renderUnCheck()
                    }
                    {/* <Animated.Image style={[{
                        width: 20, height: 20,
                        transform: [{ scale: this.state.scaleAnim }]
                    },]}
                        source={checked ? imgs.ic_choose_p : imgs.ic_choose_n}>
                    </Animated.Image> */}
                </PressView>
                :
                <PressView
                    disablePress={this.props.disablePress}
                    style={[{
                        flexDirection: "row",
                        alignItems: "center", paddingHorizontal: 2,
                        paddingVertical: 5
                    }, this.props.style]}
                    onPress={() => {
                        this.onPress();
                    }}>
                    {checked ?
                        this.renderCheck()
                        :
                        this.renderUnCheck()
                    }
                    {
                        typeof this.props.children === "string" ?
                            <V style={{
                                marginLeft: 4,
                                color: this.props.textColor ? this.props.textColor : ""
                            }}>{this.props.children}</V>
                            : this.props.children
                    }
                </PressView>
        );
    }





}