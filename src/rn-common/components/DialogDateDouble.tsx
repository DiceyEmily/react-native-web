import { Calendar, CalendarState, SelectType } from '@common/components/Calendar';
import { colors } from '@common/components/colors';
import { styles } from '@common/components/styles';
import { Dialog } from '@common/lib/components/custom/Dialog';
import { V } from '@common/lib/components/custom/V';
import { globalFont } from '@common/lib/components/font';
import { Icon } from '@common/lib/components/icon/Icon';
import TabView from '@common/lib/components/tabview/TabView';
import { TabViewItem } from '@common/model/TabViewItem';
import { tabBarCommon } from '@src/rn-common/components/tabBarCommon';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from "react-native";
import { lib } from '../lib/lib';


interface DialogDateDoubleProp {
    date1?: Date | null
    date2?: Date | null
    dialog?: Dialog

    /**
   * 允许选择的起始时间-结束时间
   */
    dateRange?: [Date, Date];

    //指定滑动选择类型
    selectType?: Array<SelectType>,
    onSelectDate1?: (d: Date) => void;
    onSelectDate2?: (d: Date) => void;

    onOk?: () => void;
    onCancle?: () => void;
}


class DialogDateDoubleState {
    index = 0;
}

interface DialogDateRes {
    date1: Date
    date2?: Date
    //是否点击确定
    ok: boolean;
    //是否点击红叉关闭
    close: boolean;
}

/**
 * 底部弹窗, 开始结束日期选择
 */
export class DialogDateDouble extends Component<DialogDateDoubleProp, DialogDateDoubleState> {

    state = new DialogDateDoubleState();



    /**
     * 最大结束日期
    */
    getEndDate = () => this.props.dateRange?.[1] ?? lib.newDate(new Date(), 0, 1)


    /**
     * 最小开始日期
     */
    getStartDate = () => this.props.dateRange?.[0] ?? lib.newDate(this.getEndDate(), -30);



    date1?: Date

    onSelectData1(d: Date) {
        this.date1 = d;
        this.calendarEnd?.fixDateRange(d, this.getEndDate())
        this.props.onSelectDate1?.(d)
    }


    calendarEnd?: CalendarState
    getRoutes(): Array<TabViewItem> {
        return [
            {
                key: "开始时间",
                title: "开始时间",
                view: () => (<Calendar
                    onSelect={res => {
                        console.log("onSelect start ", res);
                        this.onSelectData1(res)
                    }}
                    hideTitle={true}
                    style={[{},]}
                    date={this.props.date1}
                    dateRange={[this.getStartDate(), this.getEndDate()]}
                    selectType={this.props.selectType ?? ["year", "month", "day", "hour", "minute"]} />),
            },
            {
                key: "结束时间",
                title: "结束时间",
                view: () => (<Calendar
                    onRefState={s => this.calendarEnd = s}
                    onSelect={res => {
                        this.props.onSelectDate2?.(res)
                    }}
                    hideTitle={true}
                    style={[{},]}
                    date={this.props.date2}
                    dateRange={[this.date1 ?? this.props.date1 ?? new Date(), this.getEndDate()]}
                    selectType={this.props.selectType ?? ["year", "month", "day", "hour", "minute"]} />),
            },
        ]
    }


    componentDidMount() {
    }

    componentWillUnmount() {
    }

    /**
    * 底部弹窗, 开始结束日期选择
    */
    static show(props: DialogDateDoubleProp) {
        return new Promise<DialogDateRes>(resolve => {

            let ret: DialogDateRes = {
                date1: props.date1 ?? new Date(),
                ok: false,
                close: false,
            }

            Dialog.show({
                bottom: true,
                animBottom: true,
            }, dialog => {

                return <DialogDateDouble
                    {...props}

                    onSelectDate1={res => {
                        ret.date1 = res;

                        if (props.date2 && props.date2 < ret.date1) {
                            //修复date2超出date1情况
                            props.date2.setTime(ret.date1.getTime())
                            ret.date2 = props.date2;
                        }
                    }}

                    onSelectDate2={
                        res => {
                            ret.date2 = res;
                        }
                    }

                    onOk={() => {
                        ret.ok = true;
                        resolve(ret);
                    }}

                    onCancle={() => {
                        ret.close = true;
                        ret.ok = false;
                        resolve(ret)
                    }}

                    dialog={dialog} />
            })

        })

    }


    render() {
        return (
            <V style={[{ height: 350 * globalFont.scale, width: "100%" },]}>
                <TabView
                    lazy={true}
                    tabBarPosition="top"
                    navigationState={{ index: this.state.index, routes: this.getRoutes() }}
                    renderScene={({ route }) => route.view()}
                    onIndexChange={(idx) => {

                        this.setState({ index: idx })
                    }}
                    renderTabBar={tabBarCommon(
                        {
                            style: {
                                flex: 1,
                            },
                            indicatorStyle: {
                                width: 50,
                            },
                            light: true,
                            tabWarp: tab => <V style={[{ width: "100%" }, styles.borderBottomLine, styles.rowCenter]}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.dialog?.close()
                                        this.props.onCancle?.();
                                    }}
                                    style={[{ padding: 10, marginRight: 15 },]}>
                                    <Icon name="close" size={25} color={colors.red} />
                                </TouchableOpacity>
                                {tab}
                                <TouchableOpacity
                                    onPress={() => {
                                        if (this.calendarEnd && !this.props.date2) {
                                            //已打开结束页, 但未选择时间, 赋予结束date1值
                                            this.props.onSelectDate2?.(this.props.date1 ?? new Date())
                                        }
                                        this.props.dialog?.close()
                                        this.props.onOk?.();
                                    }}

                                    style={[{ padding: 10, marginLeft: 15 },]}>
                                    <Icon name="done" size={25} color={colors.primary} />
                                </TouchableOpacity>
                            </V>,
                        })}
                    style={[{ backgroundColor: colors.white }, styles.topRound]}
                />
            </V>
        )
    } //render end

}

const sty = StyleSheet.create({

})