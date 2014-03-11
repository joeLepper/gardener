var sockets;

exports.init = init;

function init (io) {
  sockets = io.sockets;
  sockets.on('connection', function (socket) {
    console.log('connected');
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
  });
}