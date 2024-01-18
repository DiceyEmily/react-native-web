import { AnimDeg } from '@common/lib/Anim';
import { PressView } from '@common/lib/components/custom/PressView';
import { V } from '@common/lib/components/custom/V';
import { Icon } from '@common/lib/components/icon/Icon';
import { RecyclePager, RecyclePagerState } from '@common/lib/components/tabview/RecyclePager';
import { useInit, useObjState } from '@common/lib/hooks';
import { lib } from '@common/lib/lib';
import React from 'react';
import { Animated, Pressable, StyleSheet, Text, TouchableOpacity, View, ViewProps } from 'react-native';
import { RefState } from '../lib/RefState';
import { CalendarScrollSelect } from './CalendarScrollSelect';
import { CalendarTime } from './CalendarTime';
import { colors } from "./colors";
import { leng, styles } from './styles';

//noon: 上午 下午模式
export type SelectType = "year" | "month" | "day" | "hour" | "minute" | "second" | "noon"

export interface CustomValItem {
    key: string,
    val: number,
    index?: number,
}


export interface CustomValType {
    "hour"?: Array<CustomValItem>,
    "minute"?: Array<CustomValItem>,
    "second"?: Array<CustomValItem>,
}

export interface CalendarProp extends ViewProps, RefState<CalendarState> {

    /**
     * 初始日期
     */
    date?: Date | null;

    //储存所有标记日期<年-月-日 , 是否标记 | 标记颜色>
    signMap?: Map<string, boolean | string>;

    /**
     * 选择结果(每次改变日期都会触发此事件,触发事件源可从state中获取，如:fromPage)
     */
    onSelect?: (dat: Date, state: CalendarState) => void

    /**
    * 切换月事件
    */
    onChangeMonth?: (dat: Date) => void;

    //禁用日期选择
    disableDate?: boolean

    //禁用时间选择
    disableTime?: boolean,

    //指定滑动选择类型
    selectType?: Array<SelectType>,

    /**
    * 当selectType包含年月日,显示日历样式
    */
    showCalendar?: boolean

    /**
     * 禁用上下滑动日期选择
     */
    disableScroll?: boolean,

    /**
     * 禁用左右滑动月份选择
     */
    disableTouch?: boolean,

    /**
     * 开启选周模式,默认选日
     */
    selectWeek?: boolean;


    /**
     * 隐藏周日切换
     */
    hideSelectWeek?: boolean;

    /**
     * 开启日表和周表的切换
     */
    onSelectWeek?: (dat: Date) => void

    /**
     * 是否周日起始
     */
    sundayStart?: boolean;

    /* 隐藏顶部月份切换 */
    hideTitle?: boolean;

    /**
     * 展开收起模式,按周翻页
     */
    expand?: boolean;

    /**
     * 初始折叠,(expand模式下)
     */
    initFold?: boolean;

    /**
     * 允许选择的起始时间-结束时间
     */
    dateRange?: [Date, Date];

    /**
    * 自定义列表数据
    */
    customVal?: CustomValType;

    //显示农历
    showLunar?: boolean;

    /**
     * 显示额外日期item信息
     */
    renderItemInfo?: (
        enable: boolean,
        year: number, month: number, dayOfMonth: number,
        isSelect: boolean | null | undefined,
    ) => React.ReactElement | React.ReactElement[]
}

const today = new Date;

export class CalendarState {

    /**
     * 当前显示日历页,折叠模式为周一，
     */
    curDateTime = new Date();

    //周选择模式
    selectWeek = false;

    //是否为来自翻页事件
    fromPage = false;

    //更新组件
    get $update() { return }

    //当前选择的日期
    selectDate: Date | null = null;

    get date() {
        return this.selectDate ?? this.curDateTime
    }

    pageState: RecyclePagerState | null = null;


    /**
     * 用于通过val值反向查询CustormValItem
     */
    valCustom: CustomValType = {};

    /**
     * 滑动选择年月日模式
     */
    showScrollSelect = false;

    private arrowAnim = new AnimDeg(0)

    updateTime?: () => void

    /**
     * 是否展开
     */
    isExpand = true;


