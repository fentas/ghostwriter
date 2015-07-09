/**
 * Native Messaging
 */
var EventEmitter = require('events').EventEmitter;

function NativeMessagingAPI(){
  var self = this;
  var mode = 0;
  var read_length = 0;

  this.emit = function(event, data){
    var msg = JSON.stringify({
      event: event,
      data: data
    });
    var length = new Buffer(msg).length;
    var length_str = new Buffer(4);
    length_str.writeInt32LE(length, 0);
    process.stdout.write(length_str);
    process.stdout.write(msg);
  }

  function processInput(){
    if(mode == 0){
      var len = process.stdin.read(4);
      if(len != null){
        read_length = len.readInt32LE(0);
        mode = 1;
        processInput();
      }
    }else{
      var msg = process.stdin.read(read_length);
      if(msg != null){
        msg = JSON.parse(msg);
        EventEmitter.prototype.emit.call(self, msg.event, msg.data);
        mode = 0;
      }
    }
  }
  this.processInput = processInput;
}
NativeMessagingAPI.prototype = Object.create(EventEmitter.prototype);

module.exports = exports = NativeMessagingAPI
