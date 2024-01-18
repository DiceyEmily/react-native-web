import { app } from '@common/lib/app';
import React, { Component } from 'react';
import { GestureResponderEvent, PanResponder, PanResponderGestureState, Platform, RefreshControl, ScrollView, ScrollViewProps } from "react-native";
import { colors } from "../../../components/colors";
import { PullHeader } from './PullHeader';

export interface PullScrollProp extends ScrollViewProps {

    //下拉刷新回调（通过await promise来判断刷新是否结束）
    onRefresh?: () => Promise<any>

}

export class PullScrollState {
    //是否正在刷新数据
    isRefreshing = false //for pull to refresh
}




/**
 * 支持下拉刷新的ScrollView
 */
export class PullScroll extends Component<PullScrollProp, PullScrollState> {



    constructor(props: PullScrollProp) {
        super(props);
        this.state = new PullScrollState();
    }

    async onRefresh() {
        this.setState({ isRefreshing: true });
        try {
            if (this.props.onRefresh) {
                await this.props.onRefresh();
            }
        }
        finally {
            this.webHeader?.pullEnd()
            this.setState({ isRefreshing: false });
        }

    }
    getHeader() {
        if (Platform.OS !== "web") {
            return null;
        }

        return (
            <PullHeader onRefresh={() => this.onRefresh()} ref={ref => { this.webHeader = ref }} />
        )
    }

    webHeader: PullHeader | null = null;

    _handleMoveShouldSetPanResponder = (e: GestureResponderEvent, gestureState: PanResponderGestureState): boolean => {/*eslint @typescript-eslint/no-unused-vars: 0*/
        // Should we become active when the user moves a touch over the circle?
        //console.log("_handleMoveShouldSetPanResponder")
        if (gestureState.vx != 0) {
            return false;
        }
        return true;
    };


    currentX = 0
    currentY = 0;

    _handlePanResponderGrant = (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        this.webHeader?._handlePanResponderGrant(e, gestureState)
    };

    _handlePanResponderMove = (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        this.currentX = gestureState.dx
        this.currentY = gestureState.dy
        this.webHeader?._handlePanResponderMove(e, gestureState)
    };

    _handlePanResponderEnd = (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        this.webHeader?._handlePanResponderEnd(e, gestureState)
    };


    panResponder = Platform.OS === "web" ? PanResponder.create({
        onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
        onPanResponderGrant: this._handlePanResponderGrant,
        onPanResponderMove: this._handlePanResponderMove,
        onPanResponderRelease: this._handlePanResponderEnd,
        onPanResponderTerminate: this._handlePanResponderEnd,
    }).panHandlers : {}


    render() {

        return (
            <ScrollView
                {...this.props}
                {...this.panResponder}
                style={[app.isWeb ? { height: 1 } : { flex: 1, }, this.props.style]}
                onScroll={e => this.webHeader?._onScrool(e)}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        colors={[colors.primary]}
                        refreshing={this.state.isRefreshing}
                        onRefresh={() => this.onRefresh()}
                    />
                }>
                {this.getHeader()}
                {this.props.children}
            </ScrollView>
        );
    }

}