    /**
     * 手动刷新日历界面
     */
    refresh() {
        this.pageState?.onCurrent();
        this.pageState?.$update;
    }

    onExpand() {
        this.isExpand = !this.isExpand;
        this.arrowAnim.start(this.isExpand ? 0 : 180)
        // this.$update;
        this.curDateTime.setTime(this.selectDate?.getTime() ?? Date.now())

        this.refresh();
    }

    arrow() {
        return <V style={[{ flexDirection: 'row' },]}>
            <Animated.View
                style={{
                    alignSelf: "center",
                    transform: [
                        this.arrowAnim.rotate,
                    ]
                }} ><Icon name='expand_more' color={colors.grey9} size={15} />
            </Animated.View>

            {this.prop_.onSelectWeek && !this.prop_.hideSelectWeek ? < V style={[{ color: colors.primary },]}
                onPress={() => {
                    if (this.selectDate) {
                        this.selectWeek = !this.selectWeek
                        this.prop_.onSelectWeek?.(this.selectDate)
                        setTimeout(() => {
                            this.refresh();
                        }, 0)

                    }
                }}
            >{this.selectWeek ? '周表' : "日表"}
            </V> : null}
        </V >
    }

    constructor(
        //组件属性
        public prop_: CalendarProp,
    ) {

        this.selectWeek = !!prop_.selectWeek;

        if (this.prop_.date) {
            this.selectDate = new Date(this.prop_.date);
            this.curDateTime = new Date(this.prop_.date)
        }

        if (this.prop_.expand && !this.prop_.date) {
            this.selectDate = new Date();
        }
        if (this.prop_.initFold) {
            this.isExpand = false;
            this.arrowAnim.setValue(180)
        }

        if (this.prop_.showLunar) {
            this.renderItem = this.renderLunarItem
        }

        if (this.prop_.customVal) {
            for (let k in this.prop_.customVal) {
                let v = this.prop_.customVal[k as "second"];
                if (!v) {
                    continue;
                }
                let m = Array<CustomValItem>();
                v.forEach((it, idx) => {
                    m[it.val] = it;
                    it.index = idx;
                })
                this.valCustom[k as "second"] = m;
            }
        }
    }

    fixDateRange(start: Date, end: Date) {
        this.startDate = start;
        this.endDate = end;
        this.$update;
    }

    /**
     * 结束日期
     */
    endDate = this.prop_.dateRange ? this.prop_.dateRange[1] : lib.newDate(new Date(), 0, 1);


    /**
     * 开始日期
     */
    startDate = this.prop_.dateRange ? this.prop_.dateRange[0] : lib.newDate(this.endDate, -30);


    fixSelectTime() {
        if (this.selectDate) {
            if (this.startDate > this.selectDate) {
                this.selectDate.setTime(this.startDate.getTime())

                this.prop_.onSelect?.(this.selectDate, this)
            }

            if (this.endDate < this.selectDate) {
                this.selectDate.setTime(this.endDate.getTime())
                this.curDateTime.setTime(this.endDate.getTime())
                this.prop_.onSelect?.(this.selectDate, this)
            }
        }

        if (this.startDate > this.curDateTime) {
            this.curDateTime.setTime(this.startDate.getTime())
        }
        if (this.endDate < this.curDateTime) {
            this.curDateTime.setTime(this.endDate.getTime())
        }
    }

    selectType = new Set<SelectType>(this.prop_.selectType)

    /**
     * 判断是否可以选择指定类型
     * @param type 
     * @returns 
     */
    hasType = (type: SelectType) => {
        if (!this.prop_.selectType && type != "second" && type != "noon") {
            return true;
        }

        return this.selectType.has(type);
    }

    weekStr = this.prop_.sundayStart
        ? ["日", "一", "二", "三", "四", "五", "六",]
        : ["一", "二", "三", "四", "五", "六", "日",]




    /**
     * 设置当前选择的时间
     * @param year 
     * @param month 
     * @param dayOfMonth 
     * @param jumpToSelect 同时跳转到选择页
     */
    onSelect(year: number, month: number, dayOfMonth: number, jumpToSelect?: boolean) {

        this.selectDate = new Date(year, month, dayOfMonth);
        if (jumpToSelect)
            this.curDateTime.setTime(this.selectDate.getTime());
        this.prop_.onSelect?.(this.selectDate, this);
        this.updateTime?.()
        this.refresh();
    }


