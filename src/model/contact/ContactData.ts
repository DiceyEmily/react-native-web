//此文件为src/task/generateCode.ts自动生成(npm脚本: json_model)

import { array } from "@common/lib/lib";
import { OrgType } from "../org-type.model";



export class ContactData {

    id = "";

    name = "";

    orgType = "";

    createTime = "";

    deleted = false;

    description = "";

    customID = "";

    properties = "";

    dn = "";

    shortDn = "";

    tabIndex = 0;

    tabIndexPath = "";

    path = "";

    parentID = "";

    version = 0;

    aliasName = "";

    deptAddress = "";

    deptFax = "";

    deptGivenName = "";

    deptOffice = "";

    deptPhone = "";

    deptType = "";

    divisionCode = "";

    enName = "";

    establishDate = "";

    gradeCode = "";

    leader = "";

    manager = "";

    zipCode = "";

    deptTypeName = "";

    gradeCodeName = "";

    bureau = false;

    officeAddress = "";
    officeFax = "";
    officePhone = "";
    official = 1;
    officialType = "";
    sex = 0;


    duty = "";

    mobile = "";

    email = "";

    children = array(ContactData);

    /**
     * 解析dn参数
     * @returns 
     */
    parseDn() {
        let ret: Record<string, string> = {}
        if (this.dn) {
            let res = this.dn.split(",");
            res.forEach(it => {
                let v = it.split("=");
                if (v.length == 2) {
                    if (!ret[v[0]])
                        ret[v[0]] = v[1];
                }
            })
        }
        return ret
    }

    //获取单位
    getDepartment() {
        return this.parseDn()["o"] ?? ""
    }

    isDepartment() {
        return this.orgType == OrgType.Department || this.orgType == OrgType.Organization
    }

    //领导部门
    static leaderBureauProps = ["bureauPosition", "bureauDept", "districtDept", "districtPosition"];
    //领导
    static leaderProps = ["bureauLead", "districtLead",]

    /**
     * 判断是否为领导部门
     * @returns 
     */
    isLeaderBureau() {
        for (let v of ContactData.leaderBureauProps) {
            if (this.properties.indexOf(v) >= 0) {
                return true;
            }
        }
        return false;
    }

    getName() {
        return this.name
    }


    getPhone() {
        return this.deptPhone || this.mobile
    }

    isMale() {
        return true;
    }
}
