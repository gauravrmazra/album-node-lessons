var http = require("http");
var fs = require("fs");
var AlbumService = require("./service/AlbumService.js");
const albumService = new AlbumService(fs);
const app_port = 8080;

function handle_incoming_requests(req, res) {
  console.log("INCOMING REQUEST: METHOD: " + req.method + " and URL: " + req.url);
  if (req.url == '/albums.json') {
    albumService.listAlbums((err, albums) => {
      if (err) {
        send_failure(res, 500, err);
      }
      else {
        send_success(res, {albums : albums});
      }
    });
  }
  else if (req.url.substr(0, 7) == '/albums' && req.url.substr(req.url.length - 5) === '.json') {
    var album_name = req.url.substr(7, req.url.length - 12);
    albumService.getAlbumContents(album_name, (err, photos) => {
      if (err) {
        send_failure(res, 500, err);
      }
      else {
        send_success(res, photos);
      }
    });
  }
  else {
    send_failure(res, 404, {code : 'No page', message : 'No page'});
  }
}

function error(code, message) {
  var err = new Error(message);
  err.code = code;
  return err;
}

function send_success(response,  data) {
  response.writeHead(200, {"Content-Type" : "application/json"});
  var output = {error: null, data: data};
  response.end(JSON.stringify(output));
}

function send_failure(response, server_code, err) {
  var code = (err.code) ? err.code : err.name;
  response.writeHead(server_code, {"Content-Type" : "application/json"});
  response.end(JSON.stringify({code : (err.code) ? err.code : err.name, message: err.message}));
}

var json_server = http.createServer(handle_incoming_requests);
json_server.listen(app_port);
console.log(`Server started at port: ${app_port}`);
