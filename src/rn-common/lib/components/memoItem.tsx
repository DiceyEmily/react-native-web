import React, { ComponentType, MemoExoticComponent } from "react";
import { GetCompnentProp, TypeCompnent } from "../Router";


const mempMaps = new Map<ComponentType<any>, MemoExoticComponent<any>>();


/**
 * 缓存指定组件, 提升大列表加载性能
 * 通过比较para参数是否变动来缓存(浅比较,不包括子对象)
 * 当传递匿名回调函数/箭头函数时, 由于其值/地址每次都会发生变化, 会使缓存失效, 需使用成员函数,或useCallBack
 * @param Comp 
 * @param para 
 * @returns 
 */
export function memoItem<T extends TypeCompnent<any>>(Comp: T, para: GetCompnentProp<T>) {
    let MemoView = mempMaps.get(Comp);
    if (!MemoView) {
        MemoView = React.memo(Comp);
        mempMaps.set(Comp, MemoView);
    }


    for (let k in para) {
        let v = para[k] as any;

        if (v && typeof v === "object") {
            if (typeof v.id === "number" || typeof v.id === "string") {
                (para as any)["__id_"] = v.id;
            }

            if (v.guid != null) {
                (para as any)["__guid_"] = v.guid;
            }

            if (v.enableSelect != null) {
                (para as any)["__enableSelect_"] = v.enableSelect;
            }

            if (v.select != null) {
                (para as any)["__select_"] = v.select;
            }
        }

    }

    return <MemoView {...para} />;
}