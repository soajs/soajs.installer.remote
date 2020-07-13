"use strict";

module.exports = {
	"type": "service",
	"name": "soamonitor",
	"configuration": {
		"group": "Reporting",
		"subType": "soajs",
		"port": 4052,
		"requestTimeout": 30,
		"requestTimeoutRenewal": 5
	},
	"versions": [
		{
			"version": "1",
			"extKeyRequired": true,
			"urac": true,
			"urac_Profile": false,
			"urac_ACL": false,
			"urac_Config": false,
			"urac_GroupConfig": false,
			"tenant_Profile": false,
			"provision_ACL": false,
			"oauth": true,
			"interConnect": null,
			"maintenance": {
				"readiness": "/heartbeat",
				"port": {
					"type": "maintenance"
				},
				"commands": [
					{
						"label": "Reload Registry",
						"path": "/reloadRegistry",
						"icon": "fas fa-undo"
					},
					{
						"label": "Resource Info",
						"path": "/resourceInfo",
						"icon": "fas fa-info"
					}
				]
			},
			"apis": []
		}
	],
	"ui": {
		"main": "Addon"
	},
	"description": "This is the soajs monitor microservice",
	"settings": {
		"recipes": [
			"5f0c71ef52b19b0a86f9daf5"
		]
	}
};