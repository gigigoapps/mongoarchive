'use strict'

let config = require('./config').getConfig()
let mongoDB = require('./db')
let co = require('co')
let moment = require('moment')
let fs = require('fs')
let utils = require('./utils')
let getUserHomePath = utils.getUserHomePath
let safeJSONParse = utils.safeJSONParse

let dataFilePath = getUserHomePath() + '/.mongoarchive/data.json'

let getPreprocessPersistentData = () => {
    if(fs.existsSync(dataFilePath)) {
        let dataFile
        try {
            dataFile = fs.readFileSync(dataFilePath, 'utf8')
            if(dataFile && dataFile.length > 0) {
                return safeJSONParse(dataFile)
            } else {
                return 
            }

        } catch(err) {
            console.error('error-reading-data-file', err)
            console.error('error-reading-data-file-path', dataFilePath)
        }
    }
}

let setPreprocessPersistentData = (key, value) => {
    let data = getPreprocessPersistentData()
    if(!data)
        data = {}

    data[key] = value
    fs.writeFileSync(dataFilePath, JSON.stringify(data), 'utf8')
}


let collectionsAndDates = []

exports.init = co.wrap(function*() {
    if(!config) {
        console.error('config file not exists')
        return 
    }

    if(!config.collections || !config.collections.length) {
        console.error('no collections in config file')
        return
    }

    // get data saved in file
    let persistentData = getPreprocessPersistentData()

    let db = yield mongoDB.getConnection()

    for(let collection of config.collections) {
        console.log('preprocessing', 'Collection: ' + collection.name)

        let field = collection.field
        let lastDate = moment().subtract(collection.offset, 'days').startOf('day')

        // get the first date from persistentData
        let firstDateProcessed
        if (persistentData && persistentData[collection.name]) {
            firstDateProcessed = moment(persistentData[collection.name], 'YYYY-MM-DD').startOf('day').add(1, 'days')
            // the date must be older than lastDate
            if(firstDateProcessed > lastDate) {
                firstDateProcessed = null
            }
        }
        
        // get the first date from db
        let firstDateDB
        let firstDateElementDB = yield db.collection(collection.name)
                            .find({[field]:{$lt : lastDate.toDate()}})
                            .sort([field,1])
                            .limit(1)
                            .toArray()

        if (
            firstDateElementDB && 
            firstDateElementDB.length && 
            firstDateElementDB[0] && 
            firstDateElementDB[0][field]
        ) {
            firstDateDB = moment(firstDateElementDB[0][field]).startOf('day')
        }
            
        // get the newest date 
        let firstDate
        if(firstDateProcessed && firstDateDB)
            firstDate = moment.max(firstDateProcessed, firstDateDB)
        else if (firstDateProcessed)
            firstDate = firstDateProcessed
        else if (firstDateDB)
            firstDate = firstDateDB            
            
        // save collection
        if (
            firstDate &&
            collection.s3 &&
            config.amazonS3 && 
            config.amazonS3[collection.s3]
        ) {
            collectionsAndDates.push({
                collection: collection.name,
                field: field,
                current: firstDate,
                last: lastDate,
                s3: config.amazonS3[collection.s3],
                remove: collection.remove
            })
        }
    }
})

exports.getNext = () => {
    if(collectionsAndDates.length && collectionsAndDates[0].current < collectionsAndDates[0].last) {
        let nextData = {
            collection: collectionsAndDates[0].collection,
            field: collectionsAndDates[0].field,
            date: collectionsAndDates[0].current.clone(),
            s3: collectionsAndDates[0].s3,
            remove: collectionsAndDates[0].remove
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

exports.saveLastDate = (collection, date) => {
    setPreprocessPersistentData(collection, date.format('YYYY-MM-DD'))
}