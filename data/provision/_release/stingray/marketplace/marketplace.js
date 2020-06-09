"use strict";

module.exports = {
	type: "service",
	name: "marketplace",
	description: "This service provides the ability to create a heterogeneous catalog capable to automatically adapt and onboard all kind of different type of components is the way to go.",
	configuration: {
		group: "Console",
		subType: "soajs",
		port: 4007,
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
					l: "This API lists the items matching certain keywords from soajs catalog only.",
					v: "/soajs/items",
					m: "get",
					group: "SOAJS"
				},
				{
					l: "This API lists the public items matching certain keywords with option to select from what type and subtype.",
					v: "/public/items",
					m: "get",
					group: "Guest"
				},
				{
					l: "This API lists the items matching certain keywords with option to select from what type and subtype.",
					v: "/items",
					m: "get",
					group: "Item"
				},
				{
					l: "This API lists the items matching certain type with option to select a subtype.",
					v: "/items/type",
					m: "get",
					group: "Item"
				},
				{
					l: "This API gets an item by its source.",
					v: "/items/src",
					m: "get",
					group: "Item"
				},
				{
					l: "This API get one item by its name and type.",
					v: "/item/type",
					m: "get",
					group: "Item"
				},
				{
					l: "This API gets the configure deployment of an item including (allowed recipes, saved configuration, and kubernetes configuration for both service and deployment|daemonset)",
					v: "/item/deploy/inspect",
					m: "get",
					group: "Item deploy"
				},
				{
					l: "This API deletes an item",
					v: "/item",
					m: "delete",
					group: "Item management"
				},
				{
					l: "This API deletes items by source",
					v: "/items/src",
					m: "delete",
					group: "Item management"
				},
				{
					l: "This API deletes the configure deployment of an item",
					v: "/item/configure/deploy",
					m: "delete",
					group: "Item deploy"
				},
				{
					l: "This API updates the item environments from soajs catalog only",
					v: "/soajs/item/environments",
					m: "put",
					group: "SOAJS"
				},
				{
					l: "This API updates the item recipes from soajs catalog only",
					v: "/soajs/item/recipes",
					m: "put",
					group: "SOAJS"
				},
				{
					l: "This API updates the item ACL from soajs catalog only",
					v: "/soajs/item/acl",
					m: "put",
					group: "SOAJS"
				},
				{
					l: "This API updates the item environments",
					v: "/item/environments",
					m: "put",
					group: "Item settings"
				},
				{
					l: "This API updates the item recipes",
					v: "/item/recipes",
					m: "put",
					group: "Item settings"
				},
				{
					l: "This API updates the item ACL",
					v: "/item/acl",
					m: "put",
					group: "Item settings"
				},
				{
					l: "This API adds/updates an item of type resource to the catalog",
					v: "/item/resource",
					m: "put",
					group: "Item management"
				},
				{
					l: "This API adds/updates an item of type service to the catalog",
					v: "/item/service",
					m: "put",
					group: "Item management"
				},
				{
					l: "This API adds/updates an item of type daemon to the catalog",
					v: "/item/daemon",
					m: "put",
					group: "Item management"
				},
				{
					l: "This API adds/updates an item of type static to the catalog",
					v: "/item/static",
					m: "put",
					group: "Item management"
				},
				{
					l: "This API adds/updates an item of type custom to the catalog",
					v: "/item/custom",
					m: "put",
					group: "Item management"
				},
				{
					l: "This API adds/updates an item of type config to the catalog",
					v: "/item/config",
					m: "put",
					group: "Item management"
				},
				{
					l: "This API appends the version configuration of an item.",
					v: "/item/version/configuration",
					m: "put",
					group: "Item management"
				},
				{
					l: "This API adds/updates an item of type service built using the SOAJS Framework (config.js)",
					v: "/item/service/soajs",
					m: "put",
					group: "Item management"
				},
				{
					l: "This API redeploys a deployed item",
					v: "/item/deploy/redeploy",
					m: "put",
					group: "Item deploy"
				},
				{
					l: "This API deploys an item used by CI",
					v: "/item/deploy/cd",
					m: "put",
					group: "Item deploy"
				},
				{
					l: "This API deploys an item",
					v: "/item/deploy",
					m: "put",
					group: "Item deploy"
				},
				{
					l: "This API updates the configure deployment of an item",
					v: "/item/deploy/configure",
					m: "put",
					group: "Item deploy"
				},
				{
					l: "This API updates the configure deployment of an item and deploy",
					v: "/item/deploy/build",
					m: "put",
					group: "Item deploy"
				},
				{
					l: "This API appends an item by branch",
					v: "/item/branch",
					m: "put",
					group: "Item management"
				},
				{
					l: "This API appends an item by tag",
					v: "/item/tag",
					m: "put",
					group: "Item management"
				}
			]
		}
	]
};