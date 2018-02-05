function simulate_asset_stream(req, resp){
    //parameters 
    // optional -   clearHistory
    // required-   assetName
    //
    //req.params.assetName = "pump-42";
    
    log(req);
    
    var MAX_RPM = 12000;
    var MAX_SUCTION = 100;
    var MAX_VOLTAGE = 24;
    
    var assetName=""
    var clearHistory = false;
    
    if (typeof req.params.clearHistory !== undefined ){
        clearHistory = req.params.clearHistory;//false;
    }
    if (typeof req.params.assetName !== undefined ){
        assetName = req.params.assetName;//false;
    }else {
        resp.error("no assetName provided");
    }
    
    var positionTopic = "asset/position/none/"+assetName,
        statusTopic = "asset/status/"+assetName;
    
    ClearBlade.init({"request":req});
    var msg = ClearBlade.Messaging();
    
    var sendMessage=function(topic, payload){
        msg.publish(topic,JSON.stringify(payload));
    }
    
    function getRandomBetween(lower, upper){
        var random = Math.random()
    	// log("Random: " + random)
    	var randomWithinRange = lower + random*(upper - lower)
    	//log("randomWithinRange: " + randomWithinRange)
    	return randomWithinRange
    }
    
    var sendRandomPosition = function(payload) {
        sendMessage(positionTopic, payload);
    }
    
    var sendAssetStatusData = function(payload) {
        sendMessage(statusTopic, payload);
    }
    
    // var nextRandomizePosition = function(msgHistory) {
    //     var avgX=0;
    //     var avgY =0;
    //     var avgDx =0;
    //     var avgDy =0;
        
    //     var getGeoVariability = function(avgD){
    //         var v = (Math.random() * .00001);
    //         v= v.toFixed(6);
    //         return v;
    //     }
    //     for (var i=0; i< msgHistory.length; i++){
    //         var pos = JSON.parse(msgHistory[i].message);
            
    //         avgX += pos.latitude;
    //         avgY += pos.longitude;
    //         if (i>0){
    //             avgDx = pos.latitude - lastPos.latitude;
    //             avgDy = pos.longitude - lastPos.longitude;
    //         }
    //         lastPos = pos;
    //     }
    //     if (msgHistory.length>0){
    //         avgX = avgX / msgHistory.length;
    //         avgY = avgY / msgHistory.length;
    //         avgDx = avgDx / msgHistory.length;
    //         avgDx = avgDx.toFixed(6);
    //         avgDy = avgDy / msgHistory.length;
    //         avgDy = avgDy.toFixed(6);
    //     }
    //     xVariability = getGeoVariability(avgDx);
    //     yVariability = getGeoVariability(avgDy);
        
    //     // payload.msgHistory = msgHistory;
    //     // payload.avgX = avgX;
    //     // payload.avgY = avgY;
    //     //payload.avgDx = avgDx;
    //     //payload.xVariability =xVariability 
    //     //payload.avgDy = avgDy;
    //     payload.latitude = parseFloat(lastPos.latitude) + parseFloat(avgDx) + parseFloat(xVariability);
    //     payload.longitude = parseFloat(lastPos.longitude) + parseFloat(avgDy) + parseFloat(yVariability);
    //     payload.latitude = payload.latitude.toFixed(6);
    //     payload.longitude = payload.longitude.toFixed(6);
    //     //resp.success(payload);
    //     sendMessage();
    // }
    // var getPositionMessageHistory = function() {
    //     var unixTimeNano = new Date().getTime()
    //     var unixTimeMilli = unixTimeNano / 1000
	   // msg.getMessageHistory(positionTopic, unixTimeMilli, 5, function(err, body) {
    // 		if(err) {
    // 			resp.error("message history error : " + JSON.stringify(data));
    // 		} else {
    // 		    nextRandomizePosition(body);
    			
    // 		}
    // 	});
    // }
    
    var clearMessageHistory = function(topic) {
        var callback = function (err, data) {
    		if(err) {
    		    log("Error while clearing message history for topic " + topic + ", " + JSON.stringify(data));
    			//resp.error("getcurrenttopics error: " + JSON.stringify(data));
    		} else {
    		    log("Message history cleared for topic " + topic);
    			//resp.success("topic cleared: "+positionTopic);
    		}
        };
    
        msg.getAndDeleteMessageHistory(topic, 0, null, null, null, callback); // get and delete all messages for "topic"
    }
   
    var updateDevice = function(deviceName, udpates) {
        log("Sending device updates: " + JSON.stringify(udpates));
        ClearBlade.updateDevice(deviceName, udpates, false, function(err, data) {
    		if(err){
        		resp.error("Unable to update device: " + JSON.stringify(data))
    		} else {
    		    resp.success("Device data published and updated");
    		}
        });
    }
    
    //
    var randomizeDeviceData = function(device) {
        
        var newData = {};
        newData.name = device.name;
        
        //Create the random position data
        var appx6feet = .00004;
        
        newData.latitude = getRandomBetween(parseFloat(device.latitude) - appx6feet, parseFloat(device.latitude) + appx6feet).toFixed(6);
        newData.longitude = getRandomBetween(parseFloat(device.longitude) - appx6feet, parseFloat(device.longitude) + appx6feet).toFixed(6);

        log("New Device position, latitude = " + newData.latitude + ", longitude = " +  newData.longitude);

        //Create the random status data

        //pressure
        var pressure = 10.0, devPressure = device.pressure != null ? device.pressure : 0;
        newData.pressure = getRandomBetween(Math.abs(parseFloat(devPressure)  - pressure), parseFloat(devPressure) + pressure).toFixed(4);
        log("New Device pressure = " + JSON.stringify(newData.pressure));

        //rpm
        var rpm = 2500, devRpm = device.rpm != null ? device.rpm : 0;
        newData.rpm = getRandomBetween(Math.abs(parseInt(devRpm) - rpm), parseInt(devRpm) + rpm).toFixed(0);
        newData.rpm = (newData.rpm <= MAX_RPM) ? newData.rpm : newData.rpm/2;
        
        log("New Device rpms = " + JSON.stringify(newData.rpm));
        
        //suction
        var suction = 10.0, devSuction = device.suction != null ? device.suction : 0;
        newData.suction = getRandomBetween(Math.abs(parseFloat(devSuction) -suction), parseFloat(devSuction) + suction).toFixed(0);
        newData.suction = (newData.suction <= MAX_SUCTION) ? newData.suction : newData.suction/2;
        log("New Device suction = " + JSON.stringify(newData.suction));
        
        //amps
        var amps = 10.0, devAmps = device.amps != null ? device.amps : 0;
        newData.amps = getRandomBetween(Math.abs(parseFloat(devAmps) - amps), parseFloat(devAmps) + amps).toFixed(0);
        log("New Device amps = " + JSON.stringify(newData.amps));
        
        //voltage
        var volts = 2.0, devVolts = device.voltage != null ? device.voltage : 0;
        newData.voltage = getRandomBetween(Math.abs(parseFloat(devVolts) - volts), parseFloat(devVolts) + volts).toFixed(1);
        newData.voltage = (newData.voltage <= MAX_VOLTAGE) ? newData.voltage : (newData.voltage/2).toFixed(1);
        log("New Device volts = " + JSON.stringify(newData.voltage));        

        //vibration
        //acceleration

        log("New Device Data = " + JSON.stringify(newData));

        return newData;
    }
    
    var send_asset_stream = function () {
        ClearBlade.getDeviceByName(assetName, function(err, data) {
    		if(err){
        		resp.error("Unable to get device: " + JSON.stringify(data))
    		} else {
    		    
    		    log("Device retrieved: " + JSON.stringify(data));
    		    
    		    positionTopic = "asset/position/"+data.location_id+"/"+assetName
    		        
                if (clearHistory){
                    log("Clearing position message history");
                    clearMessageHistory(positionTopic);
                    
                    log("Clearing status message history");
                    clearMessageHistory(statusTopic);
                }
                
                //Create new values for selected properties of our device
                var newDeviceData = randomizeDeviceData(data);
                
    		    //Send the position data
    		    log("sending position message");
                sendRandomPosition({"latitude": newDeviceData.latitude, "longitude": newDeviceData.longitude, "location": data.location_id, "device_name": data.name});
                
                //We don't want to send latitude and longitude as status data
                //We also do not want to update latitude and longitude since they are updated via trigger
                delete newDeviceData.latitude;
                delete newDeviceData.longitude;
                
                //Send the asset status data
                log("Sending status message");
                sendAssetStatusData(newDeviceData);
                
                //Update the device
                //log("Updating device data");
                //updateDevice(assetName, newDeviceData);
                
                resp.success("messages published on topics ");
    		}
        });
    }
    
    send_asset_stream()
}