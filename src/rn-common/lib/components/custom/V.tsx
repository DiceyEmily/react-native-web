import React, { ReactNode } from 'react';
import { StyleProp, Text, TextProps, TextStyle, View, ViewProps } from 'react-native';
import { fontScale, globalFont } from '../font';

export interface vProp extends ViewProps {
}



/**
 * 用于替代div或View或Text
 * 默认以flex column布局
 * 默认主轴justify-content: flex-start 
 * 默认次轴align-items: stretch
 * 默认字体大小：14
 * numberOfLines配padding web端显示有bug, 改为margin ok
 */
export function V(props: React.PropsWithChildren<vProp | TextProps>) {
    return nodeIsString(props.children) ?
        <Text
            {...props}
            style={[props.style, { fontSize: getFontSize(props.style as TextStyle) }]}>{props.children}</Text>
        : <View  {...props}>{props.children}</View>
}
// export class V extends PureComponent<vProp & TextProps> {
//     render() {
//         return nodeIsString(this.props.children) ?
//             <Text
//                 {...this.props}
//                 style={[this.props.style, { fontSize: getFontSize(this.props.style as TextStyle) }]}>{this.props.children}</Text>
//             : <View  {...this.props}>{this.props.children}</View>
//     }
// }

export function isBaseType(node: any) {
    return typeof node === "string" || typeof node === "number" || typeof node === "boolean"
}

export function nodeIsString(node: ReactNode) {
    if (isBaseType(node)) {
        return true;
    } else if (node instanceof Array) {
        if (node.length == 1 && (isBaseType(node[0]))) {
            return true;
        }
        if (node.length > 1 && (isBaseType(node[0]) || isBaseType(node[node.length - 1]))) {
            return true;
        }
        return false;
    } else {
        return false;
    }
}


export function getViewProperty(style: StyleProp<TextStyle>, prop: keyof TextStyle): any {
    if ((style as any)?.[prop] != null) {
        return (style as any)?.[prop]
    }
    else if (style instanceof Array) {
        for (let i = 0; i < style.length; i++) {
            let s = style[i];
            let ret = getViewProperty(s as any, prop);
            if (ret != null) {
                return ret;
            }
        }
    }
    return undefined
}

export function getFontSize(style: TextStyle | null | undefined) {
    if (style?.fontSize != null) {
        return fontScale(style.fontSize)
    }
    else if (style instanceof Array) {

        for (let i = 0; i < style.length; i++) {
            let s = style[i];
            if (s?.fontSize != null) {
                return fontScale(s.fontSize)
            }
        }
    }

    return globalFont.size * globalFont.scale
}


// export function V(props: React.PropsWithChildren<TextProps>) {
//     return isString(props.children) ?
//         <Text {...props} style={[props.style, { fontSize: getFontSize(props.style as TextStyle) }]}>{props.children}</Text>
//         : <View  {...props}>{props.children}</View>
// }


