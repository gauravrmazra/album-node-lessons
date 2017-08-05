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
        var only_dirs = [];

        var iterator = (index) => {
            if (index == files.length) {
              callback(null, only_dirs);
              return;
            }

            this.fs.stat("albums/" + files[index], (err, stats) => {
              if (err) {
                callback(err);
                return;
              }

              if (stats.isDirectory()) {
                only_dirs.push({ name : files[index]});
              }
              iterator(index + 1);
            });
        };
        iterator(0);
      }
    });
  }

  getAlbumContents(album_name, callback) {
    this.fs.readdir("albums/" + album_name, (err, files) => {
      if (err) {
        callback(err);
        return;
      }

      var only_files = [];
      var path = `albums/${album_name}/`;

      var iterator = (index) => {
        if (index == files.length) {
          callback(null, { short_name: album_name, photos: only_files });
          return;
        }

        this.fs.stat(path + files[index], (err, stats) => {
          if (err) {
            callback(err);
            return;
          }
          if (stats.isFile()) {
            only_files.push({ filename: files[index], desc: files[index] });
          }
          iterator(index + 1)
        });
      };
      iterator(0);
    });
  }
}
