var http = require('http'),
Smart    = require('smartjs');

http.createServer(function(request, response) {
  Smart.Router.manage(request, response);
}).listen(3000);

console.log("Server launched on localhost:3000 ...");