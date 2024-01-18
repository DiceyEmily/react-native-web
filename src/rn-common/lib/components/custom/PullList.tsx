import { useFocusEffect } from '@react-navigation/native';
import React, { Component } from 'react';
import { ActivityIndicator, FlatList, GestureResponderEvent, InteractionManager, ListRenderItemInfo, NativeScrollEvent, NativeSyntheticEvent, PanResponder, PanResponderGestureState, Platform, RefreshControl, View, ViewProps } from 'react-native';
import { colors } from "../../../components/colors";
import { styles } from '../../../components/styles';
import { app } from '../../app';
import { lib } from '../../lib';
import { ResultBuffer } from '../ResultBuffer';
import { PullHeader } from './PullHeader';
import { SubContainer } from './SubContainer';
import { V } from './V';

export interface FoucsViewProp {
    onFocus: (focus: boolean) => void;
}

export function FoucsView(props: FoucsViewProp) {
    let onFocus = React.useRef(props.onFocus);
    useFocusEffect(
        React.useCallback(() => {
            const task = InteractionManager.runAfterInteractions(() => {
                setTimeout(() => {
                    onFocus.current(true)
                }, 20)
            });
            return () => {
                // Expensive task
                // task.cancel();
                onFocus.current(false)
            };
        }, [])
    );
    return <></>
}

export interface PullListProp<ItemT> extends ViewProps {

    /**
     * 获取列表item的每项id
     */
    keyExtractor?: (item: ItemT, index: number) => string;

    /**
     * 一屏显示的item数量*2
     */
    renderSize?: number;

    /**
     * 单id加载数据回调(id:分页id,刷新时为0,加载更多时为最小id)
     */
    onGetListById?: (id: number) => Promise<ItemT[]>;

    /**
     * 通过页码加载数据(page从1开始)
     */
    onGetListByPage?: (page: number, ref: PullList<ItemT>) => Promise<ItemT[]> | ResultBuffer<ItemT[]>;

    /**
     * 双id加载数据回调(id:分页主键id,第二排序id,刷新时为0,加载更多时为最小id)
     */
    onGetListByTwoId?: (id: number, second: number) => Promise<ItemT[]>;

    /**
     * 没有数据时视图
     */
    emptyView?: React.ComponentType<any>;

    /**
     * 获取分页主键id字段
     */
    onGetId?: (dat: ItemT) => number;
    /**
     * 第二排序id(主排序字段,例如更新时间)
     */
    onSecondId?: (dat: ItemT) => number;

    /**
     * item渲染回调
     */
    renderItem: (info: ListRenderItemInfo<ItemT>, ref: PullList<ItemT>) => React.ReactElement | null;

    //显示在底部的更多提示
    name?: string;

    //是否禁用加载更多功能
    disableMore?: boolean;

    //是否禁用下拉刷新功能
    disableRefresh?: boolean;

    //渲染头部
    renderHeader?: () => any;

    /**
     * 分割线
     */
    ItemSeparatorComponent?: React.ComponentType<any>

    /**
     * 是否自动加载数据
     */
    autoLoad?: boolean;

    /**
     * 是否多列展示
     */
    numColumns?: number;


    /**
     * 禁用自动刷新item
     * 可提高性能,但需要手动刷新每个item
     */
    // disableAutoUpdate?: boolean;

    /**
     * 禁用后台刷新
     */
    // disableBackgroundUpdate?: boolean;
}


export class PullListState<ItemT> {

    //是否正在加载更多数据
    loading = false

    //是否正在刷新数据
    isRefreshing = false //for pull to refresh

    loadMoreText = "";

    loadingText = "加载中..."

    /**
    * 主数据列表
    */
    data = Array<ItemT>();

}

/**
 * 上下拉刷新List
 * 泛型参数为列表item数据类型
 * 
 */
export class PullList<ItemT> extends Component<PullListProp<ItemT>, PullListState<ItemT>> {



    flat: FlatList<ItemT> | null = null;


    constructor(props: PullListProp<ItemT>) {
        super(props);
        this.state = new PullListState();
        if (props.onGetListById == null && props.onGetListByTwoId == null && props.onGetListByPage == null) {
            throw lib.err("onGetListById 或onGetListByTwoId或onGetListByPage至少有一个")
        }

    }


    _handleMoveShouldSetPanResponder = (e: GestureResponderEvent, gestureState: PanResponderGestureState): boolean => {/*eslint @typescript-eslint/no-unused-vars: 0*/
        // Should we become active when the user moves a touch over the circle?
        // console.log("_handleMoveShouldSetPanResponder", gestureState,)
        if (Math.abs(gestureState.vx) > Math.abs(gestureState.vy)) {

            return false;
        }
        return true;
    };


