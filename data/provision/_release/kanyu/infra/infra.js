'use strict';

let doc = {
	"api": {
		"ipaddress": "%ipaddress%",
		"token": "%token%",
		"network": "soajs",
		"port": "%port%",
		"protocol": "https"
	},
	"name": "local",
	"technologies": [
		"kubernetes"
	],
	"templates": null,
	"drivers": [
		"Native"
	],
	"label" : "Kubernetes Remote",
	"deployments": [
		{
			"technology" : "kubernetes",
			"options": {
				"zone": "local"
			},
			"environments": [
				"DASHBOARD"
			],
			"loadBalancers": {},
			"name": "%name%",
			"id": "%name%"
		}
	]
};

module.exports = doc;