import React from 'react'
import { Platform, View, Text, StyleSheet, Image, Pressable, Linking } from "react-native";
import { V } from '@common/lib/components/custom/V';
import { useInit, useObjState } from '@common/lib/hooks';
import { Container } from '@src/rn-common/lib/components/Container';
import { cfg } from '@src/config/cfg';
import { imgs } from '@src/imgs';
import { styles } from '@src/rn-common/components/styles';
import { colors } from '@src/rn-common/components/colors';
import { HeaderBar } from '@src/components/Header';
import { EditView } from '@src/rn-common/lib/components/custom/EditView';
import { RegisterUserBean } from '@src/model/zhuce/RegisterUser';
import { api } from '@src/config/api';
import { app } from '@src/rn-common/lib/app';
import { OptionDate } from '@src/rn-common/components/OptionDate';
import { lib } from '@src/rn-common/lib/lib';
import { Pic } from '@src/rn-common/lib/components/custom/Pic';
import { PressView } from '@src/rn-common/lib/components/custom/PressView';
import { Icon } from '@src/rn-common/lib/components/icon/Icon';
import { DialogList, DialogListItem } from '@src/rn-common/lib/components/custom/DialogList';
import { DialogFileSelect } from '@src/rn-common/lib/components/custom/DialogFileSelect';
import { DialogView } from '@src/rn-common/lib/components/custom/DialogView';
import { apiBase } from '@src/config/apiBase';
import Config from 'react-native-config';


interface MyInformationProp {

}


export class MyInformationState {


    //更新组件
    get $update() { return }
    constructor(
        //组件属性
        public prop_: MyInformationProp,
    ) {
        let user = cfg.user.dat
        this.info.avatar = user.avatar
        this.info.avatarThumbnail = user.avatarThumbnail
        this.info.birthday = user.birthday
        this.info.email = user.email
        this.info.gender = user.gender
        this.info.identifyPhotos = user.identifyPhotos
        this.info.identifyPhotosThumbnail = user.identifyPhotosThumbnail
        this.info.name = user.name
        this.info.phone = user.phone
    }

    info = new RegisterUserBean()

    isShow = false

    async upImage(f: File) {
        let res = await api.uploadFile({
            file: f,
        }).result;

        this.info.avatar = res.url
        // cfg.user.dat.avatar = Config.FILE_URL + '/' + res.url
        // cfg.user.save

        this.$update;
    }

}///////////////MyViewState end///////////////////



/**
 * 我的信息
 * @param prop 
 * @returns 
 */
