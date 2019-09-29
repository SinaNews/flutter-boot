# https://github.com/CocoaPods/Core/blob/master/lib/cocoapods-core/podfile/dsl.rb#L256

$REGISTERED_DEPENDENCIES = Hash.new
$REGISTER_MODE = true

fbFlutterPath = ''
fbJsonPath = File.join(File.dirname(__FILE__), 'fbconfig.local.json')
if File.exists? fbJsonPath
    fbjson = File.read(fbJsonPath)
    fbConfig = JSON.parse(fbjson)
    if fbConfig['flutterPath']
        fbFlutterPath = fbConfig['flutterPath']
    end
end
if fbFlutterPath == nil
    p "fbconfig.local.json's path is nil"
    exit(-1)
end

flutter_application_path = fbFlutterPath
eval(File.read(File.join(flutter_application_path, '.ios', 'Flutter', 'podhelper.rb')), binding)

$g_flutter_path = flutter_application_path

$REGISTER_MODE = false
