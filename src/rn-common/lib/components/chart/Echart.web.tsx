import { lib } from "@common/lib/lib";
import React, { Component } from "react";
import { View, ViewProps } from "react-native";
import { EChartProps } from "./EchartType";
import * as echarts from 'echarts';
import { colors } from "@common/components/colors";

class EChartState {
    width = 0;

}

export class EChart extends Component<EChartProps, EChartState> {
    state = new EChartState();

    w = 10;

    getH() {
        return this.w / (this.props.ratio ?? 1.3)
    }

    componentDidUpdate() {
        if (this.dom) {
            this.initDom(this.dom);
        }
    }
    componentDidMount() {

    }



    eChart?: echarts.ECharts;
    initDom(ref?: HTMLDivElement) {
        if (!ref) {
            return;
        }

        if (!this.eChart) {
            this.eChart = echarts.init(ref, undefined, {
                renderer: 'canvas',
                // height: this.getH(),
            });
        }

        this.props.series.forEach(it => {
            if (typeof it.barWidth === "number") {
                it.barWidth = it.barWidth * 100 + "%" as any
            }
            if (it.showLable) {
                (it as any).itemStyle = {
                    normal: {
                        label: {
                            // rotate: -30,
                            show: true, //开启显示
                            position: 'top', //在上方显示
                            textStyle: { //数值样式
                                color: colors.greyText,
                                fontSize: 13
                            },
                            formatter: this.props.formater,
                        }
                    }
                }
            }
        })


        let option = {
            color: this.props.colors ?? colors.charts,
            tooltip: {
                trigger: 'axis',
                // formatter: "{a} <br/>{b}: {c} ({d}%)",
            },
            //图例
            legend: {
                left: '1%',
                data: this.props.series.map(it => it.name),
                textStyle: {
                    fontSize: 13,
                    color: colors.greyText
                }
            },
            grid: {
                left: 0,
                right: 20,
                top: 40,
                bottom: this.props.bottom ?? 30,
                containLabel: true,
            },
            xAxis: this.props.xAxis ? this.props.xAxis : { type: "value" },
            yAxis: this.props.yAxis ? this.props.yAxis : { type: "value" },
            series: this.props.series,
        };

        this.eChart.setOption(option)


        if (this.props.showTip != null) {

            this.eChart?.dispatchAction({
                type: 'hideTip'
            });

            this.eChart?.dispatchAction({
                type: "showTip",
                //name: "07-12",
                dataIndex: this.props.showTip,
                seriesIndex: 0,
            })
        }


    }

    dom?: HTMLDivElement;

    render() {
        return <View
            onLayout={res => {
                this.w = res.nativeEvent.layout.width;

                this.setState({
                    width: res.nativeEvent.layout.width,
                });

                if (this.eChart && (this.eChart.getWidth() != this.w || this.eChart.getHeight() < 10)) {
                    this.eChart.resize({
                        width: this.w,
                        height: this.getH(),
                        silent: true,
                    });
                }
            }}
            ref={(ref: any) => this.dom = ref}
            style={[
                this.state.width > 10 ? {
                    height: this.getH() + "px",
                } : null
                ,
                { ...this.props.style as any },
            ]}
        />

    }
}