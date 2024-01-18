import { PressView } from '@common/lib/components/custom/PressView';
import { V } from '@common/lib/components/custom/V';
import { Icon } from '@common/lib/components/icon/Icon';
import React, { Component } from 'react';
import { StyleSheet, TextStyle, ViewProps } from 'react-native';
import { DialogDateDouble } from './DialogDateDouble';
import { SelectType } from './Calendar';
import { colors } from "./colors";
import { DialogDate } from './DialogDate';
import { leng, styles } from './styles';
import { ObjStateType, ObjStateType2 } from '../lib/hooks';


interface OptionDateProp<T extends object> extends ViewProps {
    /**
     * 初始选中时间,选择时间后会修改其值
     */
    date?: Date | null

    date2?: Date | null


    /**
     * 单日期状态，默认接受Date类型日期，可搭配onState属性转为string或number类型
     */
    state?: ObjStateType<T>


    /**
     * state类型装换，将默认Date转为string或number
     */
    onState?: [(d: Date) => string | number, (d: string | number) => Date]

    /**
     * 双日期状态
     */
    state2?: ObjStateType2<T>

    /**
     * 时间文本显示函数
     */
    renderText?: (d: Date, d2?: Date) => string,

    /**
     * 选择时间回调
     */
    onSelect?: (d: Date, d2?: Date) => void;

    /**
     * 可选择的时间类型
     */
    selectType?: Array<SelectType>

    /**
     * 双时间（开始-结束）选择模式
     */
    double?: boolean;

    /**
     * 是否禁止编辑
     */
    disable?: boolean;


    /**
     * 禁止显示上午，下午文字
     */
    disableAM?: boolean;


    textStyle?: TextStyle;

    /**
   * 允许选择的起始时间-结束时间
   */
    dateRange?: [Date, Date];

    placeHolder?: string;


    editStyle?: boolean;

    /**
     * 是否必选
     */
    required?: boolean;

}


export class OptionDateState {

}

export class OptionDate<T extends object> extends Component<OptionDateProp<T>, OptionDateState> {


    date?: Date;

    date2?: Date;

    private selectType = new Set<SelectType>(this.props.selectType)

    hasType(type: SelectType) {
        if (this.props.selectType) {
            return this.selectType.has(type);
        }
        return true;
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }


    onGetDate(d: Date): any {
        if (this.props.onState) {
            return this.props.onState[0](d)
        }
        return d;
    }
    onStrDate(d: unknown): Date | undefined {
        if (this.props.onState) {
            if (d)
                return this.props.onState[1](d as string)
            else
                return undefined
        }
        return d as Date;
    }

    async onPress() {

        if (this.props.disable == true) {
            return;
        }

        if (this.props.double || this.props.state2) {
            let state = this.props.state2

            let d1 = this.props.date
            let d2 = this.props.date2
            if (state) {
                if (state[0][state[1]])
                    d1 = this.onStrDate(state[0][state[1]]);

                if (state[0][state[2]])
                    d2 = this.onStrDate(state[0][state[2]]);
            }
            //双日期选择,开始-结束
            let res = await DialogDateDouble.show({
                date1: d1,
                date2: d2,
                dateRange: this.props.dateRange,
                selectType: this.props.selectType,
            });



            if (!res.ok) {

                if (res.close) {
                    if (state) {
                        state[0][state[1]] = undefined as any;
                        state[0][state[2]] = undefined as any;
                        this.forceUpdate();
                    }
                }

                return;
            }



            if (this.props.date) {
                this.props.date.setTime(res.date1.getTime())
            } else if (state) {
                state[0][state[1]] = this.onGetDate(new Date(res.date1.getTime()))
            } else {
                this.date = res.date1;
            }

            if (res.date2) {
                if (this.props.date2) {
                    this.props.date2.setTime(res.date2.getTime())
                } else if (state) {
                    state[0][state[2]] = this.onGetDate(new Date(res.date2.getTime()))
                } else {
                    this.date2 = res.date2;
                }

            }


            this.props.onSelect?.(res.date1, res.date2)
            this.forceUpdate();
            return;
        }


        /**
         * 
         * 单日期选择
         */
        let res = await DialogDate.show({
            date: this.getDate(),
            dateRange: this.props.dateRange,
            selectType: this.props.selectType ?? ["year", "month", "day", "hour", "minute"]
        })

        if (!res.ok) {
            return;
        }

        if (this.props.date) {
            this.props.date.setTime(res.date.getTime())
        } else if (this.props.state) {
            let state = this.props.state
            state[0][state[1]] = this.onGetDate(new Date(res.date.getTime()))
        }
        else {
            this.date = res.date;
        }

        this.props.onSelect?.(res.date)

        this.forceUpdate();

    }

