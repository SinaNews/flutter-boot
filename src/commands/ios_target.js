#!/usr/bin/env node
'use strict';

const ui = require('../ui');
const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const log = require('../log');
const isEmpty = require('../utils/isEmpty');
const fsutils = require('../utils/fsutils');
const target = require('../ios/target');

const TAG = '[ios_target]';

//对于ios来说，因为使用了两个target，SinaBlog以及Runner
//那么如果native开发，加入了新的文件，可能会导致新加入的.m文件只在SinaBlog中被加入
//建议：
//在每次切换ios分支或者pull代码后，都执行一下这个命令
//此命令，主要做的工作即：删掉Runner的target，并重新dupcate一个Runner，并在新的Runner中加入Flutter的 Run Script
module.exports = program => {
    program.command('ios_target').
        description('重建iOS的Runner Target').
        action(
            async function () {
                const projChecker = fsutils.projectChecker(process.cwd());
                if (!projChecker.isIOS()) {
                    log.error(TAG, '当前目录不是有效的iOS目录，本命令只支持在ios下操作');
                }
                await ios_target(null);
            }
        );
};


async function ios_target (options) {
    const nativePath = process.cwd();
    target.start({
        nativePath: process.cwd()
    });
}
