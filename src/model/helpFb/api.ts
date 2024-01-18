import { array } from "@common/lib/lib";
import { PageModel } from "../PageModel";
import { HelpFbContent, HelpFbList } from "./HelpFbList";
import { FilterJhipster } from "../JHipsterFilter";
import { ApiRequestBase } from "../../config/apiBase";
import { url } from "../../config/url";
import { Category } from "./Category";


/**
 * 所有帮助和反馈http接口请求
 */
export class ApiHelpFb extends ApiRequestBase {

    getUrl(urlPath: string) {
        return super.getUrl(url.services + urlPath)
    }


    /**
    * getCategory
    */
    getCategory_categoryResource() {
        let req = this.request(`/api/categories`, array(Category)).useGET
        return req;
    }


    /**
    * getManualid
    */
    getManualIdResource(id: string) {
        let req = this.request(`/api/manuals/${id}`, HelpFbContent).useGET
        return req;
    }


    /**
    * creatManualid
    */
    creatManualIdResource(para: HelpFbContent) {
        let req = this.request(`/api/manuals/`, HelpFbContent).setPara(para).usePOST
        return req;
    }


    /**
    * upManualid
    */
    upManualIdResource(id: string, para: HelpFbContent) {
        let req = this.request(`/api/manuals/${id}`, HelpFbContent).setPara(para).usePUT
        return req;
    }


    /**
    * getManuals
    */
    getManualsResource(para: { title?: FilterJhipster<string> | Array<FilterJhipster<string>> } & PageModel) {
        let req = this.request(`/api/manuals`, HelpFbList).setPara(para).useGET
        return req;
    }


    /**
    * getissues
    */
    getIssuesResource(para: { title?: FilterJhipster<string> | Array<FilterJhipster<string>> } & PageModel) {
        let req = this.request(`/api/issues`, HelpFbList).setPara(para).useGET
        return req;
    }


}


export const apiHelpFb = new ApiHelpFb();
