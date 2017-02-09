'use strict'

let Debug = require('debug')
Debug.enable('mongoarchive:*')

let checkConfig = require('./bin/config').checkConfig
let postInstall = require('./bin/config').postInstall
let daemon = require('./bin/daemon')
let archive = require('./bin/archive')
let mongoDB = require('./bin/db')
let debug = Debug('mongoarchive:index')

let argv = require('yargs')
	.usage('Usage: mongoarchive [options]')

    .help('help')
    
    .describe('verbose', 'Enables verbose mode (extended log)')
    
    .describe('config', 'Post install process')
    .describe('start', 'Start mongoarchive (pm2)')
    .describe('stop', 'Stop mongoarchive (pm2)')
    .describe('restart', 'Stop mongoarchive (pm2)')
    .describe('delete', 'Stop mongoarchive (pm2)')
    .describe('run', false)
    .argv


let interval
let running = false

if(argv.run && checkConfig()) {
    let run = () => {
        if(!running) {
            debug('init')
            
            running = true
            archive.run()
            .then( () => {
                mongoDB.closeConnection()
            })
            .catch((err) => {
                debug('global-error', err)
                mongoDB.closeConnection()
            })
        }
    }

    //first run
    run()
    
    //run after X seconds
    interval = setInterval(() => { 
        run() 
    }, 60 * 60 * 1000)  //1 hour

} else if(argv.start && checkConfig()) {
    if(!running) {
        daemon.start()
    }
} else if(argv.stop) {
    //not restart
    clearInterval(interval)
        
    if(running) {
        daemon.stop()
    }

    running = false
} else if(argv.config) {
    postInstall()
}