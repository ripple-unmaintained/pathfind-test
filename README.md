## How to use:
`npm install`

`node start.js "s-west.ripple.com"`


## What it does:

1. Connects to rippled host
2. Requests pathfind
3. Logs pathfind response time and success/failed response in the ./log.csv file
4. Disconnects from rippled host and repeats at step #1

## Log file format ./log.csv

Date,('OK'|'NOTOK'),Host:Port,Duration_In_Milliseconds
