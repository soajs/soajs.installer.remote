let Mongo = require("soajs").mongo;

function coreProvision(profile) {
	let __self = this;
	
	__self.mongoCore = new Mongo(profile);
}


coreProvision.prototype.getSettings = function (cb) {
	let __self = this;
	let condition = {"type": "installer"};
	__self.mongoCore.findOne("settings", condition, null, (err, record) => {
		return cb(err, record);
	});
};

coreProvision.prototype.validateId = function (id, cb) {
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

coreProvision.prototype.closeConnection = function () {
	let __self = this;
	
	__self.mongoCore.closeDb();
};

module.exports = coreProvision;