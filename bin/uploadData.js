'use strict'

let debug = require('debug')('mongoarchive:uploaddata')
let zlib = require('zlib')
let fs = require('fs')
let AWS = require("aws-sdk")
let Promise = require('bluebird')


exports.toS3 = (dataFilePath, collection, date, s3params) => {
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
            accessKeyId: s3params.key,
            secretAccessKey: s3params.secret,
            region: s3params.region,
            params: {
                Bucket: s3params.bucketName,
                Key: filePathS3,
                ACL: "private"
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

