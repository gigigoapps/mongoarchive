'use strict'

let config = require('./config').getConfig()
let MongoClient = require("mongodb")
let co = require('co')

let db
exports.getConnection = co.wrap( function*() {
    if(!db) {
        // mongodb://localhost:27017/forme?socketTimeoutMS=XXXX
        db = yield MongoClient.connect('mongodb://' + config.MONGO_URL + '/' + config.db + '?socketTimeoutMS=' + config.connectTimeoutMS)
        console.log('conection-open')
    }

    return db
})

exports.closeConnection = () => {
    if(db) {
        db.close()
        db = null
        console.log('conection-close')
    }
}