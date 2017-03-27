'use strict'

let childProcess = require('child_process')
let config = require('./config').getConfig()
let debug = require('debug')('mongoarchive:readdata')

exports.fromMongo = (collection, field, startDate, endDate) => {
    let tmpExportFilePath = '/tmp/mongoArchiveExport'

    let mongoExportCommand = 
        'mongoexport' +
        ' -h ' + config.MONGO_URL + 
        ' -d ' + config.db + 
        ' -c ' + collection +
        ' -o ' + tmpExportFilePath
    
    if(startDate && endDate) {
        let query = "{" + field + ": {$gte: new Date(" + startDate.valueOf() + "), $lt: new Date(" + endDate.valueOf() + ")}}"
        mongoExportCommand += " -q '" + query + "'"
    }

    debug('mongoexport-command', mongoExportCommand)
    childProcess.execSync(mongoExportCommand)

    return tmpExportFilePath
}
