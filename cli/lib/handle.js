
const clear = require("clear"),
    chalk = require("chalk"),
    figlet = require("figlet"),
    log = console.log,
    fs = require('fs'),
    download = require('download'),
    decompress = require('decompress'),
    { spawn } = require('child_process'),
    read = require('readline'),
    TEMP_DIR = './dev-temp';
let [timeCounter, timer] = [0, null];

exports.log = log;

exports.clear = clear;

exports.chalk = chalk;

exports.showInfo = msg => {
    clear();
    makeInfo(msg);
};

const makeInfo = msg => {
    log(
        chalk.redBright(
            figlet.textSync(msg, {horizontalLayout: 'full'})
        ));
};

exports.successInfo = makeInfo;


/* 下载制定GitHub zip文件 */

const rewriteFile = (path, fileName, reg, value) => {
    return new Promise(async (resolve, reject) => {
        let sourceFile = `${path}/source-${fileName}`,
            distFile = `${path}/${fileName}`;

            await fs.copyFileSync(distFile, sourceFile);
            await fs.writeFileSync(distFile, '');
            read.createInterface({
                    input: fs.createReadStream(sourceFile),
                    output: process.stdout,
                    terminal: false
                }).on('line', val => {
                    if (val.indexOf('<title>') > -1) {
                        val = val.replace(reg, (a, b) =>  a.replace(b, value));
                    }
                    fs.appendFileSync(distFile, val + '\n');
                }).on('close', async () => {
                    await fs.unlinkSync(sourceFile);
                    resolve();
                });
    });
};

exports.downloadZipFile = async config => {
    
    if (!fs.existsSync(TEMP_DIR)) await fs.mkdirSync(TEMP_DIR);
    timerFunc('start', 'down develop package ... ...');
    let path = `https://github.com/demingsu/development-theme/raw/master/theme/${config.package}.zip`;
    return new Promise(async (resolve, reject) => {
        await download(path, TEMP_DIR)
            .then(() => {})
            .catch(async e => {
                await removeDir(TEMP_DIR);
                resolve(false);
            });
        timerFunc('close');
        await decompress(`${TEMP_DIR}/${config.package}.zip`, config.path)
            .then(async files => {
                await removeDir(TEMP_DIR);
                
                await rewriteFile(config.path, 'index.html', new RegExp('<title>(.+?)</title>'), config.title);
                await rewriteFile(config.path, 'gulpfile.js', /(self_pkg_name)/g, config.publish);
                await rewriteFile(config.path, 'package.json', /(self_pkg_name)/g, config.publish);
                await rewriteFile(config.path, 'webpack.config.js', /(self_pkg_name)/g, config.publish);
                
                resolve(true);
            }).catch(async e => {
                await removeDir(TEMP_DIR);
                resolve(false);
            });
    });
};

/* 超时方法 */
let timerFunc = (type, str) => {
    if (type === 'start') {
        type = 'loading';
        timeCounter = 0;
    }
    if (type === 'loading') {
        timer = setTimeout(() => {
            timeCounter += 1000;
            log(chalk(str) + chalk(`${timeCounter/1000}s`));
            timerFunc(type, str);
        }, 1000);
    } else {
        if (timer) clearTimeout(timer);
        timer = null;
    }
}

/* 删除临时目录文件 */
let removeDir = path => {

    return new Promise((resolve, reject) => {
        let files = [];
        /* 如果存在文件，读取文件 */
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            /* 遍历所有文件 */
            files.forEach(function(file, index) {
                var curPath = path + "/" + file;
                /* 如果是文件夹，则递归删除，否则直接删除文件 */
                if (fs.statSync(curPath).isDirectory()) {
                    removeDir(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            /* 删除主目录 */
            fs.rmdirSync(path);
        }

        setTimeout(() => {
            resolve(true);
        });
    });
};