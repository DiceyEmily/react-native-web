import { leng, styles } from '@common/components/styles';
import { colors } from "@common/components/colors";
import { V } from '@common/lib/components/custom/V';
import { ObjStateType, useInit, useObjState } from '@common/lib/hooks';
import React from 'react';
import { TextStyle, View, ViewProps, ViewStyle } from "react-native";
import { AnimDeg } from '../Anim';
import { vali } from '../valid';
import { DialogList, DialogListItem } from './custom/DialogList';
import { PressView } from './custom/PressView';
import { Icon } from './icon/Icon';
import { lib } from '../lib';
import { CheckView } from './custom/CheckView';
import { EditView } from './custom/EditView';


interface OptionViewProp<T extends object> extends ViewProps {

    /**
     * 绑定状态,
     * mutiSelect多选时类型为:Array<any>,或通过onMutiSate类型转换
     */
    state?: ObjStateType<T>

    /**
     * 选中回调
     */
    onSelect?: (index: number, item: DialogListItem) => void;

    /**
     * 多选mutiSelect是类型转换(选择结果默认为Array<any>)
     */
    onMutiSate?: [(d: Array<any>) => any, (d: any) => Array<any>]
    /**
     * 选项列表
     * key用于显示, val用于赋值给state
     */
    options?: Array<DialogListItem> | (() => Array<DialogListItem>);

    textStyle?: TextStyle,

    itemStyle?: ViewStyle,

    placeholder?: string;

    /**
     * 禁用编辑
     */
    disable?: boolean;

    //横向布局checkView模式
    checkView?: boolean;

    /**
     * 多选,需搭配checkView使用
     */
    mutiSelect?: boolean;

    //中部弹出对话框样式
    center?: boolean;

    /**
     * 使用底部下划线, 类EditView样式
     */
    editStyle?: boolean;

    /**
     * 是否必选
     */
    required?: boolean;

    extView?: () => any;

    //允许编辑
    editable?: boolean;

    //无边框
    noBorder?: boolean;

    //没数据回调
    noDataLis?: (st: OptionViewState) => void;
}




class OptionViewState {

    text: string | JSX.Element = "";
    isShow = false;
    width = 0;

    borderColor = colors.lineGrey
    borderDefaultColor = colors.lineGrey;

    get $update() { return }
    constructor(
        public prop_: OptionViewProp<any>,
    ) {



    }

    hasVal = false;

    getOption() {
        if (typeof this.prop_.options === "function") {
            return this.prop_.options()
        }
        return this.prop_.options;
    }


    index?: number;
    getText() {
        this.hasVal = false;
        if (this.prop_.state) {
            let state = this.prop_.state;

            let v = state[0][state[1]];

            let options = this.getOption();

            if (options) {
                for (let item of options) {
                    if (item.val == v) {
                        this.hasVal = true;
                        return item.key;
                    }
                }
            }
        }
        else if (this.text) {
            this.hasVal = true;
            return this.text
        }
        return this.prop_.placeholder || (this.prop_.disable === true ? "" : "请选择")
    }

    getChecks() {
        let state = this.prop_.state!;
        let checks = state[0][state[1]] as unknown as Array<any>;
        if (this.prop_.onMutiSate) {
            checks = this.prop_.onMutiSate[1](state[0][state[1]])
        }
        return checks;
    }


    async showDialogList(v: View) {
        if (this.prop_.disable) {
            return;
        }
        if ((this.getOption() ?? []).length == 0) {
            //无数据回调
            this.prop_.noDataLis?.(this)
            return;
        }


        this.isShow = true;
        this.$update
        let options = this.getOption() ?? []
        let state = this.prop_.state;

        if (this.prop_.center) {
            //生成居中弹窗选项
            for (let k of options) {
                k.icon = () => <CheckView
                    disablePress
                    checked={k.val == state?.[0]?.[state[1]]}>
                </CheckView>
            }
        }


        if (state) {
            //高亮选中项
            let v = state[0]?.[state[1]];
            for (let k of options) {
                k.selected = v == k.val;
            }
        }

        let res = await DialogList.show(options, {
            posView: this.prop_.center ? undefined : v,
            minWidth: this.width,
            position: this.prop_.center ? undefined : (layout) => {
                return {
                    x: (this.width - layout.width) / 2, y: 33,
                }
            },

            disableDim: this.prop_.center ? undefined : true,
            onClose: () => {
                this.isShow = false;
                this.$update
            }
        })

        this.isShow = false;
        this.text = res.key;
        if (state) {
            state[0][state[1]] = res.val;
        }
        this.prop_.onSelect?.(res.index, options[res.index]);
        this.borderColor = this.borderDefaultColor;

        this.$update

    }


    root?: any

}



/**
 * 弹框单选组件
 * @param prop 
 * @returns 
 */
export function OptionView<T extends object>(prop: OptionViewProp<T>) {

    const st = useObjState(() => new OptionViewState(prop), prop)

    useInit(async () => {
        if (prop.state) {
            let func = vali.addCheckFunc(prop.state[0], prop.state[1], ([ok, msg]) => {
                if (prop.disable) {
                    return;
                }
                st.borderColor = ok ? st.borderDefaultColor : colors.red
                st.$update;
            })

            return async () => {
                if (prop.state) {
                    vali.removeCheckFunc(prop.state[0], prop.state[1], func)
                }
            }
        }

        return;
    })



    /////////////////////////////////////////
    ////////return OptionView/////////
    /////////////////////////////////////////
    let text = st.getText()
    let state = prop.state;

    if (prop.checkView) {
        return <V style={[{}, styles.rowCenter, prop.style]}>
            {st.getOption()?.map((it, index) => {

                let check = index == st.index;
                if (state) {
                    if (prop.mutiSelect) {
                        let checks = st.getChecks();
                        check = checks.findIndex(v => v == it.val) >= 0;
                    } else {
                        check = (it.val == state?.[0]?.[state[1]])
                    }

                }

                return <V
                    key={index}
                    style={[{
                        flex: 1,
                        alignItems: "flex-start",
                        justifyContent: "flex-start"
                    }, prop.itemStyle]}><CheckView
                        box={prop.mutiSelect}
                        disable={prop.disable}
                        onPress={checked => {

                            if (state) {
                                if (prop.mutiSelect) {
                                    let checks = st.getChecks()
                                    let i = checks.findIndex(v => v == it.val);
                                    if (i >= 0) {
                                        checks.splice(i, 1);
                                    }
                                    else {
                                        checks.push(it.val as string)
                                    }
                                    if (prop.onMutiSate)
                                        state[0][state[1]] = prop.onMutiSate[0](checks);
                                    else
                                        state[0][state[1]] = checks as any;
                                } else {
                                    state[0][state[1]] = it.val as any;
                                }
                            }

                            st.index = index;
                            prop.onSelect?.(index, it);

                            st.$update
                        }}

                        style={[{ alignSelf: "flex-start", },]}

                        checked={check}>
                        {it.key}
                    </CheckView></V>
            })}
            {prop.extView?.()}
        </V>
    }


    if (prop.editable) {
        return <View

            ref={ref => st.root = ref}
            onLayout={res => {
                st.width = res.nativeEvent.layout.width / lib.getScale();
            }} {...prop}
            style={[!colors.editBorder || prop.noBorder ? null : (
                {
                    paddingVertical: 6,
                    borderBottomWidth: leng.pixel1,
                    borderColor: st.borderColor,
                }
            ), styles.rowCenter, prop.style]}
        >
            <EditView state={prop.state} multiline style={[{ flex: 1 },]} />
            <Icon
                onPress={(ev) => st.showDialogList(st.root ?? ev.currentTarget as unknown as View)}
                style={[{
                    transform: [{
                        rotate: st.isShow ? "180deg" : "0deg",
                    }]
                },]}
                name="expand_more" size={18} color={colors.editGrey}
            />
            {
                prop.required ? <V style={[{ paddingLeft: 1 }, styles.titleRed]}>*</V> : null
            }
        </View>
    }



    return (
        <PressView
            onLayout={res => {
                st.width = res.nativeEvent.layout.width / lib.getScale();
            }} {...prop}
            onPress={(ev) => st.showDialogList(ev.currentTarget as unknown as View)}
            style={[!colors.editBorder || prop.noBorder ? null : (
                prop.editStyle ?
                    {
                        paddingVertical: 6,
                        paddingHorizontal: 5,
                        borderBottomWidth: leng.pixel1,
                        borderColor: st.borderColor,
                    }
                    :
                    {
                        paddingVertical: 4,
                        paddingLeft: 14,
                        paddingRight: 5,
                        borderRadius: 360,
                        borderWidth: leng.pixel1,
                        borderColor: st.borderColor,
                    }
            ), styles.rowCenter, prop.style]}
        >

            <V style={[{
                flex: 1, color: st.hasVal ? colors.textMain : colors.editGrey,
                marginRight: 5,
            }, prop.textStyle]}>{text}</V>

            <Icon
                style={[{
                    transform: [{
                        rotate: st.isShow ? "180deg" : "0deg",
                    }]
                },]}
                name="expand_more" size={18} color={colors.editGrey}
            />
            {
                prop.required ? <V style={[{ paddingLeft: 1 }, styles.titleRed]}>*</V> : null
            }
        </PressView>
    )

}