export function MyInformation(prop: MyInformationProp) {

    //组件状态
    const st = useObjState(() => new MyInformationState(prop), prop)

    //组件初始化
    useInit(async () => {


        return async () => { //组件卸载

        }
    })


    /////////////////////////////////////////
    //////// MyView view//////////
    /////////////////////////////////////////
    return (
        <Container style={[{},]}>
            <HeaderBar
                title={"我的信息"}
            />

            <V style={[{ alignItems: 'center', paddingHorizontal: 20, backgroundColor: colors.white, flexDirection: 'row', paddingVertical: 20 },]}>
                <V style={[{ fontSize: 16 },]}>{'头像'}</V>
                <V style={[{ flex: 1 },]}></V>
                <Pressable
                    onPress={async () => {
                        let df = new DialogFileSelect()
                        df.setAcceptImage()
                        if (df.fileType != lib.imageArr) {
                            let df = new DialogFileSelect();
                            df.setAcceptImage();
                            let f = await df.show();
                            await st.upImage(f);
                            return
                        }
                        let res = await DialogView.show({
                            content: () => <V style={[{
                                padding: 10,
                            }, styles.roundBackShadow]}>
                                <V style={[{ color: colors.grey6, fontSize: 16, padding: 5 },]}
                                    onPress={() => {
                                        df.openCamera().then(async f => {
                                            await st.upImage(f);
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
                                        df.selectPhoto().then(async f => {
                                            await st.upImage(f);
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
                >
                    <Pic
                        resizeMode="cover"
                        style={[{
                            width: 40,
                            height: 40,
                            borderRadius: 360,
                        },]}
                        source={st.info.avatar ? (st.info.avatar.startsWith('HTTP') || st.info.avatar.startsWith('http') ? st.info.avatar : Config.FILE_URL + '/' + st.info.avatar) : (!cfg.user.dat.gender ? imgs.male : imgs.female)} />
                </Pressable>
            </V>

            <V style={[{ backgroundColor: colors.white, },]}>
                <V style={[styles.lineRow, { marginHorizontal: 20, },]}></V>
            </V>

            <V style={[{
                backgroundColor: colors.white,
                paddingHorizontal: 20,
                alignItems: 'center',
                flexDirection: 'row',
                paddingVertical: 15,
            },]}>
                <V style={[{ fontSize: 16 },]}>{'生日：'}</V>
                <OptionDate
                    placeHolder={lib.dateToY_M_D(st.info.birthday)}
                    renderText={res => lib.dateToY_M_D(res)}
                    onSelect={res => {
                        st.info.birthday = lib.dateToY_M_D(res)
                    }} style={[{ flex: 1, marginLeft: 30 },]}
                    selectType={["year", "month", "day"]} />
            </V>

            <V style={[{ backgroundColor: colors.white, },]}>
                <V style={[styles.lineRow, { marginHorizontal: 20, },]}></V>
            </V>

            <V style={[{
                backgroundColor: colors.white,
                paddingHorizontal: 20,
                alignItems: 'center',
                flexDirection: 'row',
                paddingVertical: 15,
            },]}>
                <V style={[{ fontSize: 16 },]}>{'邮箱：'}</V>
                <EditView
                    placeholder="请输入"
                    placeholderTextColor={colors.grey9}
                    state={[st.info, "email"]}
                    style={[{
                        flex: 1,
                        padding: 10,
                        color: colors.grey3,
                        textAlign: 'right',
                        borderBottomWidth: 0,
                    }]}
                />
            </V>

            <V style={[{ backgroundColor: colors.white, },]}>
                <V style={[styles.lineRow, { marginHorizontal: 20, },]}></V>
            </V>

            <V style={[{
                backgroundColor: colors.white,
                paddingHorizontal: 20,
                alignItems: 'center',
                flexDirection: 'row',
                paddingVertical: 15,
            },]}>
                <V style={[{ fontSize: 16 },]}>{'性别：'}</V>
                <V style={[{ flex: 1 },]}></V>

                <Pressable
                    onPress={async (ev) => {
                        let v = ev.currentTarget as unknown as View
                        st.isShow = true
                        st.$update

                        let ret = Array<DialogListItem>()
                        ret.push({
                            key: '男',
                            val: 1,
                            selected: st.info.gender == 1
                        })
                        ret.push({
                            key: '女',
                            val: 2,
                            selected: st.info.gender == 2
                        })

                        let res = await DialogList.show(ret, {
                            posView: v,
                            position: (layout) => {
                                return {
                                    x: 0, y: 33,
                                }
                            },
                            disableDim: false,
                            onClose: () => {
                                st.isShow = false
                                st.$update
                            }
                        })
                        st.isShow = false
                        let sele = res.key == '男' ? 1 : 2
                        if (st.info.gender == sele) {
                            //不选择
                            st.info.gender = 0
                        } else
                            st.info.gender = res.key == '男' ? 1 : 2
                        st.$update
                    }}
                    style={[{
                        paddingVertical: 4,
                        paddingHorizontal: 12,
                        borderRadius: 360,
                        borderWidth: 1,
                        borderColor: colors.lineGrey,
                        marginBottom: 5,
                    }, styles.rowCenter]}>
                    <V style={[{ paddingHorizontal: 10 },]}>{st.info.gender == 1 ? '男' : st.info.gender == 2 ? '女' : '请选择'}</V>
                    <Icon
                        style={[{
                            transform: [{
                                rotate: st.isShow ? "180deg" : "0deg",
                            }]
                        },]}
                        name={"expand_more"} size={18} color={colors.grey8}
                    />
                </Pressable>
            </V>

            <V style={[{ backgroundColor: colors.white, },]}>
                <V style={[styles.lineRow, { marginHorizontal: 20, },]}></V>
            </V>

            <V style={[{
                backgroundColor: colors.white,
                paddingHorizontal: 20,
                alignItems: 'center',
                flexDirection: 'row',
                paddingVertical: 15,
            },]}>
                <V style={[{ fontSize: 16 },]}>{'家长姓名：'}</V>
                <EditView
                    placeholder="请输入"
                    placeholderTextColor={colors.grey9}
                    state={[st.info, "name"]}
                    style={[{
                        flex: 1,
                        padding: 10,
                        color: colors.grey3,
                        textAlign: 'right',
                        borderBottomWidth: 0,
                    }]}
                />
            </V>

            <V style={[{ backgroundColor: colors.white, },]}>
                <V style={[styles.lineRow, { marginHorizontal: 20, },]}></V>
            </V>

            <V style={[{
                backgroundColor: colors.white,
                paddingHorizontal: 20,
                alignItems: 'center',
                flexDirection: 'row',
                paddingVertical: 15,
            },]}>
                <V style={[{ fontSize: 16 },]}>{'手机号码：'}</V>
                <EditView
                    placeholder="请输入"
                    placeholderTextColor={colors.grey9}
                    state={[st.info, "phone"]}
                    style={[{
                        flex: 1,
                        padding: 10,
                        color: colors.grey3,
                        textAlign: 'right',
                        borderBottomWidth: 0,
                    }]}
                />
            </V>

            <V style={[{ margin: 30, backgroundColor: colors.primary, color: colors.white, borderRadius: 30, padding: 10, textAlign: 'center' },]}
                onPress={async () => {
                    let user = cfg.user.dat
                    let json = {} as any
                    if (st.info.avatar != user.avatar) {
                        json['avatar'] = st.info.avatar
                    }
                    if (st.info.birthday != user.birthday) {
                        json['birthday'] = st.info.birthday
                    }
                    if (st.info.email != user.email) {
                        json['email'] = st.info.email
                    }
                    if (st.info.gender != user.gender) {
                        json['gender'] = st.info.gender
                    }
                    if (st.info.name != user.name) {
                        json['name'] = st.info.name
                    }
                    if (st.info.phone != user.phone) {
                        json['phone'] = st.info.phone
                    }
                    let res = await api.updateInfo(json).result

                    if (json['avatar']) {
                        user.avatar = st.info.avatar
                    }
                    if (json['birthday']) {
                        user.birthday = st.info.birthday
                    }
                    if (json['email']) {
                        user.email = st.info.email
                    }
                    // if (json['gender']) {
                    user.gender = st.info.gender
                    // }
                    if (json['name']) {
                        user.name = st.info.name
                    }
                    if (json['phone']) {
                        user.phone = st.info.phone
                    }

                    cfg.user.save

                    app.msg('修改成功')
                }}>保存</V>
        </Container>
    )


}///////////////MyView end//////////////////

const sty = StyleSheet.create({

})