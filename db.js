var mongoose = require('mongoose');

var uri = process.env.MONGOLAB_URI || 
    "mongodb://heroku_app7760458:uien9q6mgr7vct1uat3tf6j3v@ds041367.mongolab.com:41367/heroku_app7760458";
var db = mongoose.createConnection(uri);

//Commands!!
var Command = mongoose.Schema({ 
    name: String,
    output: String
});
var Commands = db.model('commands', Command);
function setCommand($command,$data){
    getCommand($command, function(output,query) {
        if (!output) {
            var command = new Commands({ name: $command, output: $data });
            command.save();
        }
        else {
            query.output = $data;
            query.save();
        }
    });
}
function getCommand($command,callback){
    Commands.findOne({ name: $command },function(err,query){
        callback(query ? query.output : null,query);
    });
}


//Users!!
var User = mongoose.Schema({ 
    name: String,
    active: String
});
var Users = db.model('users', User);

function setUser($username,$activeStatus){
    getUser($username, function(notUser,query) {
        if (notUser) {
            var user = new Users({ name: $username, active: $activeStatus });
            user.save();
        }
        else {
            query.active = $activeStatus;
            query.save();
        }
    });
}
function getUser(username,callback){
    Users.findOne({ name: username },function(err,query){
        callback(!query ? "notfound" : null,query);
    });
}

module.exports = {
    commandSet:setCommand,
    commandGet:getCommand,
    userSet:setUser,
    userGet:getUser
    
};

/*
getCommand("test",function(output){
    if(!output){
        console.log("command not found!");
    }else
    console.log(output);
});
newCommand("commandStr","OuputThisWhenLookedUp!");
*/
