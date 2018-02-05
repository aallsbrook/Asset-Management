function clearTopic(req, resp){
    ClearBlade.init({"request":req});
    var msg = ClearBlade.Messaging();
    var returnRemainingTopics = function() {
        var callback = function (err, data) {
    		if(err) {
    			resp.error("Unable to retrieve current topics: " + JSON.stringify(data));
    		} else {
    			resp.success(data);
    		}
        };
    
        
        msg.getCurrentTopics(callback);

    }
    if (typeof req.params.topic != "undefined"){
        var callback = function (err, data) {
    		if(err) {
    			resp.error("getcurrenttopics error: " + JSON.stringify(data));
    		} else {
    		    returnRemainingTopics();
    // 			resp.success("topic cleared: "+req.params.topic);
    		}
        };
    
        msg.getAndDeleteMessageHistory(req.params.topic, 0, null, null, null, callback); // get and delete all messages for "topic"
    }else {
        returnRemainingTopics();
    }
}