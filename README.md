# mongoarchive

Archive data in Amazon S3 from MongoDB. 

## Install and run
- npm install mongoarchive -g
- npm install pm2 -g
- Edit the file ~/.mongoarchive/conf.json and set your Amazon S3 and MongoDB security params
- mongoarchive --start

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
- Test
- When the process restart (whatever reason), if the process was stopped at the remove, we have a problem
- Recover from S3 backups