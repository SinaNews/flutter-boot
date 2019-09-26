#!/usr/bin/env node

'use strict';

const program = require('commander');
const log = require('./src/log');

process.env.FB_DIR = __dirname;
log.level = 'silly';

// Commands
require('./src/commands/init')(program);
require('./src/commands/create')(program);
require('./src/commands/link')(program);
require('./src/commands/remotelink')(program);
require('./src/commands/update')(program);
require('./src/commands/use')(program);
require('./src/commands/ios_target')(program);

program.version('1.0.0').
    description('Flutter Boot: install && run').
    parse(process.argv);
