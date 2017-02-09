'use strict'

let fs = require('fs')
let utils = require('./utils')
let getUserHomePath = utils.getUserHomePath
let safeJSONParse = utils.safeJSONParse

exports.getConfig = () => {
    let confPath = getUserHomePath() + '/.mongoarchive/conf.json'
    if(!fs.existsSync(confPath)) {
        process.stdout.write('mongoarchive is using default options. Run: "node postinstall.js" to set your options')
        confPath = './example.conf.json'
    }

    return safeJSONParse(fs.readFileSync(confPath, 'utf8'))
}

exports.checkConfig = () => {
    let dir = getUserHomePath() + '/.mongoarchive'
    if(!fs.existsSync(dir)) {
        process.stdout.write("\n mongoarchive has not been installed successfully in your system. Run postInstall.js")
        return false
    }

    dir += '/process.json'
    if(!fs.existsSync(dir)) {
        //cp the pm2 file example.process.json to ~/.mongoarchive/process.json
        let pm2Data = fs.readFileSync('./example.process.json', 'utf8')
        fs.writeFileSync(dir, pm2Data, 'utf8')
    }

    return true
}