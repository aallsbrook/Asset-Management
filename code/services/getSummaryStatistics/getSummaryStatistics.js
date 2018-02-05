function getSummaryStatistics(req, resp){
    var inactivePeriod = 900000 //represent 15 minutes
    
    var ret ={
        device_count:-1,
        active_device_count:-1,
        user_count:-1,
        issue_count:-1
    }
    ClearBlade.init({"request":req})
    
    var getIssueCount = function() {
        var callback = function (err, data) {
            if (err) {
            	resp.error("fetch error : " + JSON.stringify(data));
            } else {
            	ret.issue_count = data.TOTAL;
            }
            resp.success(ret);
        };
    
       	var col = ClearBlade.Collection({collectionName:"alert_history"});
       	var query = ClearBlade.Query();
       	query.equalTo("status", "open");
        col.fetch(query, callback);
        
    }
    var getUserCount = function(){
        var callback = function (err, data) {
            if (err) {
            	log("data request failed: getUserCount: "+data);
            } else {
                // var activeCount = 0;
                // for (var i=0;i<data.Data.length; i++){
                //     var lastactive = data.Data[i].last_active_date;
                //     lastactive = lastactive*1000;
                //     var current = new Date().getTime();
                //     if ( (current - lastactive) < inactivePeriod) {
                //         // device is active
                //         activeCount++;
                //     }
                // }
                // ret.active_user_count = activeCount;
                ret.user_count = data.Total;
            }
            //resp.success(data);
            getIssueCount();
        };
       	var user = ClearBlade.User();
       	var query = ClearBlade.Query();
        //query.columns(["email"]);
        query.equalTo("active",true);
        query.setPage(1000,1)
        user.allUsers(query, callback);

    }
    var getDeviceCount = function() {
        var callback = function (err, data) {
            if (err) {
            	log("data request failed: getActiveDeviceCount");
            } else {
                ret.device_count = data.length;
                var activeCount = 0;
                for (var i=0;i<data.length; i++){
                    //log(data[i]);
                    var lastactive = data[i].last_active_date;
                    lastactive = lastactive*1000;
                    //log("  lastactive date :"+lastactive);
                    var current = new Date().getTime();
                    //log("  current date :"+current);
                    if ( (current - lastactive) < inactivePeriod) {
                        // device is active
                        activeCount++;
                    }
                }
                ret.active_device_count = activeCount;
            }
            getUserCount();
        };
       	var dev = ClearBlade.Device();
       	var query = ClearBlade.Query();
        query.columns(["name","last_active_date"]);
        query.equalTo("enabled",true);
        query.setPage(1000,1)
        dev.fetch(query, callback);
    }
    getDeviceCount();

}