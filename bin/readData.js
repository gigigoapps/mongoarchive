'use strict'

let childProcess = require('child_process')
let config = require('./config').getConfig()
let debug = require('debug')('mongoarchive:readdata')

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

    debug('mongoexport-command', mongoExportCommand)
    childProcess.execSync(mongoExportCommand)

    return config.tmpExportFilePath
}