    currentX = 0
    currentY = 0;

    deleteIndex(idx: number) {
        this.state.data.splice(idx, 1);
        this.setState(this.state);
    }

    _handlePanResponderGrant = (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        this.webHeader?._handlePanResponderGrant(e, gestureState)
    };

    _handlePanResponderMove = (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        this.currentX = gestureState.dx
        this.currentY = gestureState.dy
        this.webHeader?._handlePanResponderMove(e, gestureState)
    };

    _handlePanResponderEnd = (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        this.webHeader?._handlePanResponderEnd(e, gestureState)
    };

    panResponder = Platform.OS === "web" ? PanResponder.create({
        onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
        onPanResponderGrant: this._handlePanResponderGrant,
        onPanResponderMove: this._handlePanResponderMove,
        onPanResponderRelease: this._handlePanResponderEnd,
        onPanResponderTerminate: this._handlePanResponderEnd,
        // onMoveShouldSetPanResponderCapture: () => {
        //     console.log("onMoveShouldSetPanResponderCapture")
        //     return true;
        // },
        onPanResponderReject: () => {
            console.log('onPanResponderReject')
        },
        onPanResponderTerminationRequest: () => {
            console.log('onPanResponderTerminationRequest')
            return true
        },
    }).panHandlers : {}


    //页面是否unmount
    finished = false;


    componentDidMount() {
        if (this.props.autoLoad) {
            this.loadMore(true);
        }
    }

    componentWillUnmount() {

        // console.log("pullList WillUnmount")
        this.finished = true;
    }



    oldLength = 0;


    /**
     * 记录是否需要后台更新
     */
    // backgroundUpdate = false;
    // shouldComponentUpdate(nextProps: PullListProp<ItemT>, nextState: PullListState<ItemT>) {


    //     if (!this.focus) {
    //         if (this.props.renderHeader) {
    //             this.header?.update(this.props.renderHeader())
    //         }
    //         if (!this.props.disableBackgroundUpdate)
    //             this.backgroundUpdate = true;

    //         return false;
    //     }
    //     if (this.props.disableAutoUpdate) {
    //         if (this.state.data.length != this.oldLength) {
    //             this.oldLength = this.state.data.length;
    //             return true;
    //         }

    //         if (this.state.loadingText != nextState.loadingText
    //             || this.state.loadMoreText != nextState.loadMoreText
    //             || this.state.isRefreshing != nextState.isRefreshing
    //             || this.state.loading != nextState.loading
    //         ) {
    //             return true;
    //         }

    //         if (this.props.renderHeader) {
    //             this.header?.update(this.props.renderHeader())
    //         }
    //         return false;
    //     } else {
    //         this.oldLength = this.state.data.length;
    //         return true;
    //     }
    // }


    scrollToIndex(index: number, params?: {
        animated?: boolean | null;
        viewOffset?: number;
        viewPosition?: number;
    }) {
        if (this.flat) {
            this.flat.scrollToIndex({ index: index, ...params })
        }
    }

    update() {
        this.forceUpdate();
    }


    /**
     * 用于单独更新header
     */
    header?: SubContainer | null;


    getHeader = () => {
        if (Platform.OS !== "web") {
            if (this.props.renderHeader) {
                return <SubContainer ref={ref => this.header = ref} p={{ view: this.props.renderHeader() }} />;
            }

        }

        if (this.props.renderHeader) {
            return <V>
                <PullHeader onRefresh={() => this.onRefresh(false)} ref={ref => { this.webHeader = ref }} />
                <SubContainer ref={ref => this.header = ref} p={{ view: this.props.renderHeader() }} />
            </V>
        }

        return (
            <PullHeader onRefresh={() => this.onRefresh(false)} ref={ref => { this.webHeader = ref }} />
        )
    }

    webHeader: PullHeader | null = null;


    renderItem = (item: ListRenderItemInfo<ItemT>) => {
        return this.props.renderItem(item, this)
    }


    onFocus = (focus: boolean) => {
        // console.log("focus:", focus, this.oldLength, this.state.data.length)


        this.focus = focus;

        if (focus) {
            if (this.loadMoreTask) {
                this.loadMoreTask();
                this.loadMoreTask = undefined;
            }
            //  else if (this.backgroundUpdate) {
            //     this.setState(this.state);
            // }

            // this.backgroundUpdate = false;
        }
    }

