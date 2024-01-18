import { PixelRatio, Platform, StyleSheet } from 'react-native';
import { colors } from './colors';

export function getHeaderColor() {
  // if (Platform.OS === "web") {
  return colors.weiXinEnterprise
  // }

  return colors.transparent
}

export function getImportanceColor(type?: string | null): string {
  return (colors.importanceMap as any)[type ?? ""] ?? colors.noneImportance;
}



export const leng = {
  pixel1: Platform.OS === "web" ? 0.8 : 1 / PixelRatio.get(),
  shadowOpacity: 0.15,
}

if (process.env.NODE_ENV === "development") {
  console.log("create styles")
}


/**
 * 全局样式
 */
export const styles = StyleSheet.create({
  full: {
    height: '100%',
    width: '100%',
    flex: 1,
  },
  topRound: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  shadowText: {
    textShadowColor: "#00000022",
    textShadowOffset: {
      width: 2,
      height: 2,
    }, textShadowRadius: 3,
  },
  scrollFix: {
    //web端ScrollView必须指定高度,
    height: 1,
  },
  logo: {
    marginTop: 10,
    fontSize: 24,
    color: colors.white,
  },
  floatButton: {
    aspectRatio: 1,
    justifyContent: "center",
    borderRadius: 360,
    position: "absolute", right: 35, bottom: 40
  },
  cardWhite: {
    backgroundColor: colors.white,
    borderRadius: 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: leng.shadowOpacity,
    shadowRadius: 5,
    elevation: 2, //android专属
  },

  cardCheck: {
    borderColor: colors.primary,
  },

  shadow1: {
    shadowColor: colors.shadow,
    shadowOpacity: leng.shadowOpacity,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 1,
    elevation: 2, //android专属
  },

  shadowTop: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: leng.shadowOpacity,
    shadowRadius: 5,
    elevation: 8,
  },

  roundBack: {
    borderRadius: 360,
    width: 20,
    height: 20,
    lineHeight: 20,
    textAlign: "center",
    color: colors.white,
  },

  shadow2: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: leng.shadowOpacity,
    shadowRadius: 2,
    elevation: 3,//android专属
  },
  roundBorder: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
  },
  round360Border: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 360,
  },
  roundShadow: {
    borderRadius: 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: leng.shadowOpacity,
    shadowRadius: 5,
    elevation: 5,//android专属
  },
  roundLRShadow: {
    borderBottomLeftRadius: 5,
    borderTopRightRadius: 5,

    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: leng.shadowOpacity,
    shadowRadius: 5,
    elevation: 5,//android专属
  },
  roundBackShadow: {
    borderRadius: 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: leng.shadowOpacity,
    shadowRadius: 5,
    backgroundColor: colors.background,
    elevation: 3,//android专属
  },
  round360BackShadow: {
    borderRadius: 360,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: leng.shadowOpacity,
    shadowRadius: 5,
    backgroundColor: colors.background,
    elevation: 3,//android专属
  },
  round360Shadow: {
    borderRadius: 360,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: leng.shadowOpacity,
    shadowRadius: 5,
    elevation: 3,//android专属
  },
  row: {
    flexDirection: "row",
  },
  //横向布局,超出部分自动换行
  rowWarp: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  column: {
    flexDirection: "column",
  },
  columnCenter: {
    flexDirection: "column",
    alignItems: "center",
  },
  lineRow: {
    height: leng.pixel1,
    backgroundColor: colors.greyLight,
  },
  borderTopLine: {
    borderTopWidth: leng.pixel1,
    borderTopColor: colors.lineGrey,
  },
  borderLeftLine: {
    borderLeftWidth: leng.pixel1,
    borderLeftColor: colors.lineGrey,
  },
  tabView: {
    backgroundColor: colors.background1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  borderBottomLine: {
    borderBottomWidth: leng.pixel1,
    borderBottomColor: colors.lineGrey,
  },
  borderLine: {
    borderBottomWidth: leng.pixel1,
    borderBottomColor: colors.lineGrey,
  },
  lineVerti: {
    width: leng.pixel1,
    height: "100%",
    backgroundColor: colors.lineGrey,
  },
  radiusBorder: {
    borderRadius: 5,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    textAlignVertical: "center",
  },
  flex1: {
    flex: 1,
  },
  headerTitle: {
    marginLeft: 5,
    alignSelf: "center",
    fontSize: 18,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 3,
  },
  titleRed: {
    fontSize: 17,
    color: colors.red,
  },
  rowMar: {
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  titleSub: {
    fontSize: 16,
    marginRight: 20
  },
  editSty: {
    marginTop: 5,
    // flex: 1,
  },
  nullEdit: {
    textAlign: "right",
    borderWidth: 0,
    borderBottomWidth: 0,
    fontSize: 16,
    paddingVertical: 0,
  },
  nullRow: {
    alignSelf: "flex-end",
  },
});




