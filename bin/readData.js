'use strict'

let childProcess = require('child_process')
let db = require('./db')
let config = require('./config').getConfig()

exports.fromMongo = (collection, field, startDate, endDate) => {

    let mongoExportCommand = 
        'mongoexport' +
        ' -h ' + db.getUriForMongoexport() + 
        ' -d ' + db.getDatabaseName() + 
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