    focus = true;
    render() {

        let renderSize = this.props.renderSize ?? app.pageNum;

        return (
            <>
                <FoucsView onFocus={this.onFocus} />
                <FlatList
                    // bounces={false}
                    {...this.panResponder}
                    removeClippedSubviews={app.isWeb ? false : true}
                    // maxToRenderPerBatch={renderSize / 2 + 1}
                    // windowSize={renderSize + 1}
                    // debug={false}
                    numColumns={this.props.numColumns ?? 1}
                    ref={it => { this.flat = it }}
                    style={[app.isWeb ? { height: 1 } : { flex: 1, }, this.props.style]}
                    ListEmptyComponent={this.state.isRefreshing || this.state.loading ? null : this.props.emptyView}
                    ItemSeparatorComponent={this.props.ItemSeparatorComponent}
                    ListHeaderComponent={this.getHeader}
                    refreshControl={
                        this.props.disableRefresh ? null as any
                            :
                            <RefreshControl
                                colors={[colors.primary]}
                                refreshing={this.state.isRefreshing}
                                onRefresh={() => this.onRefresh(false)}
                            />
                    }
                    keyExtractor={this.props.keyExtractor ? this.props.keyExtractor : (item, index) => index.toString()}
                    data={this.state.data}
                    renderItem={this.renderItem}
                    scrollEventThrottle={15}
                    ListFooterComponent={this.renderFooter}
                    //android下Threshold是相对于List总长度
                    onEndReachedThreshold={0.13}
                    onScroll={this.onScroll}
                    onEndReached={() => { if (!this.props.disableMore) this.loadMore(false) }}
                />
            </>
        );
    }


    scrollY = 0;


    onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        this.scrollY = e.nativeEvent.contentOffset.y;
        this.webHeader?._onScrool(e)
    }


    /**
     * 记录每页索引范围,end为index+1, 用于更新缓存
     */
    pageIndex = Array<{ start: number, end: number }>();


    private setRefreshRes(res: ItemT[], page: number) {

        if (!this.setData(res, page, true)) {
            return;
        }

        if (res.length < app.pageNum) {//没有更多
            this.isCanLoadMore = false;
            this.setState({ isRefreshing: false });
            this.setMoreText()
            this.webHeader?.pullEnd()
        }
        else {
            this.isCanLoadMore = true;
            this.setState({ isRefreshing: false });
            this.setMoreText('')
            this.webHeader?.pullEnd()
        }
    }

    private onRefreshError(error: Error) {
        if (this.finished)
            return;
        this.webHeader?.pullEnd()
        this.isCanLoadMore = false;
        this.setState({ isRefreshing: false });
        this.setMoreText(error.message)
    }

    /**
     * 重新加载数据,刷新界面
     */
    async onRefresh(buffer = true) {
        if (this.finished)
            return;
        this.setState({ isRefreshing: true });
        this.pageIndex.length = 0;
        //await sys.sleep(1200);
        try {
            let page = 1;
            this.page = page;
            let res = Array<ItemT>();
            if (this.props.onGetListByTwoId) {
                res = await this.props.onGetListByTwoId(0, 0);
            }
            else if (this.props.onGetListByPage) {
                let pgRes = this.props.onGetListByPage(page, this);

                if (pgRes instanceof ResultBuffer) {

                    if (!buffer) {
                        let list = await pgRes.result
                        this.setRefreshRes(list, page);
                        return;
                    }

                    pgRes.each(list => {
                        this.setRefreshRes(list, page);
                    }).catch(err => {
                        this.onRefreshError(err)
                    });
                    return;
                }

                res = await pgRes;

            }
            else if (this.props.onGetListById) {
                res = await this.props.onGetListById(0);
            }
            this.setRefreshRes(res, page);
        }
        catch (error) {
            this.onRefreshError((error as Error))
        }

    }


    page = 0;


    /**
     * 当处于后台时保存修改状态task
     */
    private loadMoreTask?: () => void


    private setData(res: ItemT[], page: number, clear = false) {
        if (this.finished)
            return false;

        if (res == null)
            res = [];

        if (this.page < page) {
            return false;
        }

        let idxs = this.pageIndex[page - 1];
        if (idxs) {//第二次刷新
            let oldCount = idxs.end - idxs.start;
            if (oldCount > 0) {
                this.state.data.splice(idxs.start, oldCount)
            }
            if (res.length > 0) {
                this.state.data.add(idxs.start, res);
            }
            let len = res.length - oldCount
            if (len != 0) {
                //更新后续索引
                for (let i = page; i < this.pageIndex.length; i++) {
                    let ci = this.pageIndex[i];
                    if (ci) {
                        ci.start += len;
                        ci.end += len;
                    }
                }
            }
            this.pageIndex[page - 1] = { start: idxs.start, end: idxs.start + res.length };
        } else {//第一次刷新
            if (clear) {
                this.state.data.length = 0;
            }
            let start = this.state.data.length
            res.forEach(it => this.state.data.push(it));
            this.pageIndex[page - 1] = { start: start, end: start + res.length };
        }

        return true;

    }

    private setLoadMoreRes(res: ItemT[], page: number) {
        let task = () => {

            if (!this.setData(res, page)) {
                return;
            }

            //加载数据不足,已加载完全部数据,禁止加载更多
            if (res.length < app.pageNum) {
                this.isCanLoadMore = false;
                this.setState({ loading: false });
                this.setMoreText()
            }
            else {
                this.setMoreText('')
                this.isCanLoadMore = true;
                this.setState({ loading: false });
            }
        }
        if (this.focus || this.state.data.length == 0) {
            task();
        } else {
            this.loadMoreTask = task;
        }
    }

    private onLoadError(error: Error) {
        if (this.finished)
            return;
        let task = () => {
            this.isCanLoadMore = false;
            this.setState({ loading: false });
            this.setMoreText(error.message);
        }
        if (this.focus) {
            task();
        } else {
            this.loadMoreTask = task;
        }
    }
    /**
     * 加载更多数据
     */
    loadMore = async (autoLoad: boolean = false) => {

        if (this.finished)
            return;
        if (!this.state.loading && this.isCanLoadMore) {

            this.setState({ loading: true })
            let id = 0;

            let page = this.page + 1;
            if (this.props.onGetListByPage) {
                this.page = page;
            }
            else if (this.props.onGetId) {
                id = this.state.data.length > 0 ? this.props.onGetId(this.state.data[this.state.data.length - 1]) : 0;
            }

            let secondId = 0;
            if (this.props.onSecondId != null) {//主排序键
                secondId = this.state.data.length > 0 ? this.props.onSecondId(this.state.data[this.state.data.length - 1]) : 0;
            }
            try {
                let res = Array<ItemT>();
                if (this.props.onGetListByTwoId) {
                    res = await this.props.onGetListByTwoId(id, secondId);
                }
                else if (this.props.onGetListByPage) {
                    let pgRes = this.props.onGetListByPage(page, this);
                    if (pgRes instanceof ResultBuffer) {
                        pgRes.each(res => {
                            this.setLoadMoreRes(res, page);
                        }).catch(err => {
                            this.onLoadError(err)
                        });
                        return;
                    }
                    res = await pgRes;
                }
                else if (this.props.onGetListById) {
                    res = await this.props.onGetListById(id);
                }


                this.setLoadMoreRes(res, page);
            } catch (error) {
                this.onLoadError(error as Error)
            }

            // if (autoLoad && Platform.OS === "web")
            //     this.webHeader?.hideHeader()
            // this.flat?.scrollToIndex({ animated: true, index: 0, })

        }
    };

    /**
     * 清空列表并刷新
     */
    clearRefresh() {
        this.clear();
        this.loadMore();
    }



    isCanLoadMore = true;

    clear() {
        if (this.state.loading) {
            return;
        }
        this.page = 0;
        this.state.data.length = 0;
        //this.setState({ loadMoreText: "没有更多" + this.props.name + "了" });
        this.isCanLoadMore = true;
        if (this.props.emptyView)
            this.setState({ loadMoreText: "" });
        else
            this.setState({ loadMoreText: this.props.name ? this.props.name : "数据加载完毕" });
    }

    remove(index: number) {
        this.state.data.splice(index, 1);
        this.setState(this.state);
    }

    setMoreText(more: string | null = null) {
        if (more == null) {
            if (this.props.emptyView && this.state.data.length === 0)
                this.setState({ loadMoreText: "" });
            else
                this.setState({ loadMoreText: this.props.name ? this.props.name : "数据加载完毕" });
        }
        else {
            this.setState({ loadMoreText: more });
        }
    }

    renderFooter = () => {
        //it will show indicator at the bottom of the list when data is loading otherwise it returns Text

        return (

            <View

                style={[{ padding: 5 }, styles.center]} >
                {
                    this.state.loading ?
                        <View style={{ flexDirection: "row" }}>
                            <ActivityIndicator
                                size={20}
                                color={colors.primary}
                            />
                            <V style={{ padding: 8, color: colors.greyA }} >加载中...</V>
                        </View>
                        : <V style={{ padding: 8, color: colors.greyA }} >{this.state.loadMoreText}</V>
                }



            </View>


        );
    };






}




