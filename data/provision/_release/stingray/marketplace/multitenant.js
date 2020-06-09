"use strict";

module.exports = {
	type: "service",
	name: "multitenant",
	description: "This microservice is handling everything related to multitenancy and productization.",
	subType: "soajs",
	configuration: {
		group: "Console",
		port: 4004,
		requestTimeout: 30,
		requestTimeoutRenewal: 5
	},
	versions: [
		{
			version: "1",
			extKeyRequired: true,
			urac: false,
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
					l: "List products",
					v: "/products",
					m: "get",
					group: "Product",
					groupMain: true
				},
				{
					l: "List console products",
					v: "/products/console",
					m: "get",
					group: "Console product",
					groupMain: true
				},
				{
					l: "Get product",
					v: "/product",
					m: "get",
					group: "Product",
					groupMain: true
				},
				{
					l: "List product packages",
					v: "/product/packages",
					m: "get",
					group: "Product"
				},
				{
					l: "Get product package",
					v: "/product/package",
					m: "get",
					group: "Product"
				},
				{
					l: "List tenants",
					v: "/tenants",
					m: "get",
					group: "Tenant"
				},
				{
					l: "Get tenant",
					v: "/tenant",
					m: "get",
					group: "Tenant"
				},
				{
					l: "Get tenant",
					v: "/admin/tenant",
					m: "get",
					group: "Admin Tenant"
				},
				{
					l: "Get tenant application",
					v: "/tenant/application",
					m: "get",
					group: "Tenant"
				},
				{
					l: "Get tenant application",
					v: "/admin/tenant/application",
					m: "get",
					group: "Admin Tenant"
				},
				{
					l: "List tenant applications",
					v: "/tenant/applications",
					m: "get",
					group: "Tenant"
				},
				{
					l: "List tenant applications",
					v: "/admin/tenant/applications",
					m: "get",
					group: "Admin Tenant"
				},
				{
					l: "List tenant application ext keys",
					v: "/tenant/application/key/ext",
					m: "get",
					group: "Tenant"
				},
				{
					l: "List tenant application ext keys",
					v: "/admin/tenant/application/key/ext",
					m: "get",
					group: "Admin Tenant"
				},
				{
					l: "Add product",
					v: "/product",
					m: "post",
					group: "Product",
					groupMain: true
				},
				{
					l: "Add package to product",
					v: "/product/package",
					m: "post",
					group: "Product"
				},
				{
					l: "Add tenant with optional application, key, and ext key",
					v: "/tenant",
					m: "post",
					group: "Tenant"
				},
				{
					l: "Add application to tenant with optional key and ext key",
					v: "/tenant/application",
					m: "post",
					group: "Tenant"
				},
				{
					l: "Add application to tenant with optional key and ext key",
					v: "/admin/tenant/application",
					m: "post",
					group: "Admin Tenant"
				},
				{
					l: "Add key to a tenant application with optional ext key",
					v: "/tenant/application/key",
					m: "post",
					group: "Tenant"
				},
				{
					l: "Add key to a tenant application with optional ext key",
					v: "/admin/tenant/application/key",
					m: "post",
					group: "Admin Tenant"
				},
				{
					l: "Add external key to tenant application",
					v: "/tenant/application/key/ext",
					m: "post",
					group: "Tenant Access"
				},
				{
					l: "Add external key to tenant application",
					v: "/admin/tenant/application/key/ext",
					m: "post",
					group: "Admin Tenant"
				},
				{
					l: "Delete product",
					v: "/product",
					m: "delete",
					group: "Product",
					groupMain: true
				},
				{
					l: "Delete product package",
					v: "/product/package",
					m: "delete",
					group: "Product"
				},
				{
					l: "Delete Tenant",
					v: "/tenant",
					m: "delete",
					group: "Tenant"
				},
				{
					l: "Delete tenant application",
					v: "/tenant/application",
					m: "delete",
					group: "Tenant"
				},
				{
					l: "Delete tenant application key",
					v: "/tenant/application/key",
					m: "delete",
					group: "Tenant"
				},
				{
					l: "Delete tenant application external key",
					v: "/tenant/application/key/ext",
					m: "delete",
					group: "Tenant Access"
				},
				{
					l: "Purge ACL for a Product and all its packages",
					v: "/product/purge",
					m: "put",
					group: "Product"
				},
				{
					l: "Update product",
					v: "/product",
					m: "put",
					group: "Product"
				},
				{
					l: "Update product ACL scope",
					v: "/product/scope",
					m: "put",
					group: "Product"
				},
				{
					l: "Update product ACL scope by env",
					v: "/product/scope/env",
					m: "put",
					group: "Product"
				},
				{
					l: "Update product package",
					v: "/product/package",
					m: "put",
					group: "Product"
				},
				{
					l: "Update product package",
					v: "/product/package/acl/env",
					m: "put",
					group: "Product"
				},
				{
					l: "Update tenant",
					v: "/tenant",
					m: "put",
					group: "Tenant"
				},
				{
					l: "Update tenant",
					v: "/admin/tenant",
					m: "put",
					group: "Admin Tenant"
				},
				{
					l: "Update profile",
					v: "/tenant/profile",
					m: "put",
					group: "Tenant"
				},
				{
					l: "Update profile",
					v: "/admin/tenant/profile",
					m: "put",
					group: "Admin Tenant"
				},
				{
					l: "Update tenant application",
					v: "/tenant/application",
					m: "put",
					group: "Tenant"
				},
				{
					l: "Update tenant application",
					v: "/admin/tenant/application",
					m: "put",
					group: "Admin Tenant"
				},
				{
					l: "Update key information for a tenant application",
					v: "/tenant/application/key",
					m: "put",
					group: "Tenant"
				},
				{
					l: "Update key information for a tenant application",
					v: "/admin/tenant/application/key",
					m: "put",
					group: "Admin Tenant"
				},
				{
					l: "Update external key information for a tenant application",
					v: "/tenant/application/key/ext",
					m: "put",
					group: "Tenant Access"
				},
				{
					l: "Update external key information for a tenant application",
					v: "/admin/tenant/application/key/ext",
					m: "put",
					group: "Admin Tenant"
				}
			]
		}
	]
};