/*
 * @Author: wangtao
 * @Date: 2020-10-10 09:36:06
 * @LastEditors: 汪滔
 * @LastEditTime: 2020-10-12 17:43:37
 * @Description: ESlint配置
 */
module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
  },
  extends: 'airbnb',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }], //在JS文件中允许存在JSX语法
    'global-require': 'off', //image指定source时要用require语句
    indent: ['error', 2], //缩进规则为2个空格
    'react/jsx-indent': ['error', 2], //缩进规则为2个空格
    'react/jsx-indent-props': ['error', 2], //缩进规则为2个空格
    'react/prop-types': ['error', { ignore: ['tintColor', 'navigation'] }],
    'react/no-multi-comp': ['error', { ignoreStateless: true }],
    'react/prefer-stateless-function': [
      'error',
      { ignorePureComponents: true },
    ],
    'max-len': ['error', { code: 200 }],
    'import/no-unresolved': [
      2,
      {
        ignore: ['^@/'], // @ 是设置的路径别名,解决与eslint的冲突
      },
    ],

    // 配置方法编码顺序start
    'react/sort-comp': [
      1,
      {
        order: ['static-methods', 'lifecycle', 'rendering', 'everything-else'],
        groups: {
          rendering: ['/^render.+$/', 'render'],
        },
      },
    ],
    // 配置方法编码顺序end

    "no-underscore-dangle": 0,
    "no-undef": 0,
    "no-console": "off", //console警告
    "no-return-assign": 0, //箭头函数必须有返回值
    "react/no-unused-state": 0,
    "react/jsx-props-no-spreading": 0,
    "no-plusplus": 0,
    "import/prefer-default-export": 0,
    "no-param-reassign": 0,
    "no-use-before-define": 0,
    "no-restricted-syntax": 0,
    "react/destructuring-assignment": 0, 
    "no-nested-ternary": 0, 
    "no-unused-expressions": 0, 
    "react/static-property-placement": 0, //static不用放在外部定义
    "no-useless-constructor": 0, //constrctor的父继承
    "react/prop-types": 0, //prop-types是否必须（严格项目应该打开）
    "max-classes-per-file": ["error", 10]
  },
}
