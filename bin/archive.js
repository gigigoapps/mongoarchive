'use strict'

let debug = require('debug')('mongoarchive:archive')
let preprocess = require('./preprocess')
let readData = require('./readData')
let uploadData = require('./uploadData')
let removeData = require('./removeData')
let config = require('./config').getConfig()
let mongoDB = require('./db')
let co = require('co')
let processControl = require('./processControl')
let utils = require('./utils')


let lockFile = '/tmp/mongoarchive-archive.lock'
exports.lockFile = lockFile


/**
 * Archive process
 */
exports.run = co.wrap(function* () {
    // process control
    if(processControl.isRunning(lockFile)) {
        debug('already-running')
        return 
    }
    processControl.setRunningLockFile(lockFile)


    // get the first day of the collections
    yield preprocess.init()
    
    let collectionNextDate = preprocess.getNext()
    while(collectionNextDate) {
        debug('archive', collectionNextDate)

        let startDate = collectionNextDate.date.toDate()
        let endDate = collectionNextDate.date.add(1, 'day').toDate()
        collectionNextDate.date.subtract(1, 'day') //removing the day added to calculate endDate

        //read
        let dataFilePath = readData.fromMongo(
            collectionNextDate.collection,
            collectionNextDate.field,
            startDate,
            endDate
        )

        //upload
        yield uploadData.toS3(
            dataFilePath, 
            collectionNextDate.collection,
            collectionNextDate.date
        )

        //remove
        if(config.remove) {
            yield removeData.fromMongo(
                collectionNextDate.collection,
                collectionNextDate.field,
                startDate,
                endDate
            )
        }

        if(utils.hasToStop()) {
            mongoDB.closeConnection()
            processControl.removeRunningLockFile(lockFile)
            debug('clean-stop')

            process.exit(101)
        } else {
            collectionNextDate = preprocess.getNext()
        }
        

    }

    processControl.removeRunningLockFile(lockFile)

    return

})