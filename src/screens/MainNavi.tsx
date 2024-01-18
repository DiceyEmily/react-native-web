import { Container } from '@common/lib/components/Container';
import { useInit, useObjState } from '@common/lib/hooks';
import { IconXC } from '@src/components/IconXC';
import { NaviView } from '@src/components/NaviView';
import { imgs } from '@src/imgs';
import { colors } from '@src/rn-common/components/colors';
import { app } from '@src/rn-common/lib/app';
import { DialogList } from '@src/rn-common/lib/components/custom/DialogList';
import { Pic } from '@src/rn-common/lib/components/custom/Pic';
import { V } from '@src/rn-common/lib/components/custom/V';
import { Icon } from '@src/rn-common/lib/components/icon/Icon';
import { TabViewItem } from '@src/rn-common/model/TabViewItem';
import React from 'react';
import { StyleSheet } from "react-native";
import { FaXianList } from './faxian/FaXianList';
import { Home } from './Home';
import { MyView } from './my/MyView';
import { Worktable } from './Worktable';
import { XiaoXi } from './xiaoxi/XiaoXi';


interface MainNaviProp {

}

const iconSize = 25;

export class MainNaviState {


    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: MainNaviProp,
    ) {

        DialogList
    }

    index = 0;

    routes = Array<TabViewItem>(
        {
            key: "home",
            title: "首页",
            iconNormal: () => <Pic
                style={[{ width: iconSize - 0.5, height: iconSize - 2.5, },]}
                source={imgs.n_shouye}
            />,
            iconActive: () => <Pic
                style={[{ width: iconSize - 0.5, height: iconSize - 2.5, },]}
                source={imgs.shouye}
            />,
            view: () => (
                <Home />
            )
        },
        {
            key: "xiaoxi",
            title: "消息",
            iconNormal: () => <Pic
                style={[{ width: iconSize, height: iconSize - 3.5, },]}
                source={imgs.xiaoxi}
            />,
            iconActive: () => <Pic
                style={[{ width: iconSize, height: iconSize - 3.5, },]}
                source={imgs.set_xiaoxi}
            />,
            view: () => (
                <XiaoXi />
            )
        },
        {
            key: "add",
            title: "",
            iconNormal: () => <Pic
                style={[{ width: iconSize + 10, height: iconSize + 7, },]}
                source={imgs.fabu}
            />,
            iconActive: () => <Pic
                style={[{ width: iconSize + 10, height: iconSize + 7, },]}
                source={imgs.fabu}
            />,
            view: () => (
                <Worktable />
            )
        },
        {
            key: "faxian",
            title: "发现",
            iconNormal: () => <Pic
                style={[{ width: iconSize - 0.5, height: iconSize - 3, },]}
                source={imgs.faxian}
            />,
            iconActive: () => <Pic
                style={[{ width: iconSize - 0.5, height: iconSize - 3, },]}
                source={imgs.set_faxian}
            />,
            view: () => (
                <FaXianList />
            )
        },
        {
            key: "my",
            title: "我的",
            iconNormal: () => <Pic
                style={[{ width: iconSize - 2.5, height: iconSize - 2.5, },]}
                source={imgs.mine}
            />,
            iconActive: () => <Pic
                style={[{ width: iconSize - 2.5, height: iconSize - 2.5, },]}
                source={imgs.set_mine}
            />,
            view: () => (
                <MyView />
            )
        },
    );

}



/**
 * 主页
 * @param prop 
 * @returns 
 */
export function MainNavi(prop: MainNaviProp) {

    //组件状态
    const st = useObjState(() => new MainNaviState(prop), prop)

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })


    return (
        <Container
            style={[{}]}>
            <NaviView
                initIndex={0}
                onClick={index => { st.index = index }}
                style={{}}
                tabStyle={{
                    backgroundColor: colors.background,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: -3,
                    },
                    shadowOpacity: 0.08,
                    shadowRadius: 5,
                    elevation: 8,
                }}
                activeColor={colors.primary}
                inactiveColor={colors.grey1}
                data={st.routes} />
        </Container>
    )


}

const sty = StyleSheet.create({

})