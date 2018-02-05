function getAssetTypes(req, resp){
    ClearBlade.init({"request":req});
    var callback = function (err, data) {
        if (err) {
        	resp.error("fetch error : " + JSON.stringify(data));
        } else {
        	resp.success(data);
        }
    };
    var query = ClearBlade.Query({collectionName: "asset_schema"});
	query.columns(["item_id", "type", "icon_path"]);

   	// var col = ClearBlade.Collection({collectionName:"asset_schema"});
    query.fetch(callback);
}