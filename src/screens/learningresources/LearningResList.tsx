import { styles } from '@common/components/styles';
import { colors } from "@common/components/colors";
import { app } from '@common/lib/app';
import { PullList } from '@common/lib/components/custom/PullList';
import { useInit, useObjState } from '@common/lib/hooks';
import React from 'react';
import { Dimensions, GestureResponderEvent, Pressable, StyleSheet, View } from "react-native";
import { api } from '@src/config/api';
import { HeaderBar } from '@src/components/Header';
import { V } from '@src/rn-common/lib/components/custom/V';
import { lib } from '@src/rn-common/lib/lib';
import { Container } from '@src/rn-common/lib/components/Container';
import { DialogList, DialogListItem } from '@src/rn-common/lib/components/custom/DialogList';
import { memoItem } from '@src/rn-common/lib/components/memoItem';
import { LearningResListData } from '@src/model/home/LearningResListData';
import { MyCurriculumAll } from '@src/model/home/MyCurriculumAll';
import { Pic } from '@src/rn-common/lib/components/custom/Pic';
import { imgs } from '@src/imgs';
import { VedioPlayerDetail } from './VedioPlayerDetail';


interface LearningResListProp {
    time?: string
}


export class LearningResListState {

    //更新组件
    get $update() { return }

    constructor(
        //组件属性
        public prop_: LearningResListProp,
    ) {

    }

    pullList: PullList<LearningResListData> | null = null

    searchXueke = new MyCurriculumAll
    listXueke = Array<MyCurriculumAll>()
    searchNianji = { code: '', name: '' }
    listNianji = Array<{ code: string, name: string }>()

    /* 刷新 */
    refreshData() {
        this.pullList?.onRefresh()
    }

    /* 获取数据 */
    async getList(page: number) {
        let res = await api.learn_resource({
            page: page - 1,
            pageSize: app.pageNum,
            // scUuid: this.searchNianji.code,
            // ccUuid: this.searchXueke.claUuid,
        }).hideProg.result

        res.push(res[0])

        return res
    }

    /* 获取搜索条件 */
    async getClass() {
        let res = await api.grade_status().result

        return res
    }

    /* 获取搜索条件 */
    async getXueKe() {
        let res = await api.scheduling_all().result

        return res
    }

    /* 学科弹框 */
    async xuekeDialog(ev: View) {
        if (!this.listXueke || this.listXueke.length == 0) {
            let res = await this.getXueKe()
            this.listXueke = res
            this.xuekeDialog(ev)
        } else {
            let dDialogList = [{
                key: '',
                val: '',
                onClick: (dat: DialogListItem) => { },
                selected: false,
            }];
            dDialogList.splice(0, 1);
            this.listXueke?.map((it, index) => {
                dDialogList.push({
                    key: it.name,
                    val: it.claUuid,
                    onClick: (dat) => {
                        this.searchXueke = this.searchXueke.claUuid == dat.val ? new MyCurriculumAll : it
                        this.$update
                        this.refreshData()
                    },
                    selected: this.searchXueke.claUuid == it.claUuid,
                });
            });

            //弹出选择框
            DialogList.show(dDialogList,
                {
                    disableDim: false,
                    posView: ev,
                    position: (l) => ({
                        x: 10,
                        y: 30,
                    })
                }
            );
        }

    }

    /* 年级弹框 */
    async nianjiDialog(ev: View) {
        if (!this.listNianji || this.listNianji.length == 0) {
            let res = await this.getClass()
            this.listNianji = res
            this.nianjiDialog(ev)
        } else {
            let dDialogList = [{
                key: '',
                onClick: (dat: DialogListItem) => { },
                selected: false,
            }];
            dDialogList.splice(0, 1);
            this.listNianji?.map((it, index) => {
                dDialogList.push({
                    key: it.name,
                    onClick: (dat) => {
                        this.searchNianji = this.searchNianji.code == dat.val ? { code: '', name: '' } : it
                        this.$update
                        this.refreshData()
                    },
                    selected: this.searchNianji.code == it.code,
                });
            });

            //弹出选择框
            DialogList.show(dDialogList,
                {
                    disableDim: false,
                    posView: ev,
                    position: (l) => ({
                        x: 10,
                        y: 30,
                    })
                }
            );
        }
    }

}



/**
 * 学习资料
 * @param prop
 * @returns
 */
export function LearningResList(prop: LearningResListProp) {

    //组件状态
    const st = useObjState(() => new LearningResListState(prop), prop)

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })


    return (
        <Container style={{ flex: 1, backgroundColor: colors.white }}>
            <HeaderBar
                title={"学习资料"}
            />

            <V style={[{ flexDirection: 'row', marginTop: 12 }]}>
                <V style={[sty.bgRadius, {
                    color: colors.black,
                    fontSize: 14,
                    paddingHorizontal: 10,
                    paddingVertical: 2,
                    marginHorizontal: 10,
                    alignSelf: 'center', flex: 1, textAlign: 'center',
                }]}
                    onPress={async (ev) => {
                        let target = ev.currentTarget as unknown as View;
                        await st.xuekeDialog(target)
                    }}>{"学科 " + (st.searchXueke.name.length > 0 ? st.searchXueke.name : "  ") + ' >'}
                </V>
                <V style={[sty.bgRadius, {
                    color: colors.black,
                    fontSize: 14,
                    paddingHorizontal: 10,
                    paddingVertical: 2,
                    marginHorizontal: 10,
                    alignSelf: 'center', flex: 1, textAlign: 'center'
                }]}
                    onPress={async (ev) => {
                        let target = ev.currentTarget as unknown as View;
                        await st.nianjiDialog(target)
                    }}>{"年级 " + (st.searchNianji.name.length > 0 ? st.searchNianji.name : "  ") + ' >'}
                </V>
            </V>

            <PullList<LearningResListData>
                numColumns={1}
                style={[{
                    paddingVertical: 8,
                    backgroundColor: colors.white,
                },]}
                ref={ref => st.pullList = ref}
                autoLoad={true}
                renderItem={(i) => memoItem(LearningResItem, {
                    dat: i.item,
                    onPress: async () => {
                        // app.push(DocumentDetail, { dat: i.item.filter() })
                    },
                    index: i.index
                })}
                onGetListByPage={page => st.getList(page)}>
            </PullList>
        </Container>
    )

}


/* 事项item */
function LearningResItem(para: { dat: LearningResListData, onPress: () => void, index: number }) {

    const st = useObjState(() => ({

        ys: lib.randomInt(4),
        dan: para.index % 2 != 0,

        gotoDetails() {
            // app.push(AchievemInquiryDetails, { id: para.dat.id, title: para.dat.biaoti })
        },
    }))

    useInit(async () => {


        return async () => { //组件卸载

        }
    })

    return (
        <Pressable style={[styles.roundBackShadow, { marginHorizontal: 12, marginVertical: 6, },]}
            onPress={() => {
                app.push(VedioPlayerDetail, { url: para.dat.url, title: para.dat.title, poster: '' })
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
            },]} >{para.dat.title}</V>
            <V style={[{
                paddingHorizontal: 12,
                paddingBottom: 12,
                fontSize: 12,
                color: colors.grey9
            },]}>{para.dat.remark}
                <V style={[{
                    paddingHorizontal: 12,
                    fontSize: 12,
                    color: colors.primary,
                },]}>{'（正在进行中）' + '下载'}</V>
            </V>
        </Pressable >

    )
}

const sty = StyleSheet.create({
    bgRadius: {
        flexDirection: "row",
        alignItems: 'center',
    }
})
