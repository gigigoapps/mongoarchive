'use strict'

let getUserHomePath = require('./utils').getUserHomePath

let dir = getUserHomePath() + '/.mongoarchive'

// notify user
console.log("\n mongoarchive has been installed successfully in your system. Now:")
console.log("\n     - Run: mongoarchive --config")
console.log("\n     - Edit: " + dir + "/conf.json (this file has the default configurations. Sure, you want your own )")
console.log("\n     - if you haven't installed pm2 yet: npm install pm2 -g")
console.log("\n     - Run:  mongoarchive --start")
console.log("\n\n")

//end post install
process.exit()