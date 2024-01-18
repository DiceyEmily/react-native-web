import { getHeaderColor, styles } from '@common/components/styles';
import { colors } from "@common/components/colors";
import { app } from '@common/lib/app';
import { ButtonView } from '@common/lib/components/custom/ButtonView';
import { CheckView } from '@common/lib/components/custom/CheckView';
import { Pic } from '@common/lib/components/custom/Pic';
import { PressView } from '@common/lib/components/custom/PressView';
import { PullScroll } from '@common/lib/components/custom/PullScroll';
import { TreeNode, TreeView } from '@common/lib/components/custom/TreeView';
import { V } from '@common/lib/components/custom/V';
import { Icon } from '@common/lib/components/icon/Icon';
import { SearchView } from '@common/lib/components/SearchView';
import TabView from '@common/lib/components/tabview/TabView';
import { useInit, useObjState } from '@common/lib/hooks';
import React, { ReactElement, useRef } from 'react';
import { StyleSheet, View } from "react-native";
import { HeaderBar } from '../../components/Header';
import { IconXC } from '../../components/IconXC';
import { commonTabBar, commonTabLight } from '../../components/Tab';
import { cfg } from '../../config/cfg';
import { imgs } from '../../imgs';
import { lib } from '@common/lib/lib';
import { ContactData } from '@src/model/contact/ContactData';
import { api } from '@src/config/api';
import { AvatarText } from './AvatarText';
import { Container } from '@src/rn-common/lib/components/Container';


interface ContactViewProp {

    /**
     * 开启选人模式(点击确定后的回调函数:<id，ContactData>)
     */
    onSelect?: (res: Map<string, ContactData>) => any

    /**
     * 是否多选
     */
    mutiSelect?: boolean

    /**
     * 是否允许选择部门
     */
    selectDepartment?: boolean;

    /**
     * 显示电话以代替职位
     */
    showPhone?: boolean;


    /**
     * 父级id
    */
    parentId?: string

    /**
     * 只选择领导
     */
    leaderOnly?: boolean

    /**
     * 只选择部门
     */
    departmentOnly?: boolean;

    /**
     * 初始选中列表
     */
    selsets?: Map<string, ContactData>;

    //有搜索框
    enSearch?: boolean;
}


class ContactViewState {
    /**
     * 选人结果<id,ContactData>
     */
    selects = new Map<string, ContactData>()

    searchText = ""

    index = 0

    constructor(prop: ContactViewProp) {

        prop.selsets?.forEach?.(it => {
            this.selects.set(it.id, it);
        })
    }


}



/**
 * 通讯录选人
 * @param prop 
 * @returns 
 */
