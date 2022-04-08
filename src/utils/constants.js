/*
 * @Author: wangtao
 * @Date: 2022-02-17 17:37:04
 * @LastEditors: 汪滔
 * @LastEditTime: 2022-04-08 15:23:06
 * @Description: file content
 */
const { name, version } = require("../../package.json");

// 临时下载文件夹
const downloadDirectory = `${
  process.env[process.platform === "darwin" ? "HOME" : "USERPROFILE"]
}/.${name}`;

const templateName = "react_native_basic_framework";

const binaryExtensions = [".png", ".jar", ".keystore"];

module.exports = {
  name,
  version,
  downloadDirectory,
  templateName,
  binaryExtensions,
};
