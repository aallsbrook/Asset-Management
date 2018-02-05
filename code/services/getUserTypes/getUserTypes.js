function getUserTypes(req, resp){
    ClearBlade.init({"request":req});
    var callback = function (err, data) {
        if (err) {
        	resp.error("fetch error : " + JSON.stringify(data));
        } else {
        	resp.success(data);
        }
    };
    var query = ClearBlade.Query({collectionName: "user_type"});
// 	query.columns(["item_id", "type", "icon_path"]);

   	query.fetch(callback);
}