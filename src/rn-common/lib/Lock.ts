
/**
 * 自旋锁
 */
export class Lock {

    static sleep(time: number) {
        return new Promise<void>((reso, reject) => {
            setTimeout(() => {
                try {
                    reso();
                } catch (e) {
                    reject(e)
                }
            }, time);
        });
    }

    locked = false;

    /**
     * 上锁
     */
    async lock() {
        while (this.locked) {
            await Lock.sleep(1);
        }
        this.locked = true;
    }


    /**
     * 解锁
     */
    unlock() {
        this.locked = false;
    }
}