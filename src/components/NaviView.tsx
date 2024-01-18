import { colors } from '@src/rn-common/components/colors';
import { styles } from '@src/rn-common/components/styles';
import { app } from '@src/rn-common/lib/app';
import { PressView } from '@src/rn-common/lib/components/custom/PressView';
import { TabNaviViewProp } from '@src/rn-common/lib/components/custom/TabNaviView';
import { V } from '@src/rn-common/lib/components/custom/V';
import { TabViewItem } from '@src/rn-common/model/TabViewItem';
import React, { Component } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { View, Text, Image, ScrollView, ImageSourcePropType, ViewProps } from 'react-native';



export interface NaviViewProp extends ViewProps {
    /**
     * 数据列表
     */
    data: Array<TabViewItem>;
    /**
     * 当前选择索引
     */
    initIndex: number;

    /**
     * 底部样式
     */
    tabStyle?: StyleProp<ViewStyle>

    /**
     * 选中文字颜色
     */
    activeColor?: string

    /**
     * 离开文字颜色
     */
    inactiveColor?: string

    /**
     * 标签点击事件
     */
    onClick?: (index: number) => void

    itemPaddingV?: number;


    fontSize?: number;
}

export class NaviViewState {
    index = 0;
    // width = app.window.width;
}

/**
 * 底部标签导航
 */
export class NaviView extends Component<TabNaviViewProp, NaviViewState> {


    listCache = Array<any>();
    constructor(props: TabNaviViewProp) {
        super(props);
        let st = new NaviViewState();
        st.index = this.props.initIndex;
        this.state = st
    }


    componentDidMount() {

        //this.setState({ index: this.props.initIndex });
    }


    componentWillUnmount() {

    }


    setIndex(i: number) {
        let dat = this.props.data[i];

        this.onPressItem(dat, i);
    }

    /**
     * 跳转前校验事件
     */
    onPrePress = (dat: TabViewItem, index: number) => {
        return true;
    }

    onPressItem(dat: TabViewItem, index: number) {
        if (this.state.index == index)
            return;

        if (!this.onPrePress(dat, index)) {
            return;
        }
        this.setState({ index: index })

        dat.onClick?.(index);

        this.props.onClick?.(index)
    }


    renderItem(dat: TabViewItem, index: number) {

        let act = this.state.index == index;

        return (
            <PressView key={index} onPress={() => this.onPressItem(dat, index)}
                style={[{ flex: 1, paddingVertical: this.props.itemPaddingV ?? 8 }, styles.center]} >
                {act ? dat.iconActive?.() : dat.iconNormal?.()}
                {!dat.title ? null : <V style={[{
                    marginTop: 2,
                    color: act ?
                        (this.props.activeColor ? this.props.activeColor : colors.primary)
                        :
                        (this.props.inactiveColor ? this.props.inactiveColor : colors.greyText), fontSize: this.props.fontSize ?? 11, textAlign: "center"
                },]}>{dat.title}</V>}
            </PressView>
        );
    }


    // {this.props.data[this.state.index].render(this.state.index)}


    rendeIndex(dat: TabViewItem, index: number) {
        let cache = this.listCache[index];
        if (index == this.state.index) {
            if (!cache) {
                cache = dat.view()
                this.listCache[index] = cache;
            }
        }

        return cache
    }


    render() {

        let w = app.window.width;

        // console.log(w)
        return (
            <View style={[{ flex: 1, }, styles.column, this.props.style]} onLayout={lay => this.onLayout(lay)}>
                <View style={[{ flex: 1, overflow: "hidden" }, styles.row]}>
                    {this.props.data.map((it, index) =>
                        <View key={index} style={{ position: "absolute", top: 0, bottom: 0, left: this.state.index == index ? 0 : w, width: "100%" }}>
                            {this.rendeIndex(it, index)}
                        </View>)}
                </View>
                <View style={[{ backgroundColor: colors.white, }, styles.row, this.props.tabStyle]}>
                    {this.props.data.map((it, ind) => this.renderItem(it, ind))}
                </View>
            </View>
        );
    }


    onLayout(lay: import("react-native").LayoutChangeEvent): void {

        // this.setState({ width: lay.nativeEvent.layout.width });
    }





}