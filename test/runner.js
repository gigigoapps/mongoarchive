'use strict'

const Mocha = require('mocha')
const mocha = new Mocha({})

// Test suites
mocha.addFile(__dirname + '/example.js')

mocha.run()
    .on('end', function() {
        process.exit()
    })