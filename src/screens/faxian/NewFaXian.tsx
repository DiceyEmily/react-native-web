import { colors } from "@common/components/colors";
import { app } from '@common/lib/app';
import { useInit, useObjState } from '@common/lib/hooks';
import React from 'react';
import { Pressable, StyleSheet, View } from "react-native";
import { api } from '@src/config/api';
import { V } from "@src/rn-common/lib/components/custom/V";
import { Container } from "@src/rn-common/lib/components/Container";
import { HeaderBar, headerPaddingRight, iconPadV } from "@src/components/Header";
import { Pic } from "@src/rn-common/lib/components/custom/Pic";
import { imgs } from "@src/imgs";
import { array, lib } from "@src/rn-common/lib/lib";
import { cfg } from "@src/config/cfg";
import { Icon } from "@src/rn-common/lib/components/icon/Icon";
import { DialogFileSelect } from "@src/rn-common/lib/components/custom/DialogFileSelect";
import { EditView } from "@src/rn-common/lib/components/custom/EditView";
import { leng, styles } from "@src/rn-common/components/styles";
import { PressView } from "@src/rn-common/lib/components/custom/PressView";
import { DialogList, DialogListItem } from "@src/rn-common/lib/components/custom/DialogList";
import { DialogView } from "@src/rn-common/lib/components/custom/DialogView";
import { RocordTypeData } from "@src/model/msg/RocordTypeData";


interface NewFaXianProp {
}


export class NewFaXianState {

    //更新组件
    get $update() { return }

    constructor(
        //组件属性
        public prop_: NewFaXianProp,
    ) {

    }

    content = ''
    level?: RocordTypeData
    news_record_listType = array(RocordTypeData)

    pics: Array<{ file?: File }> = [{},]
    picsList: Array<Array<{ file?: File }>> = []

    getPicsList() {
        this.picsList.splice(0)
        let toa = parseInt(this.pics.length / 3 + '')
        for (let index = 0; index < toa; index++) {
            this.picsList.push([this.pics[index * 3], this.pics[index * 3 + 1], this.pics[index * 3 + 2]])
        }
        if (this.pics.length % 3 != 0) {
            let pic = []
            for (let index = 0; index < this.pics.length % 3; index++) {
                pic.push(this.pics[toa * 3 + index])
            }
            this.picsList.push(pic)
        }
        this.$update
    }


    async getNews_record_listType() {
        let res = await api.news_record_listType().result

        this.news_record_listType = res.data
        this.$update
    }

    async news_record_save() {
        if (this.content.length == 0) {
            app.msg('请填写内容')
            return
        }

        let picUrls: Array<string> = []
        //上传图片
        this.pics.mapPromise(async va => {
            if (va.file) {
                let res = await api.uploadFile({
                    file: va.file,
                }).result

                picUrls.push(res.url)
            }
        }).then(async (map) => {
            let res = await api.news_record_save({
                content: this.content,
                sntUuid: this.level?.sntUuid ?? '',
                urls: picUrls,
            }).result

            if (res.code == '0') {
                app.msg('发布成功')
                app.pop()
            } else {
                app.msg(res.msg ?? '发布失败,请反馈')
            }
        }).catch(res => {
            app.msg('图片发布失败')
        })

    }

}



/**
 * 发布个人咨询
 * @param prop
 * @returns
 */
