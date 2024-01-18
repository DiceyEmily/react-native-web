import { ViewProps } from "react-native";

export type EChartType = "bar" | "line" | "pie"

export interface AxisType {

    /**
     * 'value' 数值轴，适用于连续数据。
'category' 类目轴，适用于离散的类目数据，为该类型时必须通过 data 设置类目数据。
'time' 时间轴，适用于连续的时序数据，与数值轴相比时间轴带有时间的格式化，在刻度计算上也有所不同，例如会根据跨度的范围来决定使用月，星期，日还是小时范围的刻度。
'log' 对数轴。适用于对数数据。
     */
    type: 'value' | 'category' | 'time' | 'log',

    //两边留白
    boundaryGap?: boolean,

    /**
     * 数据
     */
    data?: Array<string>,

    axisLabel?: {
        //标签间隔（为0显示所有）
        interval?: number,

        //旋转角度
        rotate?: number
        textStyle?: {
            color?: string,
            fontSize: number,
        }
    }
}

export interface EChartProps extends ViewProps {

    /**
     * 长宽比
     */
    ratio?: number;


    /**
     * 数据
     */
    series: {
        name: string,
        type: EChartType,
        /**
         * 层叠名称(需要层叠的取同样名称)
         */
        stack?: string,
        data: Array<number>,
        //小数（0-1）
        barWidth?: number,
        //显示标签数字
        showLable?: boolean,
        itemStyle?: {
            normal?: {
                color?: string,
                borderColor?: string,
            }
        }
    }[];

    //格式化文本
    formater?: string

    //默认选中位置
    showTip?: number;

    colors?: string[],

    //底部边距
    bottom?: number;

    xAxis?: AxisType,
    yAxis?: AxisType,
}
