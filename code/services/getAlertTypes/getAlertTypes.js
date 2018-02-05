function getAlertTypes(req, resp){
    //to get a subset of alert types pass in "activity" "position" "admin" "issue" on the req.params.category parameter
    ClearBlade.init({"request":req});
    var callback = function (err, data) {
        if (err) {
        	resp.error("fetch error : " + JSON.stringify(data));
        } else {
        	resp.success(data);
        }
    };
    var query = ClearBlade.Query({collectionName: "alert_type"});
    if (typeof req.params.category != "undefined") {
        query.equalTo("category",req.params.category)
    }
    
	//query.columns(["item_id", "type", "icon_path"]);

   	query.fetch(callback);
}