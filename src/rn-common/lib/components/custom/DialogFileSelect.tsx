import { lib } from "../../lib";
import { app } from "../../app";
import ImagePicker from 'react-native-image-crop-picker';
import { colors } from "../../../components/colors";
import { DialogList } from "./DialogList";
import { TypeJson } from "../../TypeJson";
import { native } from "../../native";

/**
 * 文件上传对话框
 */
export class DialogFileSelect {

    constructor() {

    }


    fileType = Array<string>();

    cropW = 0;
    cropH = 0;

    /**
     * 打开图片类型
     * @param cropW 可选 裁剪宽度（仅限移动端）
     * @param cropH 
     */
    setAcceptImage(cropW?: number, cropH?: number): this {
        this.setFileAccept(lib.imageArr)
        if (cropW != null && cropH != null) {
            this.cropH = cropH;
            this.cropW = cropW;
        }
        return this;
    }

    /**
     * 设置文本类型
     * @returns 
     */
    setAcceptDoc(): this {
        return this.setFileAccept(lib.docArr)
    }


    /**
     * 设置选择的文件类型
     * @param accept 
     */
    private setFileAccept(accept: Array<string>): this {
        this.fileType = accept;
        return this
    }


    async selectPhoto() {
        let image = await ImagePicker.openPicker({
            cropperStatusBarColor: colors.primary,
            cropperToolbarColor: colors.primary,
            cropperToolbarWidgetColor: colors.white,
            mediaType: 'photo',
            includeBase64: false,
            width: this.cropW,
            height: this.cropH,
            cropping: this.cropW > 0,
        });

        return {
            name: image.path,
            type: image.mime,
            size: image.size,
            lastModified: TypeJson.parseInt(image.modificationDate),
        } as File
    }

    async openCamera() {
        let image = await ImagePicker.openCamera({
            cropperStatusBarColor: colors.primary,
            cropperToolbarColor: colors.primary,
            cropperToolbarWidgetColor: colors.white,
            compressImageQuality: 0.8,
            includeBase64: false,
            width: this.cropW,
            height: this.cropH,
            cropping: this.cropW > 0,
        });

        return {
            name: image.path,
            type: image.mime,
            size: image.size,
            lastModified: TypeJson.parseInt(image.modificationDate),
        } as File
    }

    /**
     * 显示文件选择，并返回选择结果
     * @returns 
     */
    show(): Promise<File> {
        return new Promise<File>(async (reso, reject) => {
            if (this.fileType == lib.imageArr) {
                DialogList.show([
                    {
                        key: "拍照",
                        val: "0",
                        onClick: async (dat) => {
                            this.openCamera().then(image => {
                                //console.log(image);
                                reso(image);
                            }).catch((err: Error) => {
                                if (err.message?.indexOf("User cancelled") < 0) {
                                    app.logError(err);
                                }
                            })
                        },
                    },
                    {
                        key: "从相册中选择",
                        val: "1",
                        onClick: async (dat) => {
                            this.selectPhoto().then(file => {
                                reso(file);
                            }).catch((err: Error) => {
                                if (err.message?.indexOf("User cancelled") < 0) {
                                    app.logError(err);
                                }
                            })
                        },
                    }
                ]);
            } else {
                let res = await native.openFile("*/*", this.fileType)
                if (res) {
                    reso({
                        name: res,
                        type: 'application/octet-stream',
                        size: 0,
                        lastModified: 0,
                    } as File)
                }
            }
        })


    }

}