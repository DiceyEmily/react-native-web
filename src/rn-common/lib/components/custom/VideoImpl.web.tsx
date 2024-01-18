import React from "react";
import { VideoViewProp } from "./VideoView";


export class VideoImpl {
    static getVideo(paras: VideoViewProp) {
        return (
            <video
                ref={ref => {
                    if (paras.refPlayer && ref) {
                        paras.refPlayer.current = {
                            seek: (p1) => { ref.currentTime = p1 },
                            presentFullscreenPlayer: () => { },
                            dismissFullscreenPlayer: () => { },
                        }
                    }
                }}
                poster={paras.poster}
                autoPlay={paras.autoPlay}
                controls={true}
                controlsList="nodownload"
                style={{
                    width: "100%",
                    height: "100%"
                }} >
                <source src={paras.source.uri} />
                您的浏览器不支持HTML5!
            </video>
        );
    }
}