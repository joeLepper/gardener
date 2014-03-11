var SerialPort = require('serialport').SerialPort
  , needle     = require('needle')
  , serialPort = new SerialPort('/dev/tty.usbserial-A900cfGf', {
      baudrate: 9600
    });

var msgFrag   = ''
  , msgLength = 0;

var records = 0
  , begin   = Date.now();

serialPort.on('open', function () {
  console.log('serial port open');
  serialPort.on('data', constructMessages);
});

function constructMessages (inbound) {
  var len = inbound.length;
  if (len + msgLength === 13) {
    var fullMsg = msgFrag + inbound;
    fire(JSON.parse(fullMsg.slice(0,11)));
    msgFrag = '';
    msgLength = 0;
    return;
  }
  else {
    msgFrag = inbound;
    msgLength += len;
  }
}

function fire (msg) {
  needle.post( 'http://localhost:8888/level', msg, function(err, res, body) {
   console.log( '\n Recorded ' + records++ + ' at ' + ( Date.now() - begin ) + 'ms: ' + msg.avg +
                '\n\n// * ----------------- * \\\\\n');
 });
}
