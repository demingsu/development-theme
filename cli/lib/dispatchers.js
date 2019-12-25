const {showInfo, log, chalk, successInfo} = require("./handle"),
      {version} = require("./version"),
      MakeInit = require("./index");

exports.getInfo = () => {
    showInfo('zznode cli');
    version();
    successInfo('ZznodeFE');
};

exports.initDev = () => {
    showInfo('zznode init');
    MakeInit();
};