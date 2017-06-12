# mongoarchive

Archive data in Amazon S3 from MongoDB. 

**IMPORTANT: BETA version.**

## Install and run
- npm install mongoarchive -g
- (optional) change user
- mongoarchive --config
- npm install pm2 -g
- Edit the file ~/.mongoarchive/conf.json and set your Amazon S3 and MongoDB security params
- mongoarchive --start

## The conf.json file
* **amazonS3**: Object where configure the parameters of the Amazon S3 buckets. A key of this object is used in the collections property
    * **key**
    * **secret**
    * **region**
    * **bucketName** 
* **mongodbConnectionUri**: a MongoDB connection URI https://docs.mongodb.com/manual/reference/connection-string/
* **collections**: MongoDB collections to archive in Amazon S3. Each one has 5 params:
    * **name**: name of the collection
    * **offset**: the process archives the data from the oldest to a number of days ago. The offset is this number of days
    * **field**: collection date field to control the offset param (sure, you have something like 'createdAt' in you collection)
    * **s3**: key of the amazonS3 object with the configuration the Amazon S3 bucket to use
    * **remove**: control if you want to remove or not from MongoDB, the data archived in S3 from this collection
* **tmpExportFilePath**: File where mongoexport data is saved temporally

Mongoarchive creates a default configuration file for you with this data, but sure, you will need to edit it with your Amazon S3 and MongoDB security params.

## How it works 
Collection by collection and day by day:
- Read data from Mongo 
- Upload it to Amazon S3 (look for the 'mongoarchive' folder in your bucket)
- Remove it from Mongo (optional. See the "remove" param in conf.json)

## Before use it
- For now, this is a beta version. We are using it, but try first in a safe environment
- Create an index in the collection date field

## Recover from S3 backups
- Download from Amazon S3
- Uncompress it
- mongoimport (example: mongoimport -h localhost:27017 -d db -c collection --file file)

## Changelog
Releases are documented in the [changelog file](./changelog.md)

## Bugs
No bugs reported currently

## TODOS
### Confirmed
- Tests
### Requests
- Add collection fields for each collection
- Save as csv and json files
- Automatic recover from S3 backups
