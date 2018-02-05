function getLocations(req, resp){
    ClearBlade.init({"request":req});
    var callback = function (err, data) {
        if (err) {
        	resp.error("fetch error : " + JSON.stringify(data));
        } else {
        	resp.success(data);
        }
    };

   	var col = ClearBlade.Collection({collectionName:"locations"});
    col.fetch(callback);
}