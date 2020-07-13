'use strict';
const fs = require("fs");
const async = require("async");
let Mongo = require("soajs").mongo;

//set the logger
const utils = require("../utils/utils.js");
const logger = utils.getLogger();

module.exports = (profile, dataPath, release, callback) => {
	let path = dataPath;
	let records = [];
	fs.readdirSync(path + "catalogs/").forEach(function (file) {
		let rec = require(path + "catalogs/" + file);
		if (Array.isArray(rec)) {
			records = records.concat(rec);
		} else {
			records.push(rec);
		}
	});
	
	if (records && Array.isArray(records) && records.length > 0) {
		//use soajs.core.modules to create a connection to core_provision database
		let mongoConnection = new Mongo(profile);
		async.eachSeries(records, (item, cb) => {
				if (item.name) {
					//delete (item._id);
					item._id = mongoConnection.ObjectId(item._id);
					let condition = {"name": item.name};
					let s = {'$set': item};
					let extraOptions = {'upsert': true};
					mongoConnection.updateOne("catalogs", condition, s, extraOptions, (err, record) => {
						if (err) {
							if (err.message) {
								logger.error(err.message);
							} else {
								logger.error(err);
							}
						} else if (record) {
							logger.info(item.name + ": " + record.nModified);
						}
						cb();
					});
				}
			},
			() => {
				//close mongo connection
				mongoConnection.closeDb();
				return callback(null, "MongoDb Soajs Data migrate!");
			}
		);
	} else {
		return callback(null, "Nothing to migrate");
	}
};