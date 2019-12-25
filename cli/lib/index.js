const inquirer = require("inquirer"),
      {log, chalk, clear, successInfo, downloadZipFile} = require("./handle");

/* 主要处理方法 */
const MakeDev = async () => {
    let result = {};
    log(chalk.greenBright('开发报名、发布包名都必须为a-zA-Z'));
    let name = await getUserInput('path', '输入开发包名      ', 'input', new RegExp('^[a-zA-Z_]*$'));
    let title = await getUserInput('title', '输入项目名字      ', 'input');
    let publish = await getUserInput('publish', '输入发布包名字    ', 'input', new RegExp('^[a-zA-Z_]*$'));
    let pkg = await getUserInput('package', '开发库类型(BE/M/TS)', 'list', [
        {key: 'BE', name: 'BE 后端开发库', value: 'BE'},
        {key: 'M', name: 'M 移动端开发库', value: 'M'},
        {key: 'TS', name: 'TS 后端TS开发库', value: 'TS'},
        {key: 'CF', name: 'CF 自定义表单库', value: 'CF'}]);
    Object.assign(result, name, title, publish, pkg);

    logInfo('  你输入的项目名    ', result.title);
    logInfo('  你输入的包名      ', result.path);
    logInfo('  你输入的发布包名  ', result.publish);

    let st = result.package.trim().toLocaleLowerCase();
    result.package = st === 'ts' ? 'TS' : st === 'm' ? "M" : st === 'cf' ? "CF" : "BE";
    logInfo('  你选择的库类型', result.package);

    let confirm = await getUserInput('conf', '确认是否下载库(Y/N)?');
    if (confirm.conf.trim().toLocaleLowerCase() === "n") {
        log(chalk.yellow('  see you next time'));
    } else {
        result.package = result.package === 'TS' ? 'TSDEV' : result.package === 'M' ? 'DEVM' : result.package === 'CF' ? 'CUSF' : 'EMPTY';

        let res = await downloadZipFile(result);
        if (res) {
            showWishInfo(result);
        } else {
            log(chalk.redBright('Download Error, sorry!'));
        }
        
    }
};

const logInfo = (info, value) => {
    log(chalk.yellow(`${info}：`+chalk.greenBright(chalk.underline(value))));
};

const getUserInput = (name, message, type, data) => {
    return new Promise((resolve, reject) => {
        let config = {type, name, message};
        switch (type) {
            case 'input':
                if (!!data) {
                    Object.assign(config, {
                        validate: value => {
                            if (value.trim() === "") return message;
                            if (!(data.test(value.trim()))) return '输入不符合格式要求';
                            return true;
                        }
                    })
                }
                break;
            case 'list':
                Object.assign(config, {choices: data});
                break;
            default:
                break;
        }

        inquirer.prompt(config).then(data => {
            resolve(data);
        });
    });
};

const showWishInfo = (result) => {
    console.log(chalk.cyanBright('##################################################################################'));
    successInfo('ZznodeFE');
    console.log(chalk.greenBright('You will execute these commands to run the project.'));
    console.log(chalk.greenBright('    ' + chalk.underline(`1. cd ${result.path}`)));
    console.log(chalk.greenBright('    ' + chalk.underline('2. cnpm install')));
    console.log(chalk.greenBright('    ' + chalk.underline('3. npm run start')));
    console.log(chalk.greenBright('    ' + chalk.underline('Best wish for you!')));
    console.log();
    console.log(chalk.cyanBright('##################################################################################'));
}

module.exports = MakeDev;