import React from 'react'
import { Platform, View, Text, StyleSheet } from "react-native";
import { V } from '@common/lib/components/custom/V';
import { useInit, useObjState, WithProp, WithUpadte } from '@common/lib/hooks';
import { colors } from "@common/components/colors";
import { app } from '@common/lib/app';
import { PullList } from '@common/lib/components/custom/PullList';
import { SearchView } from '@common/lib/components/SearchView';
import { Container } from '@common/lib/components/Container';
import { HeaderBar } from '../../components/Header';
import { HelpFbItem } from './HelpFbItem';
import { apiHelpFb } from '../../model/helpFb/api';
import { HelpFbContent } from '../../model/helpFb/HelpFbList';
import { filter } from '../../model/JHipsterFilter';
import { ManualsDetail } from './ManualsDetail';


interface ManualsListProp {
}


export class ManualsListState {


    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: ManualsListProp,
    ) {

    }


    onItemPress(dat: HelpFbContent) {
        app.push(ManualsDetail, {
            id: dat.id, onBack: () => {
                this.refreshData()
            }
        })
    }

    /* 列表数量 */
    countList = new Map<string, number>()
    index = 0;
    search: string = ''
    pullList = Array<PullList<HelpFbContent> | null>()


    async getManualsResource(page: number) {
        let res = await apiHelpFb.getManualsResource({
            title: filter.contains(this.search),
            sort: this.search.length == 0 ? 'hotType,desc' : undefined,
            page: page - 1,
            pageSize: app.pageNum,
        }).hideProg.result

        return res.content
    }

    //列表刷新
    refreshData = () => {
        this.pullList[this.index]?.onRefresh()
    }

}



/**
 * 我的反馈列表
 * @param prop
 * @returns
 */
export function ManualsList(prop: ManualsListProp) {

    //组件状态
    const st = useObjState(() => new ManualsListState(prop), prop)

    //组件初始化
    useInit(async () => {



        return async () => { //组件卸载

        }
    })



    return (
        <Container
            style={{ backgroundColor: colors.background }}>

            <HeaderBar
                title={'我的反馈'}
            />

            <PullList<HelpFbContent>
                //初始化时自动加载数据。
                autoLoad={true}
                renderHeader={() => <V style={[{ marginHorizontal: 10, marginBottom: 0, marginTop: app.isWeb ? 10 : 0 },]}>
                    <SearchView
                        placeholder="输入关键词"
                        onSearch={(t) => {
                            st.search = t;
                            st.refreshData()
                        }}
                        light={app.isWeb}
                        style={{ marginHorizontal: 10 }} />
                </V>}
                ref={ref => st.pullList[0] = ref}
                renderItem={(i, ref) => {
                    return <HelpFbItem dat={i.item} idx={i.index} edit={true}
                        onPress={() => st.onItemPress(i.item)}
                        onBack={(del) => {
                            app.msg('撤销成功')
                            st.refreshData()
                        }}
                    />;
                }}
                onGetListByPage={page => st.getManualsResource(page)} />
        </Container>
    )


}


const sty = StyleSheet.create({
    bgRadius: {
        backgroundColor: colors.greyLight,
        borderRadius: 100,
        flexDirection: "row",
        paddingRight: 10,
        alignItems: 'center',
    }
})
