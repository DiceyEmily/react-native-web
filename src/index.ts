import { initColors } from './config/colors';
////初始化主题颜色, 必须放在最前
initColors()

////////////////////////////////

import { app } from "@common/lib/app";
import { globalFont } from "@common/lib/components/font";
import { NavigationCfg } from "@common/lib/navigation";
import { registApp } from '@common/main';
import Config from "react-native-config";
import { cfg } from "./config/cfg";
import { EnvBase } from "./config/EnvBase";
// import { initOnMessage } from './config/onMessage';
import { routers } from "./config/routers";
import { init } from "./rn-common/lib/ext";
import { setRouters } from "./rn-common/lib/Router";
// import { GetCodeState } from './screens/GetCode';


//初始化扩展函数
init();


cfg.env = new EnvBase();


//版本号
if (!cfg.env.appVersion)
    cfg.env.appVersion = Config.VERSION_NAME;

//设置路由
NavigationCfg.defaultTitle = cfg.env.name
NavigationCfg.title = cfg.env.name
setRouters(routers)


//全局字号
globalFont.scale = cfg.localConfig.dat.fontScale || 1;

console.log(cfg.env.appVersion, " env:", process.env.NODE_ENV, " ENVFILE:", app.getEnv(), " public url:", process.env.PUBLIC_URL);


// GetCodeState.initConsole();

// checkWxApi(wxJsApiList)

// initOnMessage();

//注册启动app
registApp();

