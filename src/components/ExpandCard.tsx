import React from 'react'
import { Platform, View, Text, StyleSheet, ViewProps, Pressable, Animated } from "react-native";
import { V } from '@common/lib/components/custom/V';
import { useInit, useObjState } from '@common/lib/hooks';
import { styles } from '@common/components/styles';
import { colors } from "@common/components/colors";
import { Icon } from '@common/lib/components/icon/Icon';
import { AnimDeg } from '@common/lib/Anim';


interface ExpandCardProp extends ViewProps {


    //不显示边框
    noBorder?: boolean
    /**
    * 标题
    */
    title?: (expand: ExpandCardState) => JSX.Element

    //显示标题下划线
    titleLine?: boolean;

    //初始化展开状态
    isExpand?: boolean;

    /**
     * 整体触摸事件
     */
    allTouch?: boolean;

    /**
     * 展开内容
     */
    expand?: (expand: ExpandCardState) => JSX.Element | JSX.Element[]

}


export class ExpandCardState {


    /**
     * 是否点击过(点击后不再初始化isExpand)
     */
    hasClick = false;

    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: ExpandCardProp,
    ) {
    }

    isExpand = this.prop_.isExpand ?? false
    animArrow = new AnimDeg(this.isExpand ? 180 : 0);

    onExpand() {
        this.hasClick = true;
        this.isExpand = !this.isExpand;
        this.animArrow.start(this.isExpand ? 180 : 0)
        this.$update
    }

}///////////////ExpandCardState end///////////////////



/**
 * 
 * @param prop 
 * @returns 
 */
export function ExpandCard(prop: ExpandCardProp) {

    //组件状态
    const st = useObjState(() => new ExpandCardState(prop), prop)

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })


    if (!st.hasClick && prop.isExpand != st.isExpand) {
        st.isExpand = !!prop.isExpand;
    }


    if (prop.allTouch) {
        return <Pressable
            onPress={() => st.onExpand()}
            style={[{
                backgroundColor: colors.white,
                padding: 12,
            }, prop.noBorder ? null : styles.roundBackShadow, prop.style]}

        >
            <V
                style={[{}, styles.rowCenter]}>
                {prop.title?.(st)}
                <Animated.View style={[{ marginLeft: 10 }, st.animArrow.transform]}>
                    <Icon name="expand_more" size={19} />
                </Animated.View>
            </V>

            {prop.titleLine ? <View
                style={[{
                    width: "100%",
                    marginVertical: 10,
                }, styles.lineRow]} /> : null}

            {st.isExpand ? prop.expand?.(st) : null}
        </Pressable>
    }


    /////////////////////////////////////////
    //////// ExpandCard view//////////
    /////////////////////////////////////////
    return (
        <V
            style={[{
                backgroundColor: colors.white,
                padding: 12,
            }, prop.noBorder ? null : styles.roundBackShadow, prop.style]}

        >
            <Pressable
                onPress={() => st.onExpand()}
                style={[{}, styles.rowCenter]}>
                {prop.title?.(st)}
                <Animated.View style={[{ marginLeft: 10 }, st.animArrow.transform]}>
                    <Icon name="expand_more" size={19} />
                </Animated.View>
            </Pressable>

            {prop.titleLine ? <View
                style={[{
                    width: "100%",
                    marginVertical: 10,
                }, styles.lineRow]} /> : null}

            {st.isExpand ? prop.expand?.(st) : null}
        </V>
    )


}///////////////ExpandCard end//////////////////

const styl = StyleSheet.create({

})