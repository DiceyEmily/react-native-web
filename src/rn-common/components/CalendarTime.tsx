import { View, Text } from "react-native";
import { V } from "../lib/components/custom/V";
import { useObjState } from "../lib/hooks";
import { CalendarProp, CalendarState } from "./Calendar";
import ScrollPicker from "./ScrollPicker";
import { styles } from "./styles";
import React from 'react';

export function CalendarTime(prop: {
    calendarProp: CalendarProp,
    st: CalendarState,
}) {

    const st = useObjState(() => ({
        /**
        * 获取选中日期
        * @returns 
        */
        getDate() {
            return prop.st.selectDate ?? prop.st.curDateTime
        },
        startHours: 0,
        endHours: 23,
        startNoon: 0,
        endNoon: 1,

        startMinus: 0,
        endMinus: 59,

        startSecond: 0,
        endSecond: 59,

        getSecond() {
            st.startSecond = st.getDate().getFullYear() == prop.st.startDate.getFullYear()
                && st.getDate().getMonth() == prop.st.startDate.getMonth()
                && st.getDate().getDate() == prop.st.startDate.getDate()
                && st.getDate().getHours() == prop.st.startDate.getHours()
                && st.getDate().getMinutes() == prop.st.startDate.getMinutes()
                ? prop.st.startDate.getSeconds() : 0;

            st.endSecond = st.getDate().getFullYear() == prop.st.endDate.getFullYear()
                && st.getDate().getMonth() == prop.st.endDate.getMonth()
                && st.getDate().getDate() == prop.st.endDate.getDate()
                && st.getDate().getHours() == prop.st.endDate.getHours()
                && st.getDate().getMinutes() == prop.st.endDate.getMinutes()
                ? prop.st.endDate.getSeconds() : 59;

            let rets = Array<string>();
            for (let start = st.startSecond; start <= st.endSecond; start++) {
                rets.push(start.toStr(2) + "秒")
            }
            return rets;
        },

        getMinus() {

            if (prop.calendarProp.customVal?.minute) {
                return prop.calendarProp.customVal?.minute.map(it => it.key)
            }

            st.startMinus = st.getDate().getFullYear() == prop.st.startDate.getFullYear()
                && st.getDate().getMonth() == prop.st.startDate.getMonth()
                && st.getDate().getDate() == prop.st.startDate.getDate()
                && st.getDate().getHours() == prop.st.startDate.getHours()
                ? prop.st.startDate.getMinutes() : 0;




            st.endMinus = st.getDate().getFullYear() == prop.st.endDate.getFullYear()
                && st.getDate().getMonth() == prop.st.endDate.getMonth()
                && st.getDate().getDate() == prop.st.endDate.getDate()
                && st.getDate().getHours() == prop.st.endDate.getHours()
                ? prop.st.endDate.getMinutes() : 59;


            // console.log(lib.dateToY_M_D(prop.st.startDate), st.startDay, " - ", st.endDay, lib.dateToY_M_D(prop.st.endDate))

            let rets = Array<string>();
            for (let start = st.startMinus; start <= st.endMinus; start++) {
                rets.push(start.toStr(2) + "分")
            }
            return rets;
        },

        getNoos() {
            if (st.getDate().getFullYear() == prop.st.startDate.getFullYear()
                && st.getDate().getMonth() == prop.st.startDate.getMonth()
                && st.getDate().getDate() == prop.st.startDate.getDate()
                && prop.st.startDate.getHours() >= 12
            ) {
                st.startNoon = 1;
            } else {
                st.startNoon = 0;
            }

            if (st.getDate().getFullYear() == prop.st.endDate.getFullYear()
                && st.getDate().getMonth() == prop.st.endDate.getMonth()
                && st.getDate().getDate() == prop.st.endDate.getDate()
                && prop.st.endDate.getHours() < 12
            ) {
                st.endNoon = 0;
            } else {
                st.endNoon = 1;
            }

            let rets = Array<string>();
            if (st.startNoon == 0) {
                rets.push("上午")
            }
            if (st.endNoon == 1) {
                rets.push("下午")
            }
            return rets;

        },
        getHours() {
            st.startHours = st.getDate().getFullYear() == prop.st.startDate.getFullYear()
                && st.getDate().getMonth() == prop.st.startDate.getMonth()
                && st.getDate().getDate() == prop.st.startDate.getDate()
                ? prop.st.startDate.getHours() : 0;

            st.endHours = st.getDate().getFullYear() == prop.st.endDate.getFullYear()
                && st.getDate().getMonth() == prop.st.endDate.getMonth()
                && st.getDate().getDate() == prop.st.endDate.getDate()
                ? prop.st.endDate.getHours() : 23;


            // console.log(lib.dateToY_M_D(prop.st.startDate), st.startDay, " - ", st.endDay, lib.dateToY_M_D(prop.st.endDate))

            let rets = Array<string>();
            for (let start = st.startHours; start <= st.endHours; start++) {
                rets.push(start.toStr(2) + "时")
            }
            return rets;
        },
    }));

    prop.st.updateTime = () => st.$update;


    function getTitle() {
        let ret = "";
        if (prop.st.hasType("hour")) {
            ret += prop.st.date.getHours().toStr(2);
        }


        if (prop.st.hasType("minute")) {
            if (ret.length > 0) {
                ret += ":";
            }
            ret += prop.st.date.getMinutes().toStr(2);
        }

        if (prop.st.hasType("second")) {
            if (ret.length > 0) {
                ret += ":";
            }
            ret += prop.st.date.getSeconds().toStr(2);
        }

        return ret;
    }
    let hasSecond = prop.st.hasType("second");

    function getFlex() {
        let flex = 1;
        if (prop.st.hasType("noon")) {
            flex += 1;
        }

        if (prop.st.hasType("hour")) {
            flex += 1.5;
        }
        if (prop.st.hasType("minute")) {
            flex += 1.5;
        }
        if (hasSecond) {
            flex += 1.5;
        }

        return flex
    }

    return (
        <View style={[{
            flex: getFlex(),
        }, styles.borderLeftLine]}>

            { //时分标题
                prop.calendarProp.hideTitle
                    ? null
                    : <Text style={[{
                        fontSize: 17, fontWeight: "bold",
                        alignSelf: "center",
                        marginTop: 15
                    },]}>{getTitle()}</Text>
            }


            <V style={[{ marginTop: 10 }, styles.rowCenter]}>
                {
                    //////////上下午
                    prop.st.hasType("noon")
                        ? <ScrollPicker
                            dataSource={st.getNoos()}
                            selectedIndex={(prop.st.date.getHours() < 12 ? 0 : 1) - st.startNoon}
                            sizeItem={7}
                            fontSize={15}
                            onValueChange={(res, idx) => {
                                if (prop.st.selectDate == null) {
                                    prop.st.selectDate = new Date(prop.st.curDateTime);
                                }

                                prop.st.selectDate.setHours((idx + st.startNoon) * 14);
                                prop.calendarProp.onSelect?.(prop.st.selectDate, prop.st)
                                st.$update
                            }}
                            style={[{ flex: 1, marginTop: 22 },]} />
                        : null
                }
                {//////////////////时
                    prop.st.hasType("hour")
                        ? <ScrollPicker
                            dataSource={st.getHours()}
                            selectedIndex={prop.st.date.getHours() - st.startHours}
                            sizeItem={7}
                            fontSize={15}
                            onValueChange={(res, idx) => {
                                if (prop.st.selectDate == null) {
                                    prop.st.selectDate = new Date(prop.st.curDateTime);
                                }

                                prop.st.selectDate.setHours(idx + st.startHours);
                                prop.calendarProp.onSelect?.(prop.st.selectDate, prop.st)
                                st.$update
                            }}
                            style={[{ flex: 1, },]} />
                        : null
                }

                {////////////分
                    prop.st.hasType("minute")
                        ? <ScrollPicker
                            dataSource={st.getMinus()}
                            selectedIndex={
                                prop.calendarProp.customVal?.minute ?
                                    (prop.st.valCustom.minute?.[prop.st.date.getMinutes()]?.index ?? 0)
                                    :
                                    prop.st.date.getMinutes() - st.startMinus
                            }
                            sizeItem={7}
                            fontSize={15}
                            onValueChange={(res, idx) => {
                                if (prop.st.selectDate == null) {
                                    prop.st.selectDate = new Date(prop.st.curDateTime);
                                }
                                if (prop.calendarProp.customVal?.minute) {
                                    prop.st.selectDate.setMinutes(prop.calendarProp.customVal?.minute[idx].val);
                                } else {
                                    prop.st.selectDate.setMinutes(idx + st.startMinus);
                                }
                                prop.calendarProp.onSelect?.(prop.st.selectDate, prop.st)
                                st.$update
                            }}
                            style={[{ flex: 1, },]} />
                        : null
                }

                {////////////秒
                    hasSecond
                        ? <ScrollPicker
                            dataSource={st.getSecond()}
                            selectedIndex={prop.st.date.getSeconds() - st.startSecond}
                            sizeItem={7}
                            fontSize={15}
                            onValueChange={(res, idx) => {
                                if (prop.st.selectDate == null) {
                                    prop.st.selectDate = new Date(prop.st.curDateTime);
                                }
                                prop.st.selectDate.setSeconds(idx + st.startSecond);
                                prop.calendarProp.onSelect?.(prop.st.selectDate, prop.st)
                                st.$update
                            }}
                            style={[{ flex: 1, },]} />
                        : null
                }

            </V>
        </View>
    )
}