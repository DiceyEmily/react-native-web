import { styles } from '@common/components/styles';
import { colors } from "@common/components/colors";
import { app } from '@common/lib/app';
import { PullList } from '@common/lib/components/custom/PullList';
import { useInit, useObjState } from '@common/lib/hooks';
import React from 'react';
import { StyleSheet } from "react-native";
import { api } from '@src/config/api';
import { HeaderBar } from '@src/components/Header';
import { V } from '@src/rn-common/lib/components/custom/V';
import { Container } from '@src/rn-common/lib/components/Container';
import { MyStyles } from '@src/config/MyStyles';
import { memoItem } from '@src/rn-common/lib/components/memoItem';
import { MoralEdueValuaData } from '@src/model/home/MoralEdueValuaData';


interface MoralEdueValuaProp {
}


export class MoralEdueValuaState {

    //更新组件
    get $update() { return }

    constructor(
        //组件属性
        public prop_: MoralEdueValuaProp,
    ) {

    }


    getList = async (page: number) => {
        let res = await api.education_evaluation({
            page: page - 1, pageSize: app.pageNum,
        }).hideProg.result

        this.$update

        return res
    }


}



/**
 * 德育评价
 * @param prop
 * @returns
 */
export function MoralEdueValua(prop: MoralEdueValuaProp) {

    //组件状态
    const st = useObjState(() => new MoralEdueValuaState(prop), prop)

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })


    return (
        <Container style={{ flex: 1, backgroundColor: colors.white }}>
            <HeaderBar
                title={'德育评价'}
            />

            <PullList<MoralEdueValuaData>
                style={[{
                    paddingVertical: 12,
                    backgroundColor: colors.white,
                },]}
                autoLoad={true}
                renderItem={(i, ref) => memoItem(MoralEdueValuaItem, {
                    dat: i.item,
                    onPress: async () => {
                        // app.push(DocumentDetail, { dat: i.item.filter() })
                    },
                    list: ref.state.data.length,
                    index: i.index
                })}
                onGetListByPage={page => st.getList(page)}>
            </PullList>
        </Container>
    )

}


/* 事项item */
function MoralEdueValuaItem(para: { dat: MoralEdueValuaData, onPress: () => void, index: number, list: number }) {

    const st = useObjState(() => ({

    }))

    useInit(async () => {


        return async () => { //组件卸载

        }
    })


    return <V style={[{
        flexDirection: 'row', paddingHorizontal: 12, flex: 1,
    }]}>
        <V style={[{},]}>
            <V style={[MyStyles.item_y, {
                alignSelf: 'center', alignItems: 'center', alignContent: 'center', textAlign: 'center',
                marginTop: 5, marginLeft: 15, width: 15, height: 15, borderRadius: 360,
            }]}></V>
            <V style={[{
                backgroundColor: para.index == para.list - 1 ? colors.transparent : colors.primary, alignSelf: 'center', textAlign: 'center',
                marginRight: 15, marginLeft: 20,
                width: 3, height: '98%', alignItems: 'center', alignContent: 'center',
            }]}></V>
        </V>
        <V style={[{ marginBottom: 25, flex: 1, flexDirection: 'row', marginRight: 12, marginTop: 2, marginLeft: 5, }]}>
            <V style={[{
                fontSize: 15,
                color: colors.grey6,
            },]}>{para.dat.title}
            </V>
            <V style={[{ flex: 1 },]}></V>
            <V style={[{
                fontSize: 15,
                color: colors.grey6,
            },]}>{para.dat.remark}
            </V>
        </V>
    </V>
}

const sty = StyleSheet.create({

})
