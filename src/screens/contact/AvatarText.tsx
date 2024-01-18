import React from 'react'
import { Platform, View, Text, StyleSheet, ViewProps } from "react-native";
import { V } from '@common/lib/components/custom/V';
import { useInit, useObjState } from '@common/lib/hooks';
import { colors } from "@common/components/colors";


interface AvatarTextProp extends ViewProps {
    //头像文本
    text: string

    size: number

    color?: string
}


export class AvatarTextState {


    //更新组件
    get $update() { return }

    constructor(
        //组件属性
        public prop_: AvatarTextProp,
    ) {

    }



}///////////////AvatarTextState end///////////////////



/**
 * 头像组件
 * @param prop 
 * @returns 
 */
export function AvatarText(prop: AvatarTextProp) {

    //组件状态
    // const st = useObjState(() => new AvatarTextState(prop), prop)

    //组件初始化
    // useInit(async () => {


    //     return async () => { //组件卸载

    //     }
    // })




    /////////////////////////////////////////
    //////// AvatarText view//////////
    /////////////////////////////////////////
    return (
        <V
            style={[{
                borderRadius: 360,
                height: prop.size,
                width: prop.size,
                backgroundColor: prop.color ?? colors.list[prop.text.charCodeAt(0) % colors.list.length],
                textAlign: "center",
                lineHeight: prop.size,
                color: colors.white,
                fontSize: prop.size / 2.5,
            }, prop.style]}>
            {prop.text.substr(0, 1)}
        </V>
    )


}///////////////AvatarText end//////////////////

// const sty = StyleSheet.create({

// })