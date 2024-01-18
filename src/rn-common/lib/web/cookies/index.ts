export default class CookieManager {
    static clearAll(useWebKit?: boolean): Promise<boolean> {
        return new Promise<boolean>(reso => {
            reso(true);
        })
    }
}