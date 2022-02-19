/*
 * @Author: wangtao
 * @Date: 2020-06-24 10:52:16
 * @LastEditors: 汪滔
 * @LastEditTime: 2020-10-10 11:52:05
 * @Description: 主要与样式及适配相关
 */

import { Dimensions, Platform } from 'react-native';

const mainBgColorLightGray = '#F5F5F5'; // 主背景色 淡灰
const mainBgColorWhite = '#FFFFFF'; // 主背景色 白色
const priceColor = '#EA0505'; // 价格色 淡红
const fontColorBlack = '#343332'; // 字体色  黑色
const fontColorDeepGray = '#666562'; // 字体色 深灰色
const fontColorSecDeepGray = '#999896'; // 字体色 次深灰色
const fontColorLightGray = '#CDCCC9'; // 字体色 浅灰色
const splitLineColorLightGray = '#F0EFEF'; // 边框分割线色 浅灰色
const fontColorCoffee = '#BA914A'; // 字体背景色 咖啡色
const fontColorLightCoffee = '#F1E9DB'; // 字体背景色 浅咖啡色
const fontColorLightGreen = '#1ABD13'; // 字体色 绿色
const fontColorOrange = '#EF9730'; // 字体色 橙色
const mainBgColorBlack = '#000000'; // 主题背景色 黑色

const { width: screenWidth, height: screenHeight } = Dimensions.get('window'); // 屏幕宽高

const isAndroid = Platform.OS === 'android'; // 判断是否为安卓
const isIOS = Platform.OS === 'ios'; // 判断是否为iOS

// 添加pxToDp
// UI图设计基准大小
const uiWidthPx = 750;

function px2dp(uiElementPx) {
  if (screenWidth > screenHeight) {
    return (uiElementPx * screenHeight) / uiWidthPx;
  }
  return (uiElementPx * screenWidth) / uiWidthPx;
}

export {
  mainBgColorLightGray,
  mainBgColorWhite,
  priceColor,
  fontColorBlack,
  fontColorLightGray,
  fontColorCoffee,
  fontColorDeepGray,
  fontColorSecDeepGray,
  isAndroid,
  isIOS,
  screenWidth,
  screenHeight,
  px2dp,
  splitLineColorLightGray,
  fontColorLightGreen,
  mainBgColorBlack,
  fontColorLightCoffee,
  fontColorOrange,
};
