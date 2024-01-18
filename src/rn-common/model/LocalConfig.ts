import { WeatherResult } from "@src/model/home/Weather";

/**
 * 本地配置信息
 */
export class LocalConfig {

    constructor(
        //首页模块资源id
        public portal_menu: string = "",
        //指纹开关
        public printSwitch: string = "",
        //手势密码
        public patternPassword: string = "",
        //账号
        public account: string = "",
        //密码
        public password: string = "",
        //记住密码
        public rememberPassword: boolean = false,
        //禁止截屏
        public jieping: boolean = false,
        //字体大小
        public fontScale: number = 1,

        //天气数据
        public weather: WeatherResult = new WeatherResult,
    ) {
    }


    public count: number = 0


}
