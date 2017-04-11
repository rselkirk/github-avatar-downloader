const request = require('request');
const https = require('https');
const fs = require('fs');
const key = require('./gitkey');


if (process.argv[2] === undefined || process.argv[3] === undefined) {
  console.log("Must supply repoOwner and repoName!");
  return;
}


console.log('Welcome to the GitHub Avatar Downloader!');

var repoOwner = process.argv[2];
var repoName = process.argv[3];

var GITHUB_USER = key.username;
var GITHUB_TOKEN = key.key;


function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  var options ={
    headers: {
      'User-agent': 'rselkirk'
    },
    uri: requestURL
    };
  request
    .get(options)
    .on('error', function (err) {
      cb(err);
    })
    .on('response', function (response) {
      console.log('Response Status Message: ', response.statusMessage, response.statusCode);

      response.setEncoding('utf8');
      var body = "";

      response.on('data', chunk => {
        body += chunk;
      });

      response.on('end', () => {
        var data;
        try {
          data = JSON.parse(body)
        }
        catch(ex) {
          return cb(ex);
        }
        if(response.statusCode !== 200) {
          return cb(new Error(data.message));
        }
        //console.log('DONE');
        cb(null, data);
      });
    })
}


getRepoContributors("jquery", "jquery", function(err, data) {
  if(err) {
    console.error('ERROR:', err.message);
    return;
  }
  if(data) {
    var avatars = [];
    for (var i = 0; i < data.length; i++) {
      avatars.push(data[i].avatar_url);
    }
    downloadImagesByURL(avatars, './avatars/');
  }
});

function downloadImagesByURL(avatars, filePath) {
  var options;
  var file;
  var url;
  for(var j = 0; j < avatars.length; j++) {
    file = filePath + "avatar-" + j + ".jpg";
    url = avatars[j];
    options = {
      headers: {
        'User-agent': 'rselkirk'
      },
      uri: url
    };

    request
      .get(options)
      .on('error', function (err) {
        console.log('error');
      })
      .on('response', function (response) {
        console.log('Response Status - Image downloaded -'+ response.statusMessage);
      })
      .pipe(fs.createWriteStream(file));
      }
}