import React from 'react';
import { View, ViewProps } from "react-native";
import xss from 'xss';


interface HtmlViewProp extends ViewProps {
    html: string;
}



/**
 * 
 * @param prop 
 * @returns 
 */
export function HtmlView(prop: HtmlViewProp) {

    //组件状态
    // const st = useObjState(() => new HtmlViewState(prop), prop)

    // //组件初始化
    // useInit(async () => {


    //     return async () => { //组件卸载

    //     }
    // })



    function onInit(div: HTMLDivElement) {
        div.innerHTML = xss(prop.html)
    }

    /////////////////////////////////////////
    //////// HtmlView view//////////
    /////////////////////////////////////////
    return (
        <View
            {...prop}
            ref={(ref: any) => {
                if (ref)
                    onInit(ref)
            }}
        />
    )


}///////////////HtmlView end//////////////////

// const styl = StyleSheet.create({

// })