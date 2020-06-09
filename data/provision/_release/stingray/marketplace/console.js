"use strict";

module.exports = {
	type: "service",
	name: "console",
	description: "This service takes care of updates and upgrades as well as everything related to registry",
	configuration: {
		subType: "soajs",
		group: "Console",
		port: 4009,
		requestTimeout: 30,
		requestTimeoutRenewal: 5
	},
	versions: [
		{
			version: "1",
			extKeyRequired: true,
			urac: true,
			urac_Profile: false,
			urac_ACL: false,
			urac_Config: false,
			urac_GroupConfig: false,
			tenant_Profile: false,
			provision_ACL: false,
			oauth: true,
			interConnect: null,
			maintenance: {
				readiness: "/heartbeat",
				port: {
					type: "maintenance"
				},
				commands: [
					{
						label: "Reload Registry",
						path: "/reloadRegistry",
						icon: "fas fa-undo"
					},
					{
						label: "Resource Info",
						path: "/resourceInfo",
						icon: "fas fa-info"
					}
				]
			},
			apis: [
				{
					l: "This API returns the ledger entries of a specific type",
					v: "/ledger/:type",
					m: "get",
					group: "Ledger"
				},
				{
					l: "This API adds an entry to the ledger of a specific type",
					v: "/ledger",
					m: "post",
					group: "Ledger"
				}
			]
		}
	]
};