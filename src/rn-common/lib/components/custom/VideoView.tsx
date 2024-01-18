import React, { Component, MutableRefObject, ReactElement } from 'react';
import { ActivityIndicator, BackHandler, GestureResponderEvent, LayoutChangeEvent, StatusBar, Text, View, ViewProps } from "react-native";
import { lib } from '../../lib';
import { native } from '../../native';
import { app } from '../../app';
import { Icon } from '../icon/Icon';
import { styles } from '../../../components/styles';
import { colors } from "../../../components/colors";
import { PressView } from './PressView';
import SliderView from './SliderView';
import { VideoImpl } from './VideoImpl';


export interface IPlayer {
    seek(time: number, tolerance?: number): void;
    presentFullscreenPlayer(): void;
    dismissFullscreenPlayer(): void;
}

export interface OnLoadData {
    canPlayFastForward: boolean;
    canPlayReverse: boolean;
    canPlaySlowForward: boolean;
    canPlaySlowReverse: boolean;
    canStepBackward: boolean;
    canStepForward: boolean;
    currentTime: number;
    duration: number;
    naturalSize: {
        height: number;
        width: number;
        orientation: 'horizontal' | 'landscape';
    };
}

export interface OnProgressData {
    currentTime: number;
    playableDuration: number;
    seekableDuration: number;
}

export interface VideoViewProp extends ViewProps {
    /**
    * 切换屏幕方向回调(是否横屏)
    */
    onOrientation?: (isLandscape: boolean) => void;

    //视频地址
    source: { uri?: string, headers?: { [key: string]: string } };

    //默认图片
    poster?: string;

    //自动播放
    autoPlay?: boolean;

    refPlayer?: MutableRefObject<IPlayer | null>;

    onEnd?(): void;

    onLoad?(data: OnLoadData): void;

    onProgress?(data: OnProgressData): void;
}

export class VideoViewState {
    /**
     * 是否全屏
     */
    isFullScreen = false;

    /**
     * 隐藏操作按钮
     */
    hideState = false;

    video_title = "";

    /**
    * 视频时长(秒,小数)
    */
    duration = 0.0;

    /**
     * 当前播放位置(秒,小数)
     */
    currentTime = 0.0;

    /**
    * 是否在缓冲
    */
    buffering = true;


    /**
     * 滑动跳转位置
     */
    seekTime = 0;

    /**
   * 暂停
   */
    paused = false;

}





/**
 * 视频播放器
 */
export class VideoView extends Component<VideoViewProp, VideoViewState> {

    constructor(props: VideoViewProp) {
        super(props);
        this.state = new VideoViewState();
    }


    _onLayout(event: LayoutChangeEvent): void {/*eslint @typescript-eslint/no-unused-vars: 0*/

        let width = app.window.width;
        let height = app.window.height;
        // 一般设备横屏下都是宽大于高，这里可以用这个来判断横竖屏

        let isLandscape = (width > height);
        if (isLandscape) {
            if (this.props.onOrientation)
                this.props.onOrientation(true)

        } else {
            if (this.props.onOrientation)
                this.props.onOrientation(false)

        }
        // this.hideState();
        //Orientation.unlockAllOrientations();
    }

    _root: View | null = null;

    player: MutableRefObject<IPlayer | null> = { current: null }

    seekStartTime = 0;

    baseView?: ReactElement



    /**
    * 记录按下时的坐标
    */
    touchX = 0;
    touchY = 0;
    onTouchEnd(event: import("react-native").GestureResponderEvent): void {
        if (Math.abs(event.nativeEvent.pageX - this.touchX) < 2 && Math.abs(event.nativeEvent.pageY - this.touchY) < 2) {
            //点击事件
            if (this.state.hideState) {
                this.hideState();
            }
            this.setState({ hideState: !this.state.hideState });
        }
        else { //滑动跳转
            if (this.state.seekTime !== 0) {
                if (this.player.current) {
                    this.player.current.seek(this.seekStartTime + this.state.seekTime, 1);
                    if (this.state.paused) {
                        this.setState({ paused: false });
                    }
                }
            }
        }
        this.setState({ seekTime: 0 });
    }

    onTouchMove(event: import("react-native").GestureResponderEvent): void {
        let len = Math.floor((event.nativeEvent.pageX - this.touchX) / 2);
        if (this.seekStartTime + len < 0) {
            len = 0 - this.seekStartTime;
        }
        if (this.seekStartTime + len > this.state.duration) {
            len = this.state.duration - this.seekStartTime;
        }

        if (this.state)
            this.setState({ seekTime: len });
    }

