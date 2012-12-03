/*
    Simple User System  - bmatusiak
*/
module.exports = function setup(options, imports, register) {
    var robot = imports.control;
    var db  = imports.db;
    
    robot.userCommand = function(passObj, message) {
        users.checkUser(passObj, function(notUser, regNick) {
            if (!notUser) {
                users.checkAdmin(regNick, function(notAdmin) {
                    if (!notAdmin) {
                        message.shift();
                        var command = message[0];
                        if (command == "add") {
                            db.userSet(message[1], "true");
                            robot.say(passObj, "Added User: " + message[1]);
                        }
                        else if (command == "rm") {
                            db.userSet(message[1], "false");
                            robot.say(passObj, "Removed User: " + message[1]);
                        }
                        else {
                            robot.say(passObj, "my !user commands are 'add' and 'rm'  '!user add NickServAccountName' do '/nickserv ACC nick *' and account name sould be after the '->' and before the AAC");
                        }
                    }
                    else {
                        robot.say(passObj, "Not In Admin List!");
                    }
                });
            }
            else {
                robot.say(passObj, "Log in with Nickserv First to add/rm users");
            }
        });
    };
    robot.on("user", robot.userCommand);
    
    if (!process.userCheck_events) process.userCheck_events = new imports.emitter();
    var userCheck_events = process.userCheck_events;

    
    imports.control.irc.on("notice", function(client, from, to, message) {
        var passObj = {
            client: client,
            from: from,
            to: to,
            message: message,
            messageSplit: message.split(" ")
        };
        if (from) from = from.toLowerCase();
        if (from === "nickserv") {
            if (passObj.messageSplit[3] == "ACC") {
                //passObj.messageSplit.shift();
                userCheck_events.emit(passObj.messageSplit[0], passObj.messageSplit[2] == "*" ? false : passObj.messageSplit[2]);
            }
        }
    });
    var users = {
        checkUser: function(passObj, callback) {
            userCheck_events.on(passObj.from, function(ircServerUser) {
                if (ircServerUser) {
                    callback(null, ircServerUser);
                }
                else {
                    callback("Login with NickServ required");
                }
                userCheck_events.rm(passObj.from, this);
            });
            passObj.client.whois(passObj.from, function(data) {
                passObj.client.say("nickserv", "ACC " + passObj.from + " *");
            });
        },
        checkAdmin: function(name, callback) {
            db.userGet(name, function(err, user) {
                if (!err) {
                    if (user && user.active && user.active == "true") callback(null);
                    else callback("Not a Admin");
                }
                else callback("Not a Admin");
            });
        }
    };
    register(null, {users:users});
};