    weekView = (
        <View style={[{}, styles.row]} >
            {Number(7).loopMap(i => //日历星期名称
                <TouchableOpacity key={i} style={[{ flex: 1 }, styles.center]}>
                    <V style={[{ padding: 8, color: colors.grey9 },]} >
                        {this.weekStr[i]}
                    </V>
                </TouchableOpacity>
            )}
        </View>
    )


    /* 左箭头 */
    leftArrow = <TouchableOpacity onPress={() => this.pageState?.onLeft()} style={[{ padding: 5, flex: 1 },]} >
        <Icon name="arrow_back_ios" size={20} color={colors.grey9} />
    </TouchableOpacity>

    /* 右箭头 */
    rightArrow = <TouchableOpacity onPress={() => this.pageState?.onRight()} style={[{
        padding: 5, flex: 1, alignItems: "flex-end"
    },]}>
        <Icon name="arrow_forward_ios" size={20} color={colors.grey9} />
    </TouchableOpacity>


    /**
     * 判断并设置是否允许左右翻页
     * @param dat 
     * @returns 
     */
    setEnable(dat: RecyclePagerState) {


        if (!this.isExpand) {
            if (this.getNum(this.curDateTime.getFullYear(), this.curDateTime.getMonth(), this.curDateTime.getWeekOfMonth())
                <
                this.getNum(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getWeekOfMonth())) {
                dat.enableRight = true;
            } else {
                dat.enableRight = false;
            }

            if (
                this.getNum(this.curDateTime.getFullYear(), this.curDateTime.getMonth(), this.curDateTime.getWeekOfMonth())
                > this.getNum(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getWeekOfMonth())
            ) {
                dat.enableLeft = true;
            } else {
                dat.enableLeft = false;
            }
            return;
        }

        // console.log(this.curDateTime.getMonth(), " - ", this.endDate.getMonth())

        if (this.curDateTime.getFullYear() * 100 + this.curDateTime.getMonth() < this.endDate.getFullYear() * 100 + this.endDate.getMonth()) {
            dat.enableRight = true;
        } else {
            dat.enableRight = false;
        }

        if (this.curDateTime.getFullYear() * 100 + this.curDateTime.getMonth() > this.startDate.getFullYear() * 100 + this.startDate.getMonth()) {
            dat.enableLeft = true;
        } else {
            dat.enableLeft = false;
        }


    }

    getNum(d1: number, d2: number, d3: number) {
        return d1 * 10000 + d2 * 100 + d3;
    }

    isDateEnable(d: Date) {
        return this.isEnable(d.getFullYear(), d.getMonth(), d.getDate())

    }

    /**
     * 判断给定年月日是否再startDate endDate范围内
     * @param year 
     * @param month 
     * @param day 
     * @returns 
     */
    isEnable(year: number, month: number, day: number) {
        let d = this.getNum(year, month, day);
        if (d >= this.getNum(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate())
            && d <= this.getNum(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate())
        ) {
            return true;
        }
        return false;
    }


    getStartYear() {
        return this.startDate.getFullYear();
    }

    getYearArray() {
        let endYear = this.endDate.getFullYear();
        let startYear = this.startDate.getFullYear();
        let arr = Array<string>();
        for (; startYear <= endYear; startYear++) {
            arr.push(startYear + "年");
        }
        return arr
    }


