import { lib } from "../../lib";
import { app } from "../../app";

/**
 * 文件上传对话框
 */
export class DialogFileSelect {

    fileInput = document.createElement("input");

    constructor() {
        this.fileInput.type = "file";
        this.fileInput.style.width = "1px";
        this.fileInput.style.height = "1px";
        this.fileInput.style.position = "fixed";
        this.fileInput.style.opacity = "0"
        document.body.appendChild(this.fileInput);

    }

    setAcceptImage() {
        this.fileInput.accept = "image/*"
    }

    setAcceptDoc() {
        this.setFileAccept(lib.docArr)
    }


    private setFileAccept(accept: Array<string>) {
        this.fileInput.accept = accept.join(",");
    }

    show(): Promise<File> {
        return new Promise<File>((resolve) => {

            this.fileInput.onchange = () => {

                if (this.fileInput.files == null || this.fileInput.files.length <= 0) {
                    return;
                }

                let file = this.fileInput.files[0]!;

                document.body.removeChild(this.fileInput);

                try {
                    resolve(file);
                } catch (error) {
                    app.logError(error as Error)
                }
            }
            this.fileInput.click();
        });
    }


}