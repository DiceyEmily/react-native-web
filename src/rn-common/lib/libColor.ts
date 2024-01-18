import { ColorValue, processColor } from "react-native";

export class libColor {
    static isWebColor = (color: string): boolean =>
        color === 'currentcolor' ||
        color === 'currentColor' ||
        color === 'inherit' ||
        color.indexOf('var(') === 0;


    /**
     * 加深或减淡颜色
     * @param color 
     * @param opacity 0.1减淡  -0.1加深
     * @returns 
     */
    static addColor(color?: number | ColorValue | null, opacity?: number) {
        if (opacity === void 0) {
            opacity = 0;
        }

        if (color == null) return;

        if (typeof color === 'string' && libColor.isWebColor(color)) {
            return color;
        }

        let colorInt = processColor(color) as number;

        if (colorInt != null) {

            let r = colorInt >> 16 & 255;


            let g = colorInt >> 8 & 255;


            let b = colorInt & 255;

            if (opacity > 0) {
                r += ((255 - r) * opacity) >> 0;
                g += ((255 - g) * opacity) >> 0;
                b += ((255 - b) * opacity) >> 0;
            }
            else {
                r += ((r) * opacity) >> 0;
                g += ((g) * opacity) >> 0;
                b += ((b) * opacity) >> 0
            }

            let a = (colorInt >> 24 & 255) / 255;

            return "rgba(" + r + "," + g + "," + b + "," + a.toFixed(2) + ")";
        }

        return "";
    }

    static normalizeColor(color?: number | ColorValue | null, opacity?: number) {
        if (opacity === void 0) {
            opacity = 1;
        }

        if (color == null) return;

        if (typeof color === 'string' && libColor.isWebColor(color)) {
            return color;
        }

        let colorInt = processColor(color) as number;

        if (colorInt != null) {
            let r = colorInt >> 16 & 255;
            let g = colorInt >> 8 & 255;
            let b = colorInt & 255;
            let a = (colorInt >> 24 & 255) / 255;
            let alpha = (a * opacity).toFixed(2);
            return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
        }

        return "";
    }

}