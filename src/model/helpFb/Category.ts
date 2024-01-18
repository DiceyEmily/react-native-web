import { array } from "@common/lib/lib";

export class Category {

    public id = ''

    /**
    * 菜单类型
    */
    public type = ''

    /**
    * 中文展示
    */
    public label = ''

    /**
    * 必填 NotNull
    * 实际value
    */
    public value = ''

    /**
    * 扩展json
    */
    public expansionJSON = ''

    /**
    * 分类自相关
    */
    public children = array(Category)

    public category?: Category

    public createdBy = ''

    public createdDate = ''

    public lastModifiedBy = ''

    public lastModifiedDate = ''


    /////////////////自定义代码区///////////////////////
}

 /////////////////自定义结束///////////////////////
