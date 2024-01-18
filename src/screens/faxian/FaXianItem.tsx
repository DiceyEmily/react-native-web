import { colors } from "@common/components/colors";
import { V } from '@common/lib/components/custom/V';
import { useInit, useObjState } from '@common/lib/hooks';
import { array, lib } from '@common/lib/lib';
import React from 'react';
import { imgs } from '@src/imgs';
import { Pic } from "@src/rn-common/lib/components/custom/Pic";
import { app } from "@src/rn-common/lib/app";
import { styles } from "@src/rn-common/components/styles";
import { Pressable } from "react-native";
import { FaxianListData } from "@src/model/msg/FaxianListData";

interface FaXianItemProp {
    dat: FaxianListData,
    onPress: () => void,
    //列表类型
    listType?: string,
    refreshList?: (id: string) => void,
}


export class FaXianItemState {

    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: FaXianItemProp,
    ) {

    }

    picsList: Array<string[]> = []

    getPicsList() {
        let pics = ['', '', '', '', '',]
        let toa = parseInt(pics.length / 3 + '')
        for (let index = 0; index < toa; index++) {
            this.picsList.push([pics[index * 3], pics[index * 3 + 1], pics[index * 3 + 2]])
        }
        if (pics.length % 3 != 0) {
            let pic = []
            for (let index = 0; index < pics.length % 3; index++) {
                pic.push(pics[toa * 3 + index])
            }
            this.picsList.push(pic)
        }
        this.$update
    }

}



/**
 * 发现item
 * @param prop 
 * @returns 
 */
export function FaXianItem(prop: FaXianItemProp) {

    const st = useObjState(() => new FaXianItemState(prop), prop)

    useInit(async () => {

        st.getPicsList()

        return async () => { //组件卸载

        }
    })

    return (
        <Pressable style={[styles.roundBackShadow, { marginHorizontal: 12, marginVertical: 6, paddingHorizontal: 12, paddingVertical: 6 },]}
            onPress={() => {
                prop.onPress()
            }}
        >
            <V numberOfLines={3} style={[{
                color: colors.textMain, fontSize: 14, marginTop: 8, marginBottom: 3,
            },]} >{prop.dat.name}</V>
            {st.picsList.map((va) =>
                <V style={[{ flexDirection: 'row', },]}>
                    {va.map((v, idx) => {
                        return <Pic
                            resizeMode="cover"
                            style={
                                [{
                                    width: "32%",
                                    height: 60,
                                    marginTop: 5,
                                    marginLeft: idx == 0 ? 0 : '1.5%',
                                },]}
                            source={!v || v.length == 0 ? imgs.bg : v}
                        />
                    })}
                </V>
            )}
            <V numberOfLines={1} style={[{
                color: colors.grey9, marginVertical: 8, fontSize: 12
            },]}>{lib.dateToY_M_D_H_M_S(prop.dat.code)}</V>
        </Pressable>
    )
}
