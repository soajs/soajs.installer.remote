'use strict';
let Mongo = require("soajs").mongo;

//set the logger
const utils = require("../utils/utils.js");
const logger = utils.getLogger();

module.exports = (profile, dataPath, release, callback) => {
	//use soajs.core.modules to create a connection to core_provision database
	let mongoConnectionTenant = new Mongo(profile);
	
	//update product DSBRD
	let path = dataPath;
	if (release) {
		path += "_release/" + release + "/";
	}
	let record = require(path + "products/dsbrd.js");
	delete (record._id);
	let condition = {"code": "DSBRD"};
	let extraOptions = {'upsert': false};
	let s = {'$set': record};
	mongoConnectionTenant.updateOne("products", condition, s, extraOptions, (err, record) => {
		//close mongo connection
		mongoConnectionTenant.closeDb();
		if (record) {
			logger.info(record.nModified);
		}
		return callback(err, "MongoDb Soajs Data migrate!");
	});
};