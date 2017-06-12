'use strict'

let config = require('./config').getConfig()
let MongoClient = require("mongodb")
let mongodbUri = require('mongodb-uri')
let co = require('co')

let db
let mongodbConnectionUriParsed

exports.getConnection = co.wrap( function*() {
    if(!db) {
        try {
            mongodbConnectionUriParsed = mongodbUri.parse(config.mongodbConnectionUri)
            if(!mongodbConnectionUriParsed || !mongodbConnectionUriParsed.database || !mongodbConnectionUriParsed.hosts  || !mongodbConnectionUriParsed.hosts.length) {
                throw new Error('Invalid mongodbConnectionUri')
            }

            db = yield MongoClient.connect(config.mongodbConnectionUri)
            console.log('conection-open')

        } catch (err) {
            console.error('conection-error', err)
            throw err
        }
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

exports.getUriForMongoexport = () => {
    let hosts = ''
    mongodbConnectionUriParsed.hosts.forEach( (host) => {
        if(hosts.length)
            hosts += ','

        hosts += host.host + ':' + host.port
    })

    if(mongodbConnectionUriParsed.options && mongodbConnectionUriParsed.options.replicaSet) {
        // if replicaset:  <replSetName>/<hostname1><:port>,<hostname2><:port>,<...>

        let replSetName = mongodbConnectionUriParsed.options.replicaSet
        return replSetName + '/' + hosts

    } else {
        // no replicaset:  <hostname><:port>
        return hosts
    }
}

exports.getDatabaseName = () => {
    return mongodbConnectionUriParsed.database
}