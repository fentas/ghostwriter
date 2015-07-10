
function StorageApiBridge() {

	if(StorageApiBridge.instance) {
		throw new Error("StorageApiBridge constructor must be called only once");
	}else{
		StorageApiBridge.instance = this;
	}

	var callbacks = {}
		, port = chrome.runtime.connect({name: "chrome.storage port"});

	port.onMessage.addListener(function(msg) {
		var callback = callbacks[msg.message_id];
		delete msg.message_id;
		callback(msg);
	});

	function postMessage(method, keys, callback) {
		var message_id = Math.random().toString(36).substring(2);
		callbacks[message_id] = callback;
		port.postMessage({method: method, keys: keys, message_id: message_id});
	}

	this.get = function(keys, callback) {
		postMessage("get", keys, callback);
	};

	this.set = function(keys, callback) {
		postMessage("set", keys, callback);
	};

}
new StorageApiBridge();
