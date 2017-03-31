'use strict'

let debug = require('debug')('mongoarchive:lalala')
let fs = require('fs')

exports.isRunning = (lockFile) => {
    debug(lockFile)
    if(fs.existsSync(lockFile))
        return true
    else
        return false
}

exports.setRunningLockFile = (lockFile) => {
    if(!fs.existsSync(lockFile)) {
        fs.writeFileSync(lockFile, '')
    }
}

exports.removeRunningLockFile = (lockFile) => {
    if(fs.existsSync(lockFile)) {
        fs.unlinkSync(lockFile)
    }
}