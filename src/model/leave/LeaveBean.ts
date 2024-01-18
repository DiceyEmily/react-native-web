import { validString } from "@common/lib/valid";

export class LeaveBean {

    public approveReason = ''
    public approveUuid = ''

    /**
    * 总时长
    */
    public duration = 0

    public slrId = 0
    public slrUuid = ''

    public createDate = ''
    /**
    * 开始日期
    */
    public startDate = ''

    /**
    * 结束日期
    */
    public endDate = ''

    /**
    * 备注
    */
    public remark = ''

    /**
    * 请假类型
    */
    @validString(r => r.required("请假类型不能为空"))
    public sltUuid = ''
    public sltName = ''

    public status = ''
    public statusName = ''

    /**
    * 请假事由
    */
    public reason = ''


}
