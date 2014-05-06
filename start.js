var ripple = require('ripple-lib');
var fs     = require('fs');

var testPathFind = function(host) {
  var port = 443;

  var remote = ripple.Remote.from_config({
    //"trace" : true,
    trusted : true,
    local_signing : true,
    servers: [
      //{ host: 's-west.ripple.com', port: 443, secure: true },
      //{ host: 's-east.ripple.com', port: 443, secure: true }
      { host: host, port: port, secure: true }
    ],
  });

  // Find paths between two accounts
  var pathFind = function(responseCallback) {
    try {
      var currency = 'USD';
      var amount = ripple.Amount.from_human('0.001 USD')
      amount.set_issuer('rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B');

      console.log('Pathfinding...');

      // Calculate path
      remote.request_path_find_create('r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
                                              'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59',
                                              amount)
      .on('success', function(res) {
        console.log('success');
        console.log(res);
        responseCallback(null);
      })
      // .on('path_find_all', function(res) {
      //   //console.log(res);
      //   console.log('path_find');
      //   responseCallback(null);
      // })
      // .on('close', function(res) {
      //   console.log('Close');
      //   console.log(res);
      //   responseCallback(null);
      // })
      .on('error', function(err) {
        console.log(err);
        responseCallback(err);
      })
      .request();
    }
    catch (e) {
      responseCallback(e);
    }
  };

  var runPathFind = function() {
    var start = Date.now();

    // Start pathfind
    pathFind(function(error) {
      var end = Date.now();
      var duration = end - start;

      var log = ''+Date().toString()+',';
      log = error ? log+'NOTOK,' : log+'OK,';
      log = log+host+':'+port+','+duration+'\n';


      console.log(log);
      if (error) console.log(error);
      fs.appendFileSync(filename, log);

      remote.disconnect();
      //return;
    });
  }

  var filename = './log.csv';

  remote.connect();

  // Connected to ripple network
  remote.on('connect', function () {
    console.log('Connected');

    runPathFind();
  });

  remote.on('disconnect', function () {
    console.log('Disconnected');
    //remote.connect();
    process.kill();
  });
}



if (process.argv && process.argv.length === 3) {
  var host = process.argv[2];

  console.log('Testing rippled host: ' + host);
  testPathFind(host);
}
else {
  console.log('Example: \nnode ' + process.argv[1] + ' \"s-west.ripple.com\"');
}
