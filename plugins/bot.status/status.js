var request = require("request");
var jsdom = require('jsdom').jsdom;

module.exports = function setup(options, imports, register) {
    var robot = imports.control;

    var getStatusFromC9io = function(callback) {
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
        getStatusFromC9io(function(message) {
            robot.say(passObj, message);
        });
    };
    robot.on("c9status", robot.sayStatus);
    robot.on("status", robot.sayStatus);
    
    
    
    robot.irc.on("userJoin", function(client, channel, nick, data) {
        if (client.robotName !== nick) {
            getStatusFromC9io(function(message) {
                client.notice(nick, message);
            });
        }
    });
    register(null, {});
};