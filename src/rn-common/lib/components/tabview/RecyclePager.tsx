import { useObjState } from '@common/lib/hooks';
import { lib } from '@common/lib/lib';
import React from 'react';
import { Animated, GestureResponderEvent, PanResponder, PanResponderGestureState, Platform, StyleSheet, View, ViewProps } from "react-native";
import { app } from '../../app';



interface RecyclePagerProp extends ViewProps {
  onCurrent: (enable: RecyclePagerState) => JSX.Element;
  onLeft: (enable: RecyclePagerState) => JSX.Element;
  onRight: (enable: RecyclePagerState) => JSX.Element;
  //禁用滑动选择
  disableTouch?: boolean;
}


export class RecyclePagerState {

  enableLeft = true;
  enableRight = true;

  //更新组件
  get $update() { return }
  constructor(
    //组件属性
    public prop_: RecyclePagerProp,
  ) {
    this.onCurrent();
  }

  /**
   * 设置当前页面
   */
  onCurrent = () => {
    this.view1 = this.prop_.onCurrent(this)
  }

  getView(ele: JSX.Element | null, key: any) {
    if (ele)
      return <View key={key} style={this.width > 0 ? { width: lib.getPx(this.width) } : { flex: 1 }}>
        {ele}
      </View>
    return null;
  }

  private id = "";

  onRight = () => {

    if (!this.enableRight) {
      return;
    }

    let curId = lib.getUniqueId16();
    this.id = curId;


    this.view2 = this.prop_.onRight(this);
    this.panX.setValue(0)
    this.$update;
    Animated.timing(this.panX, {
      toValue: -this.width,
      duration: 150,
      useNativeDriver: Platform.OS == "web" ? false : true, // 使用原生动画驱动
    }).start(() => {
      if (this.id != curId) {
        return;
      }

      this.panX.setValue(0)
      if (this.view2)
        this.view1 = this.view2;
      this.view2 = null;

      this.$update

    });

  }

  onLeft = () => {
    if (!this.enableLeft) {
      return;
    }

    let curId = lib.getUniqueId16();
    this.id = curId;

    this.view2 = this.view1
    this.view1 = this.prop_.onLeft(this);
    this.panX.setValue(-this.width)
    this.$update;
    Animated.timing(this.panX, {
      toValue: 0,
      duration: 150,
      useNativeDriver: Platform.OS == "web" ? false : true, // 使用原生动画驱动
    }).start(() => {
      if (this.id != curId) {
        return;
      }

      this.view2 = null;

      this.$update

    });
  }

  width = 0;
  panX = new Animated.Value(0 as number);

  _handleMoveShouldSetPanResponder = (e: GestureResponderEvent, gestureState: PanResponderGestureState): boolean => {/*eslint @typescript-eslint/no-unused-vars: 0*/
    // Should we become active when the user moves a touch over the circle?
    // console.log("_handleMoveShouldSetPanResponder", gestureState,)
    if (Math.abs(gestureState.vy) > Math.abs(gestureState.vx)) {

      return false;
    }
    if (gestureState.vx == 0) {
      return false;
    }
    this.currentX = gestureState.dx
    this.currentY = gestureState.dy
    this.hasMove = true;
    return true;
  };


  private hasMove = false;
  private currentX = 0
  private currentY = 0;

  view1: JSX.Element | null = null;
  view2: JSX.Element | null = null;

  _handlePanResponderGrant = (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
  }

  _handlePanResponderMove = (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
    let len = gestureState.dx - this.currentX
    if (len && this.hasMove) {
      if (len < -25 && gestureState.vx < 0) {
        this.hasMove = false;
        this.onRight();
      }
      else if (len > 25 && gestureState.vx > 0) {
        this.hasMove = false;
        this.onLeft();
      }

    }
  }

  panResponder = PanResponder.create({
    // onMoveShouldSetPanResponderCapture: () => {
    //   return true
    // },
    // onStartShouldSetPanResponder: () => {
    //   return true
    // },
    // onStartShouldSetPanResponderCapture: () => {
    //   return true
    // },
    // onShouldBlockNativeResponder: () => {
    //   console.log("onShouldBlockNativeResponder")
    //   return true
    // },
    onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
    onPanResponderGrant: this._handlePanResponderGrant,
    onPanResponderMove: this._handlePanResponderMove,
  }).panHandlers

}///////////////RecyclePagerState end///////////////////



/**
 * 
 * @param prop 
 * @returns 
 */
export function RecyclePager(prop: RecyclePagerProp) {

  //组件状态
  const st = useObjState(() => new RecyclePagerState(prop), prop)

  //组件初始化
  // useInit(async () => {


  //   return async () => { //组件卸载

  //   }
  // })




  /////////////////////////////////////////
  //////// RecyclePager view//////////
  /////////////////////////////////////////
  return (
    <View
      {...(prop.disableTouch ? null : st.panResponder)}
      onLayout={(res) => {
        if (st.width != res.nativeEvent.layout.width) {
          st.width = res.nativeEvent.layout.width
          // st.$update
        }
      }}
      style={[{
        overflow: 'hidden'
      }, prop.style]}>
      <Animated.View style={[{
        flexDirection: "row",
        transform: [{
          translateX: st.panX,
        }]
      },]}>
        {[st.getView(st.view1, 0), st.getView(st.view2, 1)]}
      </Animated.View>
    </View>
  )


}///////////////RecyclePager end//////////////////

const styl = StyleSheet.create({

})