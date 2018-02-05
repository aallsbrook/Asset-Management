function edgeDeviceUpdate(req, resp){
    ClearBlade.init({request: req});
    logStdErr("Device Message received for Pump101");
    
    if (ClearBlade.isEdge()) {
        log("noop")
        resp.success("noop");
    } else{
        var deviceNameToUpdate = "pump101"
        
        var createRandomValue = function(min, max){
            return Math.random() * (max - min) + min;
        }
        
        // Default is true, so device table changes can trigger code services
    	var DEVICE_TRIGGER_ENABLED = true;
    	
        var currentDate = new Date();
        currentDate = currentDate.toISOString();
    	var deviceUpdates = {
    		backpressure: parseFloat(createRandomValue(12,199).toFixed(0)),
    		rpm:  parseFloat(createRandomValue(2010,14000).toFixed(0)),
    		suction:  parseFloat(createRandomValue(10,839).toFixed(0)),
    		is_pumping: true,
    		amps:  parseFloat(createRandomValue(200,260).toFixed(0)),
    		voltage:  parseFloat(createRandomValue(15,20).toFixed(0)),
    		temperature: parseFloat(createRandomValue(77,160).toFixed(0)),
    		last_update:currentDate
    	};
    	log(deviceUpdates);
    // 	resp.success(deviceUpdates);
        //logStdErr(JSON.stringify(deviceUpdates));
    	ClearBlade.updateDevice(deviceNameToUpdate, deviceUpdates, DEVICE_TRIGGER_ENABLED, function(err, data) {
    		if(err) {
    		    log("Unable to update device: " + JSON.stringify(data));
    			resp.error("Unable to update device: " + JSON.stringify(data))
    		}
            log("Updated device: " + JSON.stringify(data));
    		resp.success(data);
    	});
    }
}