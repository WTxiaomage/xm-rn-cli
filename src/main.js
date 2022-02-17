/*
 * @Author: wangtao
 * @Date: 2022-02-17 17:36:29
 * @LastEditors: 汪滔
 * @LastEditTime: 2022-02-17 20:24:09
 * @Description: file content
 */
const program = require("commander");
const { version } = require("./utils/constants");
const { mapActions } = require("./utils/common");
const path = require("path");
// Object.keys()
Reflect.ownKeys(mapActions).forEach((action) => {
  program
    .command(action) //配置命令的名字
    .alias(mapActions[action].alias) // 命令的别名
    .description(mapActions[action].description) // 命令对应的描述
    .action(() => {
      //动作
      if (action === "*") {
        //访问不到对应的命令 就打印找不到命令
        console.log(mapActions[action].description);
      } else {
        console.log("🚀🚀🚀wimi======>>>action", action);
        // 分解命令 到文件里 有多少文件 就有多少配置 create config
        // rn-cli create project-name ->[node,rn-cli,create,project-name]
        console.log(process.argv);
        require(path.join(__dirname, action))(...process.argv.slice(3));
      }
    });
});

// 监听用户的help事件
program.on("--help", () => {
  console.log("\nExamples:");
  Reflect.ownKeys(mapActions).forEach((action) => {
    mapActions[action].examples.forEach((example) => {
      console.log(`${example}`);
    });
  });
});

program.version(version).parse(process.argv); // process.argv就是用户在命令行中传入的参数
