'use strict'

let config = require('./config').getConfig()
let mongoDB = require('./db')
let co = require('co')
let debug = require('debug')('mongoarchive:preprocess')
let moment = require('moment')

let collectionsAndDates = []

exports.init = co.wrap(function*() {
    if(!config || !config.collections || !config.collections.length) {
        return
    }

    let db = yield mongoDB.getConnection()

    for(let collection of config.collections) {
        debug('preprocessing', 'Collection: ' + collection.name)

        let lastDate = moment().subtract(collection.offset, 'days').startOf('day')
        let field = collection.field

        let firstDateElement = yield db.collection(collection.name)
                            .find({[field]:{$lt : lastDate.toDate()}})
                            .sort([field,1])
                            .limit(1)
                            .toArray()

        if(firstDateElement && firstDateElement.length && firstDateElement[0][field]) {
            collectionsAndDates.push({
                collection: collection.name,
                field: field,
                current: moment(firstDateElement[0][field]).startOf('day'),
                last: lastDate
            })
        }
    }
})

exports.getNext = () => {
    if(collectionsAndDates.length && collectionsAndDates[0].current < collectionsAndDates[0].last) {
        let nextData = {
            collection: collectionsAndDates[0].collection,
            field: collectionsAndDates[0].field,
            date: collectionsAndDates[0].current.clone()
        }

        // add 1 day to current date
        collectionsAndDates[0].current.add(1, 'day')
        // if current date is equal to last date, remove this colletion
        if( collectionsAndDates[0].current >= collectionsAndDates[0].last) {
            collectionsAndDates.splice(0, 1)
        }
        
        return nextData
    }

    return false
}