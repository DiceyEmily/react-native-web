
import { styles } from '@common/components/styles';
import { colors } from "@common/components/colors";
import { app } from '@common/lib/app';
import { Container } from '@common/lib/components/Container';
import { V } from '@common/lib/components/custom/V';
import { TableView } from '@common/lib/components/TableView';
import { useInit, useObjState } from '@common/lib/hooks';
import { array } from '@common/lib/lib';
import React from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, } from 'react-native';
import { HeaderBar } from '../../components/Header';
import { apiHelpFb } from '../../model/helpFb/api';
import { IssuesList } from './IssuesList';
import { ManualsDetail } from './ManualsDetail';
import { ManualsList } from './ManualsList';


interface HelpFbScreenProp {

}


export class HelpFbScreenState {

    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: HelpFbScreenProp,
    ) {

    }

    modelList: { text: string, onPress: (ev: GestureResponderEvent) => void }[][] = []


    async getModel() {
        let res = await apiHelpFb.getCategory_categoryResource().result
        let newList = res.map((v, k) => {
            return {
                text: v.label, onPress: (ev: GestureResponderEvent) => {
                    app.push(IssuesList, { title: v.label, id: v.value });
                }
            };
        });
        newList.map((v, i) => {
            let li: { text: string, onPress: (ev: GestureResponderEvent) => void }[] = this.modelList[(i / 2) << 0]
            if (!li) {
                li = []
                this.modelList.push(li)
            }
            li.push(v)
        })
        this.$update
    }


}




/**
 * 帮助与反馈首页
 * @param prop
 * @returns
 */
export function HelpFbScreen(prop: React.PropsWithChildren<HelpFbScreenProp>) {


    const st = useObjState(() => new HelpFbScreenState(prop), prop)


    useInit(async () => {

        await st.getModel()

        return async () => {

        }
    })

    return (
        <Container
            bgHeight={130}
            style={{ backgroundColor: colors.background }}>

            <HeaderBar
                title={"帮助与反馈"}
            />
            <V style={[{ alignItems: 'center', flex: 1, paddingTop: 12 },]}>

                <V style={[{ width: '100%', height: '50%' },]}>
                    <IssuesList title={'热点'} />
                </V>

                <V style={[{
                    fontSize: 15, fontWeight: 'bold', alignSelf: 'flex-start',
                    marginTop: 12, marginBottom: 5, marginHorizontal: 5,
                },]}>  {'问题分类'}</V>

                <TableView
                    onItemStyle={(row, col) => {
                        return [{
                            backgroundColor: (row % 2 == 0 && col % 2 == 1 || (row % 2 == 1 && col % 2 == 0)) ? colors.greyLight : colors.white,
                            textAlign: 'center',
                        }, sty.text]
                    }}
                    style={[{ width: '100%' },]}>
                    {st.modelList}
                </TableView>

            </V>

            <V style={[{ justifyContent: 'flex-end', flexDirection: 'row', width: '100%', marginTop: 10 },
            { backgroundColor: colors.white, borderTopWidth: 1, borderColor: colors.greyE }]}>
                <V style={[{ padding: 15, width: '50%', textAlign: 'center', },]} onPress={() => {
                    app.push(ManualsList, {})
                }}>我的反馈</V>

                <V style={[{ backgroundColor: colors.greyE, width: 1, marginVertical: 4, },]}></V>

                <V style={[{ padding: 15, width: '50%', textAlign: 'center' },]} onPress={() => {
                    app.push(ManualsDetail, {
                        onBack: () => {

                        }
                    })
                }}>我要反馈</V>
            </V>

        </Container>
    )

}


const sty = StyleSheet.create({
    title: {
        borderWidth: 1, borderColor: colors.primary, borderRadius: 360, margin: 20,
    },
    text: {
        color: colors.black, fontSize: 16, paddingVertical: 20, paddingHorizontal: 10,
    },
})

