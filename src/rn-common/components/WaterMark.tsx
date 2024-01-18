import React, { Component, useLayoutEffect } from 'react';
import { useCallback } from 'react';
import { Dimensions, View } from "react-native";
import Svg, { G, Text } from 'react-native-svg';
import { app } from '../lib/app';
import { useObjState, useOnMount } from '../lib/hooks';
import { RefState } from '../lib/RefState';

interface WaterMarkProp extends RefState<WaterMarkState> {
    //水印画布的宽度
    canvasWid?: number,
    //水印画布的高度
    canvasHei?: number,
    //水印文字之间的行间距
    txtSpace?: number,
    //水印的列数
    txtLines?: number,
    //文字距离画布上边界的距离
    txtOriginY?: number,
    //水印字体大小
    txtFont?: number,
    //水印字体颜色
    txtColor?: string,

    text: string | undefined,
}



export class WaterMarkState {

    text: string | undefined = ""
    //更新组件
    get $update() { return }
    public constructor(public prop_: WaterMarkProp) {
        app.onLayoutChange.push(this.update)
    }
    setText(text: string | undefined) {
        this.text = text;
        this.$update;
    }

    update = () => {
        this.$update
    }

    onMount() {
    }

    onUnmount() {
        for (let i = app.onLayoutChange.length - 1; i >= 0; i--) {
            if (app.onLayoutChange[i] == this.update) {
                app.onLayoutChange.splice(i, 1);
                break;
            }
        }
    }
}

/**
 * 背景水印
 * @param prop 
 * @returns 
 */
export function WaterMark(prop: WaterMarkProp) {

    let st = useObjState(() => new WaterMarkState(prop), prop);
    useOnMount(st);


    if (!st.text) {
        return null;
    }

    let { height, width } = Dimensions.get('window')
    let canvasWid = prop.canvasWid ?? width
    let canvasHei = prop.canvasHei ?? height
    let txtSpace = prop.txtSpace ?? 100;
    let txtLines = prop.txtLines ?? 3;
    let txtOriginY = prop.txtOriginY ?? 30;
    let txtFont = prop.txtFont ?? 12;
    let txtColor = prop.txtColor ?? "rgba(200,200,200,0.5)";

    let text = st.text

    canvasWid = canvasWid + 70; // 增大宽度，防止边角留白
    let cos = Math.cos(270 * (180 / Math.PI))
    let space = (txtSpace + (txtFont * 2))
    let beveling = space / cos
    let sideLength = canvasWid + canvasHei
    let rowNum = Math.ceil(sideLength / beveling)
    let arr = []
    let y = txtOriginY
    for (let i = 0; i < rowNum; i++) {
        for (let j = 0; j < txtLines; j++) {
            let x = (canvasWid / (txtLines)) * j + 20;
            let svgTxt =
                <G key={j + "_" + i}
                    rotation={-30}
                    originX={x}
                    originY={y}
                // transform={{ x: [-300, 0], y: [90, 0] }}
                >
                    <Text
                        x={x}
                        y={y}
                        stroke="transparent"
                        fill={txtColor}
                        fontSize={txtFont}
                    >{text}</Text>
                </G>;

            arr.push(svgTxt)
        }
        y = y + txtSpace
    }

    /////////////////////////////////////////
    //////// WaterMark view//////////
    /////////////////////////////////////////
    return (
        <Svg
            pointerEvents="none"
            height={canvasHei}
            width={canvasWid}
            style={{
                userSelect: "none",
                backgroundColor: 'transparent',
                position: 'absolute'
            }}
        >
            <G>{arr}</G>
        </Svg>
    )

}






