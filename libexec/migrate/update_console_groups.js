'use strict';
const fs = require("fs");
const async = require("async");
let Mongo = require("soajs").mongo;

//set the logger
const utils = require("../utils/utils.js");
const logger = utils.getLogger();

module.exports = (profile, dataPath, release, callback) => {
	let records = [];
	fs.readdirSync(dataPath + "urac/groups/").forEach(function (file) {
		let rec = require(dataPath + "urac/groups/" + file);
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
			(group, cb) => {
				if (tCode !== group.tenant.code) {
					logger.warn(e.code + ": skipped tenant code [" + group.tenant.code + "] does not match!");
					return cb();
				}
				let condition = {"code": group.code};
				if (group._id) {
					delete (group._id);
				}
				let e = {$set: group};
				mongoConnection.updateOne("groups", condition, e, {'upsert': false}, (error, record) => {
					if (error) {
						logger.error(group.code + ": " + error.message);
					} else if (record) {
						logger.info(group.code + ": " + record.nModified);
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
