const log = require('../log');
const path = require('path');
const fs = require('fs');
const fsutils = require('../utils/fsutils');
const execSync = require('child_process').execSync;
const rimraf = require('rimraf');

const TAG = '[softlink]';
const IOS_LINK_PATH = 'ios';

function softlink (options) {
    var nativePath = options.nativePath;
    var projectName = options.projectName;
    var flutterPath = path.resolve(nativePath, options.flutterPath);
    linkUserProject(flutterPath, nativePath, projectName);
    exportEnv(flutterPath);
}

function linkUserProject (flutterPath, nativePath, projectName) {
    log.info(TAG, 'create soft link');
    var iosLinkPath = path.join(flutterPath, IOS_LINK_PATH);
    rimraf.sync(iosLinkPath);
    fs.mkdirSync(iosLinkPath);

    fs.writeFileSync(path.join(iosLinkPath, 'Podfile'));
    fs.writeFileSync(path.join(iosLinkPath, 'fbpodhelper.rb'));
    execSync('mkdir -p .ios/Flutter', {cwd: iosLinkPath});
    fs.writeFileSync(path.join(iosLinkPath, '.ios/Flutter', 'podhelper.rb'));
    fs.writeFileSync(path.join(iosLinkPath, 'Runner.xcodeproj'));
    fs.writeFileSync(path.join(iosLinkPath, 'Runner.xcworkspace'));
    fs.writeFileSync(path.join(iosLinkPath, path.basename(nativePath)));
    fs.writeFileSync(path.join(iosLinkPath, 'Info.plist'));
    fs.writeFileSync(path.join(iosLinkPath, 'fbConfig.local.json'));

    fsutils.createSoftLink(path.join(iosLinkPath, 'Podfile'), path.join(nativePath, 'Podfile'));
    fsutils.createSoftLink(path.join(iosLinkPath, 'fbpodhelper.rb'), path.join(nativePath, 'fbpodhelper.rb'));
    fsutils.createSoftLink(path.join(iosLinkPath, '.ios/Flutter', 'podhelper.rb'), path.join(flutterPath, '.ios/Flutter', 'podhelper.rb'));
    fsutils.createSoftLink(path.join(iosLinkPath, 'Runner.xcodeproj'), path.join(nativePath, path.basename(nativePath) + '.xcodeproj'));
    fsutils.createSoftLink(path.join(iosLinkPath, 'Runner.xcworkspace'), path.join(nativePath, path.basename(nativePath) + '.xcworkspace'));
    fsutils.createSoftLink(path.join(iosLinkPath, path.basename(nativePath)), path.join(nativePath, path.basename(nativePath)));
    fsutils.createSoftLink(path.join(iosLinkPath, 'Info.plist'), path.join(nativePath, path.basename(nativePath), 'Info.plist'));
    fsutils.createSoftLink(path.join(iosLinkPath, 'fbConfig.local.json'), path.join(nativePath, 'fbConfig.local.json'));

    //@sunxiao5，博客项目专用，因为博客项目有本地存放podspce，这个其实是有问题的
    //todo 后面还是应该有个配置文件，而不应该直接写死
    if (projectName == 'SinaBlog') {
        if (!fs.existsSync(path.join(iosLinkPath, '../PodSpecs'))) {
            fs.writeFileSync(path.join(iosLinkPath, '../PodSpecs'));
            fsutils.createSoftLink(path.join(iosLinkPath, '../PodSpecs'), path.join(nativePath, '../PodSpecs'));
        }
    }
}

function exportEnv (flutterPath) {
    execSync('export FLUTTER_APPLICATION_PATH=' + flutterPath, {cwd: flutterPath});
}

module.exports = {
    softlink
};
