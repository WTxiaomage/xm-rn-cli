/*
 * @Author: wangtao
 * @Date: 2020-06-28 15:43:56
 * @LastEditors: 汪滔
 * @LastEditTime: 2020-10-10 10:53:48
 * @Description: 关于
 */

import React, { Component } from 'react';
import {
  StyleSheet, View, Text,
} from 'react-native';

export default class About extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <View style={styles.container}>
        <Text>this is About</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
  },
});
