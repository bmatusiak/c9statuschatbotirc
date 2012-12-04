var architect = require("architect");
var path = require('path');

var configPath = path.resolve(__dirname, "./config/", "ircbot");

var plugins = require(configPath);

architect.createApp(architect.resolveConfig(plugins, __dirname + "/plugins"), function(err, app) {
    if (err) {
        console.error("While starting the '%s':", configPath);
        throw err;
    }
    console.log("Started '%s'!", configPath);
});
