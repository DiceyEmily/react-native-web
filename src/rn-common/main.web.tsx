// import 'react-app-polyfill/ie11';
import "react-app-polyfill/stable";
import ResizeObserver from 'resize-observer-polyfill';
if (!window.ResizeObserver) {
  window.ResizeObserver = ResizeObserver;
}
import { AppRegistry } from 'react-native';
import { app } from './lib/app';
import { RootView } from "./lib/components/RootView";


export function registApp() {
  window.addEventListener("error", ev => {
    app.logError(ev.error, "Error")
  })

  window.addEventListener('unhandledrejection', (ev) => {
    app.logError(ev.reason, "Rejection")
  })



  AppRegistry.registerComponent('example', () => RootView);
  AppRegistry.runApplication('example', {
    rootTag: document.getElementById('root'),
  });


  //在React DEVTOOLS中隐藏系统组件
  if ((window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    const handleReactDevtools = (agent: any) => {
      (window as any).__REACT_DEVTOOLS_COMPONENT_FILTERS__.push({
        type: 2,
        isEnabled: true,
        isValid: true,
        value: "^PressAble$"
      });
      (window as any).__REACT_DEVTOOLS_COMPONENT_FILTERS__.push({
        type: 2,
        isEnabled: true,
        isValid: true,
        value: "Context.Provider"
      });
      (window as any).__REACT_DEVTOOLS_COMPONENT_FILTERS__.push({
        type: 2,
        isEnabled: true,
        isValid: true,
        value: "AnimatedComponent"
      });
      (window as any).__REACT_DEVTOOLS_COMPONENT_FILTERS__.push({
        type: 2,
        isEnabled: true,
        isValid: true,
        value: "^div$"
      });
      (window as any).__REACT_DEVTOOLS_COMPONENT_FILTERS__.push({
        type: 2,
        isEnabled: true,
        isValid: true,
        value: "^View$"
      });
      (window as any).__REACT_DEVTOOLS_COMPONENT_FILTERS__.push({
        type: 2,
        isEnabled: true,
        isValid: true,
        value: "^Text$"
      });
      (window as any).__REACT_DEVTOOLS_COMPONENT_FILTERS__.push({
        type: 2,
        isEnabled: true,
        isValid: true,
        value: "^img$"
      });
      (window as any).__REACT_DEVTOOLS_COMPONENT_FILTERS__.push({
        type: 2,
        isEnabled: true,
        isValid: true,
        value: "^TextInput$"
      });
      (window as any).__REACT_DEVTOOLS_COMPONENT_FILTERS__.push({
        type: 2,
        isEnabled: true,
        isValid: true,
        value: "^input$"
      });

      (window as any).__REACT_DEVTOOLS_COMPONENT_FILTERS__.push({
        type: 2,
        isEnabled: true,
        isValid: true,
        value: "^CellRenderer$"
      });
      (window as any).__REACT_DEVTOOLS_COMPONENT_FILTERS__.push({
        type: 2,
        isEnabled: true,
        isValid: true,
        value: "ContextProvider"
      });
      (window as any).__REACT_DEVTOOLS_COMPONENT_FILTERS__.push({
        type: 2,
        isEnabled: true,
        isValid: true,
        value: "^VirtualizedList$"
      });
      (window as any).__REACT_DEVTOOLS_COMPONENT_FILTERS__.push({
        type: 2,
        isEnabled: true,
        isValid: true,
        value: "^GenericTouchable$"
      });

      (window as any).__REACT_DEVTOOLS_COMPONENT_FILTERS__.push({
        type: 2,
        isEnabled: true,
        isValid: true,
        value: "^LocaleProvider$"
      });

      agent.updateComponentFilters((window as any).__REACT_DEVTOOLS_COMPONENT_FILTERS__);
    };
    if ((window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent) {
      handleReactDevtools((window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent);
    } else if ((window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__?.on) {
      (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.on("react-devtools", handleReactDevtools);
    }
  }
}

