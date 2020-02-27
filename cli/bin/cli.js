#!/usr/bin/env node

const commander = require("commander"),
      chalk = require("chalk"),
      figlet = require("figlet"),
      {getInfo, initDev} = require("../lib/dispatchers");

commander.command('info')
         .alias("f")
         .action(() => {
            getInfo();
         });

commander.command('init')
         .alias("i")
         .action(() => {
            initDev();
         });
               	
commander.command('help')
         .action(() => {
            console.log((
               chalk.redBright(
                   figlet.textSync('zznode-cli', {horizontalLayout: 'full'})
               )));
            console.log('    zznode init/i 命令用于初始化项目');
            console.log('    zznode info/f 命令用户获取当前可用开发库版本信息');
         });

commander.arguments('<dirName>').parse(process.argv);