var botID = "!";//prefix
var request = require("request");
var jsdom = require('jsdom').jsdom;
var tools = require(__dirname+"/tools.js");

var robot = new tools.Emitter();

robot.sayVersion = function(passObj) {
    robot.say(passObj, "c9bot version 0.3");
};
robot.on("botVersion",robot.sayVersion);

// Generic send method
robot.say = function(passObj, message) {
    // Channel
    if(passObj.client.nick !== passObj.to) {
        passObj.client.say(passObj.to,message);
    } else { // PM
        passObj.client.say(passObj.from,message);
    }
};

//Auto Status notice announce
if(!process.currentStatus)
    process.currentStatus = null;
    
robot.on("_worker",function(client){
    //bmatusiak
    getStatusFromC9io(function(message){
        if(process.currentStatus === null){
            process.currentStatus = message;
        }else 
        if(process.currentStatus != message){
            process.currentStatus = message;
            client.notice(client.robotChannel,message);
        }
    });
});

var getStatusFromC9io = function(callback){
    //bmatusiak
    request('http://status.c9.io/', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var window = jsdom(body).createWindow();
            var status_indicator = window.document.getElementById("status-indicator");
            callback(status_indicator.innerHTML + " ( http://status.c9.io/ )");
        }
    });
};

//!status and !c9status chat command
robot.sayStatus = function(passObj) {
    //bmatusiak
    getStatusFromC9io(function(message){
        robot.say(passObj, message);
    });
};
robot.on("c9status",robot.sayStatus);
robot.on("status",robot.sayStatus);


robot.doSearch = function(passObj, messageSplit) {
    //mattpardee - c9.io
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
robot.on("search",robot.doSearch);

robot.sayIssue = function(passObj, messageSplit) {
    //mattpardee - c9.io
    robot.say(passObj, "https://github.com/ajaxorg/cloud9/issues/new");
};
robot.on("issue",robot.sayIssue);

robot.sayNVMmessage = function(passObj, messageSplit) {
    //bmatusiak
    robot.say(passObj, 'Node Version Manager = "nvm use v0.6" || "nvm use v0.8" = Switch node versions';
}
robot.on("nvm",robot.sayIssue);

/*
    Simple User System  - bmatusiak
*/
var adminList = { "bmatusiak" : true };//TODO USE READY ONLY MONGOOSE URL 

if(!process.userCheck_events)
    process.userCheck_events = new tools.Emitter();
var userCheck_events = process.userCheck_events;

var checkUser = function(passObj,callback){
    userCheck_events.on(passObj.from,function(ircServerUser){
        if(ircServerUser){
            callback(null);
        }else{
            callback("Login with NickServ required");
        }
        userCheck_events.rm(passObj.from,this);
    });
    passObj.client.whois(passObj.from,function(data){
        passObj.client.say("nickserv","status "+passObj.from);
    });
};

var checkAdmin = function(name,callback){
    name = name.toLowerCase();
    if(adminList[name]){
        callback(null);
    }else{
        callback("Not a Admin");
    }
};

/*
    Handlers
*/
module.exports = new tools.Emitter();

module.exports.on("message",function(client,from,to,message){
    var passObj = {client:client,from:from,to:to,message:message,messageSplit:message.split(" ")};
	if(passObj.messageSplit[0].charAt(0) === botID && passObj.messageSplit[0].charAt(1) != "_"){
        passObj.messageSplit[0] = passObj.messageSplit[0].substr(1);
		robot.emit(passObj.messageSplit[0],passObj,passObj.messageSplit);
	}
});

module.exports.on("notice",function(client,from,to,message){
    var passObj = {client:client,from:from,to:to,message:message,messageSplit:message.split(" ")};
    if(from) from = from.toLowerCase();
	if(from === "nickserv"){
		if(passObj.messageSplit[0].toLowerCase() == "status"){passObj.messageSplit.shift();
            userCheck_events.emit(passObj.messageSplit[0],passObj.messageSplit[1] == 3 ? true : false);
		}
	}
});

module.exports.on("userJoin",function(client,channel, nick, data){
    if(client.robotName == nick){//Bot Joined a chanel
        if(!process.firstJoin){
            process.firstJoin = true;
            robot.emit("_worker",client);
            console.log("user",nick,"join channel",channel,"data:",data);
        }
    }else{
        getStatusFromC9io(function(message){
            client.notice(nick,message);
        });
    }
});

module.exports.on("userPart",function(client,channel, nick, message){
    //console.log("user",nick,"part channel",channel,"message:",message)
});

module.exports.on("6m-worker",function(client){
    robot.emit("_worker",client);
});