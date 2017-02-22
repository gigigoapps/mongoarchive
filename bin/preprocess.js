'use strict'

let config = require('./config').getConfig()
let mongoDB = require('./db')
let co = require('co')
let debug = require('debug')('mongoarchive:preprocess')
let moment = require('moment')

exports.fromMongo = co.wrap(function*() {
    if(!config || !config.collections || config.collections.length == 0) {
        return
    }

    let db = yield mongoDB.getConnection()
    
    let collectionsDates = []
    
    for(let collection of config.collections) {
        debug('preprocessing', 'Collection: ' + collection.name)

        let delayDate = moment().subtract(collection.offset, 'days').toDate()
        let field = collection.field
        
        let dates = yield db.collection(collection.name)
            .aggregate([
                {
                    $match: {
                        [field]:  {$lt : delayDate}
                    }
                },
                {
                    $group: {_id: {$substr: [ "$" + field, 0, 10]}}
                },
                { 
                    $sort : {_id : 1}
                }
            ])
            .toArray()
        
        if(dates && dates.length > 0) {
            //save dates
            collectionsDates.push({
                name: collection.name,
                dates: dates.map(x => x._id),
                field
            })
        }
        
    }

    return collectionsDates
})