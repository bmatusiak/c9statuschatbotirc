var nodegh = require("node-github");

if(!process.users)
	process.users = {};
	
var controller = {};

// Generic send method
controller.say = function(passObj, message) {
    // Channel
    if(passObj.client.nick !== passObj.to)
		passObj.client.say(passObj.to,message);
	// PM
    else
		passObj.client.say(passObj.from,message);
};

controller.status = function(passObj, messageElements) {
	var request = require("request");
    request('http://status.c9.io/', function (error, response, body) {
        if (!error && response.statusCode == 200) {
			var jsdom = require('jsdom').jsdom;
            var window  = jsdom(body).createWindow();
            var message = window.document.getElementById("status-indicator").innerHTML + " ( http://status.c9.io/ )";
            controller.say(passObj, message);
        }
	});
};

controller.search = function(passObj, message) {
    var searchPhrase = message.substr(8);
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
            controller.status(passObj, messageElements);
            break;
        case "!issue":
            controller.issue(passObj, messageElements);
            break;
        case "!search":
            controller.search(passObj, message);
            break;
    }
};