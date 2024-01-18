import * as React from 'react';
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
  Platform,
} from 'react-native';
import TabBar from './TabBar';
import SceneView from './SceneView';
import Pager from './Pager';
import {
  Layout,
  NavigationState,
  Route,
  SceneRendererProps,
  PagerProps,
} from './types';
import { useObject } from '@common/lib/hooks';
import { ScrollView } from 'react-native';
import { lib } from '../../lib';

export type Props<T extends Route> = PagerProps & {
  onIndexChange: (index: number) => void;
  navigationState: NavigationState<T>;
  renderScene: (props: SceneRendererProps & { route: T }) => React.ReactNode;
  renderLazyPlaceholder?: (props: { route: T }) => React.ReactNode;
  renderTabBar?: (
    props: SceneRendererProps & { navigationState: NavigationState<T> }
  ) => React.ReactNode;
  tabBarPosition?: 'top' | 'bottom';
  initialLayout?: Partial<Layout>;
  lazy?: ((props: { route: T }) => boolean) | boolean;
  lazyPreloadDistance?: number;
  sceneContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;

  /**
   * 是否自动伸缩高度
   */
  autoHeight?: boolean;
};

export default function TabView<T extends Route>({
  onIndexChange,
  navigationState,
  renderScene,
  initialLayout,
  keyboardDismissMode = 'auto',
  lazy = false,
  lazyPreloadDistance = 0,
  onSwipeStart,
  onSwipeEnd,
  renderLazyPlaceholder = () => null,
  renderTabBar = (props) => {
    return <TabBar {...props} />
  },
  sceneContainerStyle,
  style,
  swipeEnabled = true,
  tabBarPosition = 'top',
  autoHeight,
}: Props<T>) {
  const [layout, setLayout] = React.useState({
    width: 0,
    height: 0,
    ...initialLayout,
  });

  const st = useObject(() => ({
    height: 0,
    hasJump: false,
    listHeight: Array<number>(),
  }));



  const jumpToIndex = (index: number) => {

    if (index !== navigationState.index) {
      st.hasJump = true;


      if (st.listHeight[index] > 0 && st.height != st.listHeight[index]) {
        st.height = st.listHeight[index];
        // console.log("jumpToIndex ", index, " h:", st.height)
        st.$update
      }

      onIndexChange(index);


    }
  };

  const handleLayout = (e: LayoutChangeEvent) => {


    let { height, width } = e.nativeEvent.layout;
    if (layout.width == width && layout.height == height) {
      return;
    }
    if (height == 0 || width == 0) {
      return;
    }

    // width /= lib.getScale();

    setLayout((prevLayout) => {
      if (prevLayout.width === width && prevLayout.height === height) {
        return prevLayout;
      }


      return { height, width };
    });
  };



  return (
    <View onLayout={handleLayout} style={[styles.pager, style]}>
      <Pager
        style={autoHeight && st.height > 0 ? { height: st.height, overflow: "hidden" } : null}
        autoHeight={autoHeight}
        layout={layout}
        navigationState={navigationState}
        keyboardDismissMode={keyboardDismissMode}
        swipeEnabled={swipeEnabled}
        onSwipeStart={onSwipeStart}
        onSwipeEnd={onSwipeEnd}
        onIndexChange={jumpToIndex}
      >
        {({ position, render, addEnterListener, jumpTo }) => {
          // All of the props here must not change between re-renders
          // This is crucial to optimizing the routes with PureComponent
          const sceneRendererProps = {
            position,
            layout,
            jumpTo,
          };

          return (
            <React.Fragment>
              {tabBarPosition === 'top' &&
                renderTabBar({
                  ...sceneRendererProps,
                  navigationState,
                })}
              {render(
                navigationState.routes.map((route, i) => {

                  const scene = <SceneView
                    autoHeight={autoHeight}
                    onLayout={res => {
                      if (!autoHeight) {
                        return;
                      }

                      st.listHeight[i] = res.nativeEvent.layout.height
                      if (navigationState.index == i && st.listHeight[i] > 0 && st.height != st.listHeight[i]) {
                        st.height = st.listHeight[i];
                        // console.log(i, "onLayout height ", navigationState.index, " h:", st.height)
                        st.$update
                      }
                    }}
                    {...sceneRendererProps}
                    addEnterListener={addEnterListener}
                    key={route.key}
                    index={i}
                    lazy={typeof lazy === 'function' ? lazy({ route }) : lazy}
                    lazyPreloadDistance={lazyPreloadDistance}
                    navigationState={navigationState}
                    style={sceneContainerStyle}
                  >
                    {({ loading }) =>
                      loading
                        ? renderLazyPlaceholder({ route })
                        : renderScene({
                          ...sceneRendererProps,
                          route,
                        })
                    }
                  </SceneView>


                  if (autoHeight && Platform.OS !== "web") {
                    return (
                      <ScrollView style={{ flex: 1 }}  >
                        {scene}
                      </ScrollView>
                    );
                  }

                  return (scene);
                })
              )}
              {tabBarPosition === 'bottom' &&
                renderTabBar({
                  ...sceneRendererProps,
                  navigationState,
                })}
            </React.Fragment>
          );
        }}
      </Pager>
    </View>
  );
}

const styles = StyleSheet.create({
  pager: {
    flex: 1,
    overflow: 'hidden',
  },
});
