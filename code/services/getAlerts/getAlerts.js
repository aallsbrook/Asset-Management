function getAlerts(req, resp){
    
    ClearBlade.init({"request":req})
    var status= "";
    if (typeof req.params.status != "undefined" ){
        status = req.params.status;
    }
     var callback = function (err, data) {
        if (err) {
        	resp.error("fetch error : " + JSON.stringify(data));
        } else {
        	resp.success(data);
        }
    };

   	var col = ClearBlade.Collection({collectionName:"alert_history"});
   	var query = ClearBlade.Query();
   	if(status!=="") {
   	    query.equalTo("status", "open");
   	}
    col.fetch(query, callback);

}