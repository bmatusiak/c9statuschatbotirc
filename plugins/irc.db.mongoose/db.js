var mongoose = require('mongoose');

module.exports = function setup(options, imports, register) {

    var db = mongoose.createConnection(options.dbURI);

    //Commands!!
    var Command = mongoose.Schema({
        name: String,
        output: String
    });
    var Commands = db.model('commands', Command);

    function setCommand($command, $data) {
        getCommand($command, function(output, query) {
            if (!output) {
                var command = new Commands({
                    name: $command,
                    output: $data
                });
                command.save();
            }
            else {
                query.output = $data;
                query.save();
            }
        });
    }

    function getCommand($command, callback) {
        Commands.findOne({
            name: $command
        }, function(err, query) {
            callback(query ? query.output : null, query);
        });
    }


    //Users!!
    var User = mongoose.Schema({
        name: String,
        active: String
    });
    var Users = db.model('users', User);

    function setUser($username, $activeStatus) {
        getUser($username, function(notUser, query) {
            if (notUser) {
                var user = new Users({
                    name: $username,
                    active: $activeStatus
                });
                user.save();
            }
            else {
                query.active = $activeStatus;
                query.save();
            }
        });
    }

    function getUser(username, callback) {
        Users.findOne({
            name: username
        }, function(err, query) {
            callback(!query ? "notfound" : null, query);
        });
    }


    register(null, {
        db: {
            commandSet: setCommand,
            commandGet: getCommand,
            userSet: setUser,
            userGet: getUser
        }
    });
};
