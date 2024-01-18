import { NavigationContainer, NavigationContainerRef, RouteProp, useRoute } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React, { ReactElement } from 'react';
import { LogBox } from 'react-native';
import { app } from '../app';
import { RouterView } from '../components/RouterView';
import './GestureHandler';

export interface RouterViewPara {
  view: any //组件函数或class
  paras: any//组件参数
}

//界面参数
export type StackParams = {
  RouterView: RouterViewPara;
};

export const navigationRef = React.createRef<NavigationContainerRef>();

const Stack = createStackNavigator<StackParams>();

export const NavigationCfg = {
  /**
   * 默认导航名称
   */
  defaultTitle: "",
  /**
   * 当前导航名称
   */
  title: "",
  setTitle(title: string) {
    NavigationCfg.title = title
    if (window?.document) {
      document.title = title
    }
  }
}

/**
 * 
 * @param title 
 */
function setTitle(title: string) {
  setTimeout(function () {
    //利用iframe的onload事件刷新页面
    document.title = title;
    var iframe = document.createElement('iframe');
    iframe.style.visibility = 'hidden';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.onload = function () {
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 0);
    };
    document.body.appendChild(iframe);
  }, 0);
}


export function Navigation(): ReactElement {

  return (
    <NavigationContainer
      ref={navigationRef}
      documentTitle={{
        formatter: (options, route) => {

          // if (window?.document) {
          //   setTitle(NavigationCfg.title || NavigationCfg.defaultTitle)
          // }
          return NavigationCfg.title || NavigationCfg.defaultTitle
        }
      }}
    >
      <Stack.Navigator
        screenOptions={{
          animationEnabled: app.isWeb ? false : true,
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: "horizontal",
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <Stack.Screen options={{ title: NavigationCfg.title }} name="RouterView" component={RouterView} />

      </Stack.Navigator>
    </ NavigationContainer>
  );
}




LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

/**
 * 用于获取screen导航与参数
 * @returns 
 */
export function useNavi<RouteName extends keyof StackParams>(): [Readonly<StackParams[RouteName]> | undefined] {
  const para = useRoute<RouteProp<StackParams, RouteName>>().params;
  return [para];
}

