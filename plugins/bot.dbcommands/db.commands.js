module.exports = function setup(options, imports, register) {
    var robot = imports.control;
    var db = imports.db;
    var users = imports.users;
    //KB system 
    robot.KB = function(command, passObj) {
        db.commandGet(command, function(output) {
            if (output && output != "false") {
                robot.say(passObj, output);
            }
        });
    };

    robot.kbADD = function(passObj, message) {
        users.checkUser(passObj, function(notUser, regNick) {
            if (!notUser) {
                users.checkAdmin(regNick, function(notAdmin) {
                    if (!notAdmin) {
                        message.shift();
                        var command = message[0];
                        message.shift();
                        var output = message.join(" ");
                        if (output) {
                            db.commandSet(command, output);
                            if (output != "false") robot.say(passObj, "Added Command: " + command);
                            else robot.say(passObj, "Removed Command: " + command);
                        }
                        else robot.say(passObj, "to and and remove command ADD = '!add CMD' RM = '!add CMD false'");
                    }
                    else {
                        robot.say(passObj, "You are NOT In Admin List!");
                    }
                });
            }
            else {
                robot.say(passObj, "Log in with Nickserv First to add commands");
            }
        });
    };
    robot.on("add", robot.kbADD);

    //KBSYSTEM END
    register(null, {});
};