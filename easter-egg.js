var ytdl = require('ytdl-core');

var YOUTUBE_OPTIONS = {
  filter: function (format) {
    return format.container === 'mp4' && format.audioBitrate && format.resolution;
  },
  quality: 'lowest'
};

module.exports = function (app) {
  //TODO: Use 3gp if iPhone.
  app.get('/e/stream/:id', function (req, res) {
    var video = ytdl('http://www.youtube.com/watch?v=' + req.params.id, YOUTUBE_OPTIONS);
    res.type('video/mp4');
    video.pipe(res);
  });
}