    /**
     * 获取选中的时间
     * @returns 
     */
    getDate() {
        if (this.props.date) {
            return this.props.date;
        } else if (this.props.state) {
            let state = this.props.state
            return this.onStrDate(state[0][state[1]]);
        } else if (this.props.state2) {
            let state = this.props.state2
            return this.onStrDate(state[0][state[1]])
        } else if (this.date) {
            return this.date;
        }
        return undefined;
    }

    getPlaceHolder() {
        return this.props.placeHolder ?? "请选择";
    }

    getText() {
        let state = this.props.state2
        if (state) {
            if (!state[0][state[1]] && !state[0][state[2]]) {
                return this.getPlaceHolder();
            }

            return this.getTextByDate(this.onStrDate(state[0][state[1]])) + " - "
                + this.getTextByDate(this.onStrDate(state[0][state[2]]))
        }

        return this.getTextByDate(this.getDate())
    }

    getTextByDate(d?: Date) {
        if (d) {
            if (this.props.renderText) {
                return this.props.renderText(d, this.date2)
            } else {
                let symb = "-";
                let ret = "";
                if (this.hasType("year")) {
                    ret += d.getFullYear();
                }

                if (this.hasType("month")) {
                    if (ret.length > 0) {
                        ret += symb;
                    }
                    ret += (d.getMonth() + 1).toStr(2);
                }

                if (this.hasType("day")) {
                    if (ret.length > 0) {
                        ret += symb;
                    }
                    ret += d.getDate().toStr(2);
                }

                if (ret.length > 0) {
                    ret += " ";
                }

                let hasSecond = this.hasType("second");
                if (!this.props.disableAM && !hasSecond && (this.hasType("hour") || this.hasType("noon"))) {

                    if (d.getHours() < 12) {
                        ret += "上午 "
                    } else {
                        ret += "下午 "
                    }
                }
                if (this.hasType("hour")) {
                    ret += d.getHours().toStr(2) + (hasSecond ? ":" : "时");
                }
                if (this.hasType("minute")) {
                    ret += d.getMinutes().toStr(2) + (hasSecond ? ":" : "分");
                }
                if (hasSecond) {
                    ret += d.getSeconds().toStr(2);
                }
                return ret
            }
        }

        return this.getPlaceHolder();
    }

    render() {

        let d = this.getDate()

        return (
            <PressView
                onPress={() => this.onPress()}
                style={[!colors.editBorder ? null : (
                    this.props.editStyle ?
                        {
                            paddingVertical: 6,
                            paddingHorizontal: 5,
                            borderBottomWidth: 1,
                            borderColor: colors.lineGrey,
                        }
                        : {
                            borderWidth: leng.pixel1,
                            borderColor: colors.lineGrey,
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderRadius: 360,
                        }), styles.rowCenter, this.props.style]}>
                <V style={[{
                    flex: 1, color: d ? colors.textMain : colors.editGrey,
                    marginRight: 10
                }, this.props.textStyle]}>{this.getText()}</V>
                <Icon name="calendar_today" size={20} color={colors.editGrey} />

                {
                    this.props.required ? <V style={[{ paddingLeft: 2 }, styles.titleRed]}>*</V> : null
                }
            </PressView>
        )
    } //render end

}

const styl = StyleSheet.create({

})