    /**
     * 普通日期单元Item 
     * @param enable 
     * @param year 
     * @param month 
     * @param dayOfMonth 
     * @param isSelect 
     * @returns 
     */
    renderItem = (
        enable: boolean,
        year: number, month: number, dayOfMonth: number,
        isSelect: boolean | null | undefined,
    ) => {

        let yearStr = year + "-" + (month + 1).toStr(2) + "-" + dayOfMonth.toStr(2);

        let sign = this.prop_.signMap?.get(yearStr)

        return (
            <PressView
                borderless={true}
                onPress={enable ? () => this.onSelect(year, month, dayOfMonth) : undefined}
                key={dayOfMonth}
                style={[styles.flex1, styles.center]}
            >
                <Text
                    style={[enable ? styl.daytext : styl.dayDisableText,
                    //选中背景圆
                    isSelect ? (this.selectWeek ? styl.roundw360 : styl.round360) : null]}
                >
                    {dayOfMonth}
                    {this.prop_.renderItemInfo?.(enable, year, month, dayOfMonth, isSelect)}
                </Text>

                {/* 底部圆点 */}
                <View style={[styl.dot, sign ? styl.round360 : null,
                typeof sign == 'string' ? [{ backgroundColor: sign ?? colors.red }] : null]} />
            </PressView>
        )
    }

    /**
     * 农历日期Item
     * @param enable 
     * @param year 
     * @param month 
     * @param dayOfMonth 
     * @param isSelect 
     * @returns 
     */
    renderLunarItem = (
        enable: boolean,
        year: number, month: number, dayOfMonth: number,
        isSelect: boolean | null | undefined,
    ) => {

        let lunar = lib.solar2lunar(year, month, dayOfMonth);

        let yearStr = year + "-" + (month + 1).toStr(2) + "-" + dayOfMonth.toStr(2);

        let sign = this.prop_.signMap?.get(yearStr)

        return (
            <PressView
                borderless={true}
                onPress={enable ? () => this.onSelect(year, month, dayOfMonth) : undefined}
                key={dayOfMonth}
                style={[styles.flex1]} >
                <Text style={[
                    enable ? styl.daytextLunar : styl.dayDisableTextLunar,
                    //选中背景圆
                    isSelect ?
                        (
                            this.selectWeek ?
                                styl.lunarWeekSelect
                                :
                                styl.lunarSelect

                        ) : null,
                ]}>
                    {dayOfMonth}
                    {/* 农历 */}
                    <Text
                        style={[{
                            fontSize: 12,
                            color: lunar.lunarFestival ?
                                (isSelect ? colors.white : colors.primary)
                                : undefined
                        },]}>
                        {"\n" + (lunar.lunarFestival || lunar.IDayCn)}
                    </Text>
                    {this.prop_.renderItemInfo?.(enable, year, month, dayOfMonth, isSelect)}
                </Text>


                {/* 底部圆点 */}
                <View style={[styl.dot, typeof sign == 'boolean' || typeof sign == 'string' ? styl.round360 : null,
                typeof sign == 'string' ? [{ backgroundColor: sign ?? colors.red }] : null]} />
            </PressView>
        )
    }




    /**
     * 折叠后的单行日历
     * @returns 
     */
    renderRow() {
        let date = new Date(this.selectDate || new Date());
        lib.setDateWeek1(date);


        return <View
            style={[styles.row, { paddingBottom: 5, }]} >
            {Number(7).loopMap(colI => {
                if (colI > 0)
                    date.setDate(date.getDate() + 1);

                let year = date.getFullYear();
                let month = date.getMonth();
                let dayOfMonth = date.getDate();
                let enable = this.isEnable(year, month, dayOfMonth);

                let isSelect = this.selectDate && this.selectDate.getFullYear() == date.getFullYear()
                    && this.selectDate.getMonth() == date.getMonth()
                    && this.selectDate.getDate() == dayOfMonth

                if (this.selectWeek) {
                    isSelect = true;
                }

                return this.renderItem(
                    enable,
                    year, month, dayOfMonth,
                    isSelect
                )
            }
            )}
        </View>
    }

    /**
     * 获取当前日期的月份天数
     * @param month 
     * @returns 
     */
    getDays(month: Date) {
        let endMonth = new Date(month);
        endMonth.setDate(1);
        endMonth.setMonth(endMonth.getMonth() + 1);//再设置成下个月
        endMonth.setDate(0);//最后减一天即为当月最后一天
        return endMonth.getDate();
    }

