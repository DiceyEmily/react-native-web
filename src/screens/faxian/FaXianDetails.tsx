import { colors } from "@common/components/colors";
import { app } from '@common/lib/app';
import { useInit, useObjState } from '@common/lib/hooks';
import React from 'react';
import { StyleSheet } from "react-native";
import { api } from '@src/config/api';
import { V } from "@src/rn-common/lib/components/custom/V";
import { Container } from "@src/rn-common/lib/components/Container";
import { HeaderBar, headerPaddingRight, iconPadV } from "@src/components/Header";
import { Pic } from "@src/rn-common/lib/components/custom/Pic";
import { imgs } from "@src/imgs";
import { lib } from "@src/rn-common/lib/lib";
import { cfg } from "@src/config/cfg";
import { Icon } from "@src/rn-common/lib/components/icon/Icon";
import { FaxianListData } from "@src/model/msg/FaxianListData";


interface FaXianDetailsProp {
    dat: FaxianListData
}


export class FaXianDetailsState {

    //更新组件
    get $update() { return }

    constructor(
        //组件属性
        public prop_: FaXianDetailsProp,
    ) {

    }


    picsList: Array<string[]> = []

    getPicsList() {
        let pics = ['', '', '', '', '',]
        let toa = parseInt(pics.length / 3 + '')
        for (let index = 0; index < toa; index++) {
            this.picsList.push([pics[index * 3], pics[index * 3 + 1], pics[index * 3 + 2]])
        }
        if (pics.length % 3 != 0) {
            let pic = []
            for (let index = 0; index < pics.length % 3; index++) {
                pic.push(pics[toa * 3 + index])
            }
            this.picsList.push(pic)
        }
        this.$update
    }

    /* 删除消息 */
    async news_record_delete() {
        let res = await api.news_record_delete(this.prop_.dat.snrUuid).result
        if (res.code == '0') {
            app.msg('删除成功')
            app.pop()
        } else {
            app.msg(res.msg ?? '删除失败,请反馈')
        }
    }

    /* 点赞 */
    async news_record_praise() {
        let res = await api.news_record_praise({
            snrUuid: this.prop_.dat.snrUuid,
            sntUuid: this.prop_.dat.sntUuid,
        }).result
    }

    /* 收藏 */
    async news_record_save() {
        let res = await api.news_record_collect_save({
            snrUuid: this.prop_.dat.snrUuid,
            sntUuid: this.prop_.dat.sntUuid,
        }).result
    }

}



/**
 * 发现详情
 * @param prop
 * @returns
 */
export function FaXianDetails(prop: FaXianDetailsProp) {

    //组件状态
    const st = useObjState(() => new FaXianDetailsState(prop), prop)

    //组件初始化
    useInit(async () => {

        st.getPicsList()

        return async () => { //组件卸载

        }
    })


    return (
        <Container
            style={{ flex: 1, backgroundColor: colors.background, }}>

            <HeaderBar
                morelist={[{
                    iconName: 'delete',
                    click: (v) => {
                        //删除消息
                        st.news_record_delete()
                    }
                }, {
                    iconName: 'star_border',
                    click: (v) => {
                        //收藏
                        st.news_record_praise()
                    }
                }, {
                    iconName: 'favorite_border',
                    click: (v) => {
                        //点赞
                        st.news_record_save()
                    }
                }]}
            />

            <V style={[{ paddingHorizontal: 20 },]}>
                <V numberOfLines={3} style={[{
                    color: colors.textMain, fontSize: 16, marginTop: 20, marginBottom: 3,
                },]} >{prop.dat.name}</V>
                <V style={[{ flexDirection: 'row', },]}>
                    <V numberOfLines={1} style={[{
                        color: colors.grey9, marginVertical: 8, fontSize: 12
                    },]}>{cfg.user.dat.name + '  ' + lib.dateToY_M_D_H_M_S(prop.dat.code,)}</V>
                    <V style={[{ flex: 1 },]}></V>
                </V>

                {st.picsList.map((va) =>
                    <V style={[{ flexDirection: 'row', },]}>
                        {va.map((v, idx) => {
                            return <Pic
                                resizeMode="cover"
                                style={
                                    [{
                                        width: "32%",
                                        height: 60,
                                        marginTop: 5,
                                        marginLeft: idx == 0 ? 0 : '1.5%',
                                    },]}
                                source={!v || v.length == 0 ? imgs.bg : v}
                            />
                        })}
                    </V>
                )}
            </V>
        </Container >
    )


}

const sty = StyleSheet.create({

})
