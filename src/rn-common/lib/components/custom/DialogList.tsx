import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { app } from '../../app';
import { leng, styles } from '../../../components/styles';
import { colors } from "../../../components/colors";
import { Dialog, DialogCfg, ViewLayout } from './Dialog';
import { PressView } from './PressView';
import { V } from './V';
import { ReactElement } from 'react';
import { lib } from '../../lib';
import { ResultBuffer } from '../ResultBuffer';

export class KeyVal {
    key = "";
    val = "";
}

export interface DialogListItem {


    /**
     * 用于显示的文本
     */
    key: string;

    /**
     * 自定义item渲染
     */
    item?: (dat: DialogListItem) => ReactElement;

    /**
     * 自定义数据
     */
    val?: string | number;


    /**
     * 左侧图标
     */
    icon?: (dat: DialogListItem) => JSX.Element;

    /**
     * 点击事件
     */
    onClick?: (dat: DialogListItem, index: number) => void;

    /**
     * 是否高亮该item
     */
    selected?: boolean;

}

/**
 * 选择结果
 */
export interface DialogRes {
    /**
     * 显示的文本
     */
    key: ReactElement | string;
    /**
     * 自定义数据
     */
    val?: string | number;
    /**
     * 位置索引
     */
    index: number;

}

export interface DialogListProp {


    dialog: Dialog;

    data: Array<DialogListItem>;

    onClick?: (dat: DialogListItem, index: number) => void;


    position?: (dat: ViewLayout) => {
        x: number, y: number,
    };

    posView?: {
        x: number, y: number,
    };

    title?: ReactElement | string,

    onPressAround: () => void;

    /**
     * 0.白色背景
     * 1.无背景
     */
    type?: number;


}

export class DialogListState {
    data?: Array<DialogListItem>;
}

export interface DialogListProp2 {
    maxHeight?: number | string

    /**
     * 指定List最小宽度
     */
    minWidth?: number;
}



/**
 * 中间弹窗选择列表
 */
export class DialogList extends Component<DialogListProp & DialogListProp2, DialogListState> {


    posViewDat: ViewLayout = {
        width: 0,
        height: 0,
        pxWidth: 0,
        pxHeight: 0,
        x: 0,
        y: 0,
    }

    constructor(props: DialogListProp) {
        super(props);
        this.state = new DialogListState();

        if (this.props.posView) {
            this.posViewDat.x = this.props.posView.x;
            this.posViewDat.y = this.props.posView.y;
            this.props.dialog.setStyle(this.getPos())
        }



    }


    /**
     * 弹出显示列表对话框
     * @param data 
     * @param cfg
     */
    static show(data: Array<DialogListItem> | ResultBuffer<Array<DialogListItem>>, cfg?: DialogCfg & DialogListProp2): Promise<DialogRes> {
        return new Promise((reso) => {

            let dialogRef: DialogList

            let func = (data: Array<DialogListItem>) => {
                if (cfg?.posView) {
                    cfg.posView.measure((fx, fy, width, height, px, py) => {
                        Dialog.show({
                            ...cfg,
                        }, (dia) => <DialogList
                            dialog={dia}
                            ref={ref => {
                                if (ref)
                                    dialogRef = ref
                            }}
                            maxHeight={cfg.maxHeight}
                            minWidth={cfg.minWidth}
                            onPressAround={() => {
                                dia.close()
                            }}
                            position={cfg.position}
                            posView={{ x: px / lib.getScale(), y: py / lib.getScale() }}
                            data={data}
                            type={cfg?.type}
                            title={cfg?.title}
                            onClick={(dat, ind) => {
                                dia.close()
                                reso({ key: dat.key, val: dat.val, index: ind });
                            }} />)
                    })
                }
                else {
                    Dialog.show({
                        ...cfg,
                        style: {
                            alignSelf: "center",
                            ...cfg?.style,
                        },
                    }, (dia) => <DialogList
                        dialog={dia}
                        ref={ref => {
                            if (ref)
                                dialogRef = ref
                        }}
                        minWidth={cfg?.minWidth}
                        onPressAround={() => dia.close()}
                        position={cfg?.position}
                        data={data}
                        type={cfg?.type}
                        title={cfg?.title}
                        onClick={(dat, ind) => {
                            dia.close()
                            reso({ key: dat.key, val: dat.val, index: ind });
                        }} />)
                }
            }

            if (data instanceof ResultBuffer) {
                data.each(data => {
                    if (dialogRef) {
                        dialogRef.setState({ data: data })
                    } else {
                        func(data);
                    }

                })
            } else {
                func(data);
            }





        });
    }



    componentDidMount() {

    }

    componentWillUnmount() {

    }



    onPress(dat: DialogListItem, index: number) {
        if (this.props.onClick)
            this.props.onClick(dat, index);
        if (dat.onClick) {
            dat.onClick(dat, index);
        }

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

    getMinWidth() {
        if (this.props.minWidth && this.props.minWidth > 0) {
            return Math.min(this.props.minWidth - 5, 120);
        }
        return 120;
    }


    render() {
        let data = (this.state.data ?? this.props.data);
        return (
            <ScrollView
                onLayout={l => {
                    if (!this.props.position) {
                        return;
                    }
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
                        // minWidth: this.props.minWidth || undefined
                    }
                ]}

            // contentContainerStyle={[{
            //     flexGrow: 1,
            //     maxHeight: app.window.height - 30,
            // },]}
            >
                {/* 标题 */}
                {
                    this.props.title ?
                        <V style={[{
                            color: colors.black,
                            fontSize: 16,
                            paddingHorizontal: 10,
                            paddingTop: 10,
                            textAlign: 'auto',
                        },]}>{this.props.title}</V>
                        : null
                }


                <View style={[{
                },]}>
                    {data.map((it, ind) => {
                        return <PressView key={ind} style={
                            this.props.type == 1
                                ? [
                                    {
                                        minWidth: this.getMinWidth(),
                                        paddingHorizontal: 12, paddingVertical: 6,
                                        alignItems: "center",
                                        flexDirection: "row",
                                        borderColor: colors.white,
                                        backgroundColor: colors.background1,
                                        borderWidth: 2,
                                        margin: 5,
                                    }
                                    , styles.round360Shadow
                                    // , { justifyContent: "center", }
                                ]
                                : [
                                    {
                                        minWidth: this.getMinWidth(),
                                        padding: 10,
                                        alignItems: "center",
                                        flexDirection: "row",
                                    },
                                    ind === 0 ? { borderTopLeftRadius: 3, borderTopRightRadius: 3 } : null,
                                    ind === data.length - 1 ? { borderBottomLeftRadius: 3, borderBottomRightRadius: 3 } : null,
                                    // { justifyContent: "center", }
                                ]}

                            onPress={() => this.onPress(it, ind)}>
                            {it.item ? it.item(it) :
                                <>
                                    {it.icon?.(it)}
                                    <V
                                        style={[{
                                            fontSize: 15,
                                            color: it.selected || this.props.type == 1 ? colors.primary : colors.grey5,
                                            marginLeft: it.icon ? 10 : 0,
                                            textAlign: "center",
                                        }, it.icon ? null : { flex: 1 }]} >{it.key}</V>
                                </>
                            }
                        </PressView>
                    }

                    )}
                </View>
            </ScrollView >
        );
    }





}