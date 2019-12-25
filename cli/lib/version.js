const { log, chalk } = require("./handle");

exports.version = () => {
    log(chalk.redBright("Currently, three template libraries are supported:"));
    log(chalk.redBright("BackEnd, 后端系统开发库，仅集成Element和通用模板组件"));
    log(chalk.redBright("Mobile, 移动端开发库，仅集成Vux组件，及少量通用页面"));
    log(chalk.redBright("BETypescript, 后端系统开发库，集成Element和通用模板组件"));
    log(chalk.redBright("开发库安装指令："));
    log(chalk.greenBright("zznode -init"));
};