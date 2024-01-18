import { styles } from '@common/components/styles';
import { colors } from "@common/components/colors";
import { V } from '@common/lib/components/custom/V';
import { useInit, useObjState } from '@common/lib/hooks';
import { lib } from '@common/lib/lib';
import React from 'react';
import { IconXC } from '@src/components/IconXC';
import { Pressable } from 'react-native';
import { XiaoXiListData } from '@src/model/msg/XiaoXiListData';

interface XiaoXiItemProp {
    dat: XiaoXiListData,
    onPress: () => void,
    //列表类型
    listType?: string,
    refreshList?: (id: string) => void,
}


export class XiaoXiItemState {

    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: XiaoXiItemProp,
    ) {

    }


}



/**
 * 消息item
 * @param prop 
 * @returns 
 */
export function XiaoXiItem(prop: XiaoXiItemProp) {
    const st = useObjState(() => new XiaoXiItemState(prop), prop)

    function onPress() {
        prop.onPress();
    }

    useInit(async () => {

        return async () => { //组件卸载

        }
    })

    return (
        <V style={[{ flex: 1, },]}>
            <Pressable onPress={onPress} style={[{ padding: 8, paddingVertical: 12 }, styles.rowCenter]}>
                <V>
                    <IconXC name="tupian" size={50} color={colors.charts[lib.randomInt(4)]}
                        style={[{ marginLeft: 12, marginRight: 8, borderRadius: 2, },]} />

                    {prop.dat.num == 0 ? null : <V style={
                        [{
                            borderRadius: 15, backgroundColor: colors.red, color: colors.white, fontSize: 9, paddingHorizontal: 4,
                            position: 'absolute', top: 0, right: 5,
                        },]
                    }>{prop.dat.num}</V>}
                </V>

                <V style={[{ marginRight: 12, flex: 1 },]}>
                    <V style={[{}, styles.rowCenter]}>
                        <V numberOfLines={1} style={[{
                            color: colors.textMain, fontSize: 15, fontWeight: 'bold'
                        },]} >{prop.dat.typeName}</V>
                        <V style={[{ flex: 1, },]}></V>
                        <V numberOfLines={1} style={[{
                            color: colors.grey9, marginLeft: 8, fontSize: 12
                        },]}>{lib.dateToY_M_D(prop.dat.time)}</V>
                    </V>
                    <V numberOfLines={1} style={{
                        color: colors.grey9, marginTop: 2, fontSize: 13
                    }}>{prop.dat.content}</V>
                </V>
            </Pressable>

            <V style={[{ flex: 1, height: 1, marginLeft: 78, marginRight: 20, backgroundColor: colors.greyLight },]}></V>
        </V>
    )
}
