<!--
 * @Author: wangtao
 * @Date: 2020-07-09 00:09:12
 * @LastEditors: 汪滔
 * @LastEditTime: 2020-10-13 09:15:55
 * @Description: 项目说明文件
-->

# demo01

## 这是一个基础框架
1. 用react-native-cli新增一个项目，保留Android，ios目录，将js相关部分替换，app.json中的要换为项目名

## 项目搭建思路

1. 用 npx react-native init demo01 (如果不行，卸载：npm uninstall -g react-native-cli 下载：npm install react-native-cli )
2. 引入 react-navigation  
   ```
   "@react-native-community/masked-view": "^0.1.10",
   "react-native-gesture-handler": "^1.8.0",
   "react-native-reanimated": "^1.13.1",
   "react-native-safe-area-context": "^3.1.8",
   "react-native-screens": "^2.11.0",
   "react-navigation": "^4.4.2",
   "react-navigation-drawer": "^1.4.0",
   "react-navigation-stack": "^1.10.3",
   "react-navigation-tabs": "^1.2.0"
   ```
3. 配置别名（新增功能）
   ```
   "babel-plugin-module-resolver": "^4.0.0",
   ```
4. 配置全局通信
  ```
  "mitt": "^2.1.0",
  ```
5. 配置 eslint(痛定思痛，xmgj 没配置导致编码不规范，现在强制性，请在编辑器中安装 ESlint，Prettier 插件配合使用，真香！！！)
  ```
  "babel-eslint": "^10.1.0",
  "eslint": "^6.5.1",
  "eslint-config-airbnb": "^18.2.0",
  "eslint-plugin-import": "^2.22.1",
  "eslint-plugin-jsx-a11y": "^6.3.1",
  "eslint-plugin-react": "^7.21.4",
  ```
6. 配置存储机制（之前用的 react-native-storage 已经两年未维护了，重要地方采用双存储机制（主要是用于存储登录信息等，如无必要请不要用来做业务）（目前@react-native-community/async-storage 杀进程后不会丢失，sync-storage 杀进程后会丢失）
   ```
   "@react-native-community/async-storage": "^1.12.1",
   "sync-storage": "^0.4.2"
   ```

## 路由导航（架构核心，重点，常用）

- 管理路由

1.  本项目的路由主要基于 react-navigation 作为基础进行架构设计，请事先学习文档：https://reactnavigation.org/docs/3.x/getting-started/

2.  项目的路由管理全部设计到 router.js 文件中，方便路由拦截，权限路由，路由栈改变等，请引入文件

```
      import About from './containers/My/About'; //我的 关于
      About: {
        screen: About,
        navigationOptions: {
          headerTitle: '个人资料',
        },
      },

      在路由中内置两个公共样式
      About: {
        screen: About,
        navigationOptions: {
          ...titleCenter  //适配安卓居中，安卓默认靠右
        },
      },

      About: {
        screen: About,
        ...emptyHeader //去掉头部
      },

      <!-- 也可以在组件内部设置navigation，优先级低于router.js -->
      static navigationOptions = ({navigation}) => ({
        title: '商城',
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
        headerRight: (
          <TouchableOpacity
            activeOpacity={0.8}
            style={{padding: 10}}
            onPress={() => {}}>
            <Text
              allowFontScaling={false}
              style={{fontSize: 13, color: '#000', marginRight: 10}}>
              {'编辑'}
            </Text>
          </TouchableOpacity>
        ),
        tabBarIcon: ({focused}) => (
          <Image
            source={focused ? mall : mallGray}
            style={{width: 24, height: 24}}
          />
        ),
      });

```

    此时可以在路由管理器中找到对应key，通过下面的跳转方法即可方便使用

- 使用路由
  1. 跳转下一级路由

```
    不传参数

    msg.emit('router: goToNext', {
        routeName: 'XmArticle',
    });

    传参数
    msg.emit('router: goToNext', {
        routeName: 'XmArticle',
        data: "logistics"
    });

    取参数（强烈建议按此模板书写，可能会觉得繁琐，但是对于react-navigation 4.*.*的版本这样最好，不会因为参数传错儿导致程序崩溃和闪退）

    componentWillMount() {
      const navigation = this.props.navigation;
      const state = navigation.state || {};
      const params = state.params || {};
      const { data } = params;

    }

```

2.  返回上一页
    msg.emit('router: back');

- 往路由中动态注入参数

```
   componentDidMount() {

    const navigation = this.props.navigation;
    navigation.setParams({
      type:false,
    })

  }

  <!-- 在静态方法中取出, 此处改标题优先级低于router.js-->
  static navigationOptions = ({ navigation }) => {

    return {
      // headerTitle: navigation.state.params.contentTitle,
      headerTitle: navigation.getParams('contentTitle'),
    };

  };

```

## Button

1. 发送验证码

```
 <SendButton btnStyle={styles.sendBtn} onClick={() => {}} clickValid={() => {}} />
```

2. 提交表单

```
 <Submit
    text="登录"
    boxStyle={{
      width: '100%',
      height: px2dp(88),
      borderRadius: px2dp(16),
      marginTop: px2dp(80),
    }}
    disabled
    onClick={() => {}}
  />
```

## \_ 小工具函数

1. 适配 Android，iOS8， iOS11
   第一个为有刘海的如 IphoneX 顶部距离加 60，第二个为 Android 机不加，第三个为无刘海的 Iphone 加 30
   ...\_.ifIphoneX(
   { marginTop: px2dp(180 + 60) },
   isAndroid ? { marginTop: px2dp(180) } : { marginTop: px2dp(180 + 30) },
   ),

## 内存存储 异步 AsyncStorage 同步 SyncStorage

注意:在使用时请配合公共环境常量管理文件使用，方便团队管理，知道目前别人存的，防止覆盖冲突

```
  // 存
    AsyncStorage.setItem(cache.USER, JSON.stringify(response.data));
    SyncStorage.set(cache.USER, response.data);
  //取
    AsyncStorage.getItem(cache.USER).then((res) => {
      console.log('🚀🚀🚀wimi======>>>AsyncStorage', res);
    });
    SyncStorage.get(cache.USER)
  // 删除
    AsyncStorage.removeItem(cache.USER);
    SyncStorage.remove(cache.USER);
    建议清空不删key
    AsyncStorage.setItem(cache.USER, '');
    SyncStorage.set(cache.USER, '');
```

## 全局 Tips

```
msg.emit('app:tip', { text: 'message' });
msg.emit('app:tip', { text: '删除成功', icon: 'success' });
```


## XMListView

  //以下是listView的封装属性，详细可看test文件夹中的demo
  ```
  static defaultProps = {
    //请求的url
    url: '',
    // 请求方式
    methods: '',
    // 从返回对象中取数据的属性,避免在公共组件中写死这种代码context.esGoodsInfoPage.content
    dataPropsName: '',
    //样式
    style: {},
    columnWrapperStyle: {},
    topButStyle: {},
    //http参数
    params: {},
    //默认当前页
    page: 0,
    //默认每页展示的数量
    size: 10,
    //默认排序
    sortFlag: 0,
    //当前的数据
    dataSource: [],
    //是否分页
    isPagination: true,
    //显示头部
    renderHeader: null,
    //展示每列
    renderRow: null,
    //展示页脚
    renderFooter: null,
    //显示空
    renderEmpty: null,
    //收到数据后的回调
    onDataReached: noop,
    //row数据中的主键，用于生成行key
    keyProps: 'id',
    //多余的参数，state等变量
    extraData: {},
    //每行的列数
    numColumns: 1,
    //组装item需要的其他参数，和content平级的返回值
    otherProps: [],
    //行高
    // lineHeight:121
    //返回滑动数据
    returnScroll: null,
  }; 
  ```




## React 新版本一些生命周期的替换

```
//老的
componentWillReceiveProps(nextProps) {
    if (nextProps.disabled !== this.state.disabled) {
      this.setState({ disabled: nextProps.disabled })
    }
  }
//新的替换方案
static getDerivedStateFromProps(props, state) {
    if (props.disabled !== state.disabled) {
      return {
        disabled: props.disabled,
      };
    }

    return null;
  }

```
