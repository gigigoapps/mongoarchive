'use strict'

let debug = require('debug')('mongoarchive:archive')
let preprocess = require('./preprocess')
let readData = require('./readData')
let uploadData = require('./uploadData')
let removeData = require('./removeData')
let config = require('./config').getConfig()
let co = require('co')

exports.run = co.wrap(function* () {
    // get the first day of the collections
    yield preprocess.init()
    
    let collectionNextDate = preprocess.getNext()
    while(collectionNextDate) {
        debug('archive', collectionNextDate)

        let startDate = collectionNextDate.date.toDate()
        let endDate = collectionNextDate.date.add(1, 'day').toDate()
        collectionNextDate.date.subtract(1, 'day') //removing the day added to calculate endDate

        //read
        let dataReaded = readData.fromMongo(
            collectionNextDate.collection,
            collectionNextDate.field,
            startDate,
            endDate
        )

        //upload
        yield uploadData.toS3(
            dataReaded, 
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

        collectionNextDate = preprocess.getNext()
    }

    debug('finish', 'All collections archived')
})