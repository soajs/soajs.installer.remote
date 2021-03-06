"use strict";

module.exports = {
	"type": "service",
	"name": "marketplace",
	"metadata": {
		"tags": ["marketplace", "catalog"],
		"attributes": {
			"catalogs": ["api", "daemon", "custom", "resource", "front end"],
			"resources": ["native", "item from catalog"]
		},
		"program": ["soajs"]
	},
	"configuration": {
		"group": "Console",
		"subType": "soajs",
		"port": 4007,
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
			"interConnect": [
				{
					"name": "dashboard",
					"version": "1"
				},
				{
					"name": "infra",
					"version": "1"
				},
				{
					"name": "repository",
					"version": "1"
				},
				{
					"name": "console",
					"version": "1"
				}
			],
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
			"documentation": {
				"readme": "# soajs.marketplace\n\nSOAJS repositories is a service that manages everything related to Catalogs.\n\n### Complete Documentation\nMore information is available on SOAJS website under the section for [Marketplace](https://soajsorg.atlassian.net/wiki/x/AQD3Wg).\n\n### License\n*Copyright SOAJS All Rights Reserved.*\n\nUse of this source code is governed by an Apache license that can be found in the LICENSE file at the root of this repository.\n",
				"release": "# soajs release\n\nSOAJS follows the fish names as release names\n\nWe also push patches per release that are numbered like Kanuy 4, Kanuy 5, …\n\nEach release or patch might affect several repositories and each source code has its own semantic version and each microservice has its own version.\n\n### Complete Documentation\nMore information is available on SOAJS website under the section for [Release](https://soajsorg.atlassian.net/wiki/x/QYCmbw).\n\n### License\n*Copyright SOAJS All Rights Reserved.*\n\nUse of this source code is governed by an Apache license that can be found in the LICENSE file at the root of this repository.\n"
			},
			"apis": [
				{
					"l": "This API lists the items matching certain keywords from soajs catalog only.",
					"v": "/soajs/items",
					"m": "get",
					"group": "SOAJS"
				},
				{
					"l": "This API lists the public items matching certain keywords with option to select from what type and subtype.",
					"v": "/public/items",
					"m": "get",
					"group": "Guest"
				},
				{
					"l": "This API lists the items matching certain keywords with option to select from what type and subtype.",
					"v": "/items",
					"m": "get",
					"group": "Item"
				},
				{
					"l": "This API lists the items matching certain type with option to select a subtype.",
					"v": "/items/type",
					"m": "get",
					"group": "Item"
				},
				{
					"l": "This API lists all items matching certain type with option to select a subtype including soajs items.",
					"v": "/items/type/all",
					"m": "get",
					"group": "Internal"
				},
				{
					"l": "This API lists all item names matching certain types",
					"v": "/items/type/name",
					"m": "get",
					"group": "Item"
				},
				{
					"l": "This API lists all item names matching certain names",
					"v": "/items/type/names",
					"m": "get",
					"group": "Item"
				},
				{
					"l": "This API gets the items by source.",
					"v": "/items/src",
					"m": "get",
					"group": "Item"
				},
				{
					"l": "This API gets one item by its name and type.",
					"v": "/item/type",
					"m": "get",
					"group": "Item"
				},
				{
					"l": "This API gets the configure deployment of an item including (allowed recipes, saved configuration, and kubernetes configuration for both service and deployment|daemonset|cronjob)",
					"v": "/item/deploy/inspect",
					"m": "get",
					"group": "Item deploy"
				},
				{
					"l": "List catalog recipes",
					"v": "/recipes",
					"m": "get",
					"group": "Catalog"
				},
				{
					"l": "List catalog recipes by selected ids",
					"v": "/recipes/ids",
					"m": "get",
					"group": "Catalog"
				},
				{
					"l": "Get catalog recipe by id",
					"v": "/recipe",
					"m": "get",
					"group": "Catalog"
				},
				{
					"l": "List Favorites",
					"v": "/favorite",
					"m": "get",
					"group": "Favorite"
				},
				{
					"l": "Add new catalog",
					"v": "/recipe",
					"m": "post",
					"group": "Catalog"
				},
				{
					"l": "Add to Favorites",
					"v": "/favorite",
					"m": "post",
					"group": "Favorite"
				},
				{
					"l": "This API deletes an item",
					"v": "/item",
					"m": "delete",
					"group": "Item management"
				},
				{
					"l": "This API deletes items by source",
					"v": "/items/src",
					"m": "delete",
					"group": "Item management"
				},
				{
					"l": "This API deletes the configure deployment of an item",
					"v": "/item/configure/deploy",
					"m": "delete",
					"group": "Item deploy"
				},
				{
					"l": "Delete a catalog recipe by id",
					"v": "/recipe",
					"m": "delete",
					"group": "Catalog"
				},
				{
					"l": "Delete from Favorites",
					"v": "/favorite",
					"m": "delete",
					"group": "Favorite"
				},
				{
					"l": "This API updates the item environments from soajs catalog only",
					"v": "/soajs/item/environments",
					"m": "put",
					"group": "SOAJS"
				},
				{
					"l": "This API updates the item recipes from soajs catalog only",
					"v": "/soajs/item/recipes",
					"m": "put",
					"group": "SOAJS"
				},
				{
					"l": "This API updates the item ACL from soajs catalog only",
					"v": "/soajs/item/acl",
					"m": "put",
					"group": "SOAJS"
				},
				{
					"l": "This API updates the item environments",
					"v": "/item/environments",
					"m": "put",
					"group": "Item settings"
				},
				{
					"l": "This API updates the item recipes",
					"v": "/item/recipes",
					"m": "put",
					"group": "Item settings"
				},
				{
					"l": "This API updates the item ACL",
					"v": "/item/acl",
					"m": "put",
					"group": "Item settings"
				},
				{
					"l": "This API adds/updates an item of type resource to the catalog",
					"v": "/item/resource",
					"m": "put",
					"group": "Item management"
				},
				{
					"l": "This API adds/updates an item of type service to the catalog",
					"v": "/item/service",
					"m": "put",
					"group": "Item management"
				},
				{
					"l": "This API adds/updates an item of type daemon to the catalog",
					"v": "/item/daemon",
					"m": "put",
					"group": "Item management"
				},
				{
					"l": "This API adds/updates an item of type static to the catalog",
					"v": "/item/static",
					"m": "put",
					"group": "Item management"
				},
				{
					"l": "This API adds/updates an item of type custom to the catalog",
					"v": "/item/custom",
					"m": "put",
					"group": "Item management"
				},
				{
					"l": "This API adds/updates an item of type config to the catalog",
					"v": "/item/config",
					"m": "put",
					"group": "Item management"
				},
				{
					"l": "This API appends the version configuration of an item.",
					"v": "/item/version/configuration",
					"m": "put",
					"group": "Item management"
				},
				{
					"l": "This API adds/updates an item of type service built using the SOAJS Framework (config.js)",
					"v": "/item/service/soajs",
					"m": "put",
					"group": "Item management"
				},
				{
					"l": "This API redeploys a deployed item",
					"v": "/item/deploy/redeploy",
					"m": "put",
					"group": "Item deploy"
				},
				{
					"l": "This API deploys an item used by CI",
					"v": "/item/deploy/cd",
					"m": "put",
					"group": "Item deploy CI"
				},
				{
					"l": "This API deploys an item",
					"v": "/item/deploy",
					"m": "put",
					"group": "Item deploy"
				},
				{
					"l": "This API updates the configure deployment of an item",
					"v": "/item/deploy/configure",
					"m": "put",
					"group": "Item deploy"
				},
				{
					"l": "This API updates the configure deployment of an item and deploy",
					"v": "/item/deploy/build",
					"m": "put",
					"group": "Item deploy"
				},
				{
					"l": "This API appends an item by branch",
					"v": "/item/branch",
					"m": "put",
					"group": "Item management"
				},
				{
					"l": "This API appends an item by tag",
					"v": "/item/tag",
					"m": "put",
					"group": "Item management"
				},
				{
					"l": "This API triggers maintenance operation on a deployed item.",
					"v": "/item/maintenance",
					"m": "put",
					"group": "Item deploy"
				},
				{
					"l": "Update catalog recipe",
					"v": "/recipe",
					"m": "put",
					"group": "Catalog"
				}
			]
		}
	],
	"description": "This service provides the ability to create a heterogeneous catalog capable to automatically adapt and onboard all kind of different type of components is the way to go.",
	"settings": {
		"recipes": [
			"5edf6c1136c77052b0a5e1f2"
		]
	}
};