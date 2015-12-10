var ytdl = require('ytdl-core');

var YOUTUBE_OPTIONS = {
  filter: 'video',
  quality: 'lowest'
};

module.exports = function (app) {
  app.get('/e/stream/:id', function (req, res) {
    ytdl('http://www.youtube.com/watch?v=' + req.params.id, YOUTUBE_OPTIONS)
      .pipe(res);
  });
}