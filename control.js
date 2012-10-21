var botID = "!c9status";
var users = {bmatusiak:"brad123"}
if(!process.users)
	process.users = {}
	
var AuthUsers = process.users 
var controler = {}

controler.status = function(passObj,messageElements){
	var request = require("request");
    request('http://status.c9.io/', function (error, response, body) {
  		if (!error && response.statusCode == 200) {
  		
			var jsdom = require('jsdom').jsdom;
    		var window   = jsdom(body).createWindow();
    		var message = window.document.getElementById("status-indicator").innerHTML+" ( http://status.c9.io/ )";
    		if(passObj.client.nick !== passObj.to){//Channel
				passObj.client.say(passObj.to,message)
			}else{//PM
				passObj.client.say(passObj.from,message)
			}
  		}
	})
}

module.exports.message = function(client,from,to,message){
	var passObj = {client:client,from:from,to:to,message:message}
	console.log({from:from,to:to,message:message});
	var messageElements = message.split(" ");
	//console.log(passObj);
	if(messageElements[0] === botID){
		var chatControler = controler.status
		if(chatControler){
			chatControler(passObj,messageElements)
		}
	}
}