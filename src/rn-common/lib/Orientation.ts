let Orientation = require('react-native').NativeModules.Orientation;
let DeviceEventEmitter = require('react-native').DeviceEventEmitter;

let listeners = {} as any;
let orientationDidChangeEvent = 'orientationDidChange';
let specificOrientationDidChangeEvent = 'specificOrientationDidChange';

let id = 0;
let META = '__listener_id';

type orientation = "LANDSCAPE" | "PORTRAIT" | "UNKNOWN" | "PORTRAITUPSIDEDOWN";
type specificOrientation = "LANDSCAPE-LEFT" | "LANDSCAPE-RIGHT" | "PORTRAIT" | "UNKNOWN" | "PORTRAITUPSIDEDOWN";

function getKey(listener: any) {
    if (!listener.hasOwnProperty(META)) {
        if (!Object.isExtensible(listener)) {
            return 'F';
        }

        Object.defineProperty(listener, META, {
            value: 'L' + ++id,
        });
    }

    return listener[META];
};

export default {
    getOrientation(cb: (err: Error, orientation: orientation) => void) {
        Orientation.getOrientation((error: Error, orientation: orientation) => {
            cb(error, orientation);
        });
    },

    getSpecificOrientation(cb: (err: Error, orientation: specificOrientation) => void) {
        Orientation.getSpecificOrientation((error: Error, orientation: specificOrientation) => {
            cb(error, orientation);
        });
    },

    lockToPortrait() {
        Orientation.lockToPortrait();
    },

    lockToLandscape() {
        Orientation.lockToLandscape();
    },

    lockToLandscapeRight() {
        Orientation.lockToLandscapeRight();
    },

    lockToLandscapeLeft() {
        Orientation.lockToLandscapeLeft();
    },

    unlockAllOrientations() {
        Orientation.unlockAllOrientations();
    },

    addOrientationListener(cb: (orientation: orientation) => void) {
        let key = getKey(cb);
        listeners[key] = DeviceEventEmitter.addListener(orientationDidChangeEvent,
            (body: any) => {
                cb(body.orientation);
            });
    },

    removeOrientationListener(cb: (orientation: orientation) => void) {
        let key = getKey(cb);

        if (!listeners[key]) {
            return;
        }

        listeners[key].remove();
        listeners[key] = null;
    },

    addSpecificOrientationListener(cb: (specificOrientation: specificOrientation) => void) {
        let key = getKey(cb);

        listeners[key] = DeviceEventEmitter.addListener(specificOrientationDidChangeEvent,
            (body: any) => {
                cb(body.specificOrientation);
            });
    },

    removeSpecificOrientationListener(cb: (specificOrientation: specificOrientation) => void) {
        let key = getKey(cb);

        if (!listeners[key]) {
            return;
        }

        listeners[key].remove();
        listeners[key] = null;
    },

    getInitialOrientation() {
        return Orientation.initialOrientation;
    }
}