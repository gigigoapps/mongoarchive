'use strict'

let debug = require('debug')('mongoarchive:archive')
let preprocess = require('./preprocess')
let moment = require('moment')
let readData = require('./readData')
let uploadData = require('./uploadData')
let removeData = require('./removeData')
let config = require('./config').getConfig()
let co = require('co')

exports.run = co.wrap(function* () {
    // read collection and dates to process
    let collectionsDates = yield preprocess.fromMongo()

    if(!collectionsDates){
        return
    }

    for(let singleCollectionDates of collectionsDates) {
        // one collection with all dates
        for(let date of singleCollectionDates.dates) {
            // one date
            date = moment(date)
            let startDate = date.startOf('day').toDate()
            let endDate = date.add(1, 'day').startOf('day').toDate()
            date.subtract(1, 'day') //removing the day added to calculate endDate

            //read
            let dataReaded = readData.fromMongoExport(
                singleCollectionDates.name,
                singleCollectionDates.field,
                startDate,
                endDate
            )

            //upload
            yield uploadData.toS3(dataReaded, singleCollectionDates.name, date)

            //remove
            if(config.remove) {
                yield removeData.fromMongo(
                    singleCollectionDates.name,
                    singleCollectionDates.field,
                    startDate,
                    endDate
                )
            }
        }
    }

    debug('finish', 'All collections archived')
})