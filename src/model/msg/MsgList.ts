//此文件为src/task/generateCode.ts自动生成(npm脚本: json_model)

import { array } from "@common/lib/lib";
import { Task } from "./Task";


export class MsgList {

    content = array(Task);

    pageable = '';

    last = false;

    totalPages = 0;

    totalElements = 0;

    size = 0;

    number = 0;



}
