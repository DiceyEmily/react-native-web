import React, { useState } from 'react';
import { getHeaderColor, styles } from "@common/components/styles";
import { V } from "@common/lib/components/custom/V";
import { Animated, Pressable } from "react-native";
import { app } from '@common/lib/app';
import { lib } from '@common/lib/lib';
import { NavigationState, Route, Scene, SceneRendererProps } from '@common/lib/components/tabview/types';
import TabBar from '@common/lib/components/tabview/TabBar';
import { IconXC } from './IconXC';
import { colors } from '@common/components/colors';

/**
 * 公用 tabView bar ,透明背景, 白色字体
 * @param renderLabelFunc  额外的lable内容
 * @returns 
 */
export function commonTabBar<T extends Route>(
    renderLabelFunc?: (scene: Scene<T> & {
        focused: boolean;
        color: string;
    }) => React.ReactNode,
    scrollEnabled?: boolean,
    titleNum?: (scene: Scene<T> & {
        focused: boolean;
        color: string;
    }) => number,
    onTabPress?: (scene: TabBar<T> | null) => void,
) {
    return (dats: SceneRendererProps & {
        navigationState: NavigationState<T>;
    }) => {

        // let routes = dats.navigationState.routes;
        let vi: TabBar<T> | null

        return <TabBar
            {...dats}
            scrollEnabled={scrollEnabled}
            pressColor={colors.lineGrey}
            activeColor={colors.white}
            inactiveColor={colors.white}
            indicatorStyle={{
                backgroundColor: colors.white,
                borderWidth: 0,

            }}
            ref={ref => { vi = ref }}
            tabStyle={{
                paddingHorizontal: 0,
                paddingVertical: 5,
            }}
            onTabPress={dat => {
                if (app.isWeb) {
                    // let indexFind = routes.findIndex(res => res.key == dat.route.key)
                    // setIndex(indexFind);
                }
                if (vi != null && 'more' == dat.route.key)
                    onTabPress?.(vi)
            }}
            renderLabel={(dat) => <V style={[{
                paddingHorizontal: 5,
                // backgroundColor: colors.white,
                flex: 1,
            }]}>
                {renderLabelFunc?.(dat)}
                <V
                    style={[{
                        color: dat.focused ? colors.white : colors.TabTrans,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        paddingTop: renderLabelFunc ? 0 : 10,
                        fontSize: 14,
                    }]}
                >
                    {dat.route.title + (titleNum && titleNum?.(dat) > 0 ? ' ' + titleNum?.(dat) : '')}
                </V>

                <IconXC name="tab_xuanzhong" size={14} color={dat.focused ? colors.white : colors.transparent}
                    style={{
                        textAlign: 'center',
                    }}
                />
            </V>}
            style={[{ backgroundColor: getHeaderColor(), paddingHorizontal: 1, elevation: 0, }]}
            renderIndicator={dats => null}
        />
    }
}


/**
 * 公用 tabView bar ,透明背景, 黑色字体
 * @param renderLabelFunc  额外的lable内容
 * @returns 
 */
export function commonTabLight<T extends Route>(
    renderLabelFunc?: (scene: Scene<T> & {
        focused: boolean;
        color: string;
    }) => React.ReactNode,
    scrollEnabled?: boolean
) {
    return (dats: SceneRendererProps & {
        navigationState: NavigationState<T>;
    }) => {

        // let routes = dats.navigationState.routes;

        return <TabBar
            {...dats}
            scrollEnabled={scrollEnabled}
            pressColor={colors.lineGrey}
            activeColor={colors.white}
            inactiveColor={colors.white}
            indicatorStyle={{
                backgroundColor: colors.white,
                borderWidth: 0,
            }}
            tabStyle={{
                paddingHorizontal: 0,
                paddingVertical: 0,
                marginTop: 10,
                minHeight: 0,
            }}
            onTabPress={dat => {
                if (app.isWeb) {
                    // let indexFind = routes.findIndex(res => res.key == dat.route.key)
                    // setIndex(indexFind);
                }
            }}
            renderLabel={(dat) =>
                <V style={[{
                    paddingHorizontal: 5,
                    // backgroundColor: colors.white,
                    flex: 1,
                }]}>
                    {renderLabelFunc?.(dat)}
                    <V
                        style={[{
                            color: dat.focused ? colors.primary : colors.TabBlackTrans,
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            fontSize: 14,
                        }]}
                    >
                        {dat.route.title}
                    </V>

                    <IconXC name="tab_xuanzhong" size={14} color={dat.focused ? colors.primary : colors.transparent}
                        style={{
                            textAlign: 'center',
                        }}
                    />
                </V>
            }
            style={[{
                backgroundColor: colors.transparent,
                paddingHorizontal: 1, elevation: 0,
                shadowOpacity: 0,
            }, styles.borderBottomLine]}
            renderIndicator={dats => null}
        />
    }
}

