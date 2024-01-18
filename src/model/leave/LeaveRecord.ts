//此文件为src/task/generateCode.ts自动生成(npm脚本: json_model)

import { validString } from "@src/rn-common/lib/valid"


/* 请休假参数 */
export class LeaveRecord {

    /**
    * 总时长
    */
    duration?= ''

    /**
    * 开始日期
    */
    startDate = new Date()

    /**
    * 结束日期
    */
    endDate = new Date()

    /**
    * 请假类型
    */
    @validString(r => r.required("请假类型不能为空"))
    sltUuid?= ''

    // public sltName = ''

    /**
    * 请假事由
    */
    reason?= ''


}
