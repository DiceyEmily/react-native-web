import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React, { Component } from "react";
import { colors } from "../../components/colors";
import { styles } from "../../components/styles";
import { MsgError } from "../lib";
import { RouterViewPara } from "../navigation";
import { V } from "./custom/V";
import { Icon } from "./icon/Icon";
import { renderRouterView } from "./RouterView";


export interface ErrorCatchProps {
    navi: NavigationProp<ParamListBase>,
    para?: RouterViewPara,
    // focus: boolean,
}


export class HookCompnent extends Component<{ _naviga__: NavigationProp<ParamListBase>; }> {


    static navKey = "_naviga__"

    componentDidMountOld() {

    }
    componentWillUnmountOld() {

    }

    focusFunc__() {

    }

    blurFunc__() {

    }
}



export class ErrorCatchState {
    view?: any;
}


export class ErrorCatch extends Component<ErrorCatchProps, ErrorCatchState>{

    state = new ErrorCatchState();

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        let msg = "界面异常";
        if (error instanceof MsgError) {
            msg += ":" + error.message;
        }
        this.setView(
            <V style={[{
                alignSelf: "center",
                marginTop: "30%",
            }, styles.columnCenter]}>
                <Icon name="error" size={60} color={colors.red} />
                <V style={[{ marginTop: 10, fontSize: 18 },]}>{msg}</V>
            </V>)
    }

    componentDidMount() {
        // console.log("mount", this.props.para)
        // Orientation.addOrientationListener(this.onOrientationDidChange);
    }

    componentWillUnmount() {
        // console.log("Unmount", this.props.para)
        // Orientation.removeOrientationListener(this.onOrientationDidChange)
    }


    focus = true;


    onOrientationDidChange = (orientation: string) => {
        console.log("_orientationDidChange:", orientation)
    }

    setView = (v: any) => {
        this.setState({
            view: v,
        })
    }


    render() {
        return renderRouterView(this.props, this.state.view, this.setView);
    }

}


export function hookClass(com: any, prop: { navi: NavigationProp<ParamListBase> }, para: any) {

    /**
     * 自动添加navigation props
     */
    if (para[HookCompnent.navKey]) {
        console.log(prop.navi, " \r\n ", para[HookCompnent.navKey])
    } else
        para[HookCompnent.navKey] = prop.navi;

}