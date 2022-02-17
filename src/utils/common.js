/*
 * @Author: wangtao
 * @Date: 2022-02-17 17:37:09
 * @LastEditors: 汪滔
 * @LastEditTime: 2022-02-18 00:21:21
 * @Description: file content
 */

const ora = require("ora");
const axios = require("axios");
// const path = require('path');
const { downloadDirectory } = require("./constants");
const { promisify } = require("util");
let downloadGit = require("download-git-repo");
downloadGit = promisify(downloadGit);
// const chalk = require("chalk");

const MetalSmith = require("metalsmith"); // 遍历文件夹 找需不需要渲染
// consolidate是一个模板引擎的结合体。包括了常用的jade和ejs。
let { render } = require("consolidate").ejs;
render = promisify(render); // 包装渲染方法
let ncp = require("ncp");
ncp = promisify(ncp);
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const inquirer = require("inquirer");

// 根据我们想要实现的功能配置执行动作，遍历产生对应的命令
const mapActions = {
  create: {
    alias: "c", //别名
    description: "创建一个项目", // 描述
    examples: [
      //用法
      "rn create <project-name>",
    ],
  },
  config: {
    //配置文件
    alias: "conf", //别名
    description: "config project variable", // 描述
    examples: [
      //用法
      "rn config set <k> <v>",
      "rn config get <k>",
    ],
  },
  "*": {
    alias: "", //别名
    description: "command not found", // 描述
    examples: [], //用法
  },
};

// 封装loading效果
const fnLoadingByOra =
  (fn, message) =>
  async (...argv) => {
    const spinner = ora(message);
    spinner.start();
    let result = await fn(...argv);
    spinner.succeed(); // 结束loading
    return result;
  }; //  获取仓库(repo)的版本号信息

// 获取仓库列表
const fetchReopLists = async () => {
  // 获取当前组织中的所有仓库信息,这个仓库中存放的都是项目模板
  const { data } = await axios.get(
    "https://api.github.com/users/WTxiaomage/repos"
  );
  return data.filter((item) => {
    return item.name === "react-native-basic-framework";
  });
};

const getTagLists = async (repo) => {
  const { data } = await axios.get(
    `https://api.github.com/repos/WTxiaomage/${repo}/tags`
  );
  return data;
};

const downDir = async (repo, tag) => {
  console.log(tag, "downDir方法");
  let project = `WTxiaomage/${repo}`; //下载的项目
  if (tag) {
    project += `#${tag}`;
  }
  let dest = `${downloadDirectory}/${repo}`;
  //把项目下载当对应的目录中
  console.log(dest, "dest的内容。。。。。。。。。。");
  console.log(project, "dest的内容。。。。。。。。。。");
  try {
    await downloadGit(project, dest);
  } catch (error) {
    console.log("错误了吗？？？\n");
    console.log(error);
  }
  return dest;
};

// 复制项目从临时文件到本地工作项目
const copyTempToLoclhost = async (target, projectName) => {
  const resolvePath = path.join(path.resolve(), projectName);
  // 此处模拟如果仓库中有ask.js就表示是复杂的仓库项目
  if (!fs.existsSync(path.join(target, "ask.js"))) {
    await ncp(target, resolvePath);
    // fse.remove(target);
  } else {
    //复杂项目
    // 1) 让用户填信息
    await new Promise((resolve, reject) => {
      MetalSmith(__dirname)
        .source(target) // 遍历下载的目录
        .destination(resolvePath) // 最终编译好的文件存放位置
        .use(async (files, metal, done) => {
          let args = require(path.join(target, "ask.js"));
          let res = await inquirer.prompt(args);
          let met = metal.metadata();
          // 将询问的结果放到metadata中保证在下一个中间件中可以获取到
          Object.assign(met, res);
          //  ask.js 只是用于 判断是否是复杂项目 且 内容可以定制复制到本地不需要
          delete files["ask.js"];
          done();
        })
        .use((files, metal, done) => {
          const res = metal.metadata();
          Reflect.ownKeys(files).forEach(async (file) => {
            if (file.includes(".js") || file.includes(".json")) {
              let content = files[file].contents.toString(); //文件内容
              if (content.includes("<%")) {
                content = await render(content, res);
                files[file].contents = Buffer.from(content); //渲染
              }
            }
          });
          done();
        })
        .build((err) => {
          if (err) {
            reject();
          } else {
            resolve();
          }
        });
    });
  }
};

module.exports = {
  mapActions,
  fnLoadingByOra,
  fetchReopLists,
  getTagLists,
  downDir,
  copyTempToLoclhost,
};
