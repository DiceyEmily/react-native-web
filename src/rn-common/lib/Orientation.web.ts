type orientation = "LANDSCAPE" | "PORTRAIT" | "UNKNOWN" | "PORTRAITUPSIDEDOWN";
type specificOrientation = "LANDSCAPE-LEFT" | "LANDSCAPE-RIGHT" | "PORTRAIT" | "UNKNOWN" | "PORTRAITUPSIDEDOWN";

let linstener = new Map<(orientation: orientation) => void, string>();

window.addEventListener('orientationchange', function () {
    // 这个时候屏幕的尺寸数据还没有变化
    let orientation = window.orientation;
    let orientDeg: orientation = "PORTRAIT"



    switch (orientation) {
        case 90:
        case -90:
            orientDeg = 'LANDSCAPE'; //这里是横屏
            break;
        default:
    }

    // app.msg(orientDeg);
    for (let k of linstener) {
        k[0](orientDeg);
    }
})

// 监听屏幕旋转完成  获取最新屏幕尺寸
window.addEventListener('resize', function () {

})
export default {
    getOrientation(cb: (err: Error, orientation: orientation) => void) {

    },

    getSpecificOrientation(cb: (err: Error, orientation: specificOrientation) => void) {

    },

    lockToPortrait() {

    },

    lockToLandscape() {

    },

    lockToLandscapeRight() {

    },

    lockToLandscapeLeft() {

    },

    unlockAllOrientations() {

    },

    addOrientationListener(cb: (orientation: orientation) => void) {

        linstener.set(cb, "");
    },

    removeOrientationListener(cb: (orientation: orientation) => void) {
        linstener.delete(cb);
    },

    addSpecificOrientationListener(cb: (specificOrientation: specificOrientation) => void) {

    },

    removeSpecificOrientationListener(cb: (specificOrientation: specificOrientation) => void) {

    },

    getInitialOrientation() {

    }
}