import { lib } from "./lib";
import { Router, StatePara } from "./Router";

export class PushWithBack {

    /**
     * 回退函数列表,<id,function>
     */
    static backFuncMap = new Map<number, () => void>();

    static idStack = Array<number>();

    static push(back: () => void) {

        let id = lib.getAutoInc();

        window.history.pushState(
            {
                page: Router.currentPage,
            } as StatePara,
            "",
        );

        this.backFuncMap.set(id, back);
        this.idStack.push(id);
        return id;
    }


    static clearId(id: number, back = true) {
        let func = PushWithBack.backFuncMap.get(id);

        if (!func) {
            return;
        }
        for (let i = this.idStack.length - 1; i >= 0; i--) {
            if (id == this.idStack[i]) {
                this.idStack.splice(i, 1);
                break;
            }
        }
        PushWithBack.backFuncMap.delete(id)
        func();
        if (back)
            window.history.back();
    }


}