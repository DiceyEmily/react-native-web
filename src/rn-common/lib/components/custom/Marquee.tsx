import { colors } from "@common/components/colors";
import React, { Component } from 'react';
import {
    View, Animated, Easing, ViewProps, Platform
} from 'react-native';



export interface MarqueeProp<T> extends ViewProps {

    //初始数据
    data: Array<T>,

    //成员渲染回调
    renderItem: (d: T, i: number) => any,

    //动画时间
    duration: number,

    //文字停留时间
    delay: number,


    //文本高度
    toValue: number,
}

/**
* 
*/
export class MarqueeState {
    translateY = new Animated.Value(0)
    data = Array<any>();
}


/**
* 跑马灯
*/
export class Marquee<T> extends Component<MarqueeProp<T>, MarqueeState> {

    constructor(props: MarqueeProp<T>) {
        super(props);
        let st = new MarqueeState();
        st.data = props.data;
        this.state = st;

    }

    componentDidMount() {
        this.showHeadBar()
    }

    componentWillUnmount() {
    }

    height = 30
    showHeadBar() {

        Animated.timing(this.state.translateY, {
            useNativeDriver: Platform.OS == "web" ? false : true,
            toValue: -this.props.toValue || -this.height,    //40为文本View的高度
            duration: this.props.duration || 1000,          //动画时间
            easing: Easing.linear,
            delay: this.props.delay || 2000         //文字停留时间
        }).start(() => {
            //-- 删除
            let array = this.state.data
            array.push(this.state.data[0]);
            array.shift()
            this.state.translateY.setValue(0)
            this.setState(this.state, () => {
                this.showHeadBar()
                //() => this.showHeadBar(
                // this.setState({
                //     translateY: new Animated.Value(0),
                // }, () => this.showHeadBar())
            })
        })
    }


    render() {
        if (this.state.data.length === 0) {
            this.props.data?.forEach(it => {
                this.state.data.push(it)
            })
        }
        return (
            <View style={[{ height: this.props.toValue || this.height, overflow: 'hidden' }, this.props.style,]}>
                <Animated.View
                    style={{
                        transform: [{
                            translateY: this.state.translateY
                        }]
                    }}
                >
                    {
                        this.state.data.map((e, index) => this.props.renderItem(e, index))
                    }
                </Animated.View>
            </View>
        );
    }





}