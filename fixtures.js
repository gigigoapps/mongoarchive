'use strict'

let mongoDB = require('./bin/db')
let faker = require('faker')
let co = require('co')
let moment = require('moment')

let run = co.wrap(function*() {
    // create last and current date
    let currentDate = moment().subtract(7*8, 'days')
    let now = moment().startOf('day')

    // create fake data
    let fakeData = []
    while(currentDate < now) {
        fakeData.push({
            createdAt: currentDate,
            name: faker.name.findName()
        })

        currentDate.add(2, 'hours')
    }

    // remove previous data and insert fake data
    let db = yield mongoDB.getConnection()
    yield db.collection('mongoarchive').remove({})
    yield db.collection('mongoarchive').insertMany(fakeData)
    
    console.log('Fixtures loaded')

    process.exit()
})

run()