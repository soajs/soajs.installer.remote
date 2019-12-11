'use strict';
let Mongo = require("soajs").mongo;

module.exports = (profile, dataPath, callback) => {
	//use soajs.core.modules to create a connection to core_provision database
	let mongoConnectionTenant = new Mongo(profile);
	
	
	//update product DSBRD
	let record = require(dataPath + "products/dsbrd.js");
	delete (record._id);
	let condition = {code: "DSBRD"};
	mongoConnectionTenant.update("products", condition, record, {'upsert': true}, () => {
		//close mongo connection
		mongoConnectionTenant.closeDb();
		return callback(null, "MongoDb Soajs Data migrate!")
	});
};