var http = require("http");
var fs = require("fs");
var AlbumService = require("./service/AlbumService.js");
const albumService = new AlbumService(fs);
const app_port = 8080;

function handle_incoming_requests(req, res) {
  console.log("INCOMING REQUEST: METHOD: " + req.method + " and URL: " + req.url);
  albumService.listAlbums((err, albums) => {
    if (err) {
      res.writeHead(200, {"Content-Type" : "application/json"});
      res.end(JSON.stringify({ error: { code : "not able to read albums", message : err.message }, data: {}}));
    }
    else {
      res.writeHead(200, {"Content-Type" : "application/json"});
      var output = {error: null, data: {albums : albums}};
      res.end(JSON.stringify(output));
    }
  });
}

var json_server = http.createServer(handle_incoming_requests);
json_server.listen(app_port);
console.log(`Server started at port: ${app_port}`);
