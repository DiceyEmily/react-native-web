import React from 'react'
import { Platform, View, Text, StyleSheet, ScrollView } from "react-native";
import { V } from '@common/lib/components/custom/V';
import { useInit, useObjState } from '@common/lib/hooks';
import { HelpFbContent } from '../../model/helpFb/HelpFbList';
import { Container } from '@common/lib/components/Container';
import { HeaderBar } from '../../components/Header';
import { PressView } from '@common/lib/components/custom/PressView';
import { styles } from '@common/components/styles';
import { colors } from "@common/components/colors";
import { app } from '@common/lib/app';
import { EditView } from '@common/lib/components/custom/EditView';
import { apiHelpFb } from '../../model/helpFb/api';
import { CheckView } from '@common/lib/components/custom/CheckView';
import { DialogFileSelect } from '@common/lib/components/custom/DialogFileSelect';
import { Pic } from '@common/lib/components/custom/Pic';
import { array, lib } from '@common/lib/lib';
import { imgs } from '../../imgs';
import { cfg } from '../../config/cfg';
import { ButtonView } from '@common/lib/components/custom/ButtonView';
import { vali } from '@common/lib/valid';
import { Category } from '@src/model/helpFb/Category';
import { Icon } from '@src/rn-common/lib/components/icon/Icon';
import { DialogView } from '@src/rn-common/lib/components/custom/DialogView';


interface ManualsDetailProp {
    id?: string
    onBack?: () => void
}


export class ManualsDetailState {

    details = new HelpFbContent()
    modelList?: Category[]
    imgUrls = new Array<File | null>()
    checkSysI = 0

    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: ManualsDetailProp,
    ) {
        this.imgUrls.push(null)
        this.$update
    }

    //获取数据
    getData = async () => {
        let res = await apiHelpFb.getManualIdResource(this.prop_.id ?? '').result;
        this.details = res
        this.$update
    }

    //新建
    setData = async () => {
        let [ok, msg] = await vali.check(this.details);
        if (!ok) {
            app.msgErr(msg);
            return;
        }

        let res = await apiHelpFb.creatManualIdResource(this.details).result;
        app.msg('新建成功')
        this.prop_.onBack?.()
        app.pop()
    }

    //编辑保存
    upData = async () => {
        let res = await apiHelpFb.upManualIdResource(this.details.id, this.details).result;
        this.prop_.onBack?.()
        app.msg('保存成功')
    }


    async getModel() {
        let res = await apiHelpFb.getCategory_categoryResource().result
        this.modelList = res
        this.$update
    }

}///////////////IssuesDetailState end///////////////////



/**
 * 我的反馈详情
 * @param prop
 * @returns
 */
