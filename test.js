/* 
    TESTS samples and examples - bmatusiak -this goes in control.js for testing user checking functions
*/

// example simple test to echo what ever you type back to a PM
// !echo TEST    >>   bot>TEST
var echo = function(passObj,messageElements){
    messageElements.shift();
    passObj.client.say(passObj.from,messageElements.join(" "));    
};
controler.on("echo",echo);

// example simple test to check for ircUser(logged in) and in admin list
// !whois  
var whois = function(passObj,messageElements){
    checkUser(passObj,function(user_error){
        if(user_error){
            //not logged to IRC server with nickserv
            passObj.client.notice(passObj.from, user_error);
        }else{
            checkAdmin(passObj.from,function(admin_error){
                if(!admin_error){
                    //is in admin list
                    passObj.client.notice(passObj.from, "yay");
                }else{
                    //not in admin list
                    passObj.client.notice(passObj.from, admin_error);
                }
            });
        }
    });
};
controler.on("whois", whois);

