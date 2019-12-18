"use strict";

const soajs = require('soajs');

module.exports = {
	"getLogger": () => {
		return soajs.core.getLogger("SOAJS Installer", {
			"formatter": {"levelInString": true, "outputMode": 'short'},
			"level": "debug"
		});
	},
	"getProfile": (options) => {
		let profileImport = null;
		if (options.mongo.external) {
			profileImport = {
				"name": "core_provision",
				"prefix": "",
				"servers": options.mongo.profile.servers,
				"credentials": options.mongo.profile.credentials,
				"streaming": {},
				"extraParam": {},
				"URLParam": options.mongo.profile.URLParam,
			};
		} else {
			profileImport = require("../../data/soajs_profile.js");
			profileImport.servers[0].host = options.kubernetes.ip;
		}
		return profileImport;
	}
};