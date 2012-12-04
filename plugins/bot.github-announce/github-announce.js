var request = require("request");
var jsdom = require('jsdom').jsdom;

//PR
var prURL = "https://github.com/ajaxorg/cloud9/pulls?direction=desc&page=1&sort=created&state=open";

//Issue
var isuURL = "https://github.com/ajaxorg/cloud9/issues?direction=desc&page=1&sort=created&state=open";


module.exports = function setup(options, imports, register) {
    var robot = imports.control;
    
    if (!process.latestPRlisted) process.latestPRlisted = null;
    if (!process.latestIssuelisted) process.latestIssuelisted = null;
    
    robot.on("_worker", function(client) {
        //bmatusiak
        checkPRs(function(message) {
            if (process.latestPRlisted === null) {
                process.latestPRlisted = message;
            }
            else if (process.latestPRlisted != message) {
                process.latestPRlisted = message;
                client.notice(client.robotChannel, message);
            }
        });
        checkIssues(function(message) {
            if (process.latestIssuelisted === null) {
                process.latestIssuelisted = message;
            }
            else if (process.latestIssuelisted != message) {
                process.latestIssuelisted = message;
                client.notice(client.robotChannel, message);
            }
        });
    });
    
    
    //top pr request
    function checkPRs(callback){
        request(prURL, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var window = jsdom(body).createWindow();
                var lastest = window.document.getElementsByClassName("pulls-list")[0]._childNodes[1]._childNodes[3]._childNodes[1].innerHTML;
                
                callback("New PullRequest: "+lastest);
            }
        });
    }
    
    //top issue request
    function checkIssues(callback){
        request(isuURL, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var window = jsdom(body).createWindow();
                var lastest = window.document.getElementsByClassName("number")[0];
                var lInfo = window.document.getElementsByClassName("info-wrapper")[0];
                var issueNumber = lastest.innerHTML.replace(/(\r\n|\n|\r|\t| + )/gm,"");
                var issueTitle = lInfo._childNodes[1]._childNodes[1].innerHTML.replace(/(\r\n|\n|\r|\t| + )/gm,"");
                
                callback("New Issue: " + issueNumber + " "+ issueTitle);
            }
        });
    }
        
    register(null, {});
};