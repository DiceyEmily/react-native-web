

export class EnvBase {

    /**
     * 应用默认名称
     */
    name = "OA系统"

    /**
     * web版本号,默认使用.env环境中的值, 也可以在子类中单独覆盖此值
     */
    appVersion = ""

    /**
     * 默认主页
     */
    defaultRoute = true

    /**
     * 是否打开背景水印
     */
    shuiyin = false;


}
