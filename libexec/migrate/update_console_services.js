'use strict';
const fs = require("fs");
const async = require("async");
let Mongo = require("soajs").mongo;

//set the logger
const utils = require("../utils/utils.js");
const logger = utils.getLogger();

module.exports = (profile, dataPath, callback) => {
	//use soajs.core.modules to create a connection to core_provision database
	let mongoConnection = new Mongo(profile);
	
	//update product services
	let records = require(dataPath + "services/index.js");
	if (records && Array.isArray(records)) {
		async.each(records, (service, cb) => {
				if (service.name) {
					delete (service._id);
					let condition = {"name": service.name};
					let s = {'$set': service};
					let extraOptions = {'upsert': false};
					mongoConnection.updateOne("services", condition, s, extraOptions, (err, record) => {
						if (err) {
							logger.error(err);
						} else if (record) {
							logger.info(service.name + ": " + record.nModified);
						}
						cb();
					});
				}
			},
			() => {
				//close mongo connection
				mongoConnection.closeDb();
				return callback(null, "MongoDb Soajs Data migrate!")
			}
		);
	}
};