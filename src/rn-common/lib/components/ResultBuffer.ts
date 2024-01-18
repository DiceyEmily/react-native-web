

/**
 * 同时获取本地缓存与网络传输结果
 */
export class ResultBuffer<T> {

    constructor(
        /**
         * net结果,失败抛异常
         */
        public result: Promise<T>,
        /**
         * buffer结果,未获取到缓存不会触发then或catch
         */
        public buffer: Promise<T>,
    ) {

    }

    /**
     * 将结果重新map
     * @param func 
     * @returns 
     */
    map<U>(func: (res: T) => U | Promise<U>): ResultBuffer<U> {
        return new ResultBuffer(this.result.then(res => func(res)), this.buffer.then(res => func(res)))
    }


    /**
     * 同时获取缓存与net，取速度最快结果
     */
    get race() {
        return Promise.race([this.buffer, this.result]);
    }


    /**
     * 同时遍历buffer与result结果
     * 只有result会产生catch, buffer不会
     * @param func 
     */
    each<TResult1 = T>(func: (res: T) => TResult1 | PromiseLike<TResult1>): Promise<TResult1> {
        this.buffer.then(func)
        return this.result.then(func);
    }

}