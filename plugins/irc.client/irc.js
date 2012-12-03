var irc = require('irc');

module.exports = function setup(options, imports, register) {
    var name = 'c9botTEST',
        server = 'irc.freenode.net',
        channel = '#bmTest';

    
    var robot = new irc.Client(options.server, options.name, {
        channels: [options.channel],
        floodProtection: true
    });
    
    robot.robotName = options.name;
    robot.robotServer = options.server;
    robot.robotChannel = options.channel;


    robot.addListener('message', function(from, to, message) {
        takeOverTheWorld("message", robot, from, to, message);
    });
    
    robot.addListener('notice', function(from, to, message) {
        takeOverTheWorld("notice", robot, from, to, message);
    });
    
    robot.addListener('join', function(channel, nick, data) {
        takeOverTheWorld("userJoin", robot, channel, nick, data);
    });
    
    robot.addListener('part', function(channel, nick, message) {
        takeOverTheWorld("userPart", robot, channel, nick, message);
    });
    
    setInterval(function() {
        takeOverTheWorld("6m-worker", robot);
    }, 60 * 6 * 1000); //6 minits = 10 time a hour
    
    function takeOverTheWorld(a, b, c, d, e) {
        imports.control.irc.emit(a, b, c, d, e);
    }

    register(null, {
        irc: robot
    });
};
