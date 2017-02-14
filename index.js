#!/usr/bin/env node

'use strict'

let Debug = require('debug')
Debug.enable('mongoarchive:*')

let checkConfig = require('./bin/config').checkConfig
let postInstall = require('./bin/config').postInstall
let archive = require('./bin/archive')
let mongoDB = require('./bin/db')
let childProcess = require('child_process')
let debug = Debug('mongoarchive:index')

let argv = require('yargs')
	.usage('Usage: mongoarchive [options]')

    .help('help')
    
    .describe('verbose', 'Enables verbose mode (extended log)')
    
    .describe('config', 'Post install process')
    .describe('start', 'Start mongoarchive (pm2)')
    .describe('stop', 'Stop mongoarchive (pm2)')
    .describe('delete', 'Delete mongoarchive (pm2)')
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
        debug('starting', 'starting with pm2')
        childProcess.execSync('pm2 start mongoarchive -- --run')
    }
} else if(argv.stop) {
    //not restart
    clearInterval(interval)
        
    debug('stopping', 'stopping in pm2')
    childProcess.execSync('pm2 stop mongoarchive')

    running = false

} else if(argv.delete) {
    //not restart
    clearInterval(interval)
        
    debug('deleting', 'deleting in pm2')
    childProcess.execSync('pm2 delete mongoarchive')
    
    running = false

} else if(argv.config) {
    postInstall()
}