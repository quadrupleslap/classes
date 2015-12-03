var http = require('http');
var url = require('url');
var qs = require('querystring');

// Higher is better,
var type = { 'video/mp4': 2, 'video/webm': 1 };
var quality = { 'medium': 2, 'small': 1 };

function getVideo(videoID, cb) {
  http.get({
    host: 'www.youtube.com',
    path: '/get_video_info?video_id=' + videoID
  }, function (res) {
    var videoInfo = '';

    res.on('data', function (chunk) {
      videoInfo += chunk;
    });

    res.on('end', function () {
      var streamsStr = qs.parse(videoInfo).url_encoded_fmt_stream_map;
      if (!streamsStr)
        return cb('No videos found.');

      var streams = streamsStr.split(',').map(function (a) { return qs.parse(a); });
      if (streams.length == 0)
        return cb('No videos found.');

      var stream = streams.sort(function (a, b) {
        var aType = type[a.type] || 0;
        var bType = type[b.type] || 0;

        if (aType > bType) {
          return -1;
        } else if (aType < bType) {
          return 1;
        } else {
          var aQuality = quality[a.quality] || 0;
          var bQuality = quality[b.quality] || 0;

          return bQuality - aQuality;
        }
      })[0];

      cb(null, stream);
    });
  });
}

module.exports = function (app) {
  app.get('/stream/:id', function (req, res) {
    getVideo(req.params.id, function (err, videoInfo) {
      if (err)
        req.status(400).send(err);

      var videoURL = videoInfo.url;

      var videoURLComponents = url.parse(videoURL);
      http.get({
        host: videoURLComponents.host,
        path: videoURLComponents.path
      }, function (video) {
        res.type(videoInfo.type);

        video.on('data', function (chunk) {
          res.write(chunk);
        });

        video.on('end', function () {
          res.end();
        });
      });
    });
  });

  app.get('/redirect/:id', function (req, res) {
    getVideo(req.params.id, function (err, videoInfo) {
      if (err)
        req.status(400).send(err);

      res.redirect(videoInfo.url);
    });
  });
}