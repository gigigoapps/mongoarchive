'use strict'

let debug = require('debug')('mongoarchive:uploaddata')
let config = require('./config').getConfig()
let zlib = require('zlib')
let s3Stream = require('s3-upload-stream')
let AWS = require("aws-sdk")
let Promise = require('bluebird')


exports.toS3 = (data, collection, date) => {
    return new Promise((resolve, reject) => {
        let compress = zlib.createGzip()
        
        let s3 = new AWS.S3({
            accessKeyId: config.amazonS3.key,
            secretAccessKey: config.amazonS3.secret,
            region: config.amazonS3.region
        })

        // save in _mongoarchive/collection/year/month/file.gz
        let filePathS3 = '_mongoarchive/' + 
                        collection + '/' +
                        date.year() + '/' +
                        (date.month() + 1) + '/' +
                        collection + '_' + date.format('YYYY-MM-DD') + '.gz'

        let upload = s3Stream(s3).upload({
            Bucket: config.amazonS3.bucketName,
            Key: filePathS3,
            ACL: "bucket-owner-read"
        })

        upload.maxPartSize(5242880) // 5MB 
        upload.concurrentParts(5)

        upload.on('error', function (error) {
            debug('upload-error', error)
            reject(error)
        })
        
        upload.on('part', function () {
            debug('upload-part')
        })
        
        upload.on('uploaded', function (details) {
            debug('upload-finish')
            resolve(details)
        })
        
        // Pipe the incoming filestream through compression and up to S3 
        data.pipe(compress).pipe(upload)
    })
}

