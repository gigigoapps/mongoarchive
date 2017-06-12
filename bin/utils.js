'use strict'

// get the user path in any system
exports.getUserHomePath = () => {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']
}

//Normal json parse within try/catch
exports.safeJSONParse = (json) => {
    try {
        return JSON.parse(json)
    } catch(err) {
        console.error('parse-json-error', err)
        return null
    }
}

let hasToStop = false
exports.setHasToStop = () => {
    hasToStop = true
}

exports.hasToStop = () => {
    return hasToStop
}