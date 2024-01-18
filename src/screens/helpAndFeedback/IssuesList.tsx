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
import { DialogAlert } from '@common/lib/components/custom/DialogAlert';
import { HtmlView } from '@common/lib/components/HtmlView';
import { Pic } from '@common/lib/components/custom/Pic';
import { api } from '../../config/api';
import { DialogBottom } from '@common/lib/components/custom/DialogBottom';


interface IssuesListProp {
    title: string
    id?: string
}


export class IssuesListState {


    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: IssuesListProp,
    ) {

    }


    onItemPress(dat: HelpFbContent) {
        DialogBottom.show({
            content: (dialog) => (
                <V >
                    <HtmlView style={[{ flex: 1, margin: 10 },]} html={dat.content} />
                    <Pic source={api.getFileUrl(dat.imgUrls.slice(1))} style={{ height: 150 }} />
                </V >
            )
        })
    }

    /* 列表数量 */
    countList = new Map<string, number>()
    index = 0;
    search: string = ''
    pullList = Array<PullList<HelpFbContent> | null>()


    async getIssuesResource(page: number) {
        let res = await apiHelpFb.getIssuesResource({
            title: filter.contains(this.search),
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
 * 反馈的问题列表
 * @param prop
 * @returns
 */
export function IssuesList(prop: IssuesListProp) {

    //组件状态
    const st = useObjState(() => new IssuesListState(prop), prop)

    //组件初始化
    useInit(async () => {



        return async () => { //组件卸载

        }
    })



    return (
        !prop.id ? fblist(prop, st) :
            <Container
                style={{}}>

                <HeaderBar
                    title={prop.title}
                />

                {fblist(prop, st)}
            </Container>
    )


}


function fblist(prop: IssuesListProp, st: WithUpadte<WithProp<IssuesListState, IssuesListProp>>) {
    return <PullList<HelpFbContent>
        //初始化时自动加载数据。
        autoLoad={true}
        renderHeader={() => <V style={[{ marginHorizontal: 10, marginBottom: 0, marginTop: app.isWeb ? 10 : 0 },]}>
            {prop.id ? null : <SearchView
                placeholder="输入关键词"
                onSearch={(t) => {
                    st.search = t;
                    st.refreshData()
                }}
                light={true}
                style={{ marginHorizontal: 10 }} />}

            <V style={[{ fontSize: 15, fontWeight: 'bold', marginTop: 12, marginHorizontal: 5, },]}>{prop.title + '问题'}</V>

        </V>}
        ref={ref => st.pullList[0] = ref}
        renderItem={(i, ref) => {
            return <HelpFbItem dat={i.item} idx={i.index} onPress={() => st.onItemPress(i.item)} />;
        }}
        onGetListByPage={page => st.getIssuesResource(page)} />;
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
