import { PermissionsAndroid } from 'react-native';
import { app } from '../app';
import { native } from '../native';
import { AndroidIntent, AndroidSdk } from '../platform/AndroidSdk';
import { wpsDefine, wpsFilter } from './wspDefine';


export interface IEdit {
    /**
     * 待编辑的文件
     */
    file: string,

    /**
     * 是否加密文件
     */
    encrypt?: boolean,
    /**
     * 文件保存回调
     */
    onSave?: (file: string) => void,

    /**
     * 文件关闭回调
     */
    onClose?: (file: string) => void,
}

export class wps {




    static registerReceiverId = 0;

    /**
     * 初始化wps通知监听
     */
    static async initRecv() {
        if (this.registerReceiverId == 0) {
            this.registerReceiverId = await native.registerReceiver({
                action: [wpsFilter.saved, wpsFilter.closed],
                category: [AndroidIntent.CATEGORY_DEFAULT],
            }, res => {
                if (!wps.currentParas) {
                    return;
                }
                console.log(res);
                let path = res.extras["CurrentPath"];
                if (!path) {
                    return;
                }

                if (path.indexOf("/Android/data/" + wpsDefine.PACKAGE_NAME_ENG) >= 0) {
                    return;
                }
                if (path.indexOf("/Android/data/" + wpsDefine.PACKAGE_NAME_ENT) >= 0) {
                    return;
                }

                if (res.action == wpsFilter.saved) {
                    wps.currentParas.onSave?.(path);
                    wps.currentParas.onSave = undefined;
                }
                if (res.action == wpsFilter.closed) {
                    wps.currentParas.onClose?.(path);
                    wps.currentParas.onClose = undefined;
                }
            })
        }
    }

    static currentParas: IEdit | null = null;


    /**
     * 编辑指定文件
     * @param paras 
     * @returns 返回false表明wps启动失败
     */
    static async editFile(paras: IEdit) {

        let granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );

        if (!granted) {
            return false;
        }

        let wspPack = wpsDefine.PACKAGE_NAME_ENT;
        if (!await native.hasApp(wspPack)) {
            wspPack = wpsDefine.PACKAGE_NAME_ENG
            if (!await native.hasApp(wspPack)) {
                return false;
            }
        }

        this.currentParas = paras;


        this.initRecv()

        let flag = 0;

        flag |= AndroidIntent.FLAG_ACTIVITY_NEW_TASK;
        if (app.version > AndroidSdk.N) {
            flag = AndroidIntent.FLAG_GRANT_READ_URI_PERMISSION
                | AndroidIntent.FLAG_GRANT_WRITE_URI_PERMISSION;
        }

        flag |= AndroidIntent.FLAG_ACTIVITY_NEW_TASK;

        native.startActivity({
            action: AndroidIntent.ACTION_VIEW,
            flags: flag,
            launchIntentForPackage: wspPack,
            file: paras.file,
            type: "*/*",
            bundle: {
                //打开模式
                [wpsDefine.OPEN_MODE]: wpsDefine.EDIT_MODE,

                [wpsDefine.THIRD_PACKAGE]: native.getPackagename(),
                [wpsDefine.ENCRYPT_FILE]: paras.encrypt ? true : false,
                [wpsDefine.SEND_SAVE_BROAD]: true,
                [wpsDefine.SEND_CLOSE_BROAD]: true,
                [wpsDefine.IS_SHOW_VIEW]: false,
                [wpsDefine.HOME_KEY_DOWN]: true,
                [wpsDefine.BACK_KEY_DOWN]: true,
                [wpsDefine.ENTER_REVISE_MODE]: true,
                [wpsDefine.IS_SHOW_VIEW]: false,
                [wpsDefine.AUTO_JUMP]: true,
                [wpsDefine.TRACES_MODE]: true,
            },
        })

        return true;

    }
}