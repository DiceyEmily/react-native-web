import React from 'react'
import { Platform, View, Text, StyleSheet, Image } from "react-native";
import { V } from '@common/lib/components/custom/V';
import { findState, useInit, useObjState } from '@common/lib/hooks';
import { HeaderBar } from '@src/components/Header';
import { color } from 'echarts';
import { colors } from '@src/rn-common/components/colors';
import { styles } from '@src/rn-common/components/styles';
import { array, lib } from '@src/rn-common/lib/lib';
import { app } from '@src/rn-common/lib/app';
import { PressView } from '@src/rn-common/lib/components/custom/PressView';
import { api } from '@src/config/api';
import { PullList } from '@src/rn-common/lib/components/custom/PullList';
import { DialogList } from '@src/rn-common/lib/components/custom/DialogList';
import { addModule, HomeCState, moduleListID } from './Home';
import { WorkBeanData } from '@src/model/home/WorkBeanData';
import { Pic } from '@src/rn-common/lib/components/custom/Pic';
import { url } from '@src/config/url';
import { imgs } from '@src/imgs';


interface WorktableProp {

}



export class WorktableState {

    iconSize = 30
    iconColor = colors.primary;

    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: WorktableProp,
    ) {


    }


    getList = async (page: number) => {
        let res = await api.allmodule({
        }).hideProg.result

        let data = new Array<{ name: string, data: WorkBeanData[] }>()
        let xuexi = {
            name: '学习',
            data: array(WorkBeanData),
        }
        let jilv = {
            name: '纪律',
            data: array(WorkBeanData),
        }
        let live = {
            name: '生活',
            data: array(WorkBeanData),
        }
        res.forEach(va => {
            if (moduleListID[0] == va.pfmUuid ||
                moduleListID[1] == va.pfmUuid ||
                moduleListID[2] == va.pfmUuid ||
                moduleListID[3] == va.pfmUuid) {
                xuexi.data.push(va)
            } else if (moduleListID[4] == va.pfmUuid ||
                moduleListID[5] == va.pfmUuid) {
                jilv.data.push(va)
            } else if (moduleListID[6] == va.pfmUuid ||
                moduleListID[7] == va.pfmUuid ||
                moduleListID[8] == va.pfmUuid ||
                moduleListID[9] == va.pfmUuid) {
                live.data.push(va)
            }
        })

        data.push(xuexi)
        data.push(jilv)
        data.push(live)

        return data
    }

    savemodule = async (pfmUuid: string) => {
        let res = await api.savemodule({
            pfmUuid: pfmUuid
        }).result

        return res
    }


}///////////////WorktableState end///////////////////



/**
 * 全部服务
 * @param prop 
 * @returns 
 */
export function Worktable(prop: WorktableProp) {

    //组件状态
    const st = useObjState(() => new WorktableState(prop), prop)

    //组件初始化
    useInit(async () => {

        st.getList

        return async () => { //组件卸载

        }
    })




    /////////////////////////////////////////
    //////// Worktable view//////////
    /////////////////////////////////////////
    return (
        <V style={[{ flex: 1 },]}>
            <HeaderBar disableBack title="全部服务" />

            <PullList<{ name: string, data: WorkBeanData[] }>
                style={[{
                    paddingVertical: 6,
                    backgroundColor: colors.white,
                },]}
                autoLoad={true}
                name=' '
                renderItem={(i) => {
                    let group = i.item.data
                    return <V style={[{ marginBottom: 10, backgroundColor: colors.white },]}>

                        {/* 标题 */}
                        <V style={[{
                            padding: 10,
                            fontSize: 16,
                            marginLeft: 10,
                            borderBottomWidth: 1,
                            borderColor: colors.greyLight,
                        },]}>{i.item.name}</V>

                        <V style={[{ flexDirection: "row", flexWrap: "wrap" },]}>
                            {
                                group.map((it, idx) => {
                                    return <PressView key={idx}
                                        onPress={() => HomeCState.moduleLists.get(it.pfmUuid)?.()}
                                        onLongPress={(ev) => {
                                            let target = (app.isWeb ? ev.currentTarget : ev.target) as unknown as View

                                            DialogList.show([
                                                {
                                                    key: '放入首页',
                                                    onClick: async () => {
                                                        let res = await st.savemodule(it.pfmUuid)
                                                        addModule.doEvent(it)
                                                    }
                                                },
                                            ],
                                                {
                                                    disableDim: false, posView: target,
                                                    position: () => ({
                                                        x: 0,
                                                        y: 100,
                                                    })
                                                }
                                            )
                                        }}
                                        style={[{
                                            width: "33.3%",
                                            alignItems: "center", paddingVertical: 30,
                                            borderRightWidth: 1,
                                            borderColor: colors.greyLight,
                                            borderBottomWidth: 1,
                                        },]}>
                                        <Pic
                                            style={
                                                [{
                                                    borderRadius: 2,
                                                    width: 30,
                                                    height: 30,
                                                },]}
                                            source={url.file_url + it.icon}
                                            defSource={imgs.ic_launcher_bg}
                                        />
                                        <V style={[{ marginTop: 5, color: colors.greyText },]}>{it.name}</V>
                                    </PressView>
                                })
                            }
                        </V>
                    </V>
                }}
                onGetListByPage={page => st.getList(page)}>
            </PullList>
        </V >
    )


}///////////////Worktable end//////////////////

const sty = StyleSheet.create({

})