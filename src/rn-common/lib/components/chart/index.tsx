import React from 'react';
import { Component, ReactElement } from "react";
import { processColor } from 'react-native';
import { colors } from "../../../components/colors";
import { BarChartProps, PieChartProps } from "./chart";

const chartWrap: any = require('react-native-charts-wrapper')


function procColor<T>(obj: T | undefined, key: keyof T) {
    if (obj && obj[key] && typeof obj[key] === "string") {
        obj[key] = processColor(obj[key] as any) as any;
    }
}

function procColors(obj: Array<string> | undefined) {
    if (obj == null) {
        return;
    }

    for (let i = 0; i < obj.length; i++) {
        if (typeof obj[i] === "string")
            obj[i] = processColor(obj[i]) as any;
    }
}


/**
 * 柱状图
 */
export class BarChart extends Component<BarChartProps> {
    render() {
        procColor(this.props.xAxis, "gridColor")
        procColor(this.props.xAxis, "axisLineColor")
        // procColor(this.props.styledCenterText, "color")
        // procColor(this.props, "transparentCircleColor")
        // procColor(this.props, "entryLabelColor")
        if (this.props.data?.dataSets) {
            for (let v of this.props.data.dataSets) {
                if (v.label == null)
                    v.label = ""
                procColor(v.config, "color")

                //procColor(v.config, "valueLineColor")
                procColor(v.config, "valueTextColor")
                if (v.config == null) {
                    v.config = {}
                }
                if (v.config.colors == null) {
                    v.config.colors = colors.list.map(it => it);
                }
                procColors(v.config?.colors)
            }
        }
        return <chartWrap.BarChart

            //扇页上Label文字
            drawEntryLabels={false}
            {...this.props}

            legend={{
                enabled: false,
                ...this.props.legend
            }}

            xAxis={{
                position: "BOTTOM",
                drawLabels: true,

                //竖线
                drawGridLines: false,

                //x轴匹配数据
                granularityEnabled: true,
                granularity: 1,
                ...this.props.xAxis
            }}

        />;
    }

}

/**
 * 饼状图
 */
export class PieChart extends Component<PieChartProps> {

    render() {
        procColor(this.props, "holeColor")
        procColor(this.props.styledCenterText, "color")
        procColor(this.props, "transparentCircleColor")
        procColor(this.props, "entryLabelColor")
        if (this.props.data?.dataSets) {
            for (let v of this.props.data.dataSets) {
                if (v.label == null)
                    v.label = ""
                procColor(v.config, "color")

                procColor(v.config, "valueLineColor")
                procColor(v.config, "valueTextColor")
                if (v.config == null) {
                    v.config = {}
                }
                if (v.config.colors == null) {
                    v.config.colors = colors.list.map(it => it);
                }
                procColors(v.config?.colors)
            }
        }
        return <chartWrap.PieChart

            //扇页上Label文字
            drawEntryLabels={false}

            //不显示中空
            holeRadius={0}
            transparentCircleRadius={0}

            {...this.props}

            legend={{
                wordWrapEnabled: true,
                horizontalAlignment: "CENTER",
                ...this.props.legend
            }}

        />;
    }
}