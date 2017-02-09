'use strict'

let fs = require('fs')
let mkdirp = require('mkdirp')
let utils = require('./bin/utils')
let getUserHomePath = utils.getUserHomePath

//create folder in user home ~/.mongoarchive/
let dir = getUserHomePath() + '/.mongoarchive'
if(!fs.existsSync(dir)) {
    mkdirp.sync(dir)
}

//cp example.conf.json to ~/.mongoarchive/conf.json
let configData = fs.readFileSync('./example.conf.json', 'utf8')
fs.writeFileSync(dir + '/conf.json', configData, 'utf8')

// notify user
console.log("\n mongoarchive has been installed successfully in your system. Now:")
console.log("\n     - Edit: " + dir + "/conf.json (this file has the default configurations. Sure, you want your own )")
console.log("\n     - if you haven't installed pm2 yet: npm install pm2 -g")
console.log("\n     - Run:  mongoarchive --start")
console.log("\n\n")

//end post install
process.exit()