import React, { useState } from "react";
import { View } from "react-native";
import { colors } from "../rn-common/components/colors";
import { app } from "../rn-common/lib/app";
import { DialogList, DialogListItem } from "../rn-common/lib/components/custom/DialogList";
import { Icon } from "../rn-common/lib/components/icon/Icon";
import { V } from "../rn-common/lib/components/custom/V";
import { NavigationCfg } from "@common/lib/navigation";
import { ObjStateType, useInit, useObjState } from "@common/lib/hooks";
import { useFocusEffect } from "@react-navigation/native";
import { SearchView } from "@common/lib/components/SearchView";

interface HeaderProps<T> {
    title?: string;
    disableBack?: boolean;
    goBack?: { click?: (v: View) => void, }
    //搜索框
    searchView?: { click?: (t: string) => void, state?: ObjStateType<T> }
    search?: { click?: (t: string) => void, v?: JSX.Element, state?: ObjStateType<T> }
    morelist?: { click?: (v?: View) => void, v?: JSX.Element, iconName?: string, name?: string, }[]
}


export class HeaderState<T> {


    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: HeaderProps<T>,
    ) {

        if (this.prop_.title) {
            NavigationCfg.title = this.prop_.title
        }
    }

    marginLeft = 0
    search?: JSX.Element
    searchView?: JSX.Element
    backView?: JSX.Element
    morelistView?: JSX.Element[]
    //右边更多展示个数
    moreNum = 3
}


//图片大小配置
export const iconPadV = 3;
export const iconWh = 25;
export const headerPaddingRight = 15;


/**
 * 公用顶部状态栏
 * @returns 
 */
export function HeaderBar<T>(prop: HeaderProps<T>) {


    const st = useObjState(() => new HeaderState(prop), prop)

    useFocusEffect(() => {
        if (prop.title) {
            NavigationCfg.setTitle(prop.title)
        }

    })


    useInit(async () => {

        /* 搜索按钮 */
        st.search = (prop.search && prop.search.click) ?
            prop.search.v ? prop.search.v : <Icon name="search" size={iconWh} color={colors.white} style={{
                paddingVertical: iconPadV,
                paddingRight: headerPaddingRight
            }} onPress={(ev) => {
                prop.search?.click?.('')
            }} /> : undefined

        if (st.search) {
            st.marginLeft += iconWh + headerPaddingRight
            st.moreNum -= 1
        }

        //iconName如"paixu"排序；"share"分享；"more_vert"更多；"refresh"刷新
        st.morelistView = []
        prop.morelist?.forEach((va, ind) => {
            if (ind < st.moreNum) {
                st.marginLeft += iconWh + headerPaddingRight
            }
            if (!va.v) {
                st.morelistView?.push(<Icon name={(va.iconName ?? '') as any} size={iconWh} color={colors.white} style={{
                    paddingVertical: iconPadV,
                    paddingRight: headerPaddingRight
                }} onPress={async (ev) => {
                    va?.click?.(ev.currentTarget as unknown as View)
                }} />)
            } else {
                st.morelistView?.push(va.v)
            }
        })
        if (st.morelistView.length > st.moreNum) {
            //超过moreNum个,只展示moreNum个,用更多图标替换
            let lastList = prop.morelist?.slice(st.moreNum - 1)
            st.morelistView?.add(st.moreNum - 1, <Icon name={"more_vert"} size={iconWh} color={colors.white} style={{
                paddingVertical: iconPadV,
                paddingRight: headerPaddingRight
            }} onPress={async (ev) => {
                let res: Array<DialogListItem> = lastList?.map(va => {
                    return {
                        key: (va.name ?? va.iconName) ?? '',
                        icon: () => va.v ?? <Icon name={(va.iconName ?? '') as any} color={colors.primary} size={iconWh} />,
                        onClick: (dat, ind) => {
                            va.click?.(ev.currentTarget as unknown as View)
                        }
                    }
                }) ?? []
                await DialogList.show(
                    res, {
                    disableDim: true,
                    posView: ev.currentTarget as unknown as View,
                    position: () => ({
                        x: -90,
                        y: 45,
                    })
                });
            }} />)
        }

        /* 搜索框 */
        st.searchView = (prop.searchView && prop.searchView.click) ?
            <SearchView
                state={prop.searchView?.state}
                numberOfLines={1}
                style={{ flex: 1, marginRight: headerPaddingRight, marginLeft: prop.disableBack ? headerPaddingRight : 0, }}
                placeholder="输入关键词" onSearch={(t) => {
                    prop.searchView?.click?.(t)
                }} /> : undefined

        if (st.searchView) {
            st.marginLeft = prop.disableBack ? 0 : headerPaddingRight
        }

        //返回标题
        st.backView = <V style={{ flexDirection: 'row', flex: st.searchView ? undefined : 1, marginLeft: headerPaddingRight, marginRight: st.marginLeft == 0 && !prop.disableBack ? headerPaddingRight : 0 }}>
            {prop.disableBack ? null : <Icon name="arrow_back_ios" size={iconWh} color={colors.white} style={{ paddingVertical: 10, }}
                onPress={(ev) => {
                    if (!prop.goBack?.click) {
                        app.pop()
                    } else {
                        prop.goBack?.click?.(ev.currentTarget as unknown as View)
                    }
                }}
            />}

            {(prop.title && prop.title.trim().length > 0) ?
                <V
                    numberOfLines={1}
                    style={{
                        marginLeft: prop.disableBack ? st.marginLeft : st.marginLeft - iconWh,
                        flex: st.searchView ? undefined : 1,
                        alignSelf: "center",
                        textAlign: st.searchView ? 'auto' : 'center',
                        fontSize: 18,
                        color: colors.white,
                    }}>{prop.title}
                </V>
                : null}
        </V >

        st.$update

        return async () => {

        }
    })

    if (app.isWeb) {

        return null;
    }


    return (
        <View
            style={[{
                backgroundColor: colors.backgroundImg ? colors.transparent : colors.primary,
                height: 50,
                flexDirection: "row",
                alignItems: "center",
            },
            ]}>
            {st.backView}
            {/* 搜索框 */}
            {st.searchView}

            <V style={{
                paddingLeft: headerPaddingRight, backgroundColor: '#dddddd11',
                borderTopLeftRadius: 30, borderBottomLeftRadius: 30, flexDirection: 'row',
                alignItems: 'center',
            }}>
                {st.search}
                {st.morelistView?.map((v, ind) => {
                    return ind > st.moreNum - 1 ? null : v
                })}
            </V>

        </View >
    )
}

