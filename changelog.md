### 0.2.0
- BREAKING CHANGE: new structure in configuration file: MONGO_URL, db and connectTimeoutMS replaced by mongodbConnectionUri
- New mongodbConnectionUri parameter: use the mongo connection what you want https://docs.mongodb.com/manual/reference/connection-string/
- Replica set support: you can use a replica set uri in the new mongodbConnectionUri parameter

### 0.1.0
- BREAKING CHANGE: new structure in configuration file
- Fix bug: Not works well with *remove = false*
- Add remove option for each collection
- Add S3 bucket configuration for each collection
- Info logs not appears in pm2 errors

### 0.0.18
- Added forgotten files of v0.0.17

### 0.0.17
- Start & stop control improvements
- Added extension '.json' in backup files
- Clean stop: wait until the current process (read - upload - remove) finish
- Fixed restart error