    //显示该月下所有日
    renderAllDay(date: Date) {

        if (this.isExpand) {
            date.setDate(1);
        }
        else {
            lib.setDateWeek1(date);
        }


        let startWeek = date.getDayOfWeek()

        let endDay = this.getDays(date)

        let selectWeek = this.selectDate ? this.selectDate.getWeekOfMonth() : null;

        let renderI = (day: number, isSelectWeek: boolean | null) => {
            //单日信息
            let dayOfMonth = day - startWeek + 1;

            let isSelect = this.selectDate && this.selectDate.getFullYear() == date.getFullYear()
                && this.selectDate.getMonth() == date.getMonth()
                && this.selectDate.getDate() == dayOfMonth

            let enable = this.isEnable(date.getFullYear(), date.getMonth(), dayOfMonth);

            if (day >= startWeek && day < endDay + startWeek) {

                return this.renderItem(
                    enable,
                    date.getFullYear(), date.getMonth(), dayOfMonth,
                    isSelect || isSelectWeek
                )
            }

            return <View key={dayOfMonth} style={{ flex: 1, height: 44 }} />
        }

        return <View style={[{ paddingTop: 10, flexDirection: "column" },]} >
            {this.prop_.hideTitle ? null : <View style={[{ paddingHorizontal: 10 }, styles.rowCenter]} >
                {this.pageState?.enableLeft ? this.leftArrow : <View style={styles.flex1} />}

                <Pressable
                    style={[{}, styles.rowCenter]}
                    onPress={() => {

                        if (this.prop_.expand) {
                            this.onExpand();
                        }

                        if (this.prop_.disableScroll) {
                            return;
                        }

                        this.showScrollSelect = true;
                        this.$update
                    }}>
                    <Text style={[{
                        fontSize: 17,
                        textAlign: "center", color: colors.grey3,
                        fontWeight: "bold"
                    },]} >{this.isExpand ? date.getFullYear() + "年" + (date.getMonth() + 1) + "月"
                        : this.selectDate?.getFullYear() + "年" + ((this.selectDate?.getMonth() ?? 0) + 1) + "月"}</Text>
                    {
                        this.prop_.expand ?
                            this.arrow() : null
                    }
                </Pressable>
                {this.pageState?.enableRight ? this.rightArrow : <View style={styles.flex1} />}

            </View>}
            {this.weekView}
            {this.isExpand ? Number(6).loopMap(rowI => //日历日期
            {
                let isSelectWeek = this.selectWeek && this.selectDate && this.selectDate.getFullYear() == date.getFullYear()
                    && this.selectDate.getMonth() == date.getMonth()
                    && selectWeek === rowI

                return <View key={rowI}
                    style={[styles.row]} >
                    {Number(7).loopMap(colI =>
                        renderI(rowI * 7 + colI, isSelectWeek)
                    )}
                </View>
            }

            )
                : this.renderRow()
            }
        </View>
    }






}///////////////CalendarState end///////////////////



/**
 * 日历
 * @param prop 
 * @returns 
 */
