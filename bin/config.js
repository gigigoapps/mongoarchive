'use strict'

let fs = require('fs')
let utils = require('./utils')
let getUserHomePath = utils.getUserHomePath
let safeJSONParse = utils.safeJSONParse
let mkdirp = require('mkdirp')
let debug = require('debug')('mongoarchive:config')
    
exports.getConfig = () => {
    let confPath = getUserHomePath() + '/.mongoarchive/conf.json'
    
    if(fs.existsSync(confPath)) {
        let configFile
        try {
            configFile = fs.readFileSync(confPath, 'utf8')
            if(configFile && configFile.length > 0) {
                return safeJSONParse(configFile)
            } else {
                throw new Error('Config file is empty')
            }

        } catch(err) {
            debug('error-reading-config-file', err)
            debug('error-reading-config-file-path', confPath)
        }
    } else {
        debug('config-file-not-exists', 'File path: ' + confPath)
    }
}

exports.checkConfig = () => {
    let dir = getUserHomePath() + '/.mongoarchive'
    if(!fs.existsSync(dir)) {
        console.log("\n First, you must run: mongoarchive --config")
        return false
    }

    return true
}

exports.postInstall = () => {
    //create folder in user home ~/.mongoarchive/
    let dir = getUserHomePath() + '/.mongoarchive'
    if(!fs.existsSync(dir)) {
        mkdirp.sync(dir)
    }

    //cp example.conf.json to ~/.mongoarchive/conf.json
    let configData = fs.readFileSync(__dirname + '/../example.conf.json', 'utf8')
    fs.writeFileSync(dir + '/conf.json', configData, 'utf8')

    console.log('Success mongoarchive config. Now edit the ' + dir + '/conf.json file')
}