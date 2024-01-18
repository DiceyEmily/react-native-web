import { Calendar, SelectType } from '@common/components/Calendar';
import { colors } from '@common/components/colors';
import { styles } from '@common/components/styles';
import { app } from '@common/lib/app';
import { Dialog } from '@common/lib/components/custom/Dialog';
import { V } from '@common/lib/components/custom/V';
import { globalFont } from '@common/lib/components/font';
import { Icon } from '@common/lib/components/icon/Icon';
import TabView from '@common/lib/components/tabview/TabView';
import { TabViewItem } from '@common/model/TabViewItem';
import React, { Component } from 'react'
import { Platform, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { tabCustom } from './Tab';


interface SelectDateDialogProp {
    date1?: Date
    date2?: Date
    dialog?: Dialog

    //指定滑动选择类型
    selectType?: Array<SelectType>,
    onSelectDate1?: (d: Date) => void;
    onSelectDate2?: (d: Date) => void;

    onOk?: () => void;
    onCancle?: () => void;
}


class SelectDateDialogState {
    index = 0;
}

interface DialogDateRes {
    date1: Date
    date2?: Date
    ok: boolean;
}

export class SelectDateDialog extends Component<SelectDateDialogProp, SelectDateDialogState> {

    state = new SelectDateDialogState();

    routes: Array<TabViewItem> = [
        {
            key: "开始时间",
            title: "开始时间",
            view: () => (<Calendar
                onSelect={res => this.props.onSelectDate1?.(res)}
                hideTitle={true}
                style={[{},]}
                selectType={this.props.selectType ?? ["year", "month", "day", "hour", "minute"]} />),
        },
        {
            key: "结束时间",
            title: "结束时间",
            view: () => (<Calendar
                onSelect={res => this.props.onSelectDate2?.(res)}
                hideTitle={true}
                style={[{},]}
                selectType={this.props.selectType ?? ["year", "month", "day", "hour", "minute"]} />),
        },
    ]

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    static show(props: SelectDateDialogProp) {
        return new Promise<DialogDateRes>(resolve => {

            let ret: DialogDateRes = {
                date1: props.date1 ?? new Date(),
                ok: false,
            }

            Dialog.show({
                bottom: true,
                animBottom: true,
            }, dialog => {

                return <SelectDateDialog
                    {...props}

                    onSelectDate1={res => {
                        ret.date1 = res;
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
                    navigationState={{ index: this.state.index, routes: this.routes }}
                    renderScene={({ route }) => route.view()}
                    onIndexChange={(idx) => {
                        this.setState({ index: idx })
                    }}
                    renderTabBar={tabCustom(tab => <V style={[{ width: "100%" }, styles.borderBottomLine, styles.rowCenter]}>
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
                                this.props.dialog?.close()
                                this.props.onOk?.();
                            }}

                            style={[{ padding: 10, marginLeft: 15 },]}>
                            <Icon name="done" size={25} color={colors.primary} />
                        </TouchableOpacity>
                    </V>)}
                    style={[{ backgroundColor: colors.white }, styles.topRound]}
                />
            </V>
        )
    } //render end

}

const sty = StyleSheet.create({

})