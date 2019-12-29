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
					})
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