export function ContactView(prop: ContactViewProp) {

    let rootNode = useRef<TreeNode>()

    const st = useObjState(() => new ContactViewState(prop))


    useInit(async () => {

        return async () => {

        }
    })



    async function onSearch(text: string) {
        await api.search({
            name: text,
        }).result
    }

    /**
     * 递归加载部门与成员
     * @param node 树节点
     * @param id 部门id
     * @param cache 使用缓存
     * @param progress 是否显示进度弹窗
     */
    async function getContact(node: TreeNode, id: string, progress: boolean) {

        let httpReq = (st.index == 0 ? api.getContactParents() : api.getContactTeachers())
            .buffer(res => {
                //接口缓存回调
                bindView(res, node);
            })
            //显示加载进度弹窗
            .showProgress(progress);


        let ret = await httpReq.result;
        // await lib.sleep(2000);
        bindView(ret, node);
    }


    /**
     * 点击选人
     * @param dat 
     */
    function onPressItem(dat: ContactData) {
        if (!prop.onSelect) {
            //打电话

            return
        }

        let old = st.selects.get(dat.id);
        if (old) {
            st.selects.delete(dat.id)
        } else {
            if (!prop.mutiSelect) {
                st.selects.clear();
            }
            st.selects.set(dat.id, dat);
        }

        st.$update
    }

    function onCancelItem(dat: ContactData) {
        if (!prop.onSelect) {
            return
        }
        st.selects.delete(dat.id)
        st.$update
    }

    function onClearSelect() {
        st.selects.clear();
        st.$update
    }




    /**
     * 全选或取消全选
     * @param list
     * @returns 
     */
    function onSelectAll(list: Array<ContactData>) {
        if (!prop.onSelect) {
            return;
        }

        if (st.selects.get(list[0]?.id)) {
            //清空
            list.forEach((it: ContactData) => {
                st.selects.delete(it.id)
            })
        } else {
            //选中
            list.forEach((it: ContactData) => {
                if (it.isDepartment()) {
                    if (prop.selectDepartment)
                        st.selects.set(it.id, it);
                }
                else {
                    st.selects.set(it.id, it);
                }
            })
        }

        st.$update;
    }



    /**
     * 绑定视图
     * @param ret 
     * @param node 
     * @param first 
     */
    function bindView(ret: Array<ContactData>, node: TreeNode, first: boolean = false) {


        if (prop.departmentOnly) {
            //过滤非部门
            ret = ret.filter(res => res.isDepartment())
        }

        if (prop.leaderOnly) {
            //过滤非领导部门
            ret = ret.filter(res => !res.isDepartment() || res.isLeaderBureau())
        }


        // let departCount = ret.sum(r => r.isDepartment() ? 1 : 0);

        ret.sort((l, r) => l.tabIndex - r.tabIndex)

        //部门下属全为成员时，该节点使用flexWrap横向布局，否则竖向布局
        // if (departCount == 0) {
        //     node.style = { flexWrap: "wrap", flexDirection: "row", marginLeft: 15 }
        // } else {
        //     node.style = { flexDirection: "column", marginLeft: 15 }
        // }

        node.style = { marginLeft: 15 };

        node.bindList(ret, (dat, subNode) => {

            // if (first && dat.obj.id === "常用联系人" && subNode.isFold) {
            //     first = false
            //     subNode.toggle();
            //     if (subNode.notBind) {
            //         getContact(subNode, dat.obj.getName(), true)
            //     }
            // }

            //是否选中
            let isCheck = !!st.selects.get(dat.id);

            //部门
            if (dat.isDepartment()) {
                return <PressView
                    key={0}
                    onPress={() => {
                        subNode.toggle();
                        if (subNode.notBind)
                            getContact(subNode, dat.id, true)
                    }}
                    onLongPress={() => {
                        if (!subNode.isFold && subNode.list) {
                            onSelectAll(subNode.list)
                        }
                    }}
                    style={[{ padding: 10 }, styles.rowCenter]}>
                    {subNode.arrow()}
                    <V style={{ marginLeft: 10, fontSize: 15, flex: 1 }}>{dat.getName()}</V>
                    {
                        (prop.selectDepartment && prop.onSelect) ?
                            <CheckView
                                box

                                checked={isCheck}
                                onPress={check => onPressItem(dat)}

                                size={15} />
                            : null
                    }

                </PressView>
            }



            //成员
            return getRowMemberView(prop.showPhone, prop.onSelect != null, isCheck, dat, false, onPressItem)
        })
    }




    function getTreeListView(bureauId?: string) {
        return <PullScroll
            style={[{},]}
            contentContainerStyle={{ padding: 5 }}
            onRefresh={async () => {
                if (rootNode.current) {

                }
            }}>
            {
                st.selects.size > 0 ?
                    <V style={[{ flexDirection: "row" },]}>
                        <V style={[{ flex: 1 },]}>已选{st.selects.size}个</V>
                        <PressView style={[{
                            flexDirection: "row", alignItems: "center",
                            marginRight: 10
                        },]}
                            onPress={() => onClearSelect()}>
                            <V style={[{ color: colors.grey9 },]}>清空</V>
                            <IconXC name="qingkong" size={20} color={colors.grey9} />
                        </PressView>
                    </V> : null
            }
            <V style={[{
                flexDirection: "row", flexWrap: "wrap", alignItems: "center",
            },]}>
                {getSelectsView(st.selects, onCancelItem)}
            </V>
            <TreeView
                onInit={node => {
                    rootNode.current = node
                    getContact(node, prop.parentId ?? (bureauId ?? ""), true)
                }} />
        </PullScroll>
    }



    function getContentView() {
        //选择模式，不显示顶部tab导航
        if (prop.onSelect) {
            return getTreeListView()
        }

        let contactTypeList = [
            {
                type: "我的班级",
                name: "我的班级",
            },
            {
                type: "我的老师",
                name: "我的老师",
            },
        ]

        const routes = contactTypeList.map((value, idx) => {
            return {
                key: value.type,
                title: value.name,
                view: () => (
                    getTreeListView(idx != 0 ? cfg.user.dat.getUserId() : undefined)
                ),
            }
        })

        return (
            <TabView
                lazy={true}
                tabBarPosition="top"
                navigationState={{ index: st.index, routes: routes }}
                renderScene={(prop) => prop.route.view()}
                onIndexChange={(index) => {
                    st.index = index;
                    st.$update;
                }}
                sceneContainerStyle={{}}
                renderTabBar={commonTabLight()}
            />
        )
    }




    /////////////////////////////////////////
    ////////////return ContactView///////////
    ////////////////////////////////////////
    return (

        <Container style={{}}>
            <HeaderBar title={"通讯录"} />
            {!prop.enSearch ? null : <V style={[{ backgroundColor: getHeaderColor(), width: "100%", paddingHorizontal: 30, paddingTop: app.isWeb ? 10 : 5, paddingBottom: 10 },]}>
                <SearchView
                    state={[st, "searchText"]}
                    numberOfLines={1}
                    style={{}}
                    placeholder="输入关键词"
                    onSearch={(t) => onSearch(t)} />
            </V>}
            <V style={[{
                padding: 0,
                flex: 1,
                backgroundColor: prop.onSelect ? colors.background1 : colors.transparent,
            }, prop.onSelect ? styles.topRound : null]}>
                {getContentView()}
                {
                    prop.onSelect ?
                        <ButtonView
                            onPress={() => {
                                if (st.selects.size == 0) {
                                    app.msg("请先选择成员！");
                                    return;
                                }
                                prop.onSelect?.(st.selects);
                                app.pop();

                            }}
                            style={[{ margin: 10 },]}>确定{st.selects.size > 0 ? `(${st.selects.size})` : ""}</ButtonView>
                        : null
                }

            </V>
        </Container>
    )

}



export function CardCheckView() {

    return <V style={[{
        right: -1,
        top: -1,
        position: "absolute",
        padding: 3,
        backgroundColor: colors.primary,
        borderBottomLeftRadius: 5,
        borderTopRightRadius: 5,
    },]}>
        <Icon name="done" size={10} color={colors.white} />
    </V>
}

/**
 * 横向成员视图
 */
function getRowMemberView(
    showPhone: boolean | undefined,
    //是否开启选择模式
    hasSelect: boolean,
    //是否选中
    isCheck: boolean,
    dat: ContactData,
    cancel: boolean,
    onPress?: (dat: ContactData) => void,


) {
    //成员
    return (
        <PressView
            key={dat.id}
            onPress={() => onPress?.(dat)}
            style={[{
                paddingHorizontal: 10,
                paddingVertical: 5,
            },
            styles.rowCenter]}>

            <AvatarText
                style={[{},]}
                text={dat.getName()}
                size={40} />
            <V style={{
                marginLeft: 15,
                color: colors.black,
                fontSize: 15,
            }}>{dat.getName()}</V>

            <V style={[{
                flex: 1,
                color: colors.grey9,
                marginLeft: 15,
            },]}>{showPhone ? dat.getPhone() : dat.duty}</V>

            {cancel ? getCancelView() : null}
            {
                hasSelect ?
                    <CheckView
                        box
                        checked={isCheck}
                        onPress={() => onPress?.(dat)}
                        size={15} />
                    : null
            }

        </PressView>
    )
}


