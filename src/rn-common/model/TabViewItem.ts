import React from "react";
import { View } from "react-native";

export interface TabViewItem {
    key: string

    /**
     * tab标题
     */
    title: string;

    /**
     * 图标
     */
    iconNormal?: () => React.ReactNode;
    /**
     * 激活状态图标
     */
    iconActive?: () => React.ReactNode;

    /**
     * Tab主内容
     */
    view: () => any;

    cache?: any,

    onClick?: (index: number, view?: View) => void,

}
