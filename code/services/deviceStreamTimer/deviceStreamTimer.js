function deviceStreamTimer(req, resp){
    ClearBlade.init({"request":req});
    ClearBlade.getAllDevicesForSystem(function(err, data) {
        if(err){
            resp.error("Unable to retrieve devices: " + JSON.stringify(data))
    	} else {
    	    var codeEngine = ClearBlade.Code()
    	    var serviceToCall = "simulate_asset_stream"
    	    var loggingEnabled = true
    	    
    	    var serviceCallback = function(err, data) {
                if(err) {
                    log("An error was received when executing " + serviceToCall); // + " for asset " +    JSON.stringify(data))
                }
    	    };
    	    
    	    for (var i=0; i<data.length; i++) {
    	        var params = {
    	            assetName:data[i].name,
    	            clearHistory: true
    	        };
    	        log("Invoking " + serviceToCall + " for asset " + data[i].name);
    	        codeEngine.execute(serviceToCall, params, loggingEnabled, serviceCallback);
    	    }
    	    
    		resp.success("Data streams for all devices have been initiated");
    	}
    });
}