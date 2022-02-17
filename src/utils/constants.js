/*
 * @Author: wangtao
 * @Date: 2022-02-17 17:37:04
 * @LastEditors: 汪滔
 * @LastEditTime: 2022-02-17 23:18:20
 * @Description: file content
 */
const { name, version } = require("../../package.json");

const downloadDirectory = `${
  process.env[process.platform === "darwin" ? "HOME" : "USERPROFILE"]
}/.xm-rn-cli`;
console.log(downloadDirectory);
module.exports = {
  name,
  version,
  downloadDirectory,
};
