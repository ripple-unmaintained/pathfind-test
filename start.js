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
      var amount = ripple.Amount.from_human('1.2 USD')
      amount.set_issuer('rMNR9SBqBnW5xsj7p49kSCsDSXuibrcwmE');

      console.log('Pathfinding...');

      // Calculate path
      remote.request_ripple_path_find('rPJ78bFzY54HNyuNvBs6Hch9Z3F2MvMjj6',
                                              'r44SfjdwtQMpzyAML3vJkssHBiQspdMBw9',
                                              amount)
      // XXX Handle error response
      .on('success', function (response_find_path) {
        responseCallback(null);
      })
      .on('error', function (response_find_path) {
        responseCallback(response_find_path);
      })
      .request();
    }
    catch (e) {
      responseCallback(e);
    }
  };

  var file = fs.openSync('./log.txt', 'a');

  remote.connect();

  // Connected to ripple network
  remote.on('connect', function () {
    console.log('Connected');

    var start = Date.now();

    // Start pathfind
    pathFind(function(error) {
      var end = Date.now();
      var duration = end - start;

      var log = ''+start+',';
      log = error ? log+'NOTOK,' : log+'OK,';
      log = log+host+':'+port+','+duration+'\n';


      console.log(log);
      if (error) console.log(error);
      file.write(log);

      remote.disconnect();
    });

  });

  remote.on('disconnect', function () {
    console.log('Disconnected');
    remote.connect();
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
