import { colors } from "@common/components/colors";
import React, { Component } from "react";
import { processColor } from "react-native";
import { BarChartProps, BarDataset, CombinedChart, CombinedChartProps } from "./chart";
import { EChartProps } from "./EchartType";
const chartWrap: any = require('react-native-charts-wrapper')


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
    }

    componentDidMount() {
    }


    dom?: HTMLDivElement;




    render() {
        let ChartView = chartWrap.CombinedChart as (prop: CombinedChartProps) => JSX.Element



        return <ChartView

            onLayout={(res: any) => {
                this.w = res.nativeEvent.layout.width;

                this.setState({
                    width: res.nativeEvent.layout.width,
                });
            }}

            style={[
                this.state.width > 10 ? {
                    height: this.getH(),
                } : null,
                { ...this.props.style as any },
            ]}

            //扇页上Label文字
            drawEntryLabels={false}

            chartDescription={{
                text: ""
            }}


            legend={{
                enabled: true,
                verticalAlignment: "TOP",
            }}

            xAxis={{
                position: "BOTTOM",
                drawLabels: true,
                //竖线
                drawGridLines: false,

                //x轴匹配数据
                granularityEnabled: true,
                granularity: 1,

                valueFormatter: this.props.xAxis?.data?.map(it => it),
            }}
            // drawOrder={['SCATTER', 'LINE', 'BAR']}
            marker={{
                enabled: true,
                markerColor: processColor(colors.white) as any,
                textColor: processColor(colors.black) as any,
            }}
            data={{
                barData: {
                    config: {
                        barWidth: this.props.series[0]?.barWidth,
                    },
                    dataSets: this.props.series.map<BarDataset>(it => {

                        return {
                            values: it.data,
                            label: it.name,
                            config: {
                                // stackLabels: this.props.series.map(it => it.name),
                                colors: this.props.colors?.map(it => processColor(it) as any),
                                drawValues: !!it.showLable,
                                valueTextSize: 11,
                                highlightAlpha: 30,
                                valueTextColor: colors.greyText,
                                valueFormatter: "#.#",
                            }
                        }
                    })

                }
            }}
        />

    }
}