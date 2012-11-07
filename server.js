var irc = require('irc');

var robotBrain = __dirname + "/control.js";

var robotName = 'c9bot',
    robotServer = 'irc.freenode.net',
	robotChannel = '#cloud9ide';
	
var robot = new irc.Client(robotServer,robotName,{	channels: [robotChannel] , floodProtection: true});
robot.robotName = robotName,robot.robotServer=robotServer,robot.robotChannel=robotChannel;

robot.addListener('message', function (from, to, message) {
    takeOverTheWorld("message",robot,from,to,message);
});

robot.addListener('notice', function (from, to, message) {
    takeOverTheWorld("notice",robot,from,to,message);
});

robot.addListener('join', function (channel, nick, data) {
    takeOverTheWorld("userJoin",robot,channel, nick,data);
});

robot.addListener('part', function (channel, nick, message) {
    takeOverTheWorld("userPart",robot,channel, nick,message);
});

setInterval(function(){
    takeOverTheWorld("6m-worker",robot);
},60 * 6 * 1000);//6 minits = 10 time a hour

function takeOverTheWorld(a,b,c,d,e){
    require(robotBrain).emit(a,b,c,d,e);
    delete require.cache[robotBrain];
}