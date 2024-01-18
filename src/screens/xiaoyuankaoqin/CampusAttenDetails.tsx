import { styles } from '@common/components/styles';
import { colors } from "@common/components/colors";
import { app } from '@common/lib/app';
import { PullList } from '@common/lib/components/custom/PullList';
import { useInit, useObjState } from '@common/lib/hooks';
import React from 'react';
import { StyleSheet } from "react-native";
import { api } from '@src/config/api';
import { HeaderBar } from '@src/components/Header';
import { Task } from '@src/model/msg/Task';
import { V } from '@src/rn-common/lib/components/custom/V';
import { lib } from '@src/rn-common/lib/lib';
import { Container } from '@src/rn-common/lib/components/Container';
import { MyStyles } from '@src/config/MyStyles';
import { memoItem } from '@src/rn-common/lib/components/memoItem';
import { CampusAttenData } from '@src/model/home/CampusAttenData';


interface CampusAttenDetailsProp {
    time: string
}


export class CampusAttenDetailsState {

    //更新组件
    get $update() { return }

    constructor(
        //组件属性
        public prop_: CampusAttenDetailsProp,
    ) {

    }

    getList = async (page: number) => {
        let res = await api.campusAtten_date(lib.dateToY_M_D(this.prop_.time)).result

        return res
    }


}



/**
 * 考勤详情
 * @param prop
 * @returns
 */
export function CampusAttenDetails(prop: CampusAttenDetailsProp) {

    //组件状态
    const st = useObjState(() => new CampusAttenDetailsState(prop), prop)

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })


    return (
        <Container style={{ flex: 1, backgroundColor: colors.white }}>
            <HeaderBar
                title={'今日详情'}
            />

            <PullList<CampusAttenData>
                style={[{
                    paddingVertical: 20, paddingHorizontal: 10,
                    backgroundColor: colors.white,
                },]}
                autoLoad={true}
                renderItem={(i, ref) => memoItem(AchievemInquiryDetailsItem, {
                    dat: i.item,
                    onPress: async () => {

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
export function AchievemInquiryDetailsItem(para: { dat: CampusAttenData, onPress: () => void, index: number, list: number }) {

    const st = useObjState(() => ({

    }))

    useInit(async () => {


        return async () => { //组件卸载

        }
    })


    return <V style={[{
        flexDirection: 'row', paddingHorizontal: 20, flex: 1,
    }]}>
        <V style={[{ marginBottom: 40, flexDirection: 'row', marginRight: 12, }]}>
            <V style={[{
                fontSize: 15,
                color: colors.grey6,
            },]}>{lib.dateToH_M_S(para.dat.recordDate)}
            </V>
        </V>
        <V style={[{},]}>
            <V style={[MyStyles.item_y, {
                alignSelf: 'center', alignItems: 'center', alignContent: 'center', textAlign: 'center', backgroundColor: colors.white,
                marginTop: 4, marginLeft: 15, width: 12, height: 12,
                borderRadius: 360, borderColor: colors.charts[lib.randomInt(4)], borderWidth: 2,
            }]}>
            </V>
            <V style={[{
                backgroundColor: para.index == para.list - 1 ? colors.transparent : colors.lineGrey, alignSelf: 'center', textAlign: 'center',
                marginRight: 15, marginLeft: 20,
                width: 2, height: '98%', alignItems: 'center', alignContent: 'center',
            }]}>
            </V>
        </V>
        <V style={[{ marginBottom: 40, flex: 1, flexDirection: 'row', marginLeft: 12, }]}>
            <V style={[{
                fontSize: 15,
                color: colors.grey6,
            },]}>{para.dat.typeName}
            </V>
        </V>
    </V>
}

const sty = StyleSheet.create({

})
