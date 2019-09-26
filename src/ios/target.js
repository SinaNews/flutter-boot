const _execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');
const program = require('commander');
const YAML = require('js-yaml');
const ConfigName = 'flutter-boot.yaml';
const log = require('../log');
const fsutils = require('../utils/fsutils');

const TAG = '[target]';
const XCODEPROJ_SUFFIX = '.xcodeproj';

class target {
    constructor () {
        this.nativePath = '';
        this.projectName = '';
    }

    xcodeproj () {
        return path.join(this.nativePath, this.projectName + XCODEPROJ_SUFFIX);
    }

    execSync (command, option) {
        console.log(this.nativePath);
        _execSync(
            command,
            Object.assign(
                {},
                {
                    stdio: 'inherit',
                    cwd: this.nativePath
                },
                option
            )
        );
    }

    getProjectName () {
        const dirfiles = fs.readdirSync(this.nativePath);
        let projectFullName = '';
        dirfiles.every(filename => {
            if (filename.endsWith(XCODEPROJ_SUFFIX)) {
                projectFullName = filename;
                return false;
            }
            return true;
        });
        const projectName = projectFullName.substring(
            0,
            projectFullName.indexOf(XCODEPROJ_SUFFIX)
        );
        return projectName;
    }

    start (options) {
        this.nativePath = options.nativePath;
        this.projectName = this.getProjectName();
        // this.delRunnerTargetToProject();
        this.addRunnerTargetToProject();
    }

    delRunnerTargetToProject () {
        log.silly(TAG, 'prepare delete Runner target');

        const task = `ruby ${path.join(
            process.env.FB_DIR,
            'src/ios/delete_target.rb'
        )} ${this.xcodeproj()} Runner`;

        try {
            this.execSync(task);
        } catch (e) {
            log.error(TAG, 'error when add Runner target to project.' + e);
        }
    }

    addRunnerTargetToProject () {
        log.silly(TAG, 'prepare Runner target');

        const task = `ruby ${path.join(
            process.env.FB_DIR,
            'src/ios/duplicate_target.rb'
        )} ${this.xcodeproj()} ${this.projectName} Runner`;

        try {
            this.execSync(task);
        } catch (e) {
            log.error(TAG, 'error when add Runner target to project.' + e);
        }
    }
}

module.exports = new target();
