'use strict'

let config = require('./config').getConfig()
let MongoClient = require("mongodb")
let co = require('co')
let debug = require('debug')('mongoarchive:db')

let db
exports.getConnection = co.wrap( function*() {
    if(!db) {
        db = yield MongoClient.connect('mongodb://' + config.MONGO_URL + '/' + config.db)
        debug('conection-open')
    }

    return db
})

exports.closeConnection = () => {
    if(db) {
        db.close()
        debug('conection-close')
    }
}