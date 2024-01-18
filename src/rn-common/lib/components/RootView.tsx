import { ReactElement } from "react";
import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../components/styles";
import { WaterMark } from "../../components/WaterMark";
import { app } from "../app";
import { GroupView } from "./custom/GroupView";
import { Navigation } from "../navigation";
import Toast from "react-native-toast-notifications";


let isFirst = true;
/**
 *  app根View
 * @returns
 */
export function RootView(): ReactElement {
    return (
        <View style={styles.full} onLayout={(lay) => {
            if (isFirst) {
                isFirst = false;
            }
            else {
                app.onLayoutChange.forEach(it => it(lay.nativeEvent.layout))
            }
        }}>
            <Navigation />
            <GroupView ref={ref => { app.rootGroup = ref }} />
            <Toast offset={app.window.height / 10} ref={ref => { app.toast = ref }} />
            <WaterMark
                onRefState={ref => { if (ref) app.globalWaterMark = ref }}
                txtColor={"rgba(200,200,200,0.35)"}
                text={app.waterText}
            />
        </View>
    );
}
