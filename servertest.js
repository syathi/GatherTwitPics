var html = require('fs').readFileSync('test.html');
var http = require('http').createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(html);
});
var io = require('socket.io')(http);
http.listen(3000);
io.on('connection', function(socket) {
  socket.on('msg', function(data) {
    io.emit('msg', data);
  });
});
/*
*---------------------------------------------------------------
*
*以下、filestreamを用いてhtmlを外部ファイルから読み込んでブラウザに表示するための練習コード
*
*----------------------------------------------------------------
*/
// var http = require('http');
// var fs = require('fs');
// var server = http.createServer();
// server.on('request', function(req, res) {
//     fs.readFile('./test.html', 'utf-8', function(err, data) {
//         if (err) {
//             res.writeHead(404, {'Content-Type': 'text/plain'});
//             res.write('not found!');
//             return res.end();
//         }
//         res.writeHead(200, {'Content-Type': 'text/html'});
//         res.write(data);
//         res.end();
//     });
// }).listen(3000);
// console.log('server listening ...');
