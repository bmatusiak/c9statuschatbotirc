var request = require("request");
var jsdom = require('jsdom').jsdom;

if(!process.users)
	process.users = {};
	
var controller = {};

// Generic send method
controller.say = function(passObj, message) {
    // Channel
    if(passObj.client.nick !== passObj.to) {
		passObj.client.say(passObj.to,message);
    } else { // PM
		passObj.client.say(passObj.from,message);
    }
};

controller.status = function(passObj, messageElements) {
    request('http://status.c9.io/', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var window  = jsdom(body).createWindow();
            var message = window.document.getElementById("status-indicator").innerHTML + " ( http://status.c9.io/ )";
            controller.say(passObj, message);
        }
	});
};

controller.search = function(passObj, messageSplit) {
    if (messageSplit.length <= 1)
        return;

    var searchPhrase, searchClosed = false;
    if (messageSplit[1] === "--closed") {
        messageSplit.shift(); messageSplit.shift();
        searchPhrase = messageSplit.join("+");
        searchClosed = true;
    }
    else {
        messageSplit.shift();
        searchPhrase = messageSplit.join("+");
    }

    var reqUrl = "https://github.com/ajaxorg/cloud9/issues/search?q=" + searchPhrase +
        (searchClosed === false ? "&state=open" : "");
    request(reqUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var window  = jsdom(body).createWindow();
            var issueNumbers = window.document.getElementsByClassName("number");
            var retMessage = "Found " + issueNumbers.length + " issue" +
                (issueNumbers.length === 1 ? "" : "s") + (issueNumbers.length === 0 ? "." : ":" );
            controller.say(passObj, retMessage);
            var issueTitles = window.document.getElementsByClassName("title");
            for (var i = 0; i < issueNumbers.length; i++) {
                controller.say(passObj, issueTitles[i].textContent + " https://github.com/ajaxorg/cloud9/issues/" +
                    issueNumbers[i].textContent.substr(1));
            }
        }
	});
};

controller.issue = function(passObj, messageElements) {
    controller.say(passObj, "https://github.com/ajaxorg/cloud9/issues/new");
};

module.exports.message = function(client, from, to, message){
	var passObj = {client:client,from:from,to:to,message:message};
	console.log({from:from,to:to,message:message});
	var messageElements = message.split(" ");
    switch(messageElements[0]) {
        case "!c9status":
        case "!status":
            controller.status(passObj, messageElements);
            break;
        case "!issue":
            controller.issue(passObj, messageElements);
            break;
        case "!search":
            controller.search(passObj, messageElements, message);
            break;
    }
};