    onTouchStart(event: import("react-native").GestureResponderEvent): void {
        this.touchX = event.nativeEvent.pageX;
        this.touchY = event.nativeEvent.pageY;
        this.seekStartTime = this.state.currentTime;
    }

    onSliderChange(value: number): void {
        //sys.msg("slider" + value)
        if (this.player.current) {
            this.player.current.seek(value * this.state.duration / 1000, 1)
        }
    }


    getTitle() {
        if (this.state.video_title.length > 20) {
            return this.state.video_title.substr(0, 20) + "...";
        }
        return this.state.video_title;
    }


    /**
        * 隐藏操作按钮Timeout
        */
    hideStateTime: any;

    /**
         * 定时隐藏按钮
    */
    hideState() {
        if (this.hideStateTime) {
            clearTimeout(this.hideStateTime);
        }
        this.hideStateTime = setTimeout(() => {
            this.setState({ hideState: true });
        }, 2.5 * 1000);
    }

    onLoad(data: OnLoadData) {
        //this.hideState();
        this.isEnd = false;
        this.setState({
            duration: data.duration,
            currentTime: 0, buffering: false
        });

    }

    /**
    * 暂停事件
    */
    onPressPause() {
        this.setState({ paused: !this.state.paused })

        if (this.state.paused) {
            this.hideState();
        }
        else {

            clearTimeout(this.hideStateTime);
        }
    }


    fullBottom() {
        return null
    }
    /**
     * 当前播放千分比
     */
    getCurrentTimePercentage() {
        if (this.state.currentTime > 0 && this.state.duration > 0) {
            return Math.floor(this.state.currentTime as any * 1000 / this.state.duration);
        }
        return 0;
    }


    /**
     * 播放进度回调
     * @param data 
     */
    onProgress(data: OnProgressData): void {
        if (this.onSlider) {
            return;
        }
        this.setState({ currentTime: data.currentTime, buffering: false });
    }

    isEnd = false
    onEnd() {
        this.isEnd = true;
        this.player.current?.seek(0);
        this.setState({ paused: true, currentTime: this.state.duration });
    }

