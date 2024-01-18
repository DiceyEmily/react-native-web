import { styles } from "@common/components/styles";
import { V } from "@common/lib/components/custom/V";
import { LocalConfig } from "@common/model/LocalConfig";
import { app } from "@src/rn-common/lib/app";
import { Login } from "@src/screens/Login";
import React from 'react';
import { IconXC } from "../components/IconXC";
import { UserInfo } from "../model/UserInfo";
import { StorageObject } from "../rn-common/lib/StorageObject";
import { EnvBase } from "./EnvBase";

export class cfg {


    /**
     * 本地用户信息
     */
    static user = new StorageObject(UserInfo, true, "user_" + process.env.ENVFILE);

    /**
     * 本地配置信息
     */
    static localConfig = new StorageObject(LocalConfig, true, "localConfig_" + process.env.ENVFILE ?? "");


    /**
     * 不同环境配置
     * 通过不同的环境变量.env.gxj等使用不同的配置,见src/main.ts文件
     */
    static env = new EnvBase();

    /**
     * 跳转至登录页
     */
    static toLogin = () => {
        app.replace(Login, {})
    }

    /**
     * 获取扩展名对应的图标
     * @param ext
     * @param size
     * @returns
     */
    static getFileIcon(ext: string, size: number = 20) {
        if (ext == "doc" || ext == "docx" || ext == "txt") {
            return <IconXC name="Word" color={"#317DBC"} size={size} />
        }
        if (ext == "zip" || ext == "rar" || ext == "7z") {
            return <IconXC name="yasuobao" color={"#009BF1"} size={size} />
        }
        if (ext == "ppt" || ext == "pptx") {
            return <IconXC name="PPT" color={"#FF7A45"} size={size} />
        }

        if (ext == "xls" || ext == "xlsx") {
            return <IconXC name="Excel" color={"#50B568"} size={size} />
        }

        if (ext == "pdf" || ext == "ofd") {
            return <IconXC name="PDF" color={"#F95F5D"} size={size} />
        }

        if (ext == "png" || ext == "jpg" || ext == "gif" || ext == "webp" || ext == "jpeg" || ext == "bmp") {
            return <IconXC name="tupian" color={"#009BF1"} size={size} />
        }

        return <IconXC name="weizhiwenjian" color={"#806EE5"} size={size} />
    }

    static titleView(text: string, star = true) {
        return (
            <V
                style={[{ fontSize: 17, fontWeight: "bold", flex: 1, marginBottom: 5 }]}>
                {text}
                {star ? <V style={styles.titleRed}>*</V> : null}

            </V>
        )
    }



}
