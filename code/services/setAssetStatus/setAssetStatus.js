function setAssetStatus(req, resp){
    // this service runs as a trigger from the message queue for all device status updates
    log(req.params)
    var deviceName = req.params.topic.replace("asset/status/", "");

    log("devicename is: "+deviceName);
    ClearBlade.init({request: req});

    // Default is true, so device table changes can trigger code services
	var DEVICE_TRIGGER_ENABLED = false;  //this is being run via trigger, lets not make it recursive for the moment

	var deviceUpdates = JSON.parse(req.params.body);
	delete deviceUpdates.name;


	ClearBlade.updateDevice(deviceName, deviceUpdates, DEVICE_TRIGGER_ENABLED, function(err, data) {
		if(err) {
			log("Unable to update device: " + JSON.stringify(data))
		}
        log("successfully updated device")
		resp.success(data);
	});
}
