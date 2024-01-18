// import { wxOpenWps } from "./wxConfig";




export class MessageProc {


    static async openWps(data: any) {
        // let res = await wxOpenWps(data);
        setTimeout(() => {
            //刷新iframe
            let frames = document.getElementsByTagName('iframe');

            for (let i = 0; i < frames.length; i++) {
                let e = frames.item(i) as HTMLIFrameElement;
                let doc = e.contentWindow?.document;
                if (!doc) {
                    continue;
                }

                var el2 = doc.createElement('script');
                el2.text = `toViewDoc('officeForm_zw',true)`;
                doc.body.appendChild(el2);
            }
        }, 1500)


    }


}



/**
 * 接受iframe postMessage消息
 */
export function initOnMessage() {
    window.addEventListener('message', function (e) {

        let data = e.data;
        try {
            if (typeof data == "string")
                data = JSON.parse(data);
        } catch (err) {
            return;
        }
        (MessageProc as any)[data.type]?.(data.data)

    })
}