export function Calendar(prop: CalendarProp) {

    //组件状态
    const st = useObjState(() => new CalendarState(prop), prop)

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })

    if (prop.selectType) {
        st.showScrollSelect = true;
    }

    if (prop.showCalendar && st.selectType.has("year") && st.selectType.has("month") && st.selectType.has("day")) {
        st.showScrollSelect = false;
    }



    st.fixSelectTime();

    /////////////////////////////////////////
    //////// Calendar view//////////
    /////////////////////////////////////////


    return (
        <V style={[{
            width: "100%",
        }, styles.row, prop.style]}>
            {
                prop.disableDate || !(st.hasType("year") || st.hasType("month") || st.hasType("day")) ?
                    null
                    :
                    (
                        st.showScrollSelect ?
                            <CalendarScrollSelect calendarProp={prop} st={st} />
                            : <RecyclePager
                                disableTouch={prop.disableTouch}
                                style={[{
                                    flex: 8,
                                },]}
                                onLeft={dat => {
                                    if (st.isExpand) {
                                        st.curDateTime.setMonth(st.curDateTime.getMonth() - 1);
                                        if (prop.onChangeMonth) {
                                            //监听了回调，切换当前时间
                                            prop.onChangeMonth(st.curDateTime)
                                            st.selectDate = st.curDateTime
                                            st.$update
                                        }
                                    } else {
                                        if (st.selectDate) {
                                            st.selectDate.setDate(st.selectDate.getDate() - 7);
                                            if (!st.isDateEnable(st.selectDate)) {
                                                st.selectDate.setTime(st.startDate.getTime())
                                            }
                                            st.fromPage = true;
                                            try {
                                                prop.onSelect?.(st.selectDate, st)
                                            } finally {
                                                st.fromPage = false;
                                            }
                                        }
                                        st.curDateTime.setTime(st.selectDate?.getTime() ?? Date.now())
                                    }

                                    st.setEnable(dat)
                                    return st.renderAllDay(st.curDateTime)
                                }}

                                onRight={dat => {
                                    if (st.isExpand) {
                                        st.curDateTime.setMonth(st.curDateTime.getMonth() + 1);
                                        if (prop.onChangeMonth) {
                                            //监听了回调，切换当前时间
                                            prop.onChangeMonth(st.curDateTime)
                                            st.selectDate = st.curDateTime
                                            st.$update
                                        }
                                    } else {
                                        if (st.selectDate) {
                                            st.selectDate.setDate(st.selectDate.getDate() + 7);
                                            if (!st.isDateEnable(st.selectDate)) {//超出选择范围
                                                st.selectDate.setTime(st.endDate.getTime())
                                            }
                                            st.fromPage = true;
                                            try {
                                                prop.onSelect?.(st.selectDate, st)
                                            } finally {
                                                st.fromPage = false;
                                            }
                                        }
                                        st.curDateTime.setTime(st.selectDate?.getTime() ?? Date.now())

                                    }

                                    st.setEnable(dat)
                                    return st.renderAllDay(st.curDateTime)
                                }}


                                onCurrent={dat => {
                                    st.pageState = dat;

                                    st.setEnable(dat)

                                    return st.renderAllDay(st.curDateTime)
                                }}
                            />
                    )

            }

            {
                prop.disableTime || !(st.hasType("hour") || st.hasType("minute") || st.hasType("second") || st.hasType("noon")) ?
                    null
                    : <CalendarTime calendarProp={prop} st={st} />
            }

        </V>
    )



}///////////////Calendar end//////////////////







const styl = StyleSheet.create({
    round360: {
        color: colors.contraPrimary,
        backgroundColor: colors.primary,
        borderRadius: 360,
        shadowColor: colors.shadow,
        shadowOpacity: leng.shadowOpacity,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 4,
        elevation: 3, //android专属
    },
    roundw360: {
        color: colors.primary,
        backgroundColor: colors.white,
        borderRadius: 360,
        borderWidth: 1,
        borderColor: colors.shadoww,
        shadowColor: colors.shadow,
        shadowOpacity: leng.shadowOpacity,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 4,
        elevation: 3, //android专属
    },
    roundBorder360: {
        borderRadius: 360,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    roundBorder360Trans: {
        borderWidth: 1,
        borderColor: colors.transparent,
    },
    daytextLunar: {
        color: colors.grey3,
        paddingVertical: 5,
        marginTop: 1,
        marginHorizontal: 5,
        textAlign: "center",
    },
    dayDisableTextLunar: {
        color: colors.greyC,
        paddingVertical: 5,
        marginTop: 1,
        marginHorizontal: 5,
        textAlign: 'center',
    },

    lunarSelect: {
        backgroundColor: colors.primary, borderRadius: 3, color: colors.white,
    },
    lunarWeekSelect: {
        borderRadius: 3, borderWidth: 1, borderColor: colors.primary,
    },
    daytext: {
        color: colors.grey3,
        width: 28, height: 28, marginTop: 7,
        textAlign: "center",
        lineHeight: 28,
        fontSize: 14,
        // fontWeight: "bold",
    },
    dayDisableText: {
        color: colors.greyC,
        width: 28, height: 28, marginTop: 7,
        textAlign: "center",
        lineHeight: 28,
        fontSize: 14,
        // fontWeight: "bold",
    },
    dot: {
        marginTop: 2,
        width: 4, height: 4,
        marginBottom: 3,
    }
})