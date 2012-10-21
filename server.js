var irc = require('irc');
var client = new irc.Client('irc.freenode.net', 'c9bot', {
    channels: ['#cloud9ide']
});

client.addListener('message', function (from, to, message) {
    var filename = __dirname + "/control.js";
	require(filename).message(client,from,to,message);
    delete require.cache[filename];
});
