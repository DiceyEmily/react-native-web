import { colors } from "@common/components/colors";
import { V } from '@common/lib/components/custom/V';
import { useInit, useObjState } from '@common/lib/hooks';
import React from 'react';
import { imgs } from '@src/imgs';
import { Pic } from "@src/rn-common/lib/components/custom/Pic";
import { lib } from "@src/rn-common/lib/lib";
import { styles } from "@src/rn-common/components/styles";
import { Pressable } from "react-native";
import { CampusStyleData } from "@src/model/home/CampusStyleData";

interface CampusStyleItemProp {
    dat: CampusStyleData,
    onPress: () => void,
    //列表类型
    listType?: string,
    refreshList?: (id: string) => void,
}


export class CampusStyleState {

    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: CampusStyleItemProp,
    ) {

    }

    picsList: Array<string> = []

    getPicsList() {
        this.picsList.push('')
        this.picsList.push('')
        this.$update
    }

}



/**
 * 校园风采item
 * @param prop 
 * @returns 
 */
export function CampusStyleItem(prop: CampusStyleItemProp) {

    const st = useObjState(() => new CampusStyleState(prop), prop)

    useInit(async () => {

        st.getPicsList()

        return async () => { //组件卸载

        }
    })

    return (
        <Pressable style={[styles.roundBackShadow, { marginHorizontal: 12, marginVertical: 6, },]}
            onPress={() => {
                prop.onPress()
            }}
        >
            <V style={[{ flexDirection: 'row', alignContent: 'center' },]}>
                <Pic
                    resizeMode="cover"
                    style={
                        [{
                            width: "100%",
                            height: 150,
                            borderRadius: 5,
                        },]}
                    source={imgs.bg}
                />
            </V>
            <V numberOfLines={3} style={[{
                color: colors.textMain,
                fontSize: 16,
                marginTop: 10,
                paddingHorizontal: 12,
            },]} >{prop.dat.title}</V>
            <V style={[{
                flexDirection: 'row',
                paddingHorizontal: 12,
                marginBottom: 10,
                marginTop: 5,
            },]}>
                <V numberOfLines={1} style={[{
                    color: colors.grey9,
                    fontSize: 12
                },]}>{'发布时间：' + prop.dat.createTime}</V>
                <V style={[{ flex: 1 },]}></V>
                <V numberOfLines={1} style={[{
                    color: colors.grey9,
                    fontSize: 12
                },]}>{'发布人：' + prop.dat.releasePerson}</V>
            </V>
        </Pressable>
    )
}
