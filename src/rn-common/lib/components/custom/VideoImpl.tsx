import React from "react";
import Video, { VideoProperties } from "react-native-video";
import { colors } from "../../../components/colors";
import { VideoViewProp } from "./VideoView";


export class VideoImpl {
    static getVideo(paras: VideoViewProp | VideoProperties) {
        let para = (paras as VideoViewProp)
        return <Video
            {...paras as any}
            ref={ref => {
                if (para.refPlayer && ref) {
                    para.refPlayer.current = {
                        seek: (p1, p2) => ref.seek(p1, p2),
                        presentFullscreenPlayer: () => ref.presentFullscreenPlayer(),
                        dismissFullscreenPlayer: () => ref.dismissFullscreenPlayer(),
                    }
                }
            }}
            controls={false}
            resizeMode="contain"
            style={{
                width: "100%", height: "100%",
            }} />
    }
}