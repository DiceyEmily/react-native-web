import { View, TouchableOpacity, Text } from "react-native";
import { V } from "../lib/components/custom/V";
import { useObjState } from "../lib/hooks";
import { CalendarProp, CalendarState } from "./Calendar";
import ScrollPicker from "./ScrollPicker";
import { styles } from "./styles";
import React from 'react';

export

    /**
     * 上下滑动日期选择
     * @param prop 
     * @returns 
     */
    function CalendarScrollSelect(prop: {
        calendarProp: CalendarProp,
        st: CalendarState,
    }) {


    prop.st.fixSelectTime();


    const st = useObjState(() => ({
        days: prop.st.getDays(prop.st.selectDate ?? prop.st.curDateTime),

        startMonth: 0,
        endMonth: 11,
        startDay: 1,
        endDay: 1,


        getDays() {
            st.startDay = st.getDate().getFullYear() == prop.st.startDate.getFullYear()
                && st.getDate().getMonth() == prop.st.startDate.getMonth()
                ? prop.st.startDate.getDate() : 1;

            st.endDay = st.getDate().getFullYear() == prop.st.endDate.getFullYear()
                && st.getDate().getMonth() == prop.st.endDate.getMonth()
                ? prop.st.endDate.getDate() : st.days;


            // console.log(lib.dateToY_M_D(prop.st.startDate), st.startDay, " - ", st.endDay, lib.dateToY_M_D(prop.st.endDate))

            let rets = Array<string>();
            for (let start = st.startDay; start <= st.endDay; start++) {
                rets.push(start.toStr(2) + "日")
            }


            return rets;
        },

        /**
         * 获取选中日期
         * @returns 
         */
        getDate() {
            return prop.st.selectDate ?? prop.st.curDateTime
        },

        getMonths() {
            let selectDate = prop.st.selectDate ?? prop.st.curDateTime;
            let rets = Array<string>();
            st.endMonth = selectDate.getFullYear() == prop.st.endDate.getFullYear() ? prop.st.endDate.getMonth() : 11;
            st.startMonth = selectDate.getFullYear() == prop.st.startDate.getFullYear() ? prop.st.startDate.getMonth() : 0;

            let start = st.startMonth;
            // console.log(lib.dateToY_M_D(prop.st.startDate), st.startMonth, " - ", st.endMonth, lib.dateToY_M_D(prop.st.endDate))

            for (; start <= st.endMonth; start++) {
                rets.push((start + 1).toStr(2) + "月")
            }

            return rets;
        },

        getShowStr() {
            let d = st.getDate();
            let ret = "";
            if (prop.st.hasType("year")) {
                ret += d.getFullYear() + "年"
            }
            if (prop.st.hasType("month")) {
                ret += (d.getMonth() + 1).toStr(2) + "月"
            }
            if (prop.st.hasType("day")) {
                ret += (d.getDate()).toStr(2) + "日"
            }
            return ret;
        },
    }));


    function setDate(d: Date, func: (d: Date) => void) {
        let oldDay = d.getDate();

        d.setDate(1);


        func(d);

        let newDays = prop.st.getDays(d);
        if (oldDay > newDays) {
            oldDay = newDays;
        }
        d.setDate(oldDay);

        if (d > prop.st.endDate) {
            d.setTime(prop.st.endDate.getTime())
        }

        if (d < prop.st.startDate) {
            d.setTime(prop.st.startDate.getTime())
        }
    }


    function getSelectMonth() {
        // console.log("获取选中：", st.getDate().getMonth(), "-", st.startMonth);

        return st.getDate().getMonth() - st.startMonth
    }
    return (
        <View style={[{
            flex: 8,
            paddingBottom: 12,//匹配日历模式
        },]}>
            <TouchableOpacity onPress={() => {
                if (prop.calendarProp.selectType != null) {
                    return;
                }
                prop.st.showScrollSelect = false;
                prop.st.$update
            }}>
                {//年月日标题
                    prop.calendarProp.hideTitle
                        ? null
                        : <Text style={[{
                            fontSize: 17, fontWeight: "bold",
                            alignSelf: "center",
                            marginTop: 15
                        },]}>{st.getShowStr()}</Text>
                }

            </TouchableOpacity>

            {/* 年 */}
            <V style={[{ marginTop: 10 }, styles.rowCenter]}>
                {
                    prop.st.hasType("year")
                        ? <ScrollPicker
                            selectedIndex={st.getDate().getFullYear() - prop.st.startDate.getFullYear()}
                            sizeItem={7}
                            fontSize={15}
                            onValueChange={(res, idx) => {
                                if (prop.st.selectDate == null) {
                                    prop.st.selectDate = new Date(prop.st.curDateTime);
                                }

                                setDate(prop.st.selectDate, (d) => {
                                    d.setFullYear(idx + prop.st.startDate.getFullYear());
                                })

                                st.days = prop.st.getDays(prop.st.selectDate)

                                prop.st.curDateTime = new Date(prop.st.selectDate)

                                prop.calendarProp.onSelect?.(prop.st.selectDate, prop.st)
                                // console.log("选中:", prop.st.selectDate)
                                st.$update
                                prop.st.updateTime?.()
                            }}
                            style={[{ flex: 1, },]}
                            dataSource={prop.st.getYearArray()}
                        />
                        : null
                }

                {///////月
                    prop.st.hasType("month")
                        ? <ScrollPicker
                            dataSource={st.getMonths()}
                            selectedIndex={getSelectMonth()}
                            sizeItem={7}
                            fontSize={15}
                            onValueChange={(res, idx) => {
                                if (prop.st.selectDate == null) {
                                    prop.st.selectDate = new Date(prop.st.curDateTime);
                                }
                                setDate(prop.st.selectDate, (d) => {
                                    d.setMonth(idx + st.startMonth);
                                })

                                prop.st.curDateTime = new Date(prop.st.selectDate)

                                st.days = prop.st.getDays(prop.st.selectDate)
                                prop.calendarProp.onSelect?.(prop.st.selectDate, prop.st)
                                st.$update
                                prop.st.updateTime?.()
                            }}

                            style={[{ flex: 1, },]} />
                        : null
                }

                {//////日
                    prop.st.hasType("day")
                        ? <ScrollPicker
                            dataSource={st.getDays()}
                            selectedIndex={st.getDate().getDate() - st.startDay}
                            sizeItem={7}
                            fontSize={15}
                            onValueChange={(res, idx) => {
                                if (prop.st.selectDate == null) {
                                    prop.st.selectDate = new Date(prop.st.curDateTime);
                                }

                                prop.st.selectDate.setDate(idx + st.startDay);
                                prop.st.curDateTime = new Date(prop.st.selectDate)

                                prop.calendarProp.onSelect?.(prop.st.selectDate, prop.st)
                                prop.st.updateTime?.()
                            }}

                            style={[{ flex: 1, },]} />
                        : null
                }


            </V>
        </View>
    )
}


