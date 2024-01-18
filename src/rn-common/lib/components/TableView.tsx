import { V, getViewProperty } from '@common/lib/components/custom/V';
import React from 'react';
import { View, GestureResponderEvent, Pressable, StyleProp, StyleSheet, TextStyle, ViewProps } from "react-native";
import { app } from '../app';


interface itemType {
    text: string | JSX.Element,
    //横向扩展单元格数量
    row?: number,
    onPress?: (ev: GestureResponderEvent) => void

    /**
     * 单元样式
     */
    style?: StyleProp<TextStyle>,
}

interface TableViewProp extends ViewProps {
    children?: Array<Array<itemType> | null>

    /**
     * 单元格样式回调
     */
    onItemStyle?: (row: number, coloum: number) => StyleProp<TextStyle>

    /**
     * 行样式回调
     */
    onRowStyle?: (row: number) => StyleProp<TextStyle>
}



/**
 * 表格
 * @param prop
 * @returns
 */
export function TableView(prop: React.PropsWithChildren<TableViewProp>) {

    // const st = useObjState(() => ({

    // }))

    // useInit(async () => {


    //     return async () => {

    //     }
    // })



    // let maxColumn = 1;
    // prop.children?.forEach(it => {
    //     if (it.length > maxColumn) {
    //         maxColumn = it.length;
    //     }
    // })



    const rows = prop.children?.filter(it => it != null);


    /////////////////////////////////////////
    ////////return TableView/////////
    /////////////////////////////////////////
    return (
        <V {...prop}>
            {
                rows?.map((arrRow, row) => {
                    return <V style={[{
                        flexDirection: "row",
                    }, prop.onRowStyle?.(row)]}>
                        {arrRow?.map((it, coloum) => {

                            let itemStyle = prop.onItemStyle?.(row, coloum);


                            let styl = app.splitStyle(itemStyle, app.textProps)

                            let borderW = styl[1]["borderWidth"] ?? 1

                            return <Pressable style={{
                                flex: it.row || 1,
                            }}
                                onPress={(ev) => {
                                    it.onPress?.(ev)
                                }}
                            >
                                <View
                                    style={[{
                                        borderRightWidth: coloum + 1 == arrRow.length ? borderW : 0,
                                        borderBottomWidth: row + 1 == rows?.length ? borderW : 0,
                                        borderLeftWidth: borderW,
                                        borderTopWidth: borderW,
                                        flex: 1,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        paddingVertical: 5,
                                        paddingHorizontal: 8,
                                    }, styl[1]]}
                                >
                                    <V style={[styl[0], it.style]}>{it.text}</V>
                                </View>
                            </Pressable>
                        })}
                    </V>
                })
            }

        </V>
    )

}

const sty = StyleSheet.create({

})