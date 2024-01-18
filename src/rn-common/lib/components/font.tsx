export const globalFont = {
  /**
  * 默认基础字体大小
  */
  size: 14,

  //基础倍率
  scale: 1,
};

/**
 * 计算字体大小
 * @param num 
 * @returns 
 */
export function fontScale(num: number | null | undefined) {
  if (num != null)
    return num * globalFont.scale;
  return globalFont.size * globalFont.scale
}