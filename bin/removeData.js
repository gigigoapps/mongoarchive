'use strict'

let mongoDB = require('./db')
let co = require('co')

exports.fromMongo = co.wrap( function*(collection, field, startDate, endDate) {
    let db = yield mongoDB.getConnection()

    console.log('removing', collection + " - " + startDate + " - " + endDate)

    yield db
        .collection(collection)
        .remove({
            [field]: {
                $gte: startDate,
                $lt: endDate
            }
        })
})