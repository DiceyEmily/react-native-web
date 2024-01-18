export type EnvType = ".env.test" | ".env.smartcampus" | ".env.smartcampus.test"


export type EnvType2 = "test" | "release"
declare global {
    declare namespace NodeJS {
        interface ProcessEnv {

            ENVFILE: EnvType;

            //编译环境
            ENVTYPE: EnvType2;
        }
    }


}
declare module 'react-native-config' {
    export interface NativeConfig {
        //android热更新url (为了安全性, web端会移除此参数)
        HOTLOAD_URL: string;

        //android 接口 url (为了安全性, web端会移除此参数)
        HOST_URL: string;

        //android 接口 url (为了安全性, web端会移除此参数)
        FILE_URL: string;

        OUT_MENU: string;

        APP_ID: string;

        APP_NAME: string;

        APK_NAME: string;

        APP_ICON: string;

        VERSION_NAME: string;

        VERSION_CODE: string;
    }
}