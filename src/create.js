/*
 * @Author: wangtao
 * @Date: 2022-02-17 17:36:48
 * @LastEditors: 汪滔
 * @LastEditTime: 2022-02-19 15:08:25
 * @Description: file content
 */

const inquirer = require("inquirer");
const chalk = require("chalk");
const {
  fnLoadingByOra,
  fetchReopLists,
  getTagLists,
  downDir,
  copyTempToLoclhost,
} = require("./utils/common");
module.exports = async (projectName) => {
  let repos = await fnLoadingByOra(fetchReopLists, "正在链接你的仓库...")();
  repos = repos.map((item) => item.name);
  // 使用inquirer 在命令行中可以交互
  const { repo } = await inquirer.prompt([
    {
      type: "list",
      name: "repo",
      message: "请选择一个你要创建的项目模板",
      choices: repos,
    },
  ]);
  let tags = await fnLoadingByOra(
    getTagLists,
    `正在链接你的选择的仓库${repo}的版本号...`
  )(repo);
  tags = tags.map((item) => item.name);
  // 使用inquirer 在命令行中可以交互
  const { tag } = await inquirer.prompt([
    {
      type: "list",
      name: "tag",
      message: "请选择一个该项目的版本下载",
      choices: tags,
    },
  ]);
  console.log(chalk.green(`您选择了仓库${repo}的${tag}版本`));
  console.log(chalk.yellow(`仓库模板放在GitHub上面，建议科学上网`));
  const target = await fnLoadingByOra(downDir, "下载项目中...")(repo, tag);
  await copyTempToLoclhost(target, projectName);
};
