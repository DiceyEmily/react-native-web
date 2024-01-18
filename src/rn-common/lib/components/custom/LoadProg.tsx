import React, { Component } from 'react';
import { ActivityIndicator, TouchableWithoutFeedback, View } from 'react-native';
import { styles } from '../../../components/styles';
import { colors } from "../../../components/colors";
import { V } from './V';


export interface LoadProgProp {
    msg?: string;
    onClose: () => void
}

export class LoadProgState {
    show = false
    text = "加载中..."
}

/**
 * 全屏遮盖进度条
 */
export class LoadProg extends Component<LoadProgProp, LoadProgState> {

    constructor(props: LoadProgProp) {
        super(props);
        let st = new LoadProgState();
        if (props.msg)
            st.text = props.msg
        this.state = st;

    }

    onHide = () => {

    }

    /**
     * 设置进度文本
     * @param t 
     */
    setText(t: string) {
        this.setState({ text: t });
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }


    render() {

        return (
            <View style={[styles.full, {
                position: "absolute",
                backgroundColor: colors.blackTrans,
            }, styles.center]}>

                <TouchableWithoutFeedback
                    onPress={() => {
                        this.props.onClose()
                    }}
                ><View
                        style={[{
                            width: "100%",
                            //backgroundColor: colors.blue,
                            position: "absolute",
                            left: 0,
                            top: 0,
                            height: 70,
                        },]} />
                </TouchableWithoutFeedback>

                <View style={[{
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 15,
                    paddingVertical: 12,
                    borderRadius: 5,
                    backgroundColor: "#00000070",
                },]}>
                    <ActivityIndicator
                        color={colors.white}
                        size="large"
                    />
                    <V style={{ color: colors.white, marginLeft: 10 }}>{this.state.text}</V>
                </View>
            </View>
        );
    }


}
