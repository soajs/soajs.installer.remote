"use strict";

module.exports = {
	type: "service",
	name: "controller",
	subType: "soajs",
	configuration: {
		port: 4000,
		group: "Gateway"
	},
	versions: [
		{
			version: "1",
			maintenance: {
				readiness: "/heartbeat",
				port: {
					type: "maintenance"
				},
				commands: [
					{
						label: "Reload Provision",
						path: "/loadProvision",
						icon: "fas fa-download"
					},
					{
						label: "Reload Registry",
						path: "/reloadRegistry",
						icon: "fas fa-undo"
					},
					{
						label: "Reload Awareness",
						path: "/awarenessStat",
						icon: "fas fa-wifi"
					}
				]
			}
		}
	]
};