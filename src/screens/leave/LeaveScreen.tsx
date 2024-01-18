import { colors } from "@common/components/colors";
import { styles } from '@common/components/styles';
import { Container } from '@common/lib/components/Container';
import { V } from '@common/lib/components/custom/V';
import TabView from '@common/lib/components/tabview/TabView';
import { useInit, useObjState } from '@common/lib/hooks';
import { lib } from '@common/lib/lib';
import { TabViewItem } from '@common/model/TabViewItem';
import { commonTabLight } from "@src/components/Tab";
import React, { useState } from 'react';
import { StyleSheet } from "react-native";
import { HeaderBar } from '../../components/Header';
import { AddLeave } from "./AddLeave";
import { LeaveList } from "./LeaveList";


export enum LeaveType {
    VAC_DAI_NEW = "VACATION",
    VAC_DAI_BAN = "TODO",
    VAC_JI_LU = "JILU",
}

interface LeaveScreenProp {

}


export class LeaveScreenState {

    countList = new Map<string, number>()
    //审批人员
    isEditp = lib.randomInt(10) % 2 == 0
    get $update() { return }

    constructor(
        public prop_: LeaveScreenProp,
    ) {
    }




}


/* 请假首页 */
export function LeaveScreen(prop: React.PropsWithChildren<LeaveScreenProp>) {
    //tabView 索引
    const [index, setIndex] = useState(0);
    const st = useObjState(() => new LeaveScreenState(prop), prop)


    useInit(async () => {


        return async () => {

        }
    })


    //初始化tab路由
    const routes: Array<TabViewItem> = [
        {
            key: LeaveType.VAC_JI_LU,
            title: "假单记录",
            view: () => (
                <LeaveList listType={LeaveType.VAC_JI_LU} stHome={st} isEditp={st.isEditp} style={[{}, sty.tabView]} />
            ),
        },
    ]

    routes.add(0, {
        key: LeaveType.VAC_DAI_NEW,
        title: "请假申请",
        view: () => (
            <AddLeave />
        ),
    })

    return (
        <Container
            bgHeight={140}
            style={{ backgroundColor: colors.background }}>

            <HeaderBar
                title={"请假"}
            />

            <TabView
                lazy={true}
                tabBarPosition="top"
                navigationState={{ index, routes }}
                renderScene={(prop) => prop.route.view()}
                onIndexChange={setIndex}
                sceneContainerStyle={{}}
                renderTabBar={commonTabLight(dat => <V
                    style={[{
                        color: dat.focused ? colors.primary : colors.TabTrans,
                        textAlign: 'center',
                        fontSize: 14,
                    }]}
                    numberOfLines={1}
                >{st.countList.get(dat.route.key) ?? ""}
                </V>)}
            />
        </Container >
    )

}

const sty = StyleSheet.create({
    tabView: {
        backgroundColor: colors.background1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
})