import { BackHandler, Platform } from "react-native";
import { lib } from "./lib";

export class PushWithBack {

    /**
     * 回退函数列表,<id,function>
     */
    static backFuncMap = new Map<number, () => boolean>();

    static idStack = Array<number>();

    static push(back: () => void) {

        let id = lib.getAutoInc();

        if (Platform.OS == "ios") {
            return id;
        }

        let newBack = {
            func: null as any as () => boolean
        };

        newBack.func = () => {
            PushWithBack.backFuncMap.delete(id);
            BackHandler.removeEventListener('hardwareBackPress', newBack.func);
            back();
            return true;
        }
        this.backFuncMap.set(id, newBack.func);

        BackHandler.addEventListener('hardwareBackPress', newBack.func);
        return id;
    }

    static clearId(id: number, back = true) {
        let func = PushWithBack.backFuncMap.get(id);
        if (!func) {
            return;
        }
        PushWithBack.backFuncMap.delete(id)
        BackHandler.removeEventListener('hardwareBackPress', func);


    }
}