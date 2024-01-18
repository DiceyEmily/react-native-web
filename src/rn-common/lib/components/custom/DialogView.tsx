import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { app } from '../../app';
import { leng, styles } from '../../../components/styles';
import { colors } from "../../../components/colors";
import { Dialog, DialogCfg, ViewLayout } from './Dialog';
import { ReactElement } from 'react';
import { lib } from '../../lib';


export interface DialogItemView {

    /**
     * 自定义content渲染
     */
    content: () => ReactElement

}


export interface DialogViewProp {


    dialog: Dialog;

    /**
     * 自定义content渲染
     */
    content: DialogItemView;

    position?: (dat: ViewLayout) => {
        x: number, y: number,
    };

    posView?: {
        x: number, y: number,
    };

    onPressAround: () => void;

    /**
     * 0.白色背景
     * 1.无背景
     */
    type?: number;


}

export class DialogViewState {

}

export interface DialogListProp2 {
    maxHeight?: number | string
}



/**
 * 自定义view的弹窗
 */
export class DialogView extends Component<DialogViewProp & DialogListProp2, DialogViewState> {


    posViewDat: ViewLayout = {
        width: 0,
        height: 0,
        pxWidth: 0,
        pxHeight: 0,
        x: 0,
        y: 0,
    }

    constructor(props: DialogViewProp) {
        super(props);
        this.state = new DialogViewState();

        if (this.props.posView) {
            this.posViewDat.x = this.props.posView.x;
            this.posViewDat.y = this.props.posView.y;
        }

        this.props.dialog.setStyle(this.getPos())
    }


    /**
     * 弹出显示列表对话框
     * @param data 
     * @param cfg
     */
    static show(data: DialogItemView, cfg?: DialogCfg & DialogListProp2): Promise<{ dialog: Dialog }> {

        return new Promise((reso) => {
            if (cfg?.posView) {
                cfg.posView.measure((fx, fy, width, height, px, py) => {
                    Dialog.show({
                        ...cfg,
                    }, (dia) => {
                        reso({ dialog: dia })
                        return <DialogView
                            dialog={dia}
                            maxHeight={cfg.maxHeight}
                            onPressAround={() => dia.close()}
                            position={cfg.position}
                            content={data}
                            posView={{ x: px / lib.getScale(), y: py / lib.getScale() }}
                            type={cfg?.type}
                        />
                    })
                })
            }
            else {
                Dialog.show({
                    ...cfg,
                }, (dia) => {
                    reso({ dialog: dia })
                    return <DialogView
                        dialog={dia}
                        onPressAround={() => dia.close()}
                        position={cfg?.position}
                        content={data}
                        type={cfg?.type} />
                })
            }

        });
    }


    componentDidMount() {

    }

    componentWillUnmount() {

    }


    getPos(): any {
        if (this.props.position) {

            let x = this.props.position(this.posViewDat).x;
            let y = this.props.position(this.posViewDat).y;
            if (this.props.posView) {
                x += this.props.posView.x;
                y += this.props.posView.y;
            }

            let winH = app.window.height / lib.getScale();
            let winW = app.window.width / lib.getScale();

            //修复超出屏幕
            if (y + this.posViewDat.height > winH) {
                y = winH - this.posViewDat.height;
            }
            if (x + this.posViewDat.width > winW) {
                x = winW - this.posViewDat.width
            }

            return {
                position: "absolute",
                left: x,
                top: y,
            }
        }

        if (this.props.posView) {
            return {
                position: "absolute",
                left: this.props.posView.x,
                top: this.props.posView.y,
            }
        }


        return {
            marginHorizontal: 20,
            marginTop: app.statusBarHeight + 10,
            marginBottom: 20,
            justifyContent: "center", alignItems: "center",
        }
    }


    render() {
        return (
            <ScrollView
                onLayout={l => {
                    if (this.posViewDat.pxWidth != l.nativeEvent.layout.width || this.posViewDat.pxHeight != l.nativeEvent.layout.height) {
                        this.posViewDat.pxWidth = l.nativeEvent.layout.width;
                        this.posViewDat.pxHeight = l.nativeEvent.layout.height;
                        this.posViewDat.width = l.nativeEvent.layout.width / lib.getScale();
                        this.posViewDat.height = l.nativeEvent.layout.height / lib.getScale();
                        // this.setState(this.state)
                        this.props.dialog.setStyle(this.getPos())
                    }

                }}
                style={[
                    this.props.type == 1 ? null : styles.roundBackShadow,
                    {
                        maxHeight: this.props.maxHeight ?? ((app.window.height - app.statusBarHeight - 22) / lib.getScale()),
                    }
                ]}

            >
                <View style={[{
                },]}>
                    {this.props.content.content()}
                </View>
            </ScrollView >
        );
    }





}