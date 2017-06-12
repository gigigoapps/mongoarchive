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