    /**
     * 当前播放时间/总长
     */
    getTimeStr() {
        return lib.timeSecToStr(this.state.currentTime) + "/" + lib.timeSecToStr(this.state.duration);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    componentWillUnmount() {
        if (this.state.isFullScreen)
            native.orientationPortrait();
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress = () => {
        //全屏时,按返回键退出全屏
        if (this.state.isFullScreen) {
            this.onPressFullScreen();
            return true;
        }
        return false

    }

    /**
    * 切换横竖屏
    */
    onPressFullScreen(): void {
        if (this.state.isFullScreen) {
            native.orientationPortrait();
            this.player.current?.dismissFullscreenPlayer();
        }
        else {
            native.orientationLandscape();
            this.player.current?.presentFullscreenPlayer();
        }
        this.setState({ isFullScreen: !this.state.isFullScreen });

    }


    render() {

        if (app.isWeb) {
            return (
                <View
                    ref={v => { this._root = v }}
                    style={[{
                        justifyContent: "center",
                    }, this.props.style]}
                >
                    {VideoImpl.getVideo({
                        autoPlay: this.props.autoPlay,
                        poster: this.props.poster,
                        source: this.props.source,
                        refPlayer: this.player,
                    })}
                </View>

            )
        }

        this.baseView = (
            <View
                ref={v => { this._root = v }}
                style={[{
                    justifyContent: "center",
                }, this.props.style,
                this.state.isFullScreen ? {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    zIndex: 99,
                } : {}
                ]}
                onLayout={(event) => this._onLayout(event)}>
                {this.state.isFullScreen ? <StatusBar hidden={true} /> : null}
                {VideoImpl.getVideo({
                    onTouchStart: (event: GestureResponderEvent) => this.onTouchStart(event),
                    onTouchMove: (event: GestureResponderEvent) => this.onTouchMove(event),
                    onTouchEnd: (event: GestureResponderEvent) => this.onTouchEnd(event),
                    autoPlay: this.props.autoPlay,
                    paused: this.state.paused,
                    progressUpdateInterval: 500,
                    poster: this.props.poster,
                    source: this.props.source,
                    refPlayer: this.player,
                    onEnd: () => this.onEnd(),//视频播放结束时的回调函数
                    onLoad: (d: any) => this.onLoad(d),//加载媒体并准备播放时调用的回调函数。
                    onProgress: (data: any) => this.onProgress(data),//视频播放过程中每个间隔进度单位调用的回调函数
                })}

                {this.state.hideState ? null :
                    this.header()
                }
                {this.renderLoad()}
                {
                    //左右滑动,跳转搜索
                    this.state.seekTime !== 0 ?
                        this.search()
                        : null}

                <View style={[{ position: "absolute", bottom: 0, left: 0, width: "100%" },]} >
                    {this.state.hideState ? null :
                        this.bottom()
                    }
                </View>
            </View>

        )


        return (this.baseView)
    }




    /**
     * 左右滑动搜索进度
     * @returns 
     */
    search() {
        return (
            <View
                style={[{
                    position: "absolute", alignSelf: "center", alignItems: "center",
                    backgroundColor: colors.blackTrans, padding: 9
                }, styles.column]}
            >
                <Icon name={this.state.seekTime > 0 ? "fast_forward" : "fast_rewind"}
                    size={40} color={colors.white} />
                <Text style={[{ fontSize: 19, color: colors.white },]} >
                    {this.state.seekTime > 0 ? "+" + Math.floor(this.state.seekTime) : Math.floor(this.state.seekTime)}
                </Text>
                <Text style={[{ fontSize: 15, color: colors.white, marginTop: 3 },]} >
                    {lib.timeSecToStr(this.seekStartTime + this.state.seekTime) + "/" + lib.timeSecToStr(this.state.duration)}
                </Text>
            </View>
        )
    }


    /**
    * 全屏,头部
    */
    fullHeader() {
        return (
            <View
                style={[{ position: "absolute", top: 0, left: 0, backgroundColor: colors.blackTrans, width: "100%", justifyContent: "flex-start", alignItems: "center" },
                styles.row]} >
                {/* <TouchButton style={[{ padding: 8, marginLeft: 5 },]} onPress={() => this.onPressFullScreen()}>
                    <Image style={[{ width: 22, height: 22, resizeMode: "contain" },]} source={imgs.icon_back_2}></Image>
                </TouchButton> */}
                <Text style={[{ color: colors.white, marginLeft: 20, fontSize: 14, flex: 1 },]}>{this.getTitle()}</Text>
            </View>
        )
    }

    /**
    * 非全屏,头部
    */
    header() {
        return this.state.isFullScreen ? this.fullHeader() :
            <View style={[{ position: "absolute", top: 0, left: 0, backgroundColor: colors.blackTrans, width: "100%", justifyContent: "flex-start", alignItems: "center" }, styles.row]} >
                {/* <TouchButton style={[{ padding: 6, marginLeft: 5 },]} onPress={() => this.navigation.goBack()}>
                    <Image style={[{ width: 19, height: 19, resizeMode: "contain" },]} source={imgs.icon_back_2}></Image>
                </TouchButton> */}
                <Text style={[{ color: colors.white, marginLeft: 20, fontSize: 12, flex: 1 },]}>{this.getTitle()}</Text>
            </View>
    }


    //中间,加载进度条
    renderLoad() {
        return (this.state.buffering ?
            <ActivityIndicator
                style={[{ position: "absolute", alignSelf: "center" },]}
                color={colors.primary}
                size="large"
            />
            : null)
    }




    onSlider = false;
    showSlider() {

        return (<SliderView //进度条
            trackPressable={true}
            style={[{ flex: 1, marginLeft: 5, marginRight: 2 },]}
            minimumValue={0}
            maximumValue={1000}
            value={this.getCurrentTimePercentage()}
            onSlidingStart={() => { this.onSlider = true }}
            onSlidingComplete={() => { this.onSlider = false }}
            timeLimit={100}
            onValueChange={value => this.onSliderChange(value)}
            thumbStyle={{ width: 15, height: 15 }}
            //左侧颜色
            minimumTrackTintColor={colors.white}
            maximumTrackTintColor={colors.blackTrans}
            thumbTintColor={colors.white}
            step={1}
        />)
    }

    /**
    * 非全屏,底部
    */
    bottom() {
        //return this.state.isFullScreen ? this.fullBottom() :
        return <View style={[{ backgroundColor: colors.blackTrans, alignItems: "center" }, styles.row]} >

            <PressView //暂停按钮
                style={[{ padding: 5, },]} onPress={() => this.onPressPause()}>
                <Icon name={this.state.paused ? "play_arrow" : "pause"}
                    size={28} color={colors.white} />
            </PressView>
            <Text style={[{ color: colors.white, fontSize: 12, marginLeft: 5 },]} >
                {this.getTimeStr()}
            </Text>
            {this.showSlider()}
            <PressView //全屏按钮
                style={[{ padding: 5, },]}
                onPress={() => this.onPressFullScreen()}>
                <Icon name={this.state.isFullScreen ? "fullscreen_exit" : "fullscreen"}
                    size={28} color={colors.white} />
            </PressView>
        </View>
    }

}