'use strict';
module.exports = class AlbumService {
  constructor(fs) {
    this.fs = fs;
  }

  listAlbums(callback) {
    this.fs.readdir("albums", 'r', (err, files) => {
      if (err) {
        callback(err);
      }
      else {
        callback(null, files);
      }
    });
  }
}
