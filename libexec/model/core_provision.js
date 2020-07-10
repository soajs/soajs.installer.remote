"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

let Mongo = require("soajs").mongo;

function CoreProvision(profile) {
	let __self = this;
	
	__self.mongoCore = new Mongo(profile);
}


CoreProvision.prototype.getSettings = function (cb) {
	let __self = this;
	let condition = {"type": "installer"};
	__self.mongoCore.findOne("settings", condition, null, (err, record) => {
		return cb(err, record);
	});
};

CoreProvision.prototype.updateSettings = function (obj, cb) {
	let __self = this;
	let condition = {"type": "installer"};
	
	__self.mongoCore.findOne("settings", condition, (error, response) => {
		if (response) {
			if (!obj.semVer) {
				return cb(new Error("Version was not provided to update."), null);
			}
			let e = {$set: {["releaseInfo.services." + obj.serviceName + ".semVer"]: obj.semVer}};
			__self.mongoCore.updateOne("settings", condition, e, (error, response) => {
				return cb(error, response);
			});
		} else {
			return cb(new Error("Unable to find release information."));
		}
	});
};

CoreProvision.prototype.getExtKey = function (cb) {
	let __self = this;
	let condition = {"code": "DBTN"};
	__self.mongoCore.findOne("tenants", condition, null, (err, record) => {
		let extKey = null;
		if (record && record.applications) {
			let app = record.applications[0];
			if (app.keys) {
				let key = app.keys[0];
				if (key.extKeys) {
					let oneKey = key.extKeys[0];
					extKey = oneKey.extKey;
				}
			}
		}
		
		if (!extKey && !err) {
			err = new Error("Unable to find extKey!");
		}
		return cb(err, extKey);
	});
};

CoreProvision.prototype.updateCatalog = function (obj, cb) {
	let __self = this;
	__self.validateId(obj._id, (error, _id) => {
		if (_id) {
			let condition = {"_id": _id};
			obj._id = _id;
			
			__self.mongoCore.findOne("catalogs", condition, (error, response) => {
				if (response) {
					let e = {$set: {"recipe.deployOptions.image.tag": obj.recipe.deployOptions.image.tag}};
					__self.mongoCore.updateOne("catalogs", condition, e, (error, response) => {
						return cb(error, response);
					});
				} else {
					__self.mongoCore.insertOne("catalogs", obj, (error, response) => {
						return cb(error, response);
					});
				}
			});
		} else {
			return cb(error);
		}
	});
};

CoreProvision.prototype.validateId = function (id, cb) {
	let __self = this;
	
	if (!id) {
		let error = new Error("User: must provide an id.");
		return cb(error, null);
	}
	
	try {
		id = __self.mongoCore.ObjectId(id);
		return cb(null, id);
	} catch (e) {
		__self.log(e);
		return cb(new Error("A valid ID is required"), null);
	}
};

CoreProvision.prototype.closeConnection = function () {
	let __self = this;
	
	__self.mongoCore.closeDb();
};

module.exports = CoreProvision;