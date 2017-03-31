'use strict'

let debug = require('debug')('mongoarchive:uploaddata')
let config = require('./config').getConfig()
let zlib = require('zlib')
let fs = require('fs')
let AWS = require("aws-sdk")
let Promise = require('bluebird')


exports.toS3 = (dataFilePath, collection, date) => {
    return new Promise((resolve, reject) => {

        // Load the stream
        let body = fs.createReadStream(dataFilePath).pipe(zlib.createGzip())

        // save in _mongoarchive/collection/year/month/file.gz
        let filePathS3 = 'mongoarchive/' + 
                        collection + '/' +
                        date.year() + '/' +
                        (date.month() + 1) + '/' +
                        collection + '_' + date.format('YYYY-MM-DD') + '.json.gz'

        // Upload the stream
        let s3obj = new AWS.S3({
            accessKeyId: config.amazonS3.key,
            secretAccessKey: config.amazonS3.secret,
            region: config.amazonS3.region,
            params: {
                Bucket: config.amazonS3.bucketName,
                Key: filePathS3,
                ACL: "bucket-owner-read"
            }
        })

        // upload config. 
        let opts = {
            queueSize: 10, // upload parts in parallel
            partSize: 1024 * 1024 * 10 //10Mb
        }

        // Upload
        s3obj.upload({Body: body}, opts)
            .on('httpUploadProgress', function(evt) {
                debug('upload-part', evt.loaded, '/', evt.total)
            })
            .send(function(err, data) {
                if (err) {
                    debug('upload-error', err)
                    reject(err)
                }

                debug('upload-finish')
                fs.unlinkSync(dataFilePath)
                resolve(data)
            })
    })
}

