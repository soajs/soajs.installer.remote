'use strict';

let doc = {
	
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
			"env": "dashboard"
		}
	]
};

module.exports = doc;