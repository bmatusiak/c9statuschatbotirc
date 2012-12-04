module.exports = [ 
    "./bmatusiak.tools",
    {
        packagePath: "./irc.controller",
        botprefix : "!"
    },
    {
        packagePath: "./irc.client",
        name : 'c9botTEST',
        server : 'irc.freenode.net',
        channel : '#bmTest',
        workerTimer : 60 * 3 * 1000  //3 min = 20 times a hour
    },
    {
        packagePath: "./irc.db.mongoose",
        dbURI: process.env.MONGOLAB_URI || "mongodb://c9bot_r:readonly@ds041347.mongolab.com:41347/heroku_app7760458"
    },
    "./bot.status",
    "./bot.github",
    "./bot.dbcommands",
    "./bot.users",
    "./bot.github-announce"
];
