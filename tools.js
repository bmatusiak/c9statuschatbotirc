function Emitter(){
    var self = this;
    self._events = {};
    this.on = function(event, fct){
        self._events[event] = self._events[event]    || [];
        self._events[event].push(fct);
    };
    this.rm = function(event, fct){
        if( event in self._events === false )	return;
        self._events[event].splice(self._events[event].indexOf(fct), 1);
    };
    this.emit = function(event /*, args */){
        if( event in self._events === false )    return;
        for(var i = 0; i < self._events[event].length; i++){
            self._events[event][i].apply(self, Array.prototype.slice.call(arguments, 1));
        }
    };
    this.has = function(event /*, args */){
        if( event in self._events === false )    return false;
        return (self._events[event].length >= 1 ? true : false);
    };
}

module.exports.Emitter = Emitter;
