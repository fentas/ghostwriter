/**
 * Native Messaging
 */
var EventEmitter = require('events').EventEmitter,
    extend = require('extend')

function NativeMessagingAPI(stream){
  var self = this;
  var mode = 0;
  var read_length = 0;

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
  this.processInput = processInput

  stream.on('readable', function() {
    processInput()
  })
  //stream.resume()
}
NativeMessagingAPI.prototype = Object.create(EventEmitter.prototype);

extend(NativeMessagingAPI.prototype, {
  emit: function(event, data) {
    var msg = JSON.stringify({
      event: event,
      data: data
    });
    var length = new Buffer(msg).length;
    var length_str = new Buffer(4);
    length_str.writeInt32LE(length, 0);
    process.stdout.write(length_str);
    process.stdout.write(msg);
  },
  on: function(event, cb) {
    var self = this;
    EventEmitter.prototype.on.call(this, event, function() {
      var vRet = cb.apply(this, arguments)
      if ( typeof vRet != 'undefined' ) {
        self.emit(event, vRet)
      }
    })
  }
})

module.exports = exports = NativeMessagingAPI
