import React from 'react';
import { useState } from 'react';
import { View, ViewProps } from 'react-native';
import RenderHtml from 'react-native-render-html';
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
    const [w, setW] = useState(0);

    // //组件初始化
    // useInit(async () => {


    //     return async () => { //组件卸载

    //     }
    // })


    /////////////////////////////////////////
    //////// HtmlView view//////////
    /////////////////////////////////////////
    return (
        <View {...prop} onLayout={res => {
            setW(res.nativeEvent.layout.width)
        }}>
            <RenderHtml
                contentWidth={w > 0 ? w : undefined}
                source={{ html: prop.html }}
            />
        </View>

    )


}///////////////HtmlView end//////////////////

// const styl = StyleSheet.create({

// })