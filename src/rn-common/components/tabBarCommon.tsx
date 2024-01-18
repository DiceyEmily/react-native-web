import { colors } from '@common/components/colors';
import { V } from "@common/lib/components/custom/V";
import TabBar from '@common/lib/components/tabview/TabBar';
import { NavigationState, Route, Scene, SceneRendererProps } from '@common/lib/components/tabview/types';
import React from 'react';
import { ViewStyle } from "react-native";

/**
 * 公用 tabView bar,默认主色背景, 白色字体
 * @returns 
 */
export function tabBarCommon<T extends Route>(
    paras: {
        //游标样式
        indicatorStyle?: ViewStyle,

        style?: ViewStyle,

        //使用透明背景, 主色字体, 主色游标
        light?: boolean,

        /**
         * 渲染额外label
         */
        renderLabel?: (scene: Scene<T> & {
            focused: boolean;
            color: string;
        }) => React.ReactNode,

        overrideLabel?: (scene: Scene<T> & {
            focused: boolean;
            color: string;
        }) => React.ReactNode,

        scrollEnabled?: boolean,

        /**
         * tabBar外层warp
         */
        tabWarp?: (v: JSX.Element) => JSX.Element,

        titleNum?: (scene: Scene<T> & {
            focused: boolean;
            color: string;
        }) => any,

        onTabPress?: (scene: TabBar<T> | null) => void,
    }
) {
    return (dats: SceneRendererProps & {
        navigationState: NavigationState<T>;
    }) => {

        // let routes = dats.navigationState.routes;
        let vi: TabBar<T> | null
        let tab = <TabBar
            {...dats}
            scrollEnabled={paras.scrollEnabled}
            pressColor={colors.lineGrey}
            // activeColor={colors.white}
            // inactiveColor={colors.white}
            indicatorStyle={{
                backgroundColor: paras.light ? colors.primary : colors.white,
                height: 3,
                borderRadius: 2,
                ...paras.indicatorStyle,
            }}
            ref={ref => { vi = ref }}
            tabStyle={{
                paddingHorizontal: 0,
                paddingVertical: 5,
            }}
            onTabPress={dat => {
                if (vi != null)
                    paras.onTabPress?.(vi)
            }}
            renderLabel={(dat) => {
                return paras.overrideLabel ? paras.overrideLabel(dat)
                    :
                    <V style={[{
                        paddingHorizontal: 5,
                        // backgroundColor: colors.white,
                        flex: 1, textAlign: "center",
                        justifyContent: "center",
                    }]}>
                        {paras.renderLabel?.(dat)}
                        <V
                            style={[{
                                color: paras.light
                                    ? (dat.focused ? colors.primary : colors.greyText)
                                    : (dat.focused ? colors.white : colors.TabTrans),
                                fontSize: 14,
                            }]}
                        >
                            {dat.route.title + (paras.titleNum && paras.titleNum?.(dat) ? ' ' + paras.titleNum?.(dat) : '')}
                        </V>
                    </V>
            }}
            style={[

                paras.light ?
                    {
                        backgroundColor: colors.transparent,
                        shadowOffset: { width: 0, height: 0 },
                        shadowRadius: 0,
                        paddingHorizontal: 0,
                        elevation: 0,
                    }
                    : {
                        backgroundColor: colors.primary,
                        paddingHorizontal: 0,
                    }
                ,
                {
                    ...paras.style,
                }
            ]}
        />
        if (paras.tabWarp) {
            return paras.tabWarp(tab)
        }

        return tab;
    }
}