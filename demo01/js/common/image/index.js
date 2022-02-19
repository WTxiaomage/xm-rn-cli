/*
 * @Author: wangtao
 * @Date: 2020-07-24 20:06:36
 * @LastEditors: 汪滔
 * @LastEditTime: 2020-10-12 17:17:18
 * @Description: 图片浏览
 */
import React, { PureComponent } from 'react';
import { Image, StyleSheet } from 'react-native';

const noneSrc = require('./pic_loading.png');

export default class XMImage extends PureComponent { // 创建一个返回按钮的组件
  render() {
    const { style, src } = this.props;
    let imageSource;
    if (!src) {
      imageSource = noneSrc;
    } else {
      imageSource = { uri: src };
    }
    return (
      <Image
        style={[styles.img, style]}
        resizeMode="cover"
        source={imageSource}
      />
    );
  }
}

const styles = StyleSheet.create({
  img: {
    width: '100%',
    height: '100%',
  },
});