/**
 * 公用 自定义 tabView bar 外层
 * @returns 
 */
export function tabCustom<T extends Route>(tabFunc: (v: JSX.Element) => JSX.Element) {
    return (dats: SceneRendererProps & {
        navigationState: NavigationState<T>;
    }) => {

        let routes = dats.navigationState.routes;


        let tab = <TabBar
            {...dats}
            pressColor={colors.lineGrey}
            activeColor={colors.white}
            inactiveColor={colors.white}
            indicatorStyle={{
                backgroundColor: colors.white,
                borderWidth: 0,
            }}
            tabStyle={{
                paddingHorizontal: 0,
                paddingVertical: 3,
                marginTop: 10,
                minHeight: 0,
            }}
            renderLabel={(dat) =>
                <V style={[{
                    paddingHorizontal: 5,
                    // backgroundColor: colors.white,
                    flex: 1,
                }]}>
                    <V
                        style={[{
                            color: dat.focused ? colors.primary : colors.TabBlackTrans,
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            fontSize: 14,
                        }]}
                    >
                        {dat.route.title}
                    </V>

                    <IconXC name="tab_xuanzhong" size={14} color={dat.focused ? colors.primary : colors.transparent}
                        style={{
                            textAlign: 'center',
                        }}
                    />
                </V>
            }
            style={[{
                flex: 1,
                backgroundColor: colors.transparent,
                paddingHorizontal: 1, elevation: 0,
                shadowOpacity: 0,
            },]}
            renderIndicator={dats => null}
        />


        return tabFunc(tab)
    }
}

/**
 * 公用 tabView bar ,白色圆形背景, 黑色字体
 * @param renderLabelFunc  额外的lable内容
 * @returns 
 */
export function commonTabBarRound<T extends Route>(
    renderLabelFunc?: (scene: Scene<T> & {
        focused: boolean;
        color: string;
    }) => React.ReactNode
) {
    return (dats: SceneRendererProps & {
        navigationState: NavigationState<T>;
    }) => {

        let routes = dats.navigationState.routes;
        let route = dats.navigationState.routes[dats.navigationState.index]!;

        if (!route) {
            return null;
        }

        return <TabBar
            {...dats}

            pressColor={colors.lineGrey}
            activeColor={colors.textMain}
            inactiveColor={colors.grey9}
            renderIndicator={() => null}
            tabStyle={{
                paddingHorizontal: 0,
                paddingVertical: 0,
                minHeight: 0,
            }}

            renderTabBarItem={(dat) => {
                let focused = dat.key == route.key;
                return <Pressable
                    key={lib.getUniqueId16()}
                    onPress={() => {
                        dat.onPress();
                    }}
                    style={[{
                        margin: 3,
                        padding: 3,
                        flex: 1,
                    }, focused ? styles.round360BackShadow : null]}>
                    <V
                        style={[{
                            color: focused ? colors.textMain : colors.grey9,
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            fontSize: 14,
                        }]}
                    >{dat.route.title}</V>
                </Pressable>
            }
            }


            style={[{
                borderRadius: 360,
                backgroundColor: colors.greyLight,
                shadowOffset: { width: 0, height: 0 },
                borderWidth: 0, elevation: 0,
            },]}
        // renderIndicator={dats => <IconXC name="tab_xuanzhong" size={15} color={colors.white} />}
        />
    }
}


// export function tabIndicater(routes: Route[]) {
//     return (props: Props<any>) => {
//         const backgroundColor = colors.white
//         const width = 40;
//         const left = (props.getTabWidth(0) - width) / 2;
//         return (
//             <Animated.View
//                 style={[
//                     {
//                         position: 'absolute',
//                         bottom: 0,
//                         width: width,
//                         height: 3,
//                         left: left,
//                         borderRadius: 3,
//                         backgroundColor,
//                         transform: [{
//                             translateX: getTranslateX(props.position, routes, props.getTabWidth)
//                         }]
//                     } as any,
//                 ]}
//             />
//         );
//     }
// }



// /**
//   *  tabBar下划线滑动动画
//   * @param position 
//   * @param routes 
//   * @param getTabWidth 
//   */
// function getTranslateX(
//     position: Animated.AnimatedInterpolation,
//     routes: Route[],
//     getTabWidth: any
// ) {
//     const inputRange = routes.map((_, i) => i);

//     // every index contains widths at all previous indices
//     const outputRange = routes.reduce<number[]>((acc, _, i) => {
//         if (i === 0) return [0];
//         return [...acc, acc[i - 1] + getTabWidth(i - 1)];
//     }, []);

//     const transalteX = Animated.interpolate(position, {
//         inputRange,
//         outputRange,
//         extrapolate: Animated.Extrapolate.CLAMP,
//     });

//     return transalteX;
// }