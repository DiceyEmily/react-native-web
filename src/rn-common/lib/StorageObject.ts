import { NativeModules } from "react-native";
import { TypeJson } from "./TypeJson";
const NativeMod: any = NativeModules?.NativeMod ?? {};


/**
 * 本地文件对象
 */
export class StorageObject<T extends object> {


    /**
     * 获取本地储存键值对
     * @param key 
     * @param encrypt 是否加密
     * @returns 
     */
    static getItem(key: string, encrypt: boolean): string | null {
        if (window?.localStorage) {
            return window.localStorage.getItem(key)
        }
        return NativeMod.getItem(key, encrypt);
    }

    /**
     * 设置本地键值
     * @param key 
     * @param v 
     * @param encrypt 是否加密
     * @returns 
     */
    static setItem(key: string, v: string, encrypt: boolean): Promise<boolean> | boolean {
        if (window?.localStorage) {
            window.localStorage.setItem(key, v)
            return true;
        }
        return NativeMod.setItem(key, v, encrypt);
    }

    private dat_: T | null = null;



    constructor(

        private clas: { new(): T; },

        //是否开启加密
        public encrypt = false,
        /**
         * 本地储存的文件名
         */
        public keyID: string,
    ) {
    }

    /**
     * 保存对象
     */
    get save() {
        if (this.dat_ != null)
            return StorageObject.setItem(this.keyID, TypeJson.stringify(this.dat_), this.encrypt);
        return undefined
    }



    /**
     * 读取本地对像
     */
    get dat(): T {
        return this.read;
    }


    /**
     * 设置对像并保存
     */
    set dat(value: T) {

        this.dat_ = value;
        this.save
    }

    /**
     * 读取本地对像
     */
    get read(): T {
        if (this.dat_ == null) {
            let res = StorageObject.getItem(this.keyID, this.encrypt);
            if (res && res !== "") {
                this.dat_ = TypeJson.parse(res, this.clas);
            }
            else {
                this.dat_ = new this.clas();
            }

        }

        return this.dat_ as T;
    }

    /**
     * 清空并保存
     */
    async clear() {
        this.dat_ = new this.clas();
        await StorageObject.setItem(this.keyID, "", this.encrypt);
    }


}