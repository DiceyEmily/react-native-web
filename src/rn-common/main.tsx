import { AppRegistry, DeviceEventEmitter, NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import { setUnhandledPromiseRejectionTracker } from 'react-native-promise-rejection-utils';
import { app } from './lib/app';
import { native } from './lib/native';
import { RootView } from './lib/components/RootView';


export function registApp() {

  //捕获全局异常
  setJSExceptionHandler((error, isFatal) => {
    app.showError(error)
    app.writeLog("JSExceptionHandler:\r\n" + error)
  }, false);

  setNativeExceptionHandler((exceptionMsg) => {
    app.showError(exceptionMsg)
    app.writeLog("Native Exception:\r\n" + exceptionMsg)
  }, false)


  //捕获promise rejection
  setUnhandledPromiseRejectionTracker((id, error) => {
    app.showError(error as Error)
    app.writeLog(`Unhandled promise${id}:\r\n` + error)
  })

  //注册通知回调
  DeviceEventEmitter.addListener('onNotiClick', (e: string) => {

  });



  /**
   * 原生回调函数(下载进度等)
   */
  if (Platform.OS == "ios") {
    const calendarManagerEmitter = new NativeEventEmitter(NativeModules.NativeMod);
    calendarManagerEmitter.addListener("onFunc", (paras: Array<any>) => {
      native.runEventFunc(paras);
    });
  }
  else {
    DeviceEventEmitter.addListener("onFunc", (paras: Array<any>) => {
      native.runEventFunc(paras);
    });
  }



  AppRegistry.registerComponent("rnWeb", () => RootView);
}

