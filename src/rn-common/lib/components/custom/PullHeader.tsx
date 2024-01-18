import React, { Component } from 'react';
import { ActivityIndicator, Animated, GestureResponderEvent, NativeScrollEvent, NativeSyntheticEvent, PanResponderGestureState, View, ViewProps } from 'react-native';
import { lib } from '../../lib';
import { styles } from '../../../components/styles';
import { colors } from "../../../components/colors";
import { V } from './V';
import { AnimDeg } from '@common/lib/Anim';

export interface PullListHeader extends ViewProps {
    onRefresh(): void
}

enum RefreshState {   /*eslint no-shadow: 0*/
    normal,
    pull,
    refreshing,
}

export class PullHeaderState {
    headerH = 80
    text = "下拉刷新"
    marTop = -this.headerH
    pull = RefreshState.normal
}




export class PullHeader extends Component<PullListHeader, PullHeaderState> {

    maxLen = 120
    refreshLen = 100;
    constructor(props: PullListHeader) {
        super(props);
        this.state = new PullHeaderState();
    }

    /**
     * 开始下拉的坐标
     */
    startX = 0
    startY = 0;


    //startPull = false;

    _handlePanResponderGrant = (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        this.startX = gestureState.dx
        this.startY = gestureState.dy

        if (this.state.pull === RefreshState.pull) {//修复上次错误状态
            this.pullEndState()
        }
        // console.log("_handlePanResponderGrant:", this.state)
    };



    refresh = false;


    _handlePanResponderMove = (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {


        if (this.scrollY <= 0 && gestureState.vy > 0 && this.state.pull === RefreshState.normal) {
            this.startX = gestureState.dx
            this.startY = gestureState.dy
            this.setState({ pull: RefreshState.pull })
            return;
        }

        if (this.state.pull !== RefreshState.pull) {
            return;
        }

        if (this.scrollY > 0) {
            return;
        }

        // 
        let len = gestureState.dy - this.startY;

        // console.log("_handlePanResponderMove vy:", gestureState.vy, " len:", len)



        if (len < 0) {
            return;
        }


        this.refresh = false;
        let lenX = Math.abs(gestureState.dx - this.startX);
        if (lenX > 120) {
            this.setState({ pull: RefreshState.normal, marTop: -this.state.headerH })
            return;
        }
        if (len > this.refreshLen) {

            if (len > this.maxLen)
                len = this.maxLen

            if (this.state.text !== "松开刷新") {
                this.arrowAnim.start(180);
            }
            this.setState({ marTop: -this.state.headerH + len, text: "松开刷新" })
            this.refresh = true;
        } else {
            if (this.state.text !== "下拉刷新") {
                this.arrowAnim.start(0);

            }
            this.setState({ marTop: -this.state.headerH + len, text: "下拉刷新" })
        }

    };



    _handlePanResponderEnd = (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {/*eslint @typescript-eslint/no-unused-vars: 0*/

        // console.log("_handlePanResponderEnd:", this.state)
        if (this.state.pull !== RefreshState.pull) {
            return;
        }

        if (this.refresh) {
            this.pullRefresh();
        } else {
            this.pullEnd();
        }

        // console.log("end", gestureState)
    };

    scrollY = 0;

    _onScrool(e: NativeSyntheticEvent<NativeScrollEvent>) {
        this.scrollY = e.nativeEvent.contentOffset.y
    }

    /**
     * 修复列表不足全屏时，不触发加载更多
     */
    async hideHeader() {
        // await lib.sleep(3)
        // this.setState({ marTop: -this.state.headerH + 7 })

    }

    pullRefresh() {
        this.setState({ marTop: 0, pull: RefreshState.refreshing, text: "加载中..." })
        this.props.onRefresh()
    }



    pullEnd() {
        this.arrowAnim.setValue(0)
        if (this.rootView && this.rootView.animate) {
            this.setState({ pull: RefreshState.normal })

            let player = this.rootView.animate(
                {
                    marginTop: [lib.getPx2Rem(this.state.marTop) + "rem", '' + lib.getPx2Rem(-this.state.headerH) + 'rem']
                }, 150);
            player.addEventListener('finish', () => {
                //console.log(player.currentTime)
                this.setState({ marTop: -this.state.headerH })
            });
        }
        else {
            this.setState({ pull: RefreshState.normal, marTop: -this.state.headerH })
        }
    }

    pullEndState() {
        this.setState({ marTop: -this.state.headerH, pull: RefreshState.normal, text: "下拉刷新" })
    }

    rootView: Element | null = null;

    arrowAnim = new AnimDeg()

    render() {
        if (this.state.marTop == -this.state.headerH) {
            return null;
        }
        return (
            <View
                ref={ref => {
                    if (ref)
                        this.rootView = ref as any
                }}
                style={[{
                    flexDirection: "row",
                    padding: 5,
                    marginTop: this.state.marTop,
                    height: this.state.headerH
                }, styles.center]} >
                {
                    this.state.text !== "加载中..." ?
                        <Animated.View
                            style={{
                                transform: [
                                    this.arrowAnim.rotate,
                                    {
                                        translateY: 3,
                                    },],
                                width: 0,
                                height: 0,
                                borderStyle: 'solid',
                                borderWidth: 7,
                                borderRadius: 2,
                                borderTopColor: colors.primary,//下箭头颜色
                                borderLeftColor: '#ffffff00',//右箭头颜色
                                borderBottomColor: '#ffffff00',//上箭头颜色
                                borderRightColor: '#ffffff00'//左箭头颜色
                            }} />
                        :
                        <ActivityIndicator
                            size="large"
                            color={colors.primary}
                        />

                }

                <V style={{ marginLeft: 10, color: colors.greyA }}>{this.state.text}</V>
            </View>


        );
    }
}