export function NewFaXian(prop: NewFaXianProp) {

    //组件状态
    const st = useObjState(() => new NewFaXianState(prop), prop)

    //组件初始化
    useInit(async () => {

        st.getPicsList()
        st.getNews_record_listType()

        return async () => { //组件卸载

        }
    })


    return (
        <Container
            style={{ flex: 1, backgroundColor: colors.background, }}>

            <HeaderBar
                morelist={[{
                    v: <V style={{
                        fontSize: 15,
                        color: colors.white,
                        paddingVertical: iconPadV,
                        paddingRight: headerPaddingRight
                    }} onPress={ev => {
                        //发布
                        st.news_record_save()
                    }} >发布</V>
                }]}
            />

            <V style={[{ padding: 20, flex: 1, },]}>
                <EditView
                    placeholder="这一刻的想法..."
                    placeholderTextColor={colors.grey9}
                    state={[st, "content"]}
                    style={[{
                        padding: 10,
                        color: colors.grey3,
                        fontSize: 16,
                        borderBottomWidth: 0,
                    }]}
                />

                <V style={[{
                    marginTop: 40,
                },]}>
                    {st.picsList.map((va, index) =>
                        <V style={[{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                        },]}>
                            {va.map((v, idx) => {
                                return <Pressable
                                    onPress={async () => {
                                        if (st.pics.length - 1 == 3 * index + idx) {
                                            let df = new DialogFileSelect()
                                            df.setAcceptImage()
                                            if (df.fileType != lib.imageArr) {
                                                let df = new DialogFileSelect();
                                                df.setAcceptImage();
                                                let f = await df.show();
                                                st.pics.add(st.pics.length - 1, { file: f })
                                                st.getPicsList()
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
                                                                st.pics.add(st.pics.length - 1, { file: f })
                                                                st.getPicsList()
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
                                                                st.pics.add(st.pics.length - 1, { file: f })
                                                                st.getPicsList()
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
                                        }
                                    }}
                                    style={[{
                                    },]}
                                >
                                    {st.pics.length - 1 == 3 * index + idx ?
                                        <Icon name="add_a_photo" size={70} color={colors.grey9}
                                            style={[{ marginLeft: 10, },]} />
                                        :
                                        <Pic
                                            resizeMode="cover"
                                            style={
                                                [{
                                                    marginTop: 5,
                                                    height: 80,
                                                    width: 80,
                                                    marginLeft: idx == 0 ? 0 : '1.5%',
                                                },]}
                                            source={v.file ?? imgs.bg}
                                        />}
                                </Pressable>
                            })}
                        </V>
                    )}</V>

                <V style={[{
                    backgroundColor: colors.white,
                    marginTop: 40
                },]}>
                    <V style={[styles.lineRow, {},]}></V>
                </V>

                <V style={[{
                    backgroundColor: colors.white,
                    paddingHorizontal: 20, alignItems: 'center',
                    flexDirection: 'row', paddingVertical: 15
                },]}
                >
                    <V style={[{ fontSize: 16 },]}>{'类型：'}</V>

                    <Pressable
                        onPress={async (ev) => {
                            let ret = Array<DialogListItem>()
                            // let list = ['学习', '纪律', '生活']
                            for (let k of st.news_record_listType) {
                                ret.push({
                                    key: k.name,
                                    val: k.sntUuid,
                                    selected: (st.level?.sntUuid ?? '') == k.sntUuid
                                })
                            }
                            let res = await DialogList.show(ret, {
                                posView: ev.currentTarget as unknown as View,
                                position: (layout) => {
                                    return {
                                        x: 150, y: 33,
                                    }
                                },
                                disableDim: false,
                            })
                            st.level = new RocordTypeData()
                            st.level.name = res.key + ''
                            st.level.sntUuid = res.val + ''
                            st.$update
                        }}
                        style={[{
                            flex: 1, alignSelf: 'center',
                            paddingVertical: 4,
                            paddingLeft: 10,
                            borderRadius: 360,
                            borderWidth: leng.pixel1,
                            borderColor: colors.transparent,
                        }, styles.rowCenter,]}>
                        <V style={[{
                            flex: 1,
                            fontSize: 16,
                            color: colors.greyText,
                        },]}>{st.level?.name}</V>

                        <Icon
                            style={[{},]}
                            name="arrow_forward_ios" size={18} color={colors.grey8}
                        />
                    </Pressable>
                </V>
            </V>
        </Container >
    )


}

const sty = StyleSheet.create({

})
