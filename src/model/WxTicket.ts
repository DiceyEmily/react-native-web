//此文件为src/task/generateCode.ts自动生成(npm脚本: json_model)



export class WxTicket {

    errcode = 0;

    errmsg = "";

    ticket = "";

    expires_in = 0;

    //生成时间
    //时间戳（注意不能超过10位）
    time = "";


    ///客户端生成
    //随机字串
    nonceStr = "";

}

export class AccessRes {
    appId: string = "";
    ticket: string = "";
    noncestr: string = "";
    timestamp = "";
    signature: string = "";
}


export class CommonRes {

    //0表示成功
    errcode = 0;
    errmsg = "ok";
}


export class TicketRes extends CommonRes {
    ticket = "";

    //过期时间,秒
    expires_in = 0;

    //ticket获取时间戳,毫秒
    createTime = 0;
}