const request = require('request');
const https = require('https');

console.log('Welcome to the GitHub Avatar Downloader!');

var GITHUB_USER = "rselkirk";
var GITHUB_TOKEN = "0235b65ed5f8185df05efbf370be21ff319c3cbb";



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

//callback function??

getRepoContributors("jquery", "jquery", function(err, data) {
  if(err) {
    console.error('ERROR:', err.message);
    return;
  }
  if(data) {
    for (i = 0; i < data.length; i++) {
      console.log(data[i].avatar_url);
    }
  }
});