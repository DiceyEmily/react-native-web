import { colors } from "@common/components/colors";
import { PixelRatio, StyleSheet } from 'react-native';

/**
 * 全局样式
 */
export const MyStyles = StyleSheet.create({
  tab: {
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.white
  },
  title: {
    fontWeight: '600',
    position: 'relative',
    color: colors.grey3,
    fontSize: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  title_line: {
    width: 3,
    height: 16,
    backgroundColor: colors.primary,
    marginRight: 10
  },
  item_box: {
    color: colors.grey3,
    fontSize: 15,
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'row'
  },
  item_y: {
    backgroundColor: colors.primary,
    marginHorizontal: 10,
    alignSelf: 'center',
    width: 4,
    height: 4,
    borderRadius: 4,
  },
  item_t: {
    alignSelf: 'center',
  },
  tb_head: {
    color: colors.grey3,
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center'
  },
  // 下划线
  base_line: {
    height: 1,
    backgroundColor: colors.greyE
  }
});




