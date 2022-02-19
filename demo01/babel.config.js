/*
 * @Author: wangtao
 * @Date: 2020-10-10 09:46:47
 * @LastEditors: 汪滔
 * @LastEditTime: 2020-10-10 17:51:28
 * @Description: babel
 */

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'], //表示哪个目录开始设置绝对路径
        alias: {
          //别名的配置
          '@/common': './js/common',
          '@/styles': './js/common/styles',
          '@/images': './js/images',
          '@/api': './js/api',
        },
      },
    ],
  ],
};