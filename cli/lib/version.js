const { log, chalk } = require("./handle");

exports.version = () => {
    log(chalk.redBright("Currently, four template libraries are supported:"));
    log(chalk.redBright("BackEnd          后端系统开发库，仅集成Element和通用模板组件，以前的项目将继续维护，不再新加入系统开发"));
    log(chalk.redBright("Mobile           移动端开发库，仅集成Vux组件，及少量通用页面"));
    log(chalk.redBright("BETS             后端系统开发库，集成Element和通用模板组件"));
    log(chalk.redBright("BEFlow           后端流程系统开发库，集成Element和通用模板组件"));
    log(chalk.redBright("install command："));
    log(chalk.greenBright("zznode init/i"));
};