"use strict";

module.exports = {
	"type": "service",
	"name": "multitenant",
	"metadata": {
		"tags": [
			"productization",
			"packaging"
		],
		"attributes": {
			"multitenant": [
				"main tenant",
				"sub tenant"
			],
			"acl": [
				"by environment",
				"by tenant",
				"by key"
			]
		},
		"program": [
			"soajs"
		]
	},
	"configuration": {
		"group": "Console",
		"subType": "soajs",
		"port": 4004,
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
					"name": "marketplace",
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
				"readme": "# soajs.multitenant\n\nSOAJS multitenant is a service that manages everything related to Multitenancy, when you move into micro service architecture the only key elements to succeed is to productize your API, create a very thoughtful API catalog and have the ability to leverage these API in a multi tenant, multi version and multi environment fashion.\n\n### Complete Documentation\nMore information is available on SOAJS website under the section for [Multitenant](https://soajsorg.atlassian.net/wiki/x/TAAfVQ).\n\n### License\n*Copyright SOAJS All Rights Reserved.*\n\nUse of this source code is governed by an Apache license that can be found in the LICENSE file at the root of this repository.\n",
				"release": "# soajs release\n\nSOAJS follows the fish names as release names\n\nWe also push patches per release that are numbered like Kanuy 4, Kanuy 5, …\n\nEach release or patch might affect several repositories and each source code has its own semantic version and each microservice has its own version.\n\n### Complete Documentation\nMore information is available on SOAJS website under the section for [Release](https://soajsorg.atlassian.net/wiki/x/QYCmbw).\n\n### License\n*Copyright SOAJS All Rights Reserved.*\n\nUse of this source code is governed by an Apache license that can be found in the LICENSE file at the root of this repository.\n"
			},
			"apis": [
				{
					"l": "List products",
					"v": "/products",
					"m": "get",
					"group": "Product"
				},
				{
					"l": "Get product",
					"v": "/product",
					"m": "get",
					"group": "Product"
				},
				{
					"l": "Get product package",
					"v": "/product/package",
					"m": "get",
					"group": "Product"
				},
				{
					"l": "List product packages",
					"v": "/product/packages",
					"m": "get",
					"group": "Product"
				},
				{
					"l": "Get product ACL in raw form",
					"v": "/product/acl/scope/raw",
					"m": "get",
					"group": "Product"
				},
				{
					"l": "Get product package ACL in raw form",
					"v": "/product/package/acl/raw",
					"m": "get",
					"group": "Product"
				},
				{
					"l": "Get product Acl in UI form",
					"v": "/product/acl/ui",
					"m": "get",
					"group": "Product"
				},
				{
					"l": "Get product package ACL in UI form",
					"v": "/product/package/acl/ui",
					"m": "get",
					"group": "Product"
				},
				{
					"l": "Get the ACL of a specific service in the product package",
					"v": "/product/package/acl/service",
					"m": "get",
					"group": "Product"
				},
				{
					"l": "Get the ACL of a specific api in the product package",
					"v": "/product/package/acl/api",
					"m": "get",
					"group": "Product"
				},
				{
					"l": "Get the ACL of a specific service in the product scope",
					"v": "/product/acl/scope/service",
					"m": "get",
					"group": "Product"
				},
				{
					"l": "Get the ACL of a specific api in the product scope",
					"v": "/product/acl/scope/api",
					"m": "get",
					"group": "Product"
				},
				{
					"l": "List console products",
					"v": "/products/console",
					"m": "get",
					"group": "Console product"
				},
				{
					"l": "Get console product",
					"v": "/product/console",
					"m": "get",
					"group": "Console product"
				},
				{
					"l": "List console product packages",
					"v": "/product/console/packages",
					"m": "get",
					"group": "Console product"
				},
				{
					"l": "Get console product package",
					"v": "/product/console/package",
					"m": "get",
					"group": "Console product"
				},
				{
					"l": "Get console product Acl in raw form",
					"v": "/product/console/acl/scope/raw",
					"m": "get",
					"group": "Console product"
				},
				{
					"l": "Get console product package ACL in raw form",
					"v": "/product/console/package/acl/raw",
					"m": "get",
					"group": "Console product"
				},
				{
					"l": "Get console product Acl in UI form",
					"v": "/product/console/acl/ui",
					"m": "get",
					"group": "Console product"
				},
				{
					"l": "Get console product package ACL in UI form",
					"v": "/product/console/package/acl/ui",
					"m": "get",
					"group": "Console product"
				},
				{
					"l": "Get the ACL of a specific service in the product package",
					"v": "/product/console/package/acl/service",
					"m": "get",
					"group": "Product"
				},
				{
					"l": "Get the ACL of a specific api in the product package",
					"v": "/product/console/package/acl/api",
					"m": "get",
					"group": "Product"
				},
				{
					"l": "Get the ACL of a specific service in the product scope",
					"v": "/product/console/acl/scope/service",
					"m": "get",
					"group": "Product"
				},
				{
					"l": "Get the ACL of a specific api in the product scope",
					"v": "/product/console/acl/scope/api",
					"m": "get",
					"group": "Product"
				},
				{
					"l": "Get ext keys of a product for certain tenants in a specific environment.",
					"v": "/tenants/product/keys/ext",
					"m": "get",
					"group": "Tenant"
				},
				{
					"l": "List of the tenant sub tenants",
					"v": "/tenant/tenants",
					"m": "get",
					"group": "Tenant"
				},
				{
					"l": "List tenants",
					"v": "/tenants",
					"m": "get",
					"group": "Tenant"
				},
				{
					"l": "Get tenant",
					"v": "/tenant",
					"m": "get",
					"group": "Tenant"
				},
				{
					"l": "Get tenant application",
					"v": "/tenant/application",
					"m": "get",
					"group": "Tenant"
				},
				{
					"l": "List tenant applications",
					"v": "/tenant/applications",
					"m": "get",
					"group": "Tenant"
				},
				{
					"l": "List tenant application keys",
					"v": "/tenant/application/key",
					"m": "get",
					"group": "Tenant"
				},
				{
					"l": "List tenant application ext keys",
					"v": "/tenant/application/key/ext",
					"m": "get",
					"group": "Tenant"
				},
				{
					"l": "List tenant application key configuration",
					"v": "/tenant/application/key/config",
					"m": "get",
					"group": "Tenant"
				},
				{
					"l": "Get admin tenant",
					"v": "/admin/tenant",
					"m": "get",
					"group": "Admin Tenant"
				},
				{
					"l": "Get admin tenant by name",
					"v": "/admin/tenant/name",
					"m": "get",
					"group": "Admin Tenant"
				},
				{
					"l": "Get tenant application",
					"v": "/admin/tenant/application",
					"m": "get",
					"group": "Admin Tenant"
				},
				{
					"l": "List tenant applications",
					"v": "/admin/tenant/applications",
					"m": "get",
					"group": "Admin Tenant"
				},
				{
					"l": "List tenant application keys",
					"v": "/admin/tenant/application/key",
					"m": "get",
					"group": "Tenant"
				},
				{
					"l": "List tenant application ext keys",
					"v": "/admin/tenant/application/key/ext",
					"m": "get",
					"group": "Admin Tenant"
				},
				{
					"l": "List tenant application key configuration",
					"v": "/admin/tenant/application/key/config",
					"m": "get",
					"group": "Tenant"
				},
				{
					"l": "Get ext keys of a product for certain console tenants in a specific environment.",
					"v": "/tenants/console/product/keys/ext",
					"m": "get",
					"group": "Console tenant"
				},
				{
					"l": "List console tenants",
					"v": "/tenants/console",
					"m": "get",
					"group": "Console tenant"
				},
				{
					"l": "Get console tenant",
					"v": "/tenant/console",
					"m": "get",
					"group": "Console Tenant"
				},
				{
					"l": "Get console tenant application",
					"v": "/tenant/console/application",
					"m": "get",
					"group": "Console tenant"
				},
				{
					"l": "List console tenant applications",
					"v": "/tenant/console/applications",
					"m": "get",
					"group": "Console tenant"
				},
				{
					"l": "List console tenant application keys",
					"v": "/tenant/console/application/key",
					"m": "get",
					"group": "Console tenant"
				},
				{
					"l": "List console tenant application ext keys",
					"v": "/tenant/console/application/key/ext",
					"m": "get",
					"group": "Console Tenant"
				},
				{
					"l": "List tenant application key configuration",
					"v": "/tenant/console/application/key/config",
					"m": "get",
					"group": "Tenant Application"
				},
				{
					"l": "Add product",
					"v": "/product",
					"m": "post",
					"group": "Product"
				},
				{
					"l": "Add a package to product",
					"v": "/product/package",
					"m": "post",
					"group": "Product"
				},
				{
					"l": "Add console product",
					"v": "/product/console",
					"m": "post",
					"group": "Console product"
				},
				{
					"l": "Add a package to console product",
					"v": "/product/console/package",
					"m": "post",
					"group": "Console product"
				},
				{
					"l": "Add tenant with optional application, key, and ext key",
					"v": "/tenant",
					"m": "post",
					"group": "Tenant"
				},
				{
					"l": "Add application to tenant with optional key and ext key",
					"v": "/tenant/application",
					"m": "post",
					"group": "Tenant"
				},
				{
					"l": "Add key to a tenant application with optional ext key",
					"v": "/tenant/application/key",
					"m": "post",
					"group": "Tenant"
				},
				{
					"l": "Add external key to tenant application",
					"v": "/tenant/application/key/ext",
					"m": "post",
					"group": "Tenant"
				},
				{
					"l": "Add application to tenant with optional key and ext key",
					"v": "/admin/tenant/application",
					"m": "post",
					"group": "Admin Tenant"
				},
				{
					"l": "Add key to a tenant application with optional ext key",
					"v": "/admin/tenant/application/key",
					"m": "post",
					"group": "Admin Tenant"
				},
				{
					"l": "Add external key to tenant application",
					"v": "/admin/tenant/application/key/ext",
					"m": "post",
					"group": "Admin Tenant"
				},
				{
					"l": "Add console tenant with optional application, key, and ext key",
					"v": "/tenant/console",
					"m": "post",
					"group": "Console tenant"
				},
				{
					"l": "Add application to console tenant with optional key and ext key",
					"v": "/tenant/console/application",
					"m": "post",
					"group": "Console tenant"
				},
				{
					"l": "Add key to a console tenant application with optional ext key",
					"v": "/tenant/console/application/key",
					"m": "post",
					"group": "Console tenant"
				},
				{
					"l": "Add console external key to tenant application",
					"v": "/tenant/console/application/key/ext",
					"m": "post",
					"group": "Console tenant"
				},
				{
					"l": "Delete product",
					"v": "/product",
					"m": "delete",
					"group": "Product"
				},
				{
					"l": "Delete product package",
					"v": "/product/package",
					"m": "delete",
					"group": "Product"
				},
				{
					"l": "Delete console product",
					"v": "/product/console",
					"m": "delete",
					"group": "Console product"
				},
				{
					"l": "Delete console product package",
					"v": "/product/console/package",
					"m": "delete",
					"group": " Console product"
				},
				{
					"l": "Delete tenant",
					"v": "/tenant",
					"m": "delete",
					"group": "Tenant"
				},
				{
					"l": "Delete tenant application",
					"v": "/tenant/application",
					"m": "delete",
					"group": "Tenant"
				},
				{
					"l": "Delete tenant application key",
					"v": "/tenant/application/key",
					"m": "delete",
					"group": "Tenant"
				},
				{
					"l": "Delete tenant application external key",
					"v": "/tenant/application/key/ext",
					"m": "delete",
					"group": "Tenant Access"
				},
				{
					"l": "Delete console tenant",
					"v": "/tenant/console",
					"m": "delete",
					"group": "Console tenant"
				},
				{
					"l": "Delete console tenant application",
					"v": "/tenant/console/application",
					"m": "delete",
					"group": "Console tenant"
				},
				{
					"l": "Delete console tenant application key",
					"v": "/tenant/console/application/key",
					"m": "delete",
					"group": "Console tenant"
				},
				{
					"l": "Delete console tenant application external key",
					"v": "/tenant/console/application/key/ext",
					"m": "delete",
					"group": "Console tenant"
				},
				{
					"l": "Purge ACL for a product and all its packages",
					"v": "/product/purge",
					"m": "put",
					"group": "Product"
				},
				{
					"l": "Update product",
					"v": "/product",
					"m": "put",
					"group": "Product"
				},
				{
					"l": "Update product ACL scope",
					"v": "/product/scope",
					"m": "put",
					"group": "Product"
				},
				{
					"l": "Update product ACL scope by env",
					"v": "/product/scope/env",
					"m": "put",
					"group": "Product"
				},
				{
					"l": "Update product package",
					"v": "/product/package",
					"m": "put",
					"group": "Product"
				},
				{
					"l": "Update product package ACL by env",
					"v": "/product/package/acl/env",
					"m": "put",
					"group": "Product"
				},
				{
					"l": "Update the ACL of a specific service in the product package",
					"v": "/product/package/acl/service",
					"m": "put",
					"group": "Product"
				},
				{
					"l": "Update the ACL of a specific api in the product package",
					"v": "/product/package/acl/api",
					"m": "put",
					"group": "Product"
				},
				{
					"l": "Update the ACL of a specific service in the product scope",
					"v": "/product/acl/scope/service",
					"m": "put",
					"group": "Product"
				},
				{
					"l": "Update the ACL of a specific api in the product scope",
					"v": "/product/acl/scope/api",
					"m": "put",
					"group": "Product"
				},
				{
					"l": "Update console product",
					"v": "/product/console",
					"m": "put",
					"group": "Console product"
				},
				{
					"l": "Update console product ACL scope",
					"v": "/product/console/scope",
					"m": "put",
					"group": "Console product"
				},
				{
					"l": "Update console product ACL scope by env",
					"v": "/product/console/scope/env",
					"m": "put",
					"group": "Console product"
				},
				{
					"l": "Update console product package",
					"v": "/product/console/package",
					"m": "put",
					"group": "Console product"
				},
				{
					"l": "Update console product package",
					"v": "/product/console/package/acl/env",
					"m": "put",
					"group": "Console product"
				},
				{
					"l": "Update the ACL of a specific service in the product package",
					"v": "/product/console/package/acl/service",
					"m": "put",
					"group": "Product"
				},
				{
					"l": "Update the ACL of a specific api in the product package",
					"v": "/product/console/package/acl/api",
					"m": "put",
					"group": "Product"
				},
				{
					"l": "Update the ACL of a specific service in the product scope",
					"v": "/product/console/acl/scope/service",
					"m": "put",
					"group": "Product"
				},
				{
					"l": "Update the ACL of a specific api in the product scope",
					"v": "/product/console/acl/scope/api",
					"m": "put",
					"group": "Product"
				},
				{
					"l": "Update tenant",
					"v": "/tenant",
					"m": "put",
					"group": "Tenant"
				},
				{
					"l": "Update tenant profile",
					"v": "/tenant/profile",
					"m": "put",
					"group": "Tenant"
				},
				{
					"l": "Update tenant application",
					"v": "/tenant/application",
					"m": "put",
					"group": "Tenant"
				},
				{
					"l": "Update key information for a tenant application",
					"v": "/tenant/application/key",
					"m": "put",
					"group": "Tenant"
				},
				{
					"l": "Update external key information for a tenant application",
					"v": "/tenant/application/key/ext",
					"m": "put",
					"group": "Tenant Access"
				},
				{
					"l": "Update tenant application key configuration",
					"v": "/tenant/application/key/config",
					"m": "put",
					"group": "Tenant Application"
				},
				{
					"l": "Update tenant oauth configuration",
					"v": "/tenant/oauth",
					"m": "put",
					"group": "Tenant"
				},
				{
					"l": "Update tenant",
					"v": "/admin/tenant",
					"m": "put",
					"group": "Admin Tenant"
				},
				{
					"l": "Update profile",
					"v": "/admin/tenant/profile",
					"m": "put",
					"group": "Admin Tenant"
				},
				{
					"l": "Update tenant application",
					"v": "/admin/tenant/application",
					"m": "put",
					"group": "Admin Tenant"
				},
				{
					"l": "Update key information for a tenant application",
					"v": "/admin/tenant/application/key",
					"m": "put",
					"group": "Admin Tenant"
				},
				{
					"l": "Update external key information for a tenant application",
					"v": "/admin/tenant/application/key/ext",
					"m": "put",
					"group": "Admin Tenant"
				},
				{
					"l": "Update tenant application key configuration",
					"v": "/admin/tenant/application/key/config",
					"m": "put",
					"group": "Admin Tenant"
				},
				{
					"l": "Update tenant oauth configuration",
					"v": "/admin/tenant/oauth",
					"m": "put",
					"group": "Admin tenant"
				},
				{
					"l": "Update console tenant",
					"v": "/tenant/console",
					"m": "put",
					"group": "Console tenant"
				},
				{
					"l": "Update tenant profile",
					"v": "/tenant/console/profile",
					"m": "put",
					"group": "Console Tenant"
				},
				{
					"l": "Update console tenant application",
					"v": "/tenant/console/application",
					"m": "put",
					"group": "Console tenant"
				},
				{
					"l": "Update key information for a console tenant application",
					"v": "/tenant/console/application/key",
					"m": "put",
					"group": "Console tenant"
				},
				{
					"l": "Update external key information for a console tenant application",
					"v": "/tenant/console/application/key/ext",
					"m": "put",
					"group": "Console tenant"
				},
				{
					"l": "Update console tenant application key configuration",
					"v": "/tenant/console/application/key/config",
					"m": "put",
					"group": "Console tenant"
				},
				{
					"l": "Update console tenant oauth configuration",
					"v": "/tenant/console/oauth",
					"m": "put",
					"group": "Console tenant"
				}
			]
		}
	],
	"description": "This microservice is handling everything related to multitenancy and productization.",
	"settings": {
		"recipes": [
			"5df3ec10fa3912534948f004"
		]
	}
};