import React, { PureComponent } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
const normalizeColor = require('../../../../node_modules/react-native-web/dist/modules/normalizeColor').default

export interface GradientProps extends ViewProps {
    colors: (string | number)[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
    locations?: number[];
    useAngle?: boolean;
    angleCenter?: { x: number, y: number };
    angle?: number;
}


export class Gradient extends PureComponent<GradientProps> {




    getBackground() {
        let colors = "";
        for (let i = 0; i < this.props.colors.length; i++) {
            let c = this.props.colors[i];
            let loc = this.props.locations?.[i]
            if (colors.length > 0) {
                colors += ","
            }
            colors += normalizeColor(c)
            if (loc) {
                colors += " " + (loc * 100) + "%"
            }
        }

        let angle = "180deg";
        if (this.props.angle && this.props.useAngle) {
            angle = this.props.angle + "deg";
        }
        return `linear-gradient(${angle},${colors})`;
    }


    render() {
        return (
            <View {...this.props} style={[{ background: this.getBackground() }, this.props.style]}>
                {this.props.children}
            </View>
        )
    } //render end

}

const sty = StyleSheet.create({

})