import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Platform, View } from "react-native";
import { colors } from "../../components/colors";
import { styles } from "../../components/styles";
import { useNavi } from "../navigation";
import { globalRouters, Router, TypeCompnent } from "../Router";
import { V } from "./custom/V";
import { ErrorCatch, ErrorCatchProps, hookClass } from "./ErrorCatch";
import { Icon } from "./icon/Icon";


function removLoadEffect() {
    window?.document?.getElementById("loadEffect")?.remove()
}


export function renderRouterView(props: ErrorCatchProps, view: any, setView: (v: any) => any) {
    let para = props.para;
    return <View
        // onLayout={(e) => onLayout.current(e)}
        style={[
            styles.full,
            {
                backgroundColor: colors.background,
            }]}>
        {view ? view : (para
            ? createByParas(Router.getRouteName(para.view), para.view, para.paras, props.navi, setView)
            : getDefaultScreen(props.navi, setView))}
    </View>
}



function getDefaultScreen(navi: NavigationProp<ParamListBase>, setView: (v: any) => any) {

    if (globalRouters == null) {
        return null;
    }

    if (Platform.OS === "web") {
        //获取screen参数对应的界面
        let paras = Router.getUrlPara();
        if (paras) {
            return createByParas(paras.screen || globalRouters.defaultName, undefined, paras.para, navi, setView);
        }
    }


    if (globalRouters.defaut) {
        let paras = globalRouters.defaut.paras?.();
        if (!paras) {
            paras = {}
        }
        return createByParas(globalRouters.defaultName, undefined, paras, navi, setView);
    }

    return null
}


function createByParas(
    screen: string,
    view: (TypeCompnent<any> | Promise<TypeCompnent<any>>) | undefined | string,
    paras: any,
    navi: NavigationProp<ParamListBase>,
    setView: (v: any) => void
) {
    if (globalRouters == null) {
        console.log("未找到路由配置");
        return null;
    }

    //从全局路由表中查找
    let route = globalRouters.maps[screen];

    if (route && !route.disableIntercept) {
        //路由拦截
        let preComp = globalRouters.preRoute({
            name: screen,
            paras: paras,
            default: route.default,
        })
        if (preComp) {
            hookClass(preComp[0], { navi: navi }, preComp[1])

            removLoadEffect();
            return React.createElement(preComp[0], preComp[1]);
        }

    }

    if (!view || typeof view === "string") {
        if (!route) {
            removLoadEffect();

            return <V style={[{
                alignSelf: "center",
                marginTop: "30%",
            }, styles.columnCenter]}>
                <Icon name="error" size={60} color={colors.primary} />
                <V style={[{ marginTop: 10, fontSize: 18 },]}>没有找到页面</V>
            </V>;
        }
        view = route.component();
    }


    if (view instanceof Promise) {
        //异步路由
        view.then(vi => {

            hookClass(vi, { navi: navi }, paras)
            removLoadEffect();
            setView(React.createElement(vi, paras))

        }).catch(err => {

            setView(<V style={[{
                alignSelf: "center",
                marginTop: "30%",
            }, styles.columnCenter]}>
                <Icon name="error" size={60} color={colors.red} />
                <V style={[{ marginTop: 10, fontSize: 18 },]}>页面加载失败!</V>
            </V>)

        })
        return null
    } else {
        //同步路由
        hookClass(view, { navi: navi }, paras)
        removLoadEffect();
        if (view == null)
            return null;
        return React.createElement(view, paras)
    }
}


function DevView(prop: ErrorCatchProps) {

    let [view, setView] = useState<any>(null);

    return renderRouterView(prop, view, setView);
}

export function RouterView() {
    const [para] = useNavi<'RouterView'>();
    const navigation = useNavigation();
    // let catchRef = React.useRef(null as unknown as ErrorCatch);
    // useFocusEffect(
    //     React.useCallback(() => {

    //         if (catchRef.current) {
    //             catchRef.current.focus = true;
    //         }
    //         return () => {

    //             catchRef.current.focus = false;
    //         };
    //     }, [])
    // );
    if (process.env.NODE_ENV == "development") {

        return <DevView
            para={para}
            navi={navigation}
        />
    }


    return (
        <ErrorCatch
            // focus={focus}
            // ref={ref => {
            //     if (ref)
            //         catchRef.current = ref;
            // }}
            para={para}
            navi={navigation}
        />
    )
}