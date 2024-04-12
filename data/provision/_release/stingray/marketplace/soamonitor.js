"use strict";

module.exports = {
	"type": "service",
	"name": "soamonitor",
	"configuration": {
		"group": "Reporting",
		"subType": "soajs",
		"port": 4050,
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
			"apis": [
				{
					"l": "This API returns daily items by api, service, tenant or user",
					"v": "/monitor/analytics/:type",
					"m": "get",
					"group": "Monitor"
				},
				{
					"l": "This API returns the items",
					"v": "/monitor/items",
					"m": "get",
					"group": "Monitor"
				},
				{
					"l": "This API returns an item",
					"v": "/monitor/item",
					"m": "get",
					"group": "Monitor"
				},
				{
					"l": "This API deletes an item",
					"v": "/monitor/item",
					"m": "delete",
					"group": "Monitor"
				},
				{
					"l": "This API adds an item",
					"v": "/monitor/item",
					"m": "post",
					"group": "Monitor"
				},
				{
					"l": "This API updates an item by adding a note",
					"v": "/monitor/item",
					"m": "put",
					"group": "Monitor"
				}
			]
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