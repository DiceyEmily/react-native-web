import React from 'react'
import { Platform, View, Text, StyleSheet } from "react-native";
import { nodeIsString, V } from '@common/lib/components/custom/V';
import { ViewProps } from 'react-native';
import { Icon, IconNames } from '@common/lib/components/icon/Icon';
import { styles } from './styles';
import { colors } from "./colors";
import { IconXC, IconXCnames } from '@src/components/IconXC';
import { Pic } from '../lib/components/custom/Pic';


interface IconTextProp extends ViewProps {
    name?: IconNames;

    name2?: IconXCnames;

    name3?: IconXCnames;

    children: string | JSX.Element | JSX.Element[]

    color?: string
    /**
     * 限定text行数
     */
    line?: number
    hideIcon?: boolean
    sizeIcon?: number
}


export class IconTextState {


    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: IconTextProp,
    ) {

    }




}///////////////IconTextState end///////////////////



/**
 * 左侧灰色图标文本
 * @param prop 
 * @returns 
 */
export function IconText(props: IconTextProp) {

    //组件状态
    // const st = useObjState(() => new IconTextState(prop), prop)

    //组件初始化
    // useInit(async () => {


    //     return async () => { //组件卸载

    //     }
    // })


    function getIcon() {
        if (props.name3) {
            return <Pic source={props.name3 as any} style={[{ height: props.sizeIcon ?? 15, width: props.sizeIcon ?? 15, },]} />
        }

        if (props.name2) {
            return <IconXC name={props.name2} size={props.sizeIcon ?? 15} color={props.color ?? colors.grey9} />
        }

        if (props.name) {
            return <Icon name={props.name} size={props.sizeIcon ?? 15} color={props.color ?? colors.grey9} />
        }
        return null;
    }

    /////////////////////////////////////////
    //////// IconText view//////////
    /////////////////////////////////////////
    return (
        <V
            {...props}
            style={[{ marginTop: 5 }, props.style, styles.rowCenter]}>
            {
                props.hideIcon ? null :
                    getIcon()
            }

            {
                nodeIsString(props.children)
                    ? <V style={[{
                        color: colors.grey9,
                        marginLeft: 3,
                    },]}
                        numberOfLines={props.line}
                    >{props.children}</V>
                    : props.children
            }

        </V>
    )


}///////////////IconText end//////////////////

const sty = StyleSheet.create({

})