'use strict';
const fs = require("fs");
const async = require("async");
let Mongo = require("soajs").mongo;

//set the logger
const utils = require("../utils/utils.js");
const logger = utils.getLogger();

module.exports = (profile, dataPath, callback) => {
	let records = [];
	fs.readdirSync(dataPath + "urac/groups/").forEach(function (file) {
		let rec = require(dataPath + file);
		if (Array.isArray(rec)) {
			records = records.concat(rec);
		} else {
			records.push(rec);
		}
	});
	if (records && Array.isArray(records) && records.length > 0) {
		let tCode = "DBTN";
		profile.name = tCode + "_urac";
		let mongoConnection = new Mongo(profile);
		async.eachSeries(
			records,
			(e, cb) => {
				if (tCode !== e.tenant.code) {
					logger.warn(e.code + ": skipped tenant code [" + e.tenant.code + "] does not match!");
					return cb();
				}
				let condition = {"code": e.code};
				if (e._id) {
					delete (e._id);
				}
				e = {$set: e};
				mongoConnection.updateOne("groups", condition, e, {'upsert': false}, (error, record) => {
					if (error) {
						logger.error(e.code + ": " + error);
					} else if (record) {
						logger.info(e.code + ": " + record.nModified);
					}
					return cb();
				});
				
			},
			() => {
				//close mongo connection
				mongoConnection.closeDb();
				return callback(null, "MongoDb Soajs Data migrate!")
			});
	} else {
		return callback(null, "Nothing to migrate");
	}
};
