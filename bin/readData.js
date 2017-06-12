'use strict'

let childProcess = require('child_process')
let config = require('./config').getConfig()

exports.fromMongo = (collection, field, startDate, endDate) => {
    let mongoExportCommand = 
        'mongoexport' +
        ' -h ' + config.MONGO_URL + 
        ' -d ' + config.db + 
        ' -c ' + collection +
        ' -o ' + config.tmpExportFilePath
    
    if(startDate && endDate) {
        let query = "{" + field + ": {$gte: new Date(" + startDate.valueOf() + "), $lt: new Date(" + endDate.valueOf() + ")}}"
        mongoExportCommand += " -q '" + query + "'"
    }

    console.log('mongoexport-command', mongoExportCommand)
    childProcess.execSync(mongoExportCommand)

    return config.tmpExportFilePath
}
