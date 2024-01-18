import { colors } from "@common/components/colors";
import { styles } from '@common/components/styles';
import { ObjStateType, useInit, useObjState } from '@common/lib/hooks';
import React from 'react';
import { Pressable, StyleSheet, ViewProps } from "react-native";
import { IconXC } from '../../../components/IconXC';
import { EditView } from './custom/EditView';
import { V } from './custom/V';
import { Icon } from './icon/Icon';


interface SearchViewProp<T> extends ViewProps {

    placeholder?: string

    editable?: boolean

    onPress?: () => void

    state?: ObjStateType<T>;

    /**
     * 当输入内容变动时,延迟400毫秒触发
     */
    onSearch?: (text: string) => void

    /**
     * 亮色样式(白底黑字)
     */
    light?: boolean

    numberOfLines?: number


    extButton?: string
    onExtButtonClick?: () => void;


    /**
     * 是否自动焦点
     */
    autoFocus?: boolean;
}



export class SearchViewState<T> {
    text = "";
    showButton = false;

    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: SearchViewProp<T>,
    ) {

    }

    timer: any;


    onChangeText(text: string) {
        if (this.prop_.state) {
            (this.prop_.state[0])[this.prop_.state[1]] = text as any;
        }
        this.$update
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            this.prop_.onSearch?.(this.text)
        }, 400);
    }

}///////////////SearchViewState end///////////////////



/**
 * 搜索组件
 * @param prop 
 * @returns 
 */
export function SearchView<T>(prop: React.PropsWithChildren<SearchViewProp<T>>) {

    const st = useObjState(() => new SearchViewState(prop), prop)

    useInit(async () => {


        return async () => {

        }
    })

    if (prop.state) {
        let propText = (prop.state[0])[prop.state[1]] + "";
        if (propText != st.text) {
            st.text = propText
        }
    }



    /////////////////////////////////////////
    ////////return SearchView/////////
    /////////////////////////////////////////
    return (
        <Pressable
            onPress={prop.onPress ? () => prop.onPress?.() : undefined}
            style={[{
                backgroundColor: prop.light ? colors.backgroundDark : colors.whiteTrans,
                borderRadius: 360,
                paddingLeft: 15,
                paddingRight: prop.extButton
                    ? 0 : 10,
                height: 33,
            }, styles.rowCenter, prop.style]}>
            <IconXC name="sousuo_da" size={15} style={[{ marginRight: 5 },]}
                color={prop.light ? colors.TabBlackTrans : colors.TabTrans} />
            <EditView
                autoFocus={prop.autoFocus}
                maxLength={500}
                numberOfLines={prop.numberOfLines}
                onChangeText={text => st.onChangeText(text)}
                placeholderTextColor={prop.light ? colors.TabBlackTrans : colors.TabTrans}
                onDone={() => st.onChangeText(st.text)}
                state={[st, "text"]}
                editable={prop.editable}
                placeholder={prop.placeholder}
                style={[{
                    minWidth: 5,
                    flex: 1, borderBottomColor: colors.transparent,
                    color: prop.light ? colors.black : colors.white,
                },]}

            />
            {st.text.length > 0
                ? <Icon name="close" size={18} color={prop.light ? colors.primary : colors.TabTrans} style={[{
                    marginLeft: 5,
                },]}
                    onPress={() => {
                        st.text = "";
                        st.onChangeText("")
                    }}
                />
                : null
            }
            {
                prop.extButton
                    ? <Pressable
                        style={[{
                            height: "100%",

                            marginLeft: 5,
                            paddingHorizontal: 8,
                            borderTopRightRadius: 360,
                            borderBottomRightRadius: 360,
                            justifyContent: "center",

                            backgroundColor: prop.light ? colors.white : colors.whiteTrans
                        },]}
                        onPress={() => prop.onExtButtonClick?.()}
                    ><V style={[{
                        fontSize: 13,
                        color: prop.light ? colors.primary : colors.white,
                    },]}>{prop.extButton}</V></Pressable>
                    : null
            }
        </Pressable>
    )

}

const sty = StyleSheet.create({

})