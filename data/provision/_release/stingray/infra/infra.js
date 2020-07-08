'use strict';

let doc = {
	"_id": "5ee2c197bbedb89caa406d40",
	"label": "Kubernetes Remote",
	"description": "This cluster was added automatically by remote installer and used by soajs console",
	"configuration": {
		"type": "secret",
		"url": "%ipaddress%",
		"port": "%port%",
		"token": "%token%",
	},
	"deployments": [
		{
			"env": "dashboard",
			"namespace": "soajs"
		}
	]
};

module.exports = doc;