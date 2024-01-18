import { wps } from "../rn-common/lib/wps/wps";
import { file } from "../rn-common/lib/file";
import { app } from "../rn-common/lib/app";

export class WpsModel {


    static async test() {

        //本地文件路径
        let f = file.mainPath() + "/a.txt";

        //下载文件
        await file.downloadFile({
            fromUrl: "https://www",
            toFile: f,
            //下载进度
            progress: (prog) => {
                //下载百分比
                let percent = prog.bytesWritten * 100 / prog.contentLength;
            }
        }).promise


        //追加文件内容
        await file.appendFile(f, "abcd");

        /**
         * 编辑文件
         */
        let hasWps = await wps.editFile({
            encrypt: true,
            file: f,
            //保存成功
            onSave: async (path) => {
                app.msg("编辑成功!");
                //上传文件
                // await api.uploadOfficeFile({
                //     file: path,
                // }).result
            }
        });

        if (!hasWps) {
            //未安装wps
            app.msg("未安装wps");

        }

    }
}