import { AnimDeg } from '@common/lib/Anim';
import React, { Component, ReactElement } from 'react';
import { Animated, View, ViewProps, ViewStyle } from "react-native";
import { colors } from "../../../components/colors";


export class TreeNode {

    constructor(private setData: (list: Array<any>) => void) {

    }

    /**
     * 子节点集合
     */
    subs = new Map<TreeNode, number>();

    /**
     * 包裹子节点列表View的style
     */
    style?: ViewStyle

    //节点在父节点中的索引
    index = 0;

    /**
     * 节点是否为折叠状态
     */
    isFold = true

    //当前节点的左边距（父节点个数）
    left = 0;

    /**
     * 是否未初始化
     */
    notBind = true;

    //子节点渲染函数
    renderFunc?: (d: any, node: TreeNode, index: number) => ReactElement;

    //数据列表缓存
    list?: Array<any>;

    /**
     * 清除当前节点数据
     */
    clear() {
        if (!this.isFold) {
            this.isFold = true;
            this.notBind = true;
            this.arrowAnim.setValue(0);
        }
        if (this.list) {
            this.list.length = 0;
        }

    }

    /**
     * 绑定节点数据
     * @param list 数据
     * @param onRender 节点展示回调
     */
    bindList<T>(list: Array<T>, onRender: (d: T, node: TreeNode, index: number) => ReactElement) {
        if (this.isFold) {
            return;
        }
        this.notBind = false;
        this.renderFunc = onRender;


        // this.subs.forEach((v, it) => {
        //     it.clear();
        // })
        this.subs.clear();
        if (list) {
            this.list = list;
            this.setData(list);
        }

    }



    /**
     * 折叠
     */
    fold() {
        this.arrowAnim.start(0)
        this.isFold = true;
        this.setData([]);
    }


    /**
     * 展开
     */
    unfold() {
        this.arrowAnim.start(90)
        this.isFold = false;
        if (this.list) {
            this.setData(this.list);
        }
    }

    /**
     * 设置节点状态为：展开
     */
    setUnfold() {
        this.arrowAnim.setValue(90);
        this.isFold = false;
    }

    /**
     * 切换节点展开或折叠状态
     */
    toggle() {
        if (this.isFold) {
            this.unfold()
        }
        else {
            this.fold();
        }
    }

    private arrowAnim = new AnimDeg()

    arrow() {
        return <Animated.View
            style={{
                transform: [
                    this.arrowAnim.rotate,
                ],
                width: 3,
                height: 12,
                backgroundColor: colors.primary,

                // width: 0,
                // height: 0,
                // borderStyle: 'solid',
                // borderWidth: 6,
                // borderTopColor: '#ffffff00',//下箭头颜色
                // borderLeftColor: colors.primary,//右箭头颜色
                // borderBottomColor: '#ffffff00',//上箭头颜色
                // borderRightColor: '#ffffff00'//左箭头颜色
            }} />
    }

}


export interface TreeViewProp extends ViewProps {
    /**
     * 初始化回调
     */
    onInit: (node: TreeNode) => void;
}

export class TreeViewState {
    //节点数据列表
    datas = Array<any>()
}


/**
 * 树
 */
export class TreeView extends Component<TreeViewProp, TreeViewState> {

    node = new TreeNode((list) => this.setState({ datas: list }))

    constructor(props: TreeViewProp) {
        super(props);
        this.state = new TreeViewState();
        this.node.isFold = false;
    }


    componentDidMount() {
        this.props.onInit(this.node)
    }
    componentWillUnmount() {
    }

    render() {

        return (
            <View style={this.props.style}>
                {
                    this.state.datas.map((it, i) => <TreeNodeView key={i} index={i} parent={this.node} data={it} left={1} />)
                }
            </View>
        );
    }




}
export interface TreeNodeProp extends ViewProps {
    //节点数据
    data: any;
    //左边距
    left: number;
    //父节点
    parent: TreeNode;
    //位于父节点中的索引
    index: number;
}

export class TreeNodeState {
    //节点数据列表
    datas = Array<any>()
}


/**
 * 节点view
 */
export class TreeNodeView extends Component<TreeNodeProp, TreeNodeState> {

    node = new TreeNode((list) => this.setState({ datas: list }))

    constructor(props: TreeNodeProp) {
        super(props);
        this.state = new TreeNodeState();
        this.node.left = props.left;
        this.node.index = props.index;

    }




    render() {
        this.props.parent.subs.set(this.node, this.props.index)
        return (
            [
                this.props.parent.renderFunc?.(this.props.data, this.node, this.props.index)
                ,
                this.state.datas.length > 0 ?
                    <View key={2} style={this.node.style}>
                        {
                            this.state.datas.map((res, i) => {
                                return (
                                    <TreeNodeView key={i} index={i} parent={this.node} data={res} left={this.props.left + 1} />
                                )
                            })

                        }
                    </View> : null,
            ]
        );
    }




}