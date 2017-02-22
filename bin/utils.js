'use strict'

let debug = require('debug')('mongoarchive:db')

// get the user path in any system
exports.getUserHomePath = () => {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']
}

//Normal json parse within try/catch
exports.safeJSONParse = (json) => {
    try {
        return JSON.parse(json)
    } catch(err) {
        debug('parse-json-error', err)
        return null
    }
}
