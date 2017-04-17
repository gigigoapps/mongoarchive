# mongoarchive

Archive data in Amazon S3 from MongoDB. 

**IMPORTANT: This is not production version. We are working on it, looking for the best solution, so it is an unstable version**

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
* **MONGO_URL**: the MongoDB URL. Without 'mongodb://'
* **db**: MongoDB database name
* **collections**: MongoDB collections to archive in Amazon S3. Each has 3 params:
    * **name**: name of the collection
    * **offset**: the process archives the data from the oldest to a number of days ago. The offset is this the number of days
    * **field**: date collection field to control the offset param
    * **s3**: key of the amazonS3 object with the configuration the Amazon S3 bucket to use
    * **remove**: control if you want to remove or not from MongoDB the data archived in S3 from this collection
* **connectTimeoutMS**: timeout of the MongoDB connection in miliseconds
* **tmpExportFilePath**: File where mongoexport data is saved temporally

## How it works 
Collection by collection and day by day:
- Read data from Mongo 
- Upload it to Amazon S3
- Remove it from Mongo (if you want. See the "remove" param in conf.json)

## Recover from S3 backups
- Download from Amazon S3
- Uncompress it
- mongoimport (mongoimport -h localhost:27017 -d db -c collection --file file)

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
