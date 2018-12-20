/* 主要处理方法 */
let fs = require('fs'),
    download = require('download'),
    decompress = require('decompress'),
    { spawn } = require('child_process'),
    color = require('colors'),
    [timeCounter, timer] = [0, null];

/**
 * 定义所有静态变量
 */
const [LIST_TYPE, TEMP_DIR, CNPM_INS, NPM_INS] = [
    'version',
    './dev-temp'
];

const Theme = {
    init(args) {
        /* 重新组装并解析参数 */
        let dirName = args.dirName,
			isInfo = !!args.info,
            version = args.install;

        /* 如果是install类型需要下载指定theme和版本，如果版本未指定则设置为master最新版本 */
		if (isInfo) {
			console.log(`Download Command of Backend System Development Framework: ` ['green']);
			console.log(`zznode -i theme@BDEV <yourProjectName>` ['red']);
			console.log(`Download Command of Big Screen System Development Framework: ` ['green']);
			console.log(`zznode -i theme@DDBS <yourProjectName>` ['red']);
			console.log(`Download Command of Mobile System Development Framework: ` ['green']);
			console.log(`zznode -i theme@DEVM <yourProjectName>` ['red']);
        } else if (!!version && version.length > 0) {
            if (dirName === "") {
                dirName = version[1];
            }
            downloadZipFile(dirName, version);
        } else {
            console.log('your commander order is error');
        }
    }
}

/* 下载制定GitHub zip文件 */
async function downloadZipFile(...args) {
    /* 重新定义参数 */
    let [dirName, version] = args;

    /* 下载提示 */
    console.log(`Begin download the ${version[0]} version of the ${version[1]} theme template dicrionary ...`);

    /* 如果不存在文件则进行创建文件夹，并下载文件 */
    if(!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

    timerFunc('start', 'Loading ... ...');

    let path = `https://github.com/demingsu/development-theme/raw/master/${version[0]}/${version[1]}.zip`;
    await download(path, TEMP_DIR)
        .then(() => {
            // console.log(`The ${version[0]} version of the ${version[1]} theme template has downloaded`);
        }).catch(e => {
            console.log(`The ${version[0]} version of the ${version[1]} theme template has error when downloading`);
            
            /* 删除临时文件 */
            removeDir(TEMP_DIR);
        });

    timerFunc('close');
    /* 根据不同类型解压到不同位置 */

    await decompress(`${TEMP_DIR}/${version[1]}.zip`, dirName)
        .then(files => {
            /* 文件下载成功提示 */
            console.log('Theme dicrionary downloaded success');

            /* 删除临时文件 */
            removeDir(TEMP_DIR);
			
			console.log('##################################################################################');
			console.log('#                                                                                #');
			console.log('#                *****  ***   *   *   ***  *****   *   *                         #');
			console.log('#                *       *    **  *    * 	*	    *   *	                      #');
			console.log('#                *****   *    * * *    *	*****   *****					      #');
			console.log('#                *       *    *  **    *	    *   *   *			              #');
			console.log('#                *      ***   *   *   ***	*****   *   *				          #');
			console.log('#                                                                                #');
			console.log('#   **************************************************************************   #');
			console.log('#                                                                                #');
			console.log('#            You will execute these commands to run the project.                 #');
			console.log(`#            1. cd ${dirName}                                                    #`);
			console.log('#            2. cnpm install                                                     #');
			console.log('#            3. npm run start                                                    #');
			console.log('#                                                                                #');
			console.log('##################################################################################');
        });
}

/* 超时方法 */
function timerFunc(type, str) {
    if (type === 'start') {
        type = 'loading';
        timeCounter = 0;
    }
    if (type === 'loading') {
        timer = setTimeout(() => {
            timeCounter += 500;
            console.log(`${str}` ['green'], `${timeCounter/1000}s` ['red']);
            timerFunc(type, str);
        }, 500);
    } else {
        if (timer) clearTimeout(timer);
        timer = null;
    }
}

/* 删除临时目录文件 */
async function removeDir(path) {
    var files = [];
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
};

module.exports = Theme;