import { CheckView } from "@common/lib/components/custom/CheckView";
import React from 'react';
import { ViewStyle } from "react-native";


export interface SelectOne<T> {
    select?: T
    $update: void;
}


/**
 * 通用列表选择
 * 通过继承此状态,在构造函数中指定主键id:  super(d => d.id)
 */
export class SelectState<T> {
    /**
      * 是否开启选择
      */
    enableSelect = false;
    /**
     * 选择结果map <主键id,object>
     */
    selects = new Map<string, T>();

    //更新组件
    get $update() { return }

    constructor(
        //获取主键id回调
        public getId: (dat: T) => string,
        public setSelects?: Map<string, T>
    ) {
        if (setSelects)
            this.selects = setSelects
    }

    get(id: string) {
        return this.selects.get(id)
    }

    getCheckBox(d: T, style?: ViewStyle) {
        if (!this.enableSelect) {
            return null
        }
        return (
            <CheckView
                onPress={checked => this.onSelect(d)}
                box
                size={16}
                style={[{ marginLeft: 10 }, style]}
                checked={this.isSelected(d)} />
        )
    }


    cancelSelect() {
        this.selects.clear();
        this.enableSelect = false;

        this.$update;
    }

    selectAll(data: Array<T>) {

        //反选
        if (this.selects.size == data.length) {
            this.selects.clear();
            this.$update;
            return;
        }


        data.forEach(sms => {
            this.selects.set(this.getId(sms), sms);
        })
        this.$update;
    }


    isSelected(sms: T) {
        return this.selects.get(this.getId(sms)) != null
    }


    /**
     * 切换选择状态
     * @param sms 
     * @returns 
     */
    onSelect(sms: T) {
        if (!this.enableSelect) {
            this.selects.set(this.getId(sms), sms);
            this.enableSelect = true;
            this.$update;
        } else {
            let old = this.selects.get(this.getId(sms));
            if (old) {
                this.selects.delete(this.getId(sms));
                this.$update
                return;
            }
            this.selects.set(this.getId(sms), sms);
            this.$update
        }
    }
}