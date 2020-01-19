'use strict';
let Mongo = require("soajs").mongo;

//set the logger
const utils = require("../utils/utils.js");
const logger = utils.getLogger();

module.exports = (profile, dataPath, callback) => {
	//use soajs.core.modules to create a connection to core_provision database
	let mongoConnectionTenant = new Mongo(profile);
	
	//update product DSBRD
	let record = require(dataPath + "products/dsbrd.js");
	delete (record._id);
	let condition = {"code": "DSBRD"};
	
	let extraOptions = {
		'upsert': true
	};
	let s = {'$set': record};
	
	mongoConnectionTenant.updateOne("products", condition, s, extraOptions, (err, record) => {
		logger.info(logger);
		//close mongo connection
		mongoConnectionTenant.closeDb();
		return callback(err, "MongoDb Soajs Data migrate!")
	});
};