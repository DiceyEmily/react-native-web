//此文件为src/task/generateCode.ts自动生成(npm脚本: json_model)

import { array, arrayString } from "@common/lib/lib";
import { vali, validString } from "@common/lib/valid";


export class HelpFbList {

    content = array(HelpFbContent);

    totalElements = 0;

    last = false;

    totalPages = 0;

    first = false;

    numberOfElements = 0;

    size = 0;

    number = 0;

    empty = false;



}


export class HelpFbContent {

    createdBy = "";

    createdDate = "";

    lastModifiedBy = "";

    lastModifiedDate = "";

    id = "";

    @validString(r => r.required("请选择系统类型"))
    systemId = "";

    moduleId = "";

    @validString(r => r.required("请选择终端"))
    terminalId = "";

    @validString(r => r.required("请填写标题"))
    title = "";

    @validString(r => r.required("请填写内容"))
    content = "";

    createdId = "";

    createdName = "";

    createdDeptId = "";

    createdDeptName = "";

    createdBureauId = "";

    createdBureauName = "";

    imgUrls = "";

    count = 0;

    hotType = "";

    moduleName = "";

    pageViews = 0;

    systemModuleValue = arrayString();

    systemName = "";

    terminalName = "";

}