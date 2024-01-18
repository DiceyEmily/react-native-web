import { getFontSize, getViewProperty } from '@common/lib/components/custom/V';
import { ObjStateType, useInit, useObject } from '@common/lib/hooks';
import { vali } from '@common/lib/valid';
import React from 'react';
import { InteractionManager, Platform, TextInput, TextInputProps, TextStyle } from "react-native";
import { colors } from "../../../components/colors";


interface EditViewProp<T extends object> extends TextInputProps {
    //useState
    state?: ObjStateType<T>;

    title?: () => JSX.Element;

    /**
     * web端单独指定css样式
     */
    css?: string;

    /**
     * 点击输入法确定或回车触发
     */
    onDone?: () => void;

    /**
     * 输入类型（会针对state类型自动转换）
     */
    type?: "string" | "int" | "float";

    /**
     * 是否禁止编辑
     */
    disable?: boolean;


    maxHeight?: number;
}


export class EditViewState<T extends object> {

    public height: number = -1;
    public text = "";
    padingVer = 3;

    public styleHeight?: number;

    get $update() { return }
    constructor(
        //组件属性
        public prop_: EditViewProp<T>,
    ) {
        if ((this.prop_.style as TextStyle)?.paddingVertical != null) {
            this.padingVer = (this.prop_.style as TextStyle)?.paddingVertical as number
        }

        if (typeof this.padingVer === "number" && Platform.OS === "android") {
            this.padingVer -= 2;
        }

    }


    bottomColor = colors.lineGrey

    borderColor = (this.prop_.style as TextStyle)?.borderColor as string ?? colors.primary

    focus = false;

    getValue(): any {
        if (this.prop_.state) {
            return ((this.prop_.state[0])[this.prop_.state[1]] || "")

        }
        if (this.prop_.value != null) {
            return this.prop_.value
        }
        return null
    }

    compositionText?: string
    onChange(res: string) {

        // console.log("onChange", res, this.compositionText)

        if (this.compositionstart) {
            //输入法内容
            this.compositionText = res;
            this.$update;
            return;
        }

        if (res == this.text) {
            return;
        }

        if (this.prop_.state) {
            if (this.prop_.type === "int") {

                let v = parseInt(res);
                if (Number.isNaN(v)) {
                    v = 0;
                }

                (this.prop_.state[0])[this.prop_.state[1]] = v as any;
                if (res == "-") {//允许输入负号
                    this.text = res;

                } else {
                    this.text = (v || "") + ""
                }

            } else if (this.prop_.type === "float") {
                let v = parseFloat(res);
                if (Number.isNaN(v)) {
                    v = 0;
                }
                (this.prop_.state[0])[this.prop_.state[1]] = v as any;

                if (res[res.length - 1] == "." || res == "-") {//允许输入小数
                    this.text = res;
                } else {
                    this.text = (v || "") + "";

                }

            }
            else {

                (this.prop_.state[0])[this.prop_.state[1]] = res as any;
                this.text = res;

            }
        } else {
            this.text = res;
        }
        if (this.prop_.state) {
            // vali.checkField(this.prop_.state[0], this.prop_.state[1])
        }
        this.prop_.onChangeText?.(res);
        this.$update;

    }

    validFunc = ([ok, msg]: [boolean, string]) => {
        if (this.prop_.disable || this.prop_.editable === false) {
            return;
        }

        // if (!ok) {
        //     let ele = this.edit as unknown as HTMLElement | null;
        //     console.log("ele scroll", ele?.getBoundingClientRect()?.top)
        //     for (; ele != null;) {
        //         let next = ele.parentElement;
        //         if (next == null) {
        //             break;
        //         }
        //         if (next.className.indexOf("r-overflowY") >= 0) {
        //             console.log("scroll", ele.getBoundingClientRect().top)
        //             break;
        //         }
        //         ele = next
        //     }
        // }

        this.bottomColor = ok ? colors.lineGrey : colors.red;

        this.$update;
    }

    maxHeight = 900;

    onInputEvent?: any;

    onInput = (ele: HTMLTextAreaElement) => {

        if (this.styleHeight != null) {
            return;
        }


        //输入文本时，自动调整高度
        ele.style.height = 'auto';
        // console.log("onIpnut scrollHeight", ele.scrollHeight)
        if (ele.scrollHeight < this.maxHeight || this.maxHeight <= 0) {
            if (ele.scrollHeight > 0)
                ele.style.height = ele.scrollHeight + 1 + "px"
        }
        else {
            ele.style.height = this.maxHeight + "px"
        }
    }

    compositionstart = false;

    edit?: TextInput

