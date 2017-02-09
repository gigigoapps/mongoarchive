'use strict'

let fs = require('fs')
let utils = require('./utils')
let getUserHomePath = utils.getUserHomePath
let safeJSONParse = utils.safeJSONParse
let mkdirp = require('mkdirp')
    
exports.getConfig = () => {
    let confPath = getUserHomePath() + '/.mongoarchive/conf.json'
    if(fs.existsSync(confPath)) {
        return safeJSONParse(fs.readFileSync(confPath, 'utf8'))
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

    //cp the pm2 file example.process.json to ~/.mongoarchive/process.json
    let pm2Data = fs.readFileSync(__dirname + '/../example.process.json', 'utf8')
    fs.writeFileSync(dir + '/process.json', pm2Data, 'utf8')

    console.log('Success mongoarchive config. Now edit the ' + dir + '/conf.json file')
}