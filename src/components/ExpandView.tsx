import React from 'react'
import { Platform, View, Text, StyleSheet, ViewProps, TouchableOpacity, Animated } from "react-native";
import { V } from '@common/lib/components/custom/V';
import { useInit, useObjState } from '@common/lib/hooks';
import { getHeaderColor, styles } from '@common/components/styles';
import { colors } from "@common/components/colors";
import { IconXC } from './IconXC';
import { app } from '@common/lib/app';
import { AnimDeg } from '@common/lib/Anim';


export interface ExpandGridItem {
    icon?: JSX.Element
    name: string
    onPress?: () => void
    isSelect?: boolean
    isMore?: boolean

}

interface ExpandGridProp extends ViewProps {
    list: Array<ExpandGridItem>
    maxShow?: number
    onExpand?: (expand: boolean) => any
}


class ExpandGridState {

    //是否展开
    expand = false;
    //截取显示部分
    moduleList1 = Array<ExpandGridItem>();

    animArrow = new AnimDeg();

}


/* 收起展开 */
export function ExpandGrid(prop: React.PropsWithChildren<ExpandGridProp>) {

    const st = useObjState(() => new ExpandGridState())

    const maxShow = prop.maxShow ?? 7;

    useInit(async () => {

        return async () => {

        }
    })

    st.moduleList1 = prop.list.slice(0, maxShow - 1);

    function getItem(it: ExpandGridItem, idx: number) {
        return (
            <V
                key={idx}
                style={[{
                    flexShrink: 1,
                    alignItems: "center",
                    padding: 5,
                },]}>
                <TouchableOpacity
                    style={[{

                        backgroundColor: colors.whiteTrans,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 360,
                        borderWidth: 1,
                        borderColor: it.isSelect ? colors.primary : colors.greyD,
                        alignItems: "center",
                    },]} onPress={it.onPress}>
                    {it.icon}
                    {it.name.length == 0 ? null : <V style={[{ color: it.isSelect ? colors.primary : colors.grey6, fontSize: 15 },]}
                        numberOfLines={3}
                    >{it.name}</V>}
                </TouchableOpacity>
            </V>
        )
    }


    /////////////////////////////////////////
    ////////return ExpandGrid/////////
    /////////////////////////////////////////
    return (
        <V style={[{ flexWrap: "wrap", }, styles.row, prop.style]}>
            {
                st.expand
                    ? prop.list.map((it, idx) => getItem(it, idx))
                    : st.moduleList1.map((it, idx) => getItem(it, idx))
            }
            {
                prop.list.length > maxShow
                    ? getItem({
                        icon: <Animated.View style={[st.animArrow.transform, { paddingHorizontal: 5 }]}>
                            <IconXC name="gengduo" size={20} color={colors.grey3} />
                        </Animated.View>,
                        name: '',
                        onPress: () => {
                            st.expand = !st.expand
                            st.animArrow.start(st.expand ? 180 : 0)
                            prop.onExpand?.(st.expand);
                            st.$update
                        },
                        isMore: true,
                    }, -1)
                    : null
            }
        </V>
    )

}

const sty = StyleSheet.create({

})