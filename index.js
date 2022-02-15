#!/usr/bin/env node
//使用node开发命令行工具所执行的js脚本必须在顶部加入 #!/usr/bin/env node 声明
import {program} from "commander";//. 使用包 Commander.js 模块来获取处理命令行参数
import download from "download-git-repo";//使用 download-git-repo 下载 能够直接下载仓库内容的插件
import inquirer from "inquirer";//够与用户在命令行进行参数选择交互
import handlebars from "handlebars";//能够读取当前项目下的文件，并重新写入
import ora from "ora";//使用 ora 增加下载中 loading 效果
import fs from "fs";
import chalk from "chalk";//字体美化 chalk chalk 能够自定义使输出的命令行字体颜色
import logSymbols from "log-symbols";//日志符号 logSymbols logSymbols 能够在控制台输出指定的日志符号
console.log('demo index.js执行了')
//原生获取命令行参数的方法
// console.log(process.argv);
/* 
输入：itRun pro 
结果： 
[
  'C:\\Program Files\\nodejs\\node.exe',
  'C:\\Users\\dongxu.yang\\AppData\\Roaming\\npm\\node_modules\\democli\\index.js',
  'pro'
]
*/
const template = {
  "tpl-a": {
    "url": "https://github.com:15011164760/tpl-a#main",
    "description": "uni-shop_demo"
  },
  "tpl-b": {
    // 下载目标，格式为：仓库地址:用户名/仓库名字#分支
    "url": "https://github.com:15011164760/tpl-b#main",
    "description": "tpl-b==="
  },
  "tpl-c": {
    "url": "https://github.com:15011164760/tpl-c#main",
    "description": "sunhuapeng_2.0"
  },
}
program.version('0.1.0')
program
  .command('init <template> <project>')
  .description('初始化项目模板')
  .action((templateName, projectName) => {
    console.log(templateName, projectName);
    let { url } = template[templateName];
    console.log(url);
    // 初始化 ora
    const loading = ora("模板下载中...");
    loading.start();
    download(url, projectName, {
      // 以克隆形式下载
      clone: true,
      // 完成回调
    }, (err) => {
      if (err) {
        loading.fail();
        console.log('下载失败', err)
        // 输出红色警告字体告知用户模板下载失败
        console.log(logSymbols.error, chalk.red("模板下载失败!"));
        console.log("错误原因：", err);
      } else {
        loading.succeed("下载成功！");
        console.log('下载成功')
        // 以橙色字体提示用户模板已经下载完成
        const log = chalk.hex("#FFA500");
        // // 模板初始化成功后输出
        console.log(logSymbols.success, log("模板初始化成功！"))
        inquirer.prompt([
          {
            // 输入类型
            type: "input",
            // 字段名称
            name: "name",
            // 提示信息
            message: "请输入项目名称",
          },
          {
            // 输入类型
            type: "input",
            name: "description",
            message: "请输入项目简介",
          },
          {
            type: "input",
            name: "author",
            message: "请输入作者名称",
          },
        ])
          // 获取输入结果
          .then((answers) => {
            console.log(answers);
            // 把采集到的用户数据解析替换到 package.json 文件中
            // 保存下载下来的模板 package.json 配置文件路径
            const packagePath = `${projectName}/package.json`;
            // 使用 fs 获取下载到的模板中额 package.json 配置文件
            const packageContent = fs.readFileSync(
              `${projectName}/package.json`,
              "utf8"
            );
            // 使用 handlebars 编译这个文件为渲染函数
            const packageResult = handlebars.compile(packageContent)(answers);
            // 将修改后配置写入下载下来的模板中
            fs.writeFileSync(packagePath, packageResult);
            console.log("初始化模板成功！");
            console.log(packageResult);
          });
      }
    })
    // 使用 download-git-repo 下载模板
    /* 
    
    */
  })
program
  .command('list')
  .description('查看所用可用模板')
  .action((templateName, projectName) => {
    for (let key in template)
      console.log(`${key} ${template[key].description}`);
  }
  )
program.parse(process.argv);