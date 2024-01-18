//此文件为src/task/generateCode.ts自动生成(npm脚本: json_model)

import { arrayString } from "@src/rn-common/lib/lib";


export class TokenBean {

    code = "";

    data = new TokenBeanData();

    msg = "";

    total = 0;



}


export class TokenBeanData {

    access_token = "";

    token_type = "";

    refresh_token = "";

    expires_in = 0;

    scope = "";

    company_uuid = "";

    menu_type_uuid = "";

    user_uuid = "";

    user_id = "";

    dept_uuid = arrayString();

    jti = "";



}