/*
 * @Author: wangtao
 * @Date: 2020-06-28 15:43:56
 * @LastEditors: 汪滔
 * @LastEditTime: 2021-08-20 18:23:12
 * @Description: 登录
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  PixelRatio, TouchableOpacity,
  ScrollView,
} from 'react-native';
import SyncStorage from 'sync-storage';
import AsyncStorage from '@react-native-community/async-storage';
import { logo, iconLeft } from '@/images';
import {
  Button, _, isAndroid, cache, msg, ValidConst,
} from '@/common';
import {
  px2dp,
  mainBgColorWhite,
  fontColorBlack,
  fontColorLightGray,
} from '@/styles';
import userApi from '@/api/user';

const { SendButton, Submit } = Button;

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: '',
      code: '',
    };
  }

  componentDidMount() {}

  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} scrollEnabled={false}>
        <View style={styles.container}>
          <Image source={logo} resizeMode="contain" style={styles.logo} />
          <Text style={styles.title}>欢迎来到小马之家</Text>
          <TextInput
            style={[styles.textInput, { marginTop: px2dp(140) }]}
            ref={(inputMobile) => this.inputMobile = inputMobile}
            placeholder="手机号"
            placeholderTextColor="#999"
            maxLength={11}
            keyboardType="numeric"
            underlineColorAndroid="transparent"
            clearButtonMode="while-editing"
            onChangeText={(text) => {
              this.setState({
                mobile: text,
              });
              if (text.length === 11) {
                this.inputMobile.blur();
              }
            }}
          />
          <View style={styles.pwdWrap}>
            <TextInput
              style={[styles.textInput]}
              placeholder="验证码"
              ref={(inputCode) => this.inputCode = inputCode}
              maxLength={4}
              keyboardType="number-pad"
              placeholderTextColor="rgba(153, 151, 150, 1)"
              underlineColorAndroid="transparent"
              onChangeText={(text) => {
                this.setState({
                  code: text,
                });
                if (text.length === 4) {
                  this.inputCode.blur();
                }
              }}
            />
            <SendButton
              btnStyle={styles.sendBtn}
              onClick={() => {}}
              clickValid={() => {}}
            />
          </View>
          <Submit
            text="登录"
            boxStyle={{
              width: '100%',
              height: px2dp(88),
              borderRadius: px2dp(16),
              marginTop: px2dp(80),
            }}
            btnTextStyle={{ fontSize: px2dp(36) }}
            onClick={() => this.login()}
          />
          {/* 小返回按钮 */}
          <TouchableOpacity
            style={styles.backDot}
            onPress={() => msg.emit('router: back')}
          >
            <Image
              style={styles.backImg}
              resizeMode="stretch"
              source={iconLeft}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  login=() => {
    const { mobile, code } = this.state;

    // 登录前校验手机号
    const regex = ValidConst.phone;
    if (mobile === '') {
      msg.emit('app:tip', { text: '请填写联系人手机号' });
      return;
    }
    if (!regex.test(mobile)) {
      msg.emit('app:tip', { text: '无效的手机号！' });
      return;
    }

    let type = 1;
    if (Platform.OS === 'ios') {
      type = 2;
    }
    userApi.smsLogin({ mobile, code, registerWay: type }).then((res) => {
      if (res.success) {
        // 登录成功获取用户信息
        userApi.getUserInfo().then((response) => {
          if (response.success) {
            // 双存储机制user信息到内存(在业务场景主要用同步存储SyncStorage，此处是为了全局USER的考虑)
            AsyncStorage.setItem(cache.USER, JSON.stringify(response.data));
            SyncStorage.set(cache.USER, response.data);
            msg.emit('router: reset', {
              routeName: 'Tab',
            });
          } else {
            msg.emit('app:tip', { text: response.msg });
          }
        }).catch((error) => {
          console.log('🚀🚀🚀wimi======>>>response', error);
          msg.emit('app:tip', { text: '登录用户信息异常，请重新登录' });
        });
      } else {
        msg.emit('app:tip', { text: res.msg });
      }
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: mainBgColorWhite,
    paddingHorizontal: px2dp(64),
  },
  logo: {
    width: px2dp(160),
    height: px2dp(180),
    ..._.ifIphoneX(
      { marginTop: px2dp(180 + 60) },
      isAndroid ? { marginTop: px2dp(180) } : { marginTop: px2dp(180 + 30) },
    ),
  },
  title: {
    fontSize: px2dp(44),
    fontWeight: 'bold',
    color: fontColorBlack,
    marginTop: px2dp(32),
  },
  textInput: {
    height: px2dp(80),
    width: '100%',
    textAlign: 'left',
    fontSize: px2dp(32),
    borderBottomColor: fontColorLightGray,
    borderBottomWidth: 1 / PixelRatio.get(),
  },
  pwdWrap: {
    width: '100%',
    position: 'relative',
    marginTop: px2dp(20),
  },
  sendBtn: {
    position: 'absolute',
    right: 0,
    height: px2dp(80),
  },
  backDot: {
    width: px2dp(66),
    height: px2dp(66),
    position: 'absolute',
    left: px2dp(40),
    ..._.ifIphoneX(
      { marginTop: px2dp(30 + 60) },
      isAndroid ? { marginTop: px2dp(30) } : { marginTop: px2dp(30 + 30) },
    ),
    backgroundColor: '#343332',
    opacity: 0.4,
    borderRadius: px2dp(33),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backImg: {
    width: px2dp(36),
    height: px2dp(36),
  },
});