/**
 * 卡片成员视图
 * @param isCheck 
 * @param dat 
 * @param cancel 
 * @param onPress 
 * @returns 
 */
function getMemberView(isCheck: boolean, dat: ContactData, cancel: boolean, onPress?: (dat: ContactData, v: View) => void) {

    //成员
    return (
        <PressView
            key={dat.id}
            onPress={(ev) => {
                onPress?.(dat, ev.currentTarget as unknown as View);
            }}
            style={[{
                alignSelf: "flex-start",
                padding: 12,
                margin: 7,
                borderWidth: 1,
                borderColor: isCheck || cancel ? colors.primary : colors.white,
            },
            styles.columnCenter, styles.cardWhite]}>

            <Pic source={dat.isMale() ? imgs.male : imgs.female} style={{ width: 40, height: 40 }} />
            <V style={{ marginTop: 5 }}>{dat.getName()}</V>
            {
                cancel ? getCancelView() : null
            }
            {
                isCheck ?
                    <CardCheckView />
                    : null
            }

        </PressView>
    )
}

function getCancelView() {
    return <V style={[{
        right: -1,
        top: -1,
        position: "absolute",
        padding: 3,
        borderColor: colors.primary,
        borderWidth: 1,
        borderBottomLeftRadius: 5, borderTopRightRadius: 5,
    },]}>
        <V style={[{
            width: 10,
            height: 2,
            marginVertical: 4,
            backgroundColor: colors.primary,
        },]} />

    </V>
}


export class ListCheckViewState {

    get $update() {
        return
    }
}


/**
 * 指定人员或部门列表的多项选择
 * @param selects
 * @param onCancelItem
 * @returns
 */
export function ListCheckView(prop: {
    /**
     * 显示的人员列表
     */
    list: Array<ContactData>,
    /**
     * 选中项<id,人员>
     */
    selects: Map<string, ContactData>,
    onClick: () => void
}) {

    const st = useObjState(() => new ListCheckViewState());
    const selects = prop.selects;
    const list = prop.list;

    function onCheck(it: ContactData) {
        if (selects.get(it.id)) {
            //清空
            selects.delete(it.id)
        } else {
            selects.set(it.id, it);
        }
        st.$update;
        prop.onClick();
    }

    let ret = Array<ReactElement>();
    list.forEach(it => {

        let isCheck = selects.get(it.id) != null;

        if (it.isDepartment()) {
            ret.push(
                <PressView
                    key={it.id}

                    onPress={(event) => onCheck(it)}

                    style={[{
                        padding: 15,
                        margin: 7,
                        borderWidth: 1,
                        borderColor: isCheck ? colors.primary : colors.transparent,
                    },
                    styles.columnCenter, styles.cardWhite]}>

                    {/* 部门名称 */}
                    <V style={{}}>{it.getName()}</V>
                    {isCheck ?
                        <CardCheckView />
                        : null}
                </PressView>
            )
        } else {
            //成员
            ret.push(getMemberView(isCheck, it, false, onCheck))
        }

    })
    return <>{ret}</>;
}



/**
 * 选中人员或部门列表
 * @param selects 
 * @param onCancelItem 
 * @returns 
 */
export function getSelectsView(selects: Map<string, ContactData>, onCancelItem?: (d: ContactData, v: View) => void) {
    let ret = Array<ReactElement>();
    selects.forEach(it => {
        if (it.isDepartment()) {
            ret.push(
                <PressView
                    key={it.id}

                    onPress={(event) => {
                        onCancelItem?.(it, event.currentTarget as unknown as View)
                    }}

                    style={[{
                        padding: 15,
                        margin: 7,
                        borderWidth: 1,
                        borderColor: colors.primary,
                    },
                    styles.columnCenter, styles.cardWhite]}>


                    <V style={{}}>{it.getName()}</V>
                    {getCancelView()}
                </PressView>
            )
        } else {
            ret.push(getMemberView(false, it, onCancelItem ? true : false, onCancelItem))
        }

    })
    return ret;
}

const sty = StyleSheet.create({

})