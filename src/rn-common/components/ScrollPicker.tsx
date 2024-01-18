import { PressView } from "@common/lib/components/custom/PressView";
import { V } from "@common/lib/components/custom/V";
import { globalFont } from "@common/lib/components/font";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    ScrollView,
    StyleSheet, View,
    ViewProps,
    ViewStyle
} from "react-native";
import { lib } from "../lib/lib";
import { colors } from "./colors";

function isNumeric(str: string | unknown): boolean {
    if (typeof str === "number") return true;
    if (typeof str !== "string") return false;
    return (
        !isNaN(str as unknown as number) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str))
    ); // ...and ensure strings of whitespace fail
}


const isViewStyle = (style: ViewProps["style"]): style is ViewStyle => {
    return (
        typeof style === "object" &&
        style !== null &&
        Object.keys(style).includes("height")
    );
};

export type ScrollPickerProps = {
    style?: ViewProps["style"];
    dataSource: Array<string | number>;
    //有Bug,变动时未刷新
    selectedIndex?: number;

    onValueChange?: (
        value: ScrollPickerProps["dataSource"][0],
        index: number
    ) => void;
    renderItem?: (
        data: ScrollPickerProps["dataSource"][0],
        index: number,
        isSelected: boolean
    ) => JSX.Element;
    highlightColor?: string;
    fontSize?: number;
    sizeItem?: number;
};


export default function ScrollPicker({
    sizeItem = 5,
    style,
    ...props
}: ScrollPickerProps): JSX.Element {
    const [initialized, setInitialized] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(
        props.selectedIndex && props.selectedIndex >= 0 ? props.selectedIndex : 0
    );
    const sView = useRef<ScrollView>(null);
    const [isScrollTo, setIsScrollTo] = useState(false);
    const [dragStarted, setDragStarted] = useState(false);
    const [momentumStarted, setMomentumStarted] = useState(false);
    const timer = useRef(null as any);
    const updateFix = useRef(false);
    const lastPos = useRef(0 as number)
    const itemHeight = (props.fontSize || globalFont.size) * globalFont.scale + 25;

    const wrapperHeight =
        (isViewStyle(style) && isNumeric(style.height)
            ? Number(style.height)
            : 0) ||
        itemHeight * sizeItem;

    useEffect(
        function initialize() {
            if (initialized) return;
            setInitialized(true);
            // console.log("initialize", selectedIndex)
            setTimeout(() => {
                const y = itemHeight * selectedIndex;
                sView?.current?.scrollTo({ y: y * lib.getScale() });
            }, 0);

            return () => {
                timer.current && clearTimeout(timer.current);
            };
        },
        [initialized, itemHeight, selectedIndex, sView, timer]
    );

    const renderPlaceHolder = () => {
        const h = (wrapperHeight - itemHeight) / 2;
        const header = <View style={{ height: h, width: 1 }} />;
        const footer = <View style={{ height: h, width: 1 }} />;
        return { header, footer };
    };

    useEffect(
        function changeIndex() {
            // console.log("changeIndex", props.selectedIndex)
            if (props.selectedIndex != null) {
                setSelectedIndex(props.selectedIndex)
                const _y = props.selectedIndex * itemHeight;
                sView?.current?.scrollTo({ y: _y * lib.getScale(), animated: false });
            }
        },
        [props.selectedIndex, itemHeight]
    );


    // if (props.selectedIndex != null && selectedIndex != props.selectedIndex && props.selectedIndex < props.dataSource.length) {
    //     // console.log("不匹配", props.selectedIndex, selectedIndex)
    //     // setSelectedIndex(props.selectedIndex)
    //     // const _y = props.selectedIndex * itemHeight;
    //     // setTimeout(() => {
    //     //     sView?.current?.scrollTo({ y: _y, animated: false });
    //     // }, 0)

    // }

    if (selectedIndex >= props.dataSource.length) {
        setSelectedIndex(props.dataSource.length - 1)
    }

    const renderItem = (
        data: ScrollPickerProps["dataSource"][0],
        index: number
    ) => {
        const isSelected = index === selectedIndex;
        const item = props.renderItem ? (
            props.renderItem(data, index, isSelected)
        ) : (
            <V
                style={
                    [
                        {
                            color: "#999",
                            fontSize: props.fontSize,
                        },
                        isSelected ? styles.itemTextSelected : null,
                    ]
                }
            >
                {data}
            </V >
        );

        return (
            <PressView
                onPress={() => {
                    const _y = index * itemHeight;
                    if (Platform.OS != "web") {
                        updateFix.current = true;
                    }
                    sView?.current?.scrollTo({ y: _y * lib.getScale(), animated: true });

                }}
                style={[styles.itemWrapper, { height: itemHeight }]} key={index}>
                {item}
            </PressView>
        );
    };


    // if (selectedIndex != props.selectedIndex && props.selectedIndex != null) {
    //     setSelectedIndex(props.selectedIndex)
    //     const _y = selectedIndex * itemHeight;
    //     if (Platform.OS != "web") {
    //         updateFix.current = true;
    //     }
    //     sView?.current?.scrollTo({ y: _y, animated: true });
    // }

    const scrollFix = useCallback(
        (offsetY: number) => {
            updateFix.current = false;
            let y = offsetY;
            const h = itemHeight * lib.getScale();


            const _selectedIndex = Math.round(y / h);

            const _y = _selectedIndex * h;
            if (_y !== y) {
                // using scrollTo in ios, onMomentumScrollEnd will be invoked
                if (Platform.OS === "ios") {
                    setIsScrollTo(true);
                }
                sView?.current?.scrollTo({ y: _y });
            }
            if (selectedIndex === _selectedIndex) {
                return;
            }
            // onValueChange
            if (props.onValueChange) {
                const selectedValue = props.dataSource[_selectedIndex];
                // props.selectedIndex = _selectedIndex;
                setSelectedIndex(_selectedIndex);

                props.onValueChange(selectedValue ?? "", _selectedIndex);
            }

        },
        [itemHeight, props, selectedIndex]
    );

    const scrollFixTime = (offsetY: number) => {
        timer.current && clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            if (!momentumStarted) {
                scrollFix(offsetY);
            }
        }, 50)
    }
    const onScrollBeginDrag = () => {
        setDragStarted(true);

        if (Platform.OS === "ios") {
            setIsScrollTo(false);
        }
        timer.current && clearTimeout(timer.current);
    };

    const onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        setDragStarted(false);
        // console.log("onScrollEndDrag")
        // if not used, event will be garbaged
        const _e: NativeSyntheticEvent<NativeScrollEvent> = { ...e };

        scrollFixTime(_e.nativeEvent.contentOffset.y)
    };
    const onMomentumScrollBegin = () => {
        setMomentumStarted(true);
        timer.current && clearTimeout(timer.current);
    };

    const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        setMomentumStarted(false);

        if (!isScrollTo && !dragStarted) {
            scrollFix(e.nativeEvent.contentOffset.y);
        }
    };

    const { header, footer } = renderPlaceHolder();
    const highlightColor = props.highlightColor || colors.lineGrey;

    const wrapperStyle: ViewStyle = {
        height: wrapperHeight,
        overflow: "hidden",
    };

    const highlightStyle: ViewStyle = {
        position: "absolute",
        top: (wrapperHeight - itemHeight) / 2,
        height: itemHeight,
        width: "100%",
        borderTopColor: highlightColor,
        borderBottomColor: highlightColor,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
    };


    return (
        <View style={[wrapperStyle, style]}>
            <View style={highlightStyle} />
            <ScrollView
                ref={sView}
                bounces={false}
                showsVerticalScrollIndicator={false}
                onMomentumScrollBegin={(_e) => onMomentumScrollBegin()}

                scrollEventThrottle={20}
                onScroll={(_e) => {
                    lastPos.current = _e.nativeEvent.contentOffset.y;

                    if (!updateFix.current && (Platform.OS !== "web" || momentumStarted || dragStarted)) {
                        return;
                    }

                    scrollFixTime(lastPos.current)
                }
                }
                onTouchStart={() => {
                    setDragStarted(true)
                }}
                onTouchEnd={() => {
                    setDragStarted(false)
                    if (Platform.OS === "web" && lastPos.current) {
                        scrollFixTime(lastPos.current)

                    }
                }}
                onMomentumScrollEnd={(e) => onMomentumScrollEnd(e)}
                onScrollBeginDrag={(_e) => onScrollBeginDrag()}
                onScrollEndDrag={(e) => onScrollEndDrag(e)}
            >
                {header}
                {props.dataSource.map(renderItem)}
                {footer}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    itemWrapper: {
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    itemTextSelected: {
        color: colors.primary,
    },
});