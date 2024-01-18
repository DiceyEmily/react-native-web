
export class Task {

    public id = ''

    public num = 0

    public processType = ''

    public biaoti = ''

    public description = ''

    public limitedDate = ''



    /////////////////自定义代码区///////////////////////

    /**
     * 过滤较长内容
     */
    filter() {
        let ret = { ...this };
        delete (ret as Partial<Task>).biaoti
        delete (ret as Partial<Task>).description
        return ret
    }


}

 /////////////////自定义结束///////////////////////
