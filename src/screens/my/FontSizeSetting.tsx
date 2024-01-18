import React from "react";
import { Text } from "react-native";
import { HeaderBar } from "../../components/Header";
import { cfg } from "../../config/cfg";
import { styles } from "../../rn-common/components/styles";
import { colors } from "../../rn-common/components/colors";
import { app } from "../../rn-common/lib/app";
import { Container } from "../../rn-common/lib/components/Container";
import SliderView from "../../rn-common/lib/components/custom/SliderView";
import { V } from "../../rn-common/lib/components/custom/V";
import { globalFont } from "../../rn-common/lib/components/font";
import { useObjState } from "../../rn-common/lib/hooks";
import { MainNavi } from "../MainNavi";


/**
 * 设置字体大小页面
 */
export function FontSizeSetting() {

    const st = useObjState(() => ({
        scale: globalFont.scale,
    }))

    const [sliderVal, setSliderVal] = React.useState((globalFont.scale - 1) * 10 / 6);

    return (
        <Container style={{ backgroundColor: colors.background }}>
            <HeaderBar
                title="字体大小"
            />

            <V style={[styles.roundBorder, { backgroundColor: colors.white, margin: 20, }]}>

                <Text style={[{
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    backgroundColor: colors.greyD,
                    color: colors.black,
                    padding: 5,
                    fontSize: 16,
                    textAlign: 'center'
                }]}>字体预览</Text>

                <Text style={[{
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 5,
                    backgroundColor: colors.white,
                    color: colors.black,
                    padding: 10,
                    textAlign: 'center',
                    fontSize: globalFont.size * st.scale,
                    minHeight: 80,
                }]}>拖动下面的滑块，可设置字体大小，此处供预览!</Text>

            </V>

            <V style={{ flex: 1 }} />

            <SliderView
                showDot={true}
                state={[sliderVal, setSliderVal]}
                trackPressable={true}
                maximumTrackTintColor={colors.grey3}
                minimumTrackTintColor={colors.grey3}
                trackStyle={{ maxHeight: 1 }}
                thumbStyle={{ height: 20, width: 20 }}
                thumbTintColor={colors.white}
                punctuationStyle={{ height: 10, width: 10 }}
                punctuationStyleColor={colors.primary}
                style={{ marginHorizontal: 30 }}
                onSlidingComplete={(value) => {
                    //3等份
                    let parts = 3
                    //分6点
                    let m = 2 * parts
                    for (var i = 1; i <= m; i++) {
                        if (i / m > value) {
                            //在i-1到i之间，取级别值为n：0，2，4，6
                            let n = (i + (i % 2 == 0 ? 0 : -1))
                            //重设
                            value = n / m
                            st.scale = 1 + n / 10
                            st.$update
                            // console.log(st.scale + "wwwww" + n)
                            setSliderVal(value)
                            break
                        } else if (i / m == value) {
                            //在i点，取级别值为n：0，2，4，6
                            let n = (i + (i % 2 == 0 ? 0 : 1))
                            //重设
                            value = n / m
                            st.scale = 1 + n / 10
                            st.$update
                            // console.log(st.scale + "qqqqq" + n)
                            setSliderVal(value)
                            break
                        }
                    }
                }}
            />

            <V style={[styles.rowCenter, { marginLeft: 27, marginRight: 14, marginVertical: 15 }]}>
                <Text style={{ color: colors.white, fontSize: 14 }}>标准</Text>
                <Text style={{ flex: 1 }} />
                <Text style={{ color: colors.white, fontSize: 16.8 }}>大</Text>
                <Text style={{ flex: 1 }} />
                <Text style={{ color: colors.white, fontSize: 19.6 }}>偏大</Text>
                <Text style={{ flex: 1 }} />
                <Text style={{ color: colors.white, fontSize: 22.4 }}>超大</Text>
            </V>

            <V style={[styles.rowCenter, { padding: 30, marginBottom: 20 }]}>

                <Text style={[{
                    borderTopLeftRadius: 25,
                    borderBottomLeftRadius: 25,
                    backgroundColor: colors.white,
                    padding: 18,
                    fontSize: 14,
                    textAlign: 'center',
                    alignItems: 'center',
                    flex: 1
                }]}
                    onPress={() => {
                        app.pop()
                    }}
                >取消</Text>

                <V style={{ width: 1, height: '100%', backgroundColor: colors.greyE }} />

                <Text style={[{
                    borderTopRightRadius: 25,
                    borderBottomRightRadius: 25,
                    backgroundColor: colors.white,
                    padding: 18,
                    alignItems: 'center',
                    fontSize: 14,
                    textAlign: 'center',
                    flex: 1
                }]}
                    onPress={() => {
                        app.pop()
                        if (globalFont.scale == st.scale)
                            return
                        globalFont.scale = st.scale
                        cfg.localConfig.dat.fontScale = st.scale
                        cfg.localConfig.save
                        app.popToTop()
                        app.replace(MainNavi, {})
                    }}
                >确认</Text>

            </V>
        </Container >
    )

}