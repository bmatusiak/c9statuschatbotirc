var request = require("request");
var jsdom = require('jsdom').jsdom;

module.exports = function setup(options, imports, register) {
    var robot = imports.control;
    
    robot.doSearch = function(passObj, messageSplit) {
        //mattpardee - c9.io
        if (messageSplit.length <= 1) return;
    
        var searchPhrase, searchClosed = false;
        if (messageSplit[1] === "--closed") {
            messageSplit.shift();
            messageSplit.shift();
            searchPhrase = messageSplit.join("+");
            searchClosed = true;
        }
        else {
            messageSplit.shift();
            searchPhrase = messageSplit.join("+");
        }
        var reqUrl = "https://github.com/ajaxorg/cloud9/issues/search?q=" + searchPhrase + (searchClosed === false ? "&state=open" : "");
        request(reqUrl, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var window = jsdom(body).createWindow();
                var issueNumbers = window.document.getElementsByClassName("number");
                var retMessage = "Found " + issueNumbers.length + " issue" + (issueNumbers.length === 1 ? "" : "s") + (issueNumbers.length === 0 ? "." : ":");
                robot.say(passObj, retMessage);
                var issueTitles = window.document.getElementsByClassName("title");
                for (var i = 0; i < issueNumbers.length; i++) {
                    robot.say(passObj, issueTitles[i].textContent + " https://github.com/ajaxorg/cloud9/issues/" + issueNumbers[i].textContent.substr(1));
                }
            }
        });
    };
    robot.on("search", robot.doSearch);
    
    robot.sayIssue = function(passObj, messageSplit) {
        //mattpardee - c9.io
        robot.say(passObj, "https://github.com/ajaxorg/cloud9/issues/new");
    };
    robot.on("issue", robot.sayIssue);
    
    register(null, {});
};