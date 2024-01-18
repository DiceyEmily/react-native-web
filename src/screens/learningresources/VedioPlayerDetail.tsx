import { colors } from "@common/components/colors";
import { useInit, useObjState } from '@common/lib/hooks';
import React from 'react';
import { Container } from '@src/rn-common/lib/components/Container';
import { VideoView } from '@src/rn-common/lib/components/custom/VideoView';
import { V } from "@src/rn-common/lib/components/custom/V";
import { Icon } from "@src/rn-common/lib/components/icon/Icon";
import { app } from "@src/rn-common/lib/app";


interface VedioPlayerDetailProp {
    title?: string
    poster?: string
    url: string
}


export class VedioPlayerDetailState {

    //更新组件
    get $update() { return }

    constructor(
        //组件属性
        public prop_: VedioPlayerDetailProp,
    ) {

    }

}



/**
 * 视频播放页面
 * @param prop
 * @returns
 */
export function VedioPlayerDetail(prop: VedioPlayerDetailProp) {

    //组件状态
    const st = useObjState(() => new VedioPlayerDetailState(prop), prop)

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })


    return (
        <Container full style={{
            height: '100%',
            backgroundColor: colors.black,
            justifyContent: 'center'
        }}>
            <Icon name="arrow_back_ios" size={25}
                color={colors.white}
                style={{
                    marginLeft: 10,
                    marginTop: app.isWeb ? 10 : 60,
                    position: 'absolute',
                    top: 0,
                }}
                onPress={(ev) => {
                    app.pop()
                }}
            />

            <VideoView
                autoPlay={true}
                // poster="https://UsFQYPtapzL6yml.jpg" //视频加载前的占位图
                style={{
                    backgroundColor: colors.black,
                    width: "100%",
                    aspectRatio: 16 / 9,
                }}
                source={{
                    uri: prop.url,
                }} />

            <V style={[{
                color: colors.white,
                position: 'absolute',
                bottom: 0,
                marginHorizontal: 20,
            },]}>{prop.title + '\n' + '\n' + '\n'}</V>
        </Container>
    )

}