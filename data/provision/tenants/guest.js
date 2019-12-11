'use strict';
let doc = {
	"_id": "5c0e74ba9acc3c5a84a51259",
	"type": "product",
	"code": "DBTN",
	"locked": true,
	"console": true,
	"name": "Console Tenant",
	"description": "This is the tenant that holds the access rights and configuration for the console users with DSBRD_GUEST as Guest default package",
	"oauth": {
		"secret": "this is a secret",
		"disabled": 0,
		"type": 2,
		"loginMode": "urac"
	},
	"applications": [
		{
			"product": "DSBRD",
			"package": "DSBRD_GUEST",
			"appId": "5c0e74ba9acc3c5a84a5125a",
			"description": "Dashboard application for DSBRD_GUEST package",
			"_TTL": 604800000,
			"keys": [
				{
					"key": "a139786a6e6d18e48b4987e83789430b",
					"extKeys": [
						{
							"extKey": "%guestExtKey%",
							"device": null,
							"geo": null,
							"env": "DASHBOARD",
                            "dashboardAccess" : true,
							"expDate": null
						}
					],
					"config": {
						"dashboard": {
							"urac": {
								"tokenExpiryTTL": 2 * 24 * 3600 * 1000,
								"validateJoin": true
							}
						}
					}
				}
			]
		}
	],
	"tag": "Console"
};

module.exports = doc;
