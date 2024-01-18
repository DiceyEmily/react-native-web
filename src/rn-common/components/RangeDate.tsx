import { V } from '@common/lib/components/custom/V';
import { ObjStateType, useInit, useObjState } from '@common/lib/hooks';
import { lib } from '@common/lib/lib';
import React from 'react';
import { Pressable, StyleSheet, ViewProps, ViewStyle } from "react-native";
import { IconXC } from '../../components/IconXC';
import { SelectType } from './Calendar';
import { colors } from './colors';
import { DialogDate } from './DialogDate';
import { OptionDate } from './OptionDate';
import { styles } from './styles';


interface RangeDateProp extends ViewProps {
    /**
       * 允许选择的起始时间-结束时间
       */
    dateRange?: [Date, Date];

    /**
     * 初始时间
     */
    startTime?: Date | null;

    /**
     * 结束时间
     */
    endTime?: Date | null;

    /**
      * 可选择的时间类型
      */
    selectType?: Array<SelectType>,

    /**
     * 是否必填
     */
    required?: boolean,

    /**
     * 按列显示标题(竖排样式)
     */
    column?: [string, string],


    //禁用时间选择
    disableTime?: boolean,

    placeHolder?: [string, string],

    /**
     * 是否禁止编辑
     */
    disable?: boolean;

    /**
     * 搜索按钮事件,与显示控制
     */
    onSearch?: (start: Date, end: Date) => void

    //
    onSelectStart?: (d: Date) => void

    //
    onSelectEnd?: (d: Date) => void

    startStyle?: ViewStyle
    endStyle?: ViewStyle
}


export class RangeDateState {

    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: RangeDateProp,
    ) {

    }

    /**
     * 选中的起始时间
     */
    startTime = this.prop_.startTime;

    /**
     * 选中的结束时间
     */
    endTime = this.prop_.endTime;


    /**
    * 最大结束日期
    */
    endDate = this.prop_.dateRange?.[1] ?? lib.newDate(new Date(), 0, 1)


    /**
     * 最小开始日期
     */
    startDate = this.prop_.dateRange?.[0] ?? lib.newDate(this.endDate, -30);


    getDateText(d: Date | null | undefined, idx: number) {


        if (!d) {
            return this.prop_.placeHolder?.[idx] ?? "请选择";
        }

        return this.prop_.disableTime
            ? lib.dateToY_M_D(d)
            : lib.dateToY_M_D_H_M_S(d)
    }


}///////////////RangeDateState end///////////////////



/**
 * 开始-结束范围时间选择
 * 默认横向排列, 可通过column参数改为竖向排列样式
 * @param prop 
 * @returns 
 */
