/*
 * @Author: wangtao
 * @Date: 2022-02-17 17:37:09
 * @LastEditors: 汪滔
 * @LastEditTime: 2022-02-19 19:30:57
 * @Description: file content
 */

const ora = require("ora");
const axios = require("axios");
// const path = require('path');
const {
  downloadDirectory,
  templateName,
  binaryExtensions,
} = require("./constants");
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

let newProjectName = "";

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
  let project = `WTxiaomage/${repo}`; //下载的项目
  if (tag) {
    project += `#${tag}`;
  }
  let dest = `${downloadDirectory}/${repo}`;
  try {
    await downloadGit(project, dest);
  } catch (error) {
    console.log(error);
  }
  return dest;
};

// 复制项目从临时文件到本地工作项目
const copyTempToLoclhost = async (srcPath, projectName) => {
  let destPath = path.resolve(projectName);
  newProjectName = projectName;

  run(srcPath, destPath);
};

// 复制项目
const run = (srcPath, destPath) => {
  copyFiles(srcPath, destPath);
  fs.readdir(srcPath, (err, files) => {
    if (err) {
      console.warn(err);
    } else {
      files.forEach((relativeFilePath) => {
        let absoluteSrcPath = path.join(srcPath, relativeFilePath);
        let absoluteDestPath = path.join(destPath, relativeFilePath);

        // 复制文件及文件夹
        copyFiles(absoluteSrcPath, absoluteDestPath);
        // 如果是文件夹需要递归
        if (fs.lstatSync(absoluteSrcPath).isDirectory()) {
          run(absoluteSrcPath, absoluteDestPath);
        }
      });
    }
  });
};

// 复制文件
function copyFiles(srcPath, destPath) {
  // 是否需要改名
  const isRename = destPath.indexOf(templateName) !== -1;
  if (isRename) {
    destPath = destPath.replace(
      /react_native_basic_framework/g,
      newProjectName
    );
  }

  if (fs.lstatSync(srcPath).isDirectory()) {
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath);
    } // Not recursive
    return;
  }

  copyFile(srcPath, destPath);
}

function copyFile(srcPath, destPath) {
  // 二进制格式不能用utf8
  let format =
    binaryExtensions.indexOf(path.extname(srcPath)) !== -1 ? "binary" : "utf8";
  fs.readFile(srcPath, format, function (err, data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/react_native_basic_framework/g, newProjectName);

    fs.writeFile(destPath, result, format, function (err) {
      if (err) return console.log(err);
    });
  });
}

function copyBinaryFile(srcPath, destPath, cb) {
  let cbCalled = false;

  const { mode } = fs.statSync(srcPath);

  const readStream = fs.createReadStream(srcPath);

  const writeStream = fs.createWriteStream(destPath);

  readStream.on("error", (err) => {
    done(err);
  });
  writeStream.on("error", (err) => {
    done(err);
  });
  readStream.on("close", () => {
    done();

    fs.chmodSync(destPath, mode);
  });
  readStream.pipe(writeStream);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}

module.exports = {
  mapActions,
  fnLoadingByOra,
  fetchReopLists,
  getTagLists,
  downDir,
  copyTempToLoclhost,
};