export function ManualsDetail(prop: ManualsDetailProp) {

    //组件状态
    const st = useObjState(() => new ManualsDetailState(prop), prop)

    //组件初始化
    useInit(async () => {

        if (prop.id) {
            //详情
            await st.getData()
        }
        await st.getModel()

        if (prop.id) {
            st.modelList?.map((v, i) => {
                if (v.value == st.details.systemId) {
                    st.checkSysI = i
                    st.details.systemName = v.label
                    v.children?.map((v1, i1) => {
                        if (v1.value == st.details.moduleId) {
                            st.details.moduleName = v1.label
                        }
                    })
                    st.$update
                }
            })
        }

        return async () => { //组件卸载

        }
    })


    const checkSize = 15;


    /////////////////////////////////////////
    //////// IssuesDetail view//////////
    /////////////////////////////////////////
    return <Container
        style={{ backgroundColor: colors.background }}>

        <HeaderBar
            title={prop.id ? '反馈详情' : '新建反馈'}
        />
        <V style={[{ flex: 1, }, styles.topRound]}>
            <ScrollView style={[{ paddingHorizontal: 12, }, styles.scrollFix]}>
                <V style={[{}, sty.title]}>填写反馈标题<V style={styles.titleRed}>*</V></V>
                <EditView
                    state={[st.details, "title"]}
                    style={[{}, styles.editSty]} placeholder="输入标题" />

                <V style={[{}, sty.title]}>选择系统<V style={styles.titleRed}>*</V></V>
                <V style={[{ flexWrap: 'wrap', flexDirection: 'row' }]}>
                    {st.modelList?.map((v, i) => {
                        return <CheckView
                            size={checkSize}
                            textColor={colors.grey9}
                            checked={v.value == st.details.systemId}
                            style={{ marginRight: 15 }}
                            onPress={(check: boolean) => {
                                if (st.checkSysI !== i) {
                                    //还原模块选择
                                    st.details.moduleId = ''
                                    st.details.moduleName = ''
                                }
                                st.checkSysI = i
                                st.details.systemId = v.value
                                st.details.systemName = v.label
                                vali.checkField(st.details, "systemId")
                                st.$update
                            }}
                        >{v.label}</CheckView>
                    })}
                </V>

                <V style={[{}, sty.title]}>选择模块</V>
                <V style={[{ flexWrap: 'wrap', flexDirection: 'row' }]}>
                    {st.modelList?.[st.checkSysI]?.children?.map((v, i) => {
                        return <CheckView
                            size={checkSize}
                            textColor={colors.grey9}
                            checked={v.value == st.details.moduleId}
                            style={{ marginRight: 15 }}
                            onPress={(check: boolean) => {
                                st.details.moduleId = check ? v.value : ''
                                st.details.moduleName = check ? v.label : ''
                                st.$update
                            }}
                        >{v.label}</CheckView>
                    })}
                </V>

                <V style={[{}, sty.title]}>选择终端<V style={styles.titleRed}>*</V></V>
                <V style={[{ flexWrap: 'wrap', flexDirection: 'row' }]}>
                    {['web端', '手机端', '微信端'].map((v, i) => {
                        return <CheckView
                            size={checkSize}
                            textColor={colors.grey9}
                            checked={v == st.details.terminalId}
                            style={{ marginRight: 15 }}
                            onPress={(check: boolean) => {
                                st.details.terminalId = v
                                st.details.terminalName = v
                                vali.checkField(st.details, "terminalId")
                                st.$update
                            }}
                        >{v}</CheckView>
                    })}
                </V>

                <V style={[{}, sty.title]}>填写您对产品的建议和遇到的问题<V style={styles.titleRed}>*</V></V>
                <EditView
                    multiline
                    state={[st.details, "content"]}
                    style={[{}, styles.editSty]} placeholder="输入内容" />

                <V style={[{}, sty.title]}>上传相关问题截图</V>
                <V style={[{ flexWrap: 'wrap', flexDirection: 'row' }]}>
                    {st.imgUrls.map((v, i) => {
                        return <PressView onPress={async () => {
                            let df = new DialogFileSelect()
                            df.setAcceptImage()
                            if (df.fileType != lib.imageArr) {
                                let df = new DialogFileSelect();
                                df.setAcceptImage();
                                let f = await df.show();
                                st.imgUrls.add(st.imgUrls.length - 1, f)
                                st.$update
                                return
                            }
                            let res = await DialogView.show({
                                content: () => <V style={[{
                                    padding: 10,
                                }, styles.roundBackShadow]}>
                                    <V style={[{ color: colors.grey6, fontSize: 16, padding: 5 },]}
                                        onPress={() => {
                                            df.openCamera().then(f => {
                                                st.imgUrls.add(st.imgUrls.length - 1, f)
                                                st.$update
                                            }).catch((err: Error) => {
                                                if (err.message?.indexOf("User cancelled") < 0) {
                                                    app.logError(err);
                                                }
                                            })
                                            if (res.dialog) {
                                                res.dialog.close()
                                            }
                                        }}
                                    >{"拍照"}</V>

                                    <V style={[{ color: colors.grey6, fontSize: 16, padding: 5, marginTop: 10, },]}
                                        onPress={() => {
                                            df.selectPhoto().then(f => {
                                                st.imgUrls.add(st.imgUrls.length - 1, f)
                                                st.$update
                                            }).catch((err: Error) => {
                                                if (err.message?.indexOf("User cancelled") < 0) {
                                                    app.logError(err);
                                                }
                                            })
                                            if (res.dialog) {
                                                res.dialog.close()
                                            }
                                        }}
                                    >{"从相册中选择"}</V>

                                </V>
                            })
                        }}
                            style={[{ marginVertical: 5, marginLeft: 0, marginRight: 5 },]}
                        >
                            {st.imgUrls.length - 1 == i ?
                                <Icon name="add_a_photo" size={70} color={colors.grey9}
                                    style={[{ marginLeft: 10, },]} />
                                :
                                <Pic source={v?.name ?? ''} style={{ height: 80, width: 80 }} />}
                        </PressView>
                    })}
                </V>
            </ScrollView>

            <V style={[{ marginVertical: 20 }, sty.extRow]}>
                <ButtonView
                    white
                    style={[{ marginHorizontal: 20, flex: 1 },]}
                    state={st.details}
                    onPress={() => {
                        if (prop.id) {
                            //详情
                            st.upData()
                        } else {
                            //新建
                            st.details.hotType = 'GENERAL'
                            st.setData()
                        }
                    }}
                >提交</ButtonView>
            </V>
        </V>
    </Container>


}///////////////IssuesDetail end//////////////////

const sty = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 3,
    },
    extRow: {
        flexDirection: "row",
        alignItems: 'center',
        marginRight: 12,
    },
})
