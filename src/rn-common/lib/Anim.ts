import { Animated, Platform } from "react-native";

export type EndResult = { finished: boolean };

export type EndCallback = (result: EndResult) => void;


/**
 * 角度旋转动画
 */
export class AnimDeg extends Animated.Value {

    /**
     * 持续时间
     */
    duration = 200;

    constructor(val?: number) {
        super(val ?? 0)
    }

    degInterpolate = this.interpolate({
        inputRange: [0, 360],//输入值
        outputRange: ['0deg', '360deg'] //输出值
    });

    rotate = { rotate: this.degInterpolate as any }

    transform = {
        transform: [
            this.rotate
        ]
    }

    /**
     * 开始线性动画
     * @param deg 
     * @param onEnd 
     */
    start(deg: number, onEnd?: EndCallback) {
        Animated.timing(
            this,
            {
                useNativeDriver: Platform.OS == "web" ? false : true,
                toValue: deg,
                duration: this.duration,
            }
        ).start(onEnd);
    }


}