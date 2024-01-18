// const ReactNativePropRegistry: any = require('../../../../node_modules/react-native-web/dist/exports/StyleSheet/ReactNativePropRegistry').default
import { StyleSheet } from 'react-native';
import { fontScale } from './font';
// const StyleSheet: any = require('../../../../node_modules/react-native-web/dist/exports/StyleSheet/StyleSheet').default
// const normalizeValueWithProperty: any = require('../../../../node_modules/react-native-web/dist/exports/StyleSheet/normalizeValueWithProperty')
const idHasFontMap = new Map<number, number>();

let old = StyleSheet.create;
if (process.env.NODE_ENV == "development") {
    console.log("initReactHook")
}


export function stylesHasFont(id: number): number | undefined {
    return idHasFontMap.get(id);
}

//hook StyleSheet.create 处理字体等属性
StyleSheet.create = (sty: any) => {

    let keys = Array<{ prop: string, fontSize: number }>();

    for (let k in sty) {//调整字体大小,并加入idHasFont map
        let obj = sty[k];
        if (obj) {
            for (let prop in obj) {
                if (prop === "fontSize") {
                    let fontSize = fontScale(obj[prop])
                    obj[prop] = fontSize;
                    keys.push({ prop: k, fontSize: fontSize });
                }
            }
        }
    }

    let ret = old(sty);
    for (let k of keys) {
        let id = ret[k.prop];
        //rn web会将属性转换为id number
        if (typeof id === "number") {
            idHasFontMap.set(id, k.fontSize);
        }

    }
    return ret;
}


//hook样式创建,处理字体
export function initReactHook() {

    if (process.env.NODE_ENV == "development") {

        // let old = React.createElement
        // React.createElement = ((
        //     type: any,
        //     props?: any,
        //     ...children: any[]) => {

        //     if (props?.["bgHeight"])
        //         console.log(type, props, children);
        //     return old(type, props, ...children)
        // }) as any;
    }


}

