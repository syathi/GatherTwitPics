//defined ncmb
NCMB = require('./ncmb.min.js');
console.log(NCMB)
var http = require('http');
 
http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  //response.end('Hello World\n');
}).listen(8124);
 
console.log('Server running at http://127.0.0.1:8124/');

var api_key = "c28e6cd99f48c0ffc9435fbacb3cbc19c498599244077ce3030f9d7c24410dac";
var client_key = "9e50a7b0f91df46a1c5c97e8554cdac29318ff1169242ad2d52eda5099c8a63f"
console.log("hei");

var ncmb = new NCMB(api_key, client_key);

var fs = require("fs");

fs.readFile("/unitytyann.png", function(err, data){
	if(err){throw err};
	var name = "unitytyann.png";
	ncmb.File.upload(name, data)
		.then(function(data){
			console.log("ok うpしました");
		})
		.catch(function(err){
			console.log("error うpできませんでした");
		});
});