export function RangeDate(prop: RangeDateProp) {

    //组件状态
    const st = useObjState(() => new RangeDateState(prop), prop)
    if (prop.startTime !== undefined) {
        st.startTime = prop.startTime
    }


    if (prop.endTime !== undefined) {
        st.endTime = prop.endTime
    }

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })



    if (prop.column) {
        return <V style={[{}, prop.style]}>
            <V style={[{}, !colors.editBorder ? sty.bottomLine : styles.rowMar]}>

                <V style={[{ flexDirection: "row" }, styles.titleSub]}>
                    {
                        !colors.editBorder ?
                            [
                                prop.required ? <V key={0} style={[{ marginRight: 2 }, styles.titleRed]}>*</V> : null,
                                <V>{prop.column[0]}</V>,
                            ]
                            :
                            [
                                <V>{prop.column[0]}</V>,
                                prop.required ? <V key={1} style={styles.titleRed}>*</V> : null,
                            ]
                    }
                </V>
                {/* 局右 */}
                {!colors.editBorder ? <V style={[{ flex: 1 },]} /> : null}
                <OptionDate
                    disable={prop.disable}
                    date={st.startTime}
                    placeHolder={prop.placeHolder?.[0]}
                    selectType={prop.selectType}
                    dateRange={[st.startDate, st.endDate]}
                    onSelect={d => {
                        if (!st.startTime) {
                            st.startTime = d;
                        }
                        st.startTime.setTime(d.getTime());

                        prop.onSelectStart?.(st.startTime)
                        if (st.endTime && st.endTime < st.startTime) {
                            st.endTime.setTime(st.startTime.getTime());
                            prop.onSelectEnd?.(st.endTime)
                        }
                        st.$update
                    }}
                    style={[!colors.editBorder ? {} : { flex: 1, },]}
                />
            </V>

            <V style={[{}, !colors.editBorder ? sty.bottomLine : styles.rowMar]}>
                <V style={[{ flexDirection: "row" }, styles.titleSub]}>
                    {
                        !colors.editBorder ?
                            [
                                prop.required ? <V key={0} style={[{ marginRight: 2 }, styles.titleRed]}>*</V> : null,
                                <V>{prop.column[1]}</V>,

                            ]
                            :
                            [
                                <V>{prop.column[1]}</V>,
                                prop.required ? <V key={1} style={styles.titleRed}>*</V> : null,
                            ]
                    }
                </V>
                {/* 局右 */}
                {!colors.editBorder ? <V style={[{ flex: 1 },]} /> : null}
                <OptionDate
                    disable={prop.disable}
                    date={prop.endTime ?? st.endTime}
                    selectType={prop.selectType}
                    dateRange={[st.startTime ?? st.startDate, st.endDate]}
                    placeHolder={prop.placeHolder?.[1]}
                    onSelect={d => {

                        if (!st.endTime) {
                            st.endTime = d;
                        }

                        st.endTime.setTime(d.getTime());
                        prop.onSelectEnd?.(st.endTime)
                        st.$update

                    }}
                    style={[!colors.editBorder ? {} : { flex: 1, },]}
                />
            </V>
        </V>
    }


    /////////////////////////////////////////
    //////// RangeDate view//////////
    /////////////////////////////////////////
    return (
        <V
            style={[{
                marginHorizontal: 10, marginTop: 10, flexDirection: 'row',
                borderColor: colors.greyD,
                borderWidth: colors.editBorder ? 1 : 0,
                borderRadius: colors.editBorder ? 360 : 0,
            }, prop.style]}

        >
            <Pressable style={[{
                flexDirection: 'row',
                marginLeft: colors.editBorder ? 10 : 0,
                padding: 4,
                flex: 1,
                alignItems: 'center',
            }, prop.startStyle]}
                onPress={() => {
                    DialogDate.show({
                        date: prop.startTime,
                        disableTime: prop.disableTime,
                        selectType: prop.selectType,
                        dateRange: [st.startDate, st.endDate],
                        onSelect: (d) => {

                            if (!st.startTime) {

                                st.startTime = d;
                            }
                            st.startTime.setTime(d.getTime());

                            prop.onSelectStart?.(d)
                            if (st.endTime && st.endTime < st.startTime) {
                                st.endTime.setTime(st.startTime.getTime());
                                prop.onSelectEnd?.(st.endTime)
                            }
                            st.$update

                        },
                    })
                }}
            >
                <IconXC name="rili" size={20} color={colors.editGrey} />
                <V numberOfLines={2} style={{
                    color: st.startTime ? colors.textMain : colors.editGrey,
                    paddingLeft: 5,
                }}>{st.getDateText(st.startTime, 0)}</V>
            </Pressable>
            <Pressable style={[{
                flexDirection: 'row',
                padding: 4,
                flex: 1, alignItems: 'center',
            }, prop.endStyle]}
                onPress={() => {
                    DialogDate.show({
                        date: prop.endTime,
                        selectType: prop.selectType,
                        disableTime: prop.disableTime,
                        dateRange: [st.startTime ?? st.startDate, st.endDate],
                        onSelect: (d) => {
                            if (!st.endTime) {
                                st.endTime = d;
                            }

                            st.endTime.setTime(d.getTime());
                            st.$update
                            prop.onSelectEnd?.(d)
                        },
                    })
                }}
            >
                <IconXC name="rili" size={20} color={colors.editGrey} />
                <V numberOfLines={2} style={{
                    color: st.endTime ? colors.textMain : colors.editGrey,
                    paddingLeft: 5,
                }}>{st.getDateText(st.endTime, 1)}</V>
            </Pressable>

            {
                prop.onSearch ? <Pressable
                    style={{
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: colors.primary,
                        backgroundColor: colors.white,
                        paddingHorizontal: 10, paddingVertical: 4,
                        borderRadius: 360,
                    }}
                    onPress={() => {

                        prop.onSearch?.(st.startTime ?? new Date(), st.endTime ?? new Date())
                    }}
                >
                    <V style={{
                        color: colors.primary, textAlign: 'center',
                        fontSize: 15
                    }}>查询</V>
                </Pressable>
                    : null
            }

        </ V >
    )


}///////////////RangeDate end//////////////////

const sty = StyleSheet.create({
    bottomLine: {
        borderBottomWidth: 1,
        borderColor: colors.greyE,
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 12,
    }
})