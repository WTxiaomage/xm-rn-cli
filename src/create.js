/*
 * @Author: wangtao
 * @Date: 2022-02-17 17:36:48
 * @LastEditors: 汪滔
 * @LastEditTime: 2022-06-07 14:36:58
 * @Description: file content
 */

const inquirer = require("inquirer");
const chalk = require("chalk");
const {
  fnLoadingByOra,
  fetchReopLists,
  getBranchesLists,
  downDir,
  copyTempToLoclhost,
} = require("./utils/common");
module.exports = async (projectName) => {
  // 1.请求模板仓库
  let repos = await fnLoadingByOra(fetchReopLists, "正在链接你的仓库...")();
  repos = repos.map((item) => item.name);
  // 2.用户选择模板仓库
  const { repo } = await inquirer.prompt([
    {
      type: "list",
      name: "repo",
      message: "请选择一个你要创建的项目模板",
      choices: repos,
    },
  ]);
  // // 3.请求该仓库的tag
  // let tags = await fnLoadingByOra(
  //   getTagLists,
  //   `正在链接你的选择的仓库${repo}的版本号...`
  // )(repo);
  // tags = tags.map((item) => item.name);
  // 3.请求该仓库的branches
  let branches = await fnLoadingByOra(
    getBranchesLists,
    `正在链接你的选择的仓库${repo}的版本号...`
  )(repo);

  let branchesChoices = branches.filter((item) => {
    // 去掉master和test分支
    if (item.name !== "master" && item.name !== "test") {
      return item.name;
    }
  });
  // 4.用户选择该仓库的branch
  const { branch } = await inquirer.prompt([
    {
      type: "list",
      name: "branch",
      message: "请选择一个该项目的分支下载",
      choices: branchesChoices,
    },
  ]);
  console.log(chalk.green(`您选择了仓库${repo}的${branch}版本`));
  console.log(chalk.yellow(`仓库模板放在GitHub上面，建议科学上网`));
  // 5.下载仓库到用户根目录
  const target = await fnLoadingByOra(downDir, "下载项目中...")(repo, branch);
  // 6.从根目录复制并改名到当前目录
  await copyTempToLoclhost(target, projectName);
};
