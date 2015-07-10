
function NativeMessagingBridge() {
	EventEmitter.call(this);
}
inherits(NativeMessagingBridge, EventEmitter);

extend(NativeMessagingBridge.prototype, {
	connect: function(){
		var self = this;
		var connected = false;
		setTimeout(function(){
			//self.port = chrome.runtime.connectNative("com.dfilimonov.devtoolsterminal");
			self.port = chrome.runtime.connect({name: "chrome.nativeMessaging port"});
			self.port.onDisconnect.addListener(function(){
				if(connected){
					EventEmitter.prototype.emit.call(self, 'disconnect');
				}else{
					EventEmitter.prototype.emit.call(self, 'error');
				}

				self.port = null;
			});
			self.port.onMessage.addListener(function(msg){
				if(!connected){
					if(msg.event != 'nm-error'){
						connected = true;
					}
					EventEmitter.prototype.emit.call(self, 'connect');
				}
				EventEmitter.prototype.emit.call(self, msg.event, msg.data);
			});
			self.emit('init', self.options);

		}, 0);
	},
	emit: function(event, data){
		if(this.port) {
			this.port.postMessage({
				event: event,
				data: data
			});
		}
	}
})
