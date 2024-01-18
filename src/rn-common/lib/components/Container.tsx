import React from 'react';
import { Image, StatusBar, View, ViewProps } from 'react-native';
import { imgs } from '../../../imgs';
import { styles } from '../../components/styles';
import { colors } from "../../components/colors";
import { app } from '../app';
import { Gradient } from './Gradient';
import { V } from './custom/V';



export interface ContainerProp extends React.PropsWithChildren<ViewProps> {

  /**
   * 是否使用黑色图标状态栏
   */
  statusDark?: boolean;

  /**
   * 背景图片
   */
  backgroundImg?: any;
  backgroundImgCol?: string;


  full?: boolean;

  /**
   * 背景颜色
   */
  backgroundCol?: any;


  /**
   * 背景图高度
   */
  bgHeight?: number;
}


export function ViewGradient(prop: {
  top?: number,
  color: string,
  bgHeight?: number,
}) {
  if (!prop.bgHeight || prop.bgHeight <= 0 || !colors.containerGradient) {
    return null
  }
  return <View style={[{
    zIndex: -100,
    position: "absolute",
    top: prop.top ?? 0,
    width: "100%",
    height: prop.bgHeight,
    background: `linear-gradient(180deg, ${prop.color} 85%, ${colors.backgroundContainer} 100%)`,
  },]}>
  </View>
}

export function BgImage(prop: {
  top?: number,
  bgHeight: number,
  /**
  * 背景图片
  */
  backgroundImg?: any
  backgroundImgCol?: string;
}) {

  return <>
    {!prop.backgroundImgCol ? <>
      <Image
        resizeMode="cover"
        style={
          [{
            zIndex: -100,
            position: "absolute",
            top: prop.top ?? 0,
            width: "100%",
            height: prop.bgHeight,
          },]}
        source={prop.backgroundImg ?? imgs.bg} />

      {/* 背景图底部渐变  */}
      <Gradient colors={colors.bgGradient} style={{
        zIndex: -98,
        width: "100%",
        position: "absolute",
        // top: 0,
        top: prop.bgHeight - 20 + (prop.top ?? 0),
        height: 20,
      }} />
    </>
      :
      <V style={
        [{
          position: "absolute",
          top: prop.top ?? 0,
          width: "100%",
          height: prop.bgHeight,
          backgroundColor: prop.backgroundImgCol,
        },]} />}
  </>
}


/**
 * 所有screen的根容器
 * 包含状态栏样式处理
 * @param props 
 * @returns 
 */
export function Container(props: ContainerProp) {

  if (props.statusDark) {
    StatusBar.setBarStyle("dark-content")
  }
  else {
    StatusBar.setBarStyle("light-content")
  }

  const cont = <View style={[styles.full,
  {
    //保留状态栏高度
    borderTopWidth: props.full || colors.backgroundImg ? 0 : app.statusBarHeight,
    paddingTop: colors.backgroundImg && !props.full ? app.statusBarHeight : 0,
    borderColor: colors.primary,
    backgroundColor: props.backgroundCol ?? colors.backgroundContainer,
  }, props.style]}>

    {
      (props.full)
        ? null
        : (
          app.isWeb
            ? <ViewGradient
              bgHeight={(props.bgHeight ?? 260) - 50}
              color={colors.weiXinEnterprise} />
            : (colors.backgroundImg ?
              <BgImage
                bgHeight={(props.backgroundImgCol ? 50 : props.bgHeight ?? 260) + app.statusBarHeight}
                backgroundImg={props.backgroundImg}
                backgroundImgCol={props.backgroundImgCol} />
              : null)
        )
    }

    {props.children}
  </View>


  return (
    cont
  );
}
