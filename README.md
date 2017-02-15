# mongoarchive

Archive data in Amazon S3 from MongoDB. 

## Install and run
- npm install mongoarchive -g
- mongoarchive --config
- npm install pm2 -g
- Edit the file ~/.mongoarchive/conf.json and set your Amazon S3 and MongoDB security params
- mongoarchive --start

## The conf.json file
- **amazonS3**: the parameters of the Amazon S3 bucket
- **MONGO_URL**: the MongoDB URL. Without 'mongodb://'
- **db**: MongoDB database name
- **collections**: MongoDB collections to archive in Amazon S3. Each has 3 params:
- **name**: name of the collection
- **offset**: the process archives the data from the oldest to a number of days ago. The offset is this the number of days
- **field**: date collection field to control the offset param
- **connectTimeoutMS**: timeout of the MongoDB connection in miliseconds
- **remove**: Controls if you want to remove or not from MongoDB the data archived in S3 

## How it works 
Collection by collection and day by day:
- Read data from Mongo 
- Upload it to Amazon S3
- Remove it from Mongo (if you want. See the "remove" param in conf.json)

## Recover from S3 backups
- Download from Amazon S3
- Uncompress it
- mongoimport (mongoimport -h localhost:27017 -d db -c collection --file file)

## TODOS
- Tests
- When the process restart (whatever reason), if the process was stopped at the remove, we have a problem
- Automatic recover from S3 backups