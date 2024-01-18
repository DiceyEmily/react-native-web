import { styles } from '@common/components/styles';
import { colors } from "@common/components/colors";
import { app } from '@common/lib/app';
import { PressView } from '@common/lib/components/custom/PressView';
import { V } from '@common/lib/components/custom/V';
import { useInit, useObjState } from '@common/lib/hooks';
import React from 'react';
import { StyleSheet } from "react-native";
import { HelpFbContent } from '@src/model/helpFb/HelpFbList';


interface HelpFbItemProp {
    dat: HelpFbContent,
    idx: number,
    onPress: () => void
    edit?: boolean
    onBack?: (del?: boolean) => void
}


export class HelpFbItemState {


    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: HelpFbItemProp,
    ) {

    }




}



/**
 * 反馈的问题item
 * @param prop 
 * @returns 
 */
export function HelpFbItem(prop: HelpFbItemProp) {

    //组件状态
    const st = useObjState(() => new HelpFbItemState(prop), prop)

    //组件初始化
    useInit(async () => {

        return async () => { //组件卸载

        }
    })


    return (
        <PressView
            onPress={prop.onPress}
            style={[{
                marginTop: 12,
                marginHorizontal: 12,
                padding: 12,
                backgroundColor: colors.white,
            }, styles.roundShadow]}>

            <V style={[{ padding: 4, paddingTop: 0 },]}>

                <V numberOfLines={2} style={{
                    color: colors.textMain,
                    fontSize: 16,
                }}>{prop.dat.title}</V>

                <V style={{ flex: 1, flexDirection: 'row' }}>
                    {prop.edit ? <V numberOfLines={2} style={{
                        color: colors.primary,
                        fontSize: 14, marginTop: 5,
                    }}
                        onPress={() => {
                            prop.onBack?.(true)
                        }}
                    >{'撤销'}</V> : null}

                    <V numberOfLines={2} style={{
                        color: colors.grey9,
                        fontSize: 14, marginTop: 5,
                        flex: 1, textAlign: 'right'
                    }}>{prop.dat.createdDate}</V>
                </V>
            </V>
        </PressView>
    )


}

const sty = StyleSheet.create({

})