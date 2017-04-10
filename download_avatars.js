const request = require('request');

console.log('Welcome to the GitHub Avatar Downloader!');

var GITHUB_USER = "rselkirk";
var GITHUB_TOKEN = "0235b65ed5f8185df05efbf370be21ff319c3cbb";

function getRepoContributors(repoOwner, repoName, cb) {
 var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
 console.log(requestURL);
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});