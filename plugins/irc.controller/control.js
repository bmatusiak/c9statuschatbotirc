module.exports = function setup(options, imports, register) {
    options.botprefix;// "!"
    //imports.tools;
    //imports.db;
        
    var control = new imports.emitter();
    
    // Generic send method
    control.say = function(passObj, message) {
        // Channel
        if (passObj.client.nick !== passObj.to) {
            passObj.client.say(passObj.to, message);
        }
        else { // PM
            passObj.client.say(passObj.from, message);
        }
    };
    
    
    control.irc = new imports.emitter();
    
    control.irc.on("message", function(client, from, to, message) {
        var passObj = {
            client: client,
            from: from,
            to: to,
            message: message,
            messageSplit: message.split(" ")
        };
        if (passObj.messageSplit[0].charAt(0) === options.botprefix && passObj.messageSplit[0].charAt(1) != "_") {
            passObj.messageSplit[0] = passObj.messageSplit[0].substr(1);
            if (control.has(passObj.messageSplit[0])) control.emit(passObj.messageSplit[0], passObj, passObj.messageSplit);
            else control.KB(passObj.messageSplit[0], passObj);
        }
    });
    
    
    
    control.irc.on("userJoin", function(client, channel, nick, data) {
        if (client.robotName == nick) { //Bot Joined a chanel
            if (!process.firstJoin) {
                process.firstJoin = true;
                control.emit("_worker", client);
                console.log("user", nick, "join channel", channel, "data:", data);
            }
        }
    });
    
    control.irc.on("userPart", function(client, channel, nick, message) {
        //console.log("user",nick,"part channel",channel,"message:",message)
    });
    
    control.irc.on("6m-worker", function(client) {
        control.emit("_worker", client);
    });
    
    register(null, {
        control: control
    });
};

