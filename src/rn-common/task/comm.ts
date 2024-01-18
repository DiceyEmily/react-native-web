import * as fs from "fs";
import * as archiver from "archiver";
import * as  path from "path";
import * as  sh from 'shelljs';
import { packAndroid } from "./packAndroid";

export async function buildJs(project: string) {
    sh.exec(`cross-env ENVFILE=.env.${project} react-app-rewired build`);
    await packAndroid(project, true);
}

export function toStr(str: number, num: number) {
    return ("000000000000000000" + str).substr(-num);
}

export function getDateStr(da: Date) {
    let m = (da.getMonth() + 1);
    let d = da.getDate();
    return da.getFullYear() + toStr(m, 2) + toStr(d, 2)
}

export function mkdirsSync(dirname: string) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
    return false;
}

/**
 * 监听指定目录，并限制触发频率
 * @param menu 
 * @param listener 
 * @param time 频率 毫秒
 */
export function menuWatch(menu: string, listener: (event: "rename" | "change", filename: string) => any, time: number = 800) {
    let timeOut: any;
    listener("change", "");
    fs.watch(menu, (event, file) => {
        clearTimeout(timeOut);
        timeOut = setTimeout(() => {
            listener(event, file);
        }, time);
    })

}


/**
 * 
 * @param {string} menu 输入目录
 * @param {string} outFile 输出目录
 * @param {string} exitMenu 重复文件目录，（用于排除指定文件）
 */
export function zipMenu(menu: string, outFile: string, exitMenu = "", destpath: false | string) {
    return new Promise<void>((resolve, reject) => {
        // 创建一个可写文件流，以便把压缩的数据导入
        let output = fs.createWriteStream(outFile);
        //archiv对象，设置等级
        let archive = archiver.create('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });

        //管道连接
        archive.pipe(output);


        //监听压缩、传输数据过程中的错误回调
        archive.on('error', function (err) {//压缩失败  
            console.error(err);
            reject(err)
        });
        //监听压缩、传输数据结束
        output.on('close', function () {//压缩完成
            console.log("压缩完成: " + outFile);
            resolve();
        })

        output.on('end', function () {

            console.log('Data has been drained');
        });

        archive.directory(menu, destpath, dat => {

            if (exitMenu && dat.stats?.isFile()) {//检测是否已经存在
                if (fs.existsSync(exitMenu + dat.name)) {
                    return false;
                }
            }
            return dat;
        })


        //开始压缩
        archive.finalize();
    })



}


/**
 * 
 * @param {string} menu 
 * @param {string} outFile 
 */
export function zipFile(file: string, outFile: string) {

    return new Promise<void>((resolve, reject) => {
        // 创建一个可写文件流，以便把压缩的数据导入
        var output = fs.createWriteStream(outFile);
        //archiv对象，设置等级
        var archive = archiver.create('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });

        //管道连接
        archive.pipe(output);

        //监听压缩、传输数据过程中的错误回调
        archive.on('error', function (err) {//压缩失败  
            console.error(err);
            reject(err)
        });
        //监听压缩、传输数据结束
        output.on('close', function () {//压缩完成
            console.log("压缩完成: " + outFile);
            resolve();
        })

        output.on('end', function () {
            console.log('Data has been drained');

        });

        //压缩文件到压缩包
        archive.file(file, { name: path.basename(file) });

        //开始压缩
        archive.finalize();
    });

}