    onRef(edit: TextInput) {
        if (this.edit === edit) {
            return;
        }



        this.styleHeight = getViewProperty(this.prop_.style, "height")

        this.edit = edit;
        if (Platform.OS === "web") {

            if (this.prop_.css) {
                (edit as unknown as HTMLInputElement).style.cssText = this.prop_.css;
            }

            if (this.prop_.secureTextEntry) {
                (edit as unknown as HTMLInputElement).autocomplete = "off";
            }

            if (this.prop_.autoFocus) {
                setTimeout(() => {
                    let v = (edit as unknown as HTMLInputElement).value;
                    if (v.length > 0) {
                        (edit as unknown as HTMLInputElement).setSelectionRange(v.length, v.length)
                    } else {
                        (edit as unknown as HTMLInputElement).select();
                    }
                }, 1)



            }

            let ele = edit as unknown as HTMLTextAreaElement;
            if (this.prop_.multiline) {
                this.onInput(ele)
                ele.removeEventListener("input", this.onInputEvent);
                this.onInputEvent = () => this.onInput(ele);
                ele.addEventListener("input", this.onInputEvent);
            }

            ele.addEventListener("compositionstart", () => {
                // console.log("compositionstart", this.text)
                this.compositionstart = true
            })
            ele.addEventListener("compositionupdate", (ev) => {
                // console.log("compositionupdate", this.text)
                // this.compositionstart = true
            })
            ele.addEventListener("compositionend", (ev) => {
                this.compositionstart = false
                let r = (ev.currentTarget as any)?.value;
                this.compositionText = undefined;
                // console.log("compositionend",)
                //chrome会提前触发onChange,需要额外修复
                if (r != null)
                    this.onChange(r)

            })


        }




    }

}///////////////EditViewState end///////////////////



/**
 * 文本输入
 * web端multiline自动扩充高度与flex:1冲突
 * @param prop 
 * @returns 
 */
export function EditView<T extends object>(prop: EditViewProp<T>) {

    //组件状态
    const st = useObject(() => new EditViewState(prop), prop)

    //组件初始化
    useInit(async () => {



        if (prop.state) {
            vali.addCheckFunc(prop.state[0], prop.state[1], st.validFunc)
        }
        return async () => { //组件卸载
            if (prop.state) {
                vali.removeCheckFunc(prop.state[0], prop.state[1], st.validFunc)
            }
        }
    })

    let val = st.getValue();
    if (val !== null && val != st.text) {
        if ((prop.type == "int" || prop.type == "float") && val == 0 && st.text == "-") {

        } else {
            if (Platform.OS === "web" && st.edit && prop.multiline) {
                //修复高度
                InteractionManager.runAfterInteractions(() => {
                    // Expensive task
                    st.onInput(st.edit as unknown as HTMLTextAreaElement)
                });

            }
            st.text = val;
        }

    }

    let editable = prop.editable;

    if (prop.disable != null) {
        editable = !prop.disable;
    }

    const fontSize = getFontSize(prop.style as TextStyle);

    /////////////////////////////////////////
    //////// EditView view//////////
    /////////////////////////////////////////
    return (
        <TextInput

            ref={ref => {
                if (ref) st.onRef(ref)
            }}
            returnKeyType={prop.onDone ? "done" : undefined}

            keyboardType={prop.type === "int" ? "numeric" : (prop.type === "float" ? "decimal-pad" : prop.keyboardType)}

            {...prop}

            value={st.compositionText ?? st.text}
            editable={editable}
            onKeyPress={(e) => {
                const k = e.nativeEvent.key;
                if (k == "Enter") {
                    if (prop.onDone) {
                        e.preventDefault?.();
                        e.stopPropagation?.();
                        prop.onDone()
                    }
                }
                prop.onKeyPress?.(e)
            }}

            onSubmitEditing={(e) => {
                prop.onSubmitEditing?.(e)
                prop.onDone?.()
            }}

            onFocus={(e) => {
                st.focus = true;
                st.$update
                prop.onFocus?.(e)

            }}
            onBlur={(e) => {
                st.focus = false;
                st.$update
                prop.onBlur?.(e)
                if (prop.state) {
                    vali.checkField(prop.state[0], prop.state[1])
                }

            }}

            onChangeText={res => {
                st.onChange(res)
            }}

            placeholderTextColor={prop.placeholderTextColor ?? colors.grey7}

            onContentSizeChange={(event) => {

                if (!prop.multiline) {
                    return;
                }

                if (Platform.OS === "web") {
                    return;
                }

                if (st.styleHeight != null) {
                    return;
                }

                if (st.height != event.nativeEvent.contentSize.height
                    && event.nativeEvent.contentSize.height < st.maxHeight || st.maxHeight <= 0) {
                    if (st.height != event.nativeEvent.contentSize.height && event.nativeEvent.contentSize.height < st.maxHeight) {
                        st.height = event.nativeEvent.contentSize.height;
                        st.$update;
                    }
                }
            }}

            style={[{
                borderBottomWidth: colors.editBorder ? 1 : 0,
                borderBottomColor: st.focus && prop.editable !== false && !prop.disable ? colors.primary : st.bottomColor,
                height: (prop.multiline && st.height >= 0) ? Math.max(fontSize + 14, st.height) : undefined,
            },

            Platform.OS === "web" ?
                {
                    paddingVertical: st.padingVer,
                    paddingHorizontal: 2,
                    // outlineColor: this.borderColor,
                }
                :
                {
                    minWidth: 50,
                    paddingVertical: st.padingVer,
                    paddingHorizontal: 2
                }
                , prop.style, { fontSize: fontSize, }]}

        />
    )


}///////////////EditView end//////////////////

// const sty = StyleSheet.create({

// })