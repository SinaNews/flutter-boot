const isEmpty = require('./isEmpty')
const path = require('path')
const fs = require('fs')
const assert = require('assert')
const log = require('../log')

function flutterRecorderPath () {
  return path.join(process.env.FB_DIR, '.last_flutter_module')
}

function recordFlutterModule (flutterModulePath) {
  assert(!isEmpty(flutterModulePath), 'flutter module路径不能为空')
  log.silly('[create]', 'flutter module recorded')
  const selfRoot = process.env.FB_DIR
  try {
    fs.writeFileSync(flutterRecorderPath(), flutterModulePath)
    return true
  } catch (e) {
    return false
  }
}

function existedFlutterModule () {
  const selfRoot = process.env.FB_DIR
  const modulePath = flutterRecorderPath()
  if (fs.existsSync(modulePath)) {
    return fs.readFileSync(modulePath, 'utf-8')
  } else {
    return undefined
  }
}

function cleanFlutterRecord () {
  const selfRoot = process.env.FB_DIR
  const modulePath = flutterRecorderPath()
  fs.unlink(modulePath, () => {})
}

module.exports = {
  // @sunxiao5，不缓存flutter module路径，以避免有多个flutter module项目的时候出现冲突
  // recordFlutterModule,
  existedFlutterModule,
  flutterRecorderPath,
  cleanFlutterRecord
}
