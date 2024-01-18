import { MapString } from "./lib";

export class HttpCookie {
    cookies = {} as MapString<MapString<string>>;

    clear() {
        this.cookies = {}
        this.path = ""
        this.expires = ""
        this.max_age = 0


    }

    /**
     * 从http响应头中获取cookie
     * @param host
     * @param header
     */
    setCookies(host: string, header: MapString<any> | string) {
        if (!header)
            return;

        //console.log(header);
        if (typeof header === "string") {
            this.praseCookie(host, header);
            return
        }

        let cookie = header["set-cookie"] as string | string[];
        if (!cookie)
            return;

        if (cookie instanceof Array) {
            cookie.forEach(it => {
                this.praseCookie(host, it)
            })
        }
        else if (cookie) {
            this.praseCookie(host, cookie);
        }
    }

    /**
     * 将cookie设置到请求头中
     * @param host
     * @param path
     */
    // setCookis(ht: dfvHttpClient) {
    //     ht.setHeader("Cookie", this.getCookisStr(ht.getHostName(), ""))
    // }

    getCookisStr(host: string) {

        let cook: any = {};
        for (let c in this.cookies) {
            if (host.indexOf(c) >= 0) {
                let vals = this.cookies[c];
                for (let k in vals) {
                    cook[k] = vals[k]
                    // ret += k + "=" + vals[k] + "; "
                }
            }
        }
        // let vals = this.cookies[host];
        // if (!vals)
        //     return ""
        //
        //
        let ret = "";
        for (let k in cook) {
            ret += k + "=" + cook[k] + "; "
        }

        return ret.length > 1 ? ret.substr(0, ret.length - 2) : "";
    }

    path = ""
    expires = ""
    max_age = 0

    private praseCookie(domain: string, cookie: string) {
        let arr = cookie.split(";")
        let host = "";
        let vals = new Map<string, string>();
        for (let subStrs of arr) {

            let strArr = subStrs.split(",");

            for (let str of strArr) {
                let val = str.replace(" ", "").split("=") as [string, string];
                if (val.length !== 2)
                    continue;
                let key = val[0].replace(" ", "").toLocaleLowerCase();
                if (key === "domain") {
                    host = val[1];
                    continue;
                }
                if (key === "path") {
                    this.path = val[1];
                    continue;
                }


                if (key === "max-age") {
                    this.max_age = parseInt(val[1], 10);
                    continue;
                }

                if (key === "expires") {
                    this.expires = val[1];
                    continue;
                }
                vals.set(val[0], val[1]);
            }



        }

        //console.log(vals);
        if (!this.cookies[domain]) {
            this.cookies[domain] = {}
        }
        if (host.length > 0 && host !== domain) {

            if (!this.cookies[host]) {
                this.cookies[host] = {}
            }

            for (let a of vals) {
                this.cookies[domain][a[0]] = a[1];
                this.cookies[host][a[0]] = a[1];
            }
        }
        else {
            for (let a of vals) {
                this.cookies[domain][a[0]] = a[1];
            }
        }


    }
}