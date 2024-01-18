
/**
 * Jhipster可选条件
 */
export class FilterJhipster<T> {
    constructor(
        public name: string,
        public val: T) {

    }



    /**
     * 相等条件
     * @param v 可为undefined 
     * @returns 
     */
    equals<T>(v?: T): FilterJhipster<T> | Array<FilterJhipster<T>> {
        if (v === undefined)
            return undefined as any;
        return new FilterJhipster("equals", v);

    }


    in<T>(arr?: Array<T>): FilterJhipster<T> {
        if (arr === undefined)
            return undefined as any;
        return new FilterJhipster("in", arr) as unknown as FilterJhipster<T>
    }


    /**
     *  where xyz is not null, specified.
     */
    specified(val?: boolean): FilterJhipster<any> {
        if (val === undefined)
            return undefined as any;
        return new FilterJhipster("specified", val)
    }

    contains(val?: string): FilterJhipster<any> {
        if (val === undefined)
            return undefined as any;
        return new FilterJhipster("contains", val)
    }


    greaterThan<T>(val?: T): FilterJhipster<T> {
        if (val === undefined)
            return undefined as any;
        return new FilterJhipster("greaterThan", val)
    }

    lessThan<T>(val?: T): FilterJhipster<T> {
        if (val === undefined)
            return undefined as any;
        return new FilterJhipster("lessThan", val)
    }

    greaterThanOrEqual<T>(val?: T): FilterJhipster<T> {
        if (val === undefined)
            return undefined as any;
        return new FilterJhipster("greaterThanOrEqual", val)
    }

    lessThanOrEqual<T>(val?: T): FilterJhipster<T> {
        if (val === undefined)
            return undefined as any;
        return new FilterJhipster("lessThanOrEqual", val)
    }


    /**
   * 处理FilterJhipster参数表达式
   * @param para 
   */
    static parseParas(para: any) {
        for (let k in para) {
            let v = para[k];
            if (v instanceof Array) {
                for (let i = v.length - 1; i >= 0; i--) {
                    let it = v[i];
                    if (it instanceof FilterJhipster) {
                        para[k + "." + it.name] = it.val;
                        v.splice(i, 1);
                    }
                }
            }
            else if (v instanceof FilterJhipster) {
                delete para[k];
                para[k + "." + v.name] = v.val;
            }
        }
    }
}

export const filter = new FilterJhipster("", 0);