'use strict'

let childProcess = require('child_process')
let utils = require('./utils')
let debug = require('debug')('mongoarchive:daemon')
let getUserHomePath = utils.getUserHomePath

let processFilePath = getUserHomePath() + '/.mongoarchive/process.json'

exports.start = () => {
    debug('starting', 'starting with pm2')
    childProcess.execSync('pm2 start ' + processFilePath)
}

exports.stop = () => {
    debug('stopping', 'stopping pm2 process')
    childProcess.execSync('pm2 stop ' + processFilePath)
}