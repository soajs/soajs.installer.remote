'use strict';

let doc = {
	"_id": "5512867be603d7e01ab1688d",
	"locked": true,
	"code": "DSBRD",
	"console": true,
	"name": "Console UI Product",
	"description": "This is the main Console UI Product.",
	"scope": {
		"acl": {
			"dashboard": {
				"urac": {
					"3": {
						"access": true,
						"apisPermission": "restricted",
						"get": [
							{
								"group": "Administration",
								"apis": {
									"/admin/all": {
										"access": true
									}
								}
							}, {
								"group": "User administration",
								"apis": {
									"/admin/users": {
										"access": true
									}
								}
							},
							{
								"group": "Group administration",
								"apis": {
									"/admin/groups": {
										"access": true
									}
								}
							}, {
								"group": "My account",
								"apis": {
									"/user": {
										"access": true
									}
								}
							}, {
								"group": "My account guest",
								"apis": {
									"/password/forgot": {
										"access": false
									},
									"/validate/changeEmail": {
										"access": true
									},
								}
							}],
						"post": [
							{
								"group": "User administration",
								"apis": {
									"/admin/user": {
										"access": true
									}
								}
							},
							{
								"group": "Group administration",
								"apis": {
									"/admin/group": {
										"access": true
									}
								}
							}],
						"put": [
							{
								"group": "User administration",
								"apis": {
									"/admin/user/status": {
										"access": true
									},
									"/admin/user": {
										"access": true
									},
								}
							},
							{
								"group": "Group administration",
								"apis": {
									"/admin/group": {
										"access": true
									},
									"/admin/groups/environments": {
										"access": true
									}
								}
							},
							{
								"group": "My account",
								"apis": {
									"/account/email": {
										"access": true
									},
									"/account/password": {
										"access": true
									},
									"/account": {
										"access": true
									}
								}
							},
							{
								"group": "My account guest",
								"apis": {
									"/password/reset": {
										"access": false
									}
								}
							}
						],
						"delete": [{
							"group": "Group administration",
							"apis": {
								"/admin/group": {
									"access": true
								}
							}
						}]
					}
				},
				"dashboard": {
					"1": {
						"access": true,
						"post": [{
							"group": "Continuous Delivery Deployment",
							"apis": {
								"/cd/deploy": {
									"access": false
								}
							}
						}]
					}
				},
				"oauth": {
					"1": {
						"access": true,
						"apisPermission": "restricted",
						"delete": [{
							"group": "Tokenization",
							"apis": {
								"/refreshToken/:token": {
									"access": true
								},
								"/accessToken/:token": {
									"access": true
								}
							}
						}, {
							"group": "User Tokenization",
							"apis": {
								"/tokens/user/:userId": {
									"access": true
								}
							}
						}, {
							"group": "Cient Tokenization",
							"apis": {
								"/tokens/tenant/:clientId": {
									"access": true
								}
							}
						}],
						"post": [{
							"group": "Tokenization",
							"apis": {
								"/pin": {
									"access": true
								}
							}
						}, {
							"group": "Guest",
							"apis": {
								"/token": {
									"access": false
								}
							}
						}],
						"get": [{
							"group": "Guest",
							"apis": {
								"/authorization": {
									"access": false
								}
							}
						}]
					}
				},
				"multitenant": {
					"1": {
						"access": false,
						"apisPermission": "restricted",
						"get": [
							{
								"group": "Product",
								"apis": {
									"/products": {},
									"/product": {},
									"/product/packages": {},
									"/product/package": {}
								}
							},
							{
								"group": "Console product",
								"apis": {
									"/products/console": {}
								}
							},
							{
								"group": "Tenant",
								"apis": {
									"/tenants": {},
									"/tenant": {},
									"/tenant/application": {},
									"/tenant/applications": {},
									"/tenant/application/key/ext": {}
								}
							},
							{
								"group": "Admin Tenant",
								"apis": {
									"/admin/tenant": {},
									"/admin/tenant/application": {},
									"/admin/tenant/applications": {},
									"/admin/tenant/application/key/ext": {}
								}
							}
						],
						"post": [
							{
								"group": "Product",
								"apis": {
									"/product": {},
									"/product/package": {}
								}
							},
							{
								"group": "Tenant",
								"apis": {
									"/tenant": {},
									"/tenant/application": {},
									"/tenant/application/key": {}
								}
							},
							{
								"group": "Admin Tenant",
								"apis": {
									"/admin/tenant/application": {},
									"/admin/tenant/application/key": {},
									"/admin/tenant/application/key/ext": {}
								}
							},
							{
								"group": "Tenant Access",
								"apis": {
									"/tenant/application/key/ext": {}
								}
							}
						],
						"delete": [
							{
								"group": "Product",
								"apis": {
									"/product": {},
									"/product/package": {}
								}
							},
							{
								"group": "Tenant",
								"apis": {
									"/tenant": {},
									"/tenant/application": {},
									"/tenant/application/key": {}
								}
							},
							{
								"group": "Tenant Access",
								"apis": {
									"/tenant/application/key/ext": {}
								}
							}
						],
						"put": [
							{
								"group": "Product",
								"apis": {
									"/product/purge": {},
									"/product": {},
									"/product/scope": {},
									"/product/package": {}
								}
							},
							{
								"group": "Tenant",
								"apis": {
									"/tenant": {},
									"/tenant/profile": {},
									"/tenant/application": {},
									"/tenant/application/key": {}
								}
							},
							{
								"group": "Admin Tenant",
								"apis": {
									"/admin/tenant": {},
									"/admin/tenant/application/key/ext": {},
									"/admin/tenant/application/key": {},
									"/admin/tenant/application": {},
									"/admin/tenant/profile": {}
								}
							},
							{
								"group": "Tenant Access",
								"apis": {
									"/tenant/application/key/ext": {}
								}
							}
						]
					}
				}
			}
		},
	},
	"packages": [
		{
			"code": "DSBRD_GUEST",
			"name": "Guest",
			"locked": true,
			"description": "This package is used to provide anyone access to login and forgot password. Once logged in the package linked to the user tenant will take over thus providing the right access to the logged in user.",
			"acl": {
				"dashboard": {
					"oauth": [{
						"version": "1",
						"get": ["Guest"],
						"post": ["Guest", "Tokenization"],
						"delete": ["Tokenization"]
					}],
					"urac": [{
						"version": "3",
						"put": ["My account guest"],
						"get": ["My account guest"]
					}],
					"dashboard": [{
						"version": "1",
						"post": ["Private Tenant ACL"]
					}]
				}
			},
			"_TTL": 604800000
		},
		{
			"code": "DSBRD_OWNER",
			"name": "Owner",
			"description": "This package is used to provide owner level access. This means the user who has this package will have access to everything.",
			"locked": true,
			"acl": {
				"dashboard": {
					"oauth": [{
						"version": "1",
						"get": ["Guest"],
						"post": ["Guest", "Tokenization"],
						"delete": ["Tokenization", "User Tokenization", "Cient Tokenization"]
					}],
					"urac": [{
						"version": "3",
						"get": ["My account guest", "Administration", "My account", "User administration", "Group administration"],
						"post": ["User administration", "Group administration"],
						"put": ["My account guest", "My account", "User administration", "Group administration"],
						"delete": ["Group administration"]
					}],
					"dashboard": [{
						"version": "1",
						"get": ["Continuous Delivery", "Environment", "Templates", "Environment Databases", "Resources", "Custom Registry", "Environment Platforms", "Product", "Console Product", "Tenant", "Console Tenant", "Tenant oAuth", "Tenant Application", "Dashboard Tenants", "Tenant Settings", "Services", "Daemons", "Hosts", "HA Cloud", "Catalog", "Infra Providers", "API Builder", "Secrets", "Git Accounts", "Continuous Integration"],
						"post": ["Continuous Delivery", "Environment", "Templates", "Environment Databases", "Resources", "Custom Registry", "Environment Platforms", "Product", "Tenant", "Tenant oAuth", "Tenant Application", "Tenant Settings", "Services", "Daemons", "Hosts", "HA Cloud", "Catalog", "Infra Providers", "API Builder", "Secrets", "Git Accounts", "Continuous Integration", "swagger", "Simulate", "Continuous Delivery Deployment", "Private Tenant ACL"],
						"put": ["Continuous Delivery", "Environment", "Environment Databases", "Resources", "Custom Registry", "Environment Platforms", "Product", "Tenant", "Tenant oAuth", "Tenant Application", "Tenant Settings", "Services", "Daemons", "HA Cloud", "Catalog", "Infra Providers", "API Builder", "Git Accounts", "Continuous Integration", "Owner HA Cloud"],
						"delete": ["Environment", "Templates", "Environment Databases", "Resources", "Custom Registry", "Environment Platforms", "Product", "Tenant", "Tenant oAuth", "Tenant Application", "Tenant Settings", "Daemons", "HA Cloud", "Catalog", "Infra Providers", "API Builder", "Secrets", "Git Accounts", "Continuous Integration"]
					}]
				}
			},
			"_TTL": 604800000
		},
		{
			"code": "DSBRD_DEVOP",
			"name": "DevOps",
			"locked": true,
			"description": "This package has the right privileges a DevOps user will need to be able to configure, control, and monitor what is happening across the board.",
			"acl": {
				"dashboard": {
					"oauth": [{
						"version": "1",
						"delete": ["Tokenization", "User Tokenization", "Cient Tokenization"],
						"post": ["Tokenization", "Guest"],
						"get": ["Guest"]
					}],
					"urac": [{
						"version": "3",
						"get": ["My account guest", "My account"],
						"put": ["My account", "My account guest"]
					}],
					"dashboard": [{
						"version": "1",
						"get": ["Continuous Delivery", "Environment", "Templates", "Environment Databases", "Resources", "Custom Registry", "Environment Platforms", "Tenant Settings", "Services", "Daemons", "Hosts", "HA Cloud", "Catalog", "Git Accounts", "API Builder", "Secrets", "Dashboard Tenants", "Product", "Tenant", "Tenant oAuth", "Tenant Application"],
						"post": ["Continuous Delivery", "Environment", "Environment Databases", "Resources", "Custom Registry", "Environment Platforms", "Tenant Settings", "Services", "Daemons", "Hosts", "HA Cloud", "Catalog", "Git Accounts", "API Builder", "Secrets", "Product", "Tenant", "Tenant oAuth", "Tenant Application", "swagger", "Simulate", "Continuous Delivery Deployment", "Private Tenant ACL"],
						"put": ["Continuous Delivery", "Environment", "Environment Databases", "Resources", "Custom Registry", "Environment Platforms", "Tenant Settings", "Services", "HA Cloud", "Catalog", "Git Accounts", "API Builder", "Product", "Tenant", "Tenant oAuth", "Tenant Application"],
						"delete": ["Environment", "Environment Databases", "Resources", "Custom Registry", "Environment Platforms", "Tenant Settings", "Daemons", "HA Cloud", "Catalog", "Git Accounts", "API Builder", "Product", "Tenant", "Tenant oAuth", "Tenant Application"]
					}]
				}
			},
			"_TTL": 604800000
		},
		{
			"code": "DSBRD_DEVEL",
			"name": "Developer",
			"locked": true,
			"description": "This package is ideal for a developer. You are not giving much access but yet it is enough to sail and fast.",
			"acl": {
				"dashboard": {
					"oauth": [{
						"version": "1",
						"delete": ["Tokenization", "User Tokenization", "Cient Tokenization"],
						"post": ["Tokenization", "Guest"],
						"get": ["Guest"]
					}],
					"urac": [{
						"version": "3",
						"get": ["My account", "My account guest"],
						"put": ["My account", "My account guest"]
					}],
					"dashboard": [{
						"version": "1",
						"get": ["Continuous Delivery", "Environment", "Templates", "Environment Databases", "Resources", "Custom Registry", "Environment Platforms", "Services", "Daemons", "Hosts", "HA Cloud", "Catalog", "Continuous Integration", "Git Accounts", "API Builder", "Secrets"],
						"post": ["Continuous Delivery", "Environment", "Templates", "Environment Databases", "Resources", "Custom Registry", "Environment Platforms", "Services", "Daemons", "Hosts", "HA Cloud", "Continuous Integration", "Git Accounts", "API Builder", "Secrets", "Private Tenant ACL", "Continuous Delivery Deployment", "Simulate", "swagger"],
						"put": ["Continuous Delivery", "Environment", "Environment Databases", "Resources", "Custom Registry", "Environment Platforms", "Services", "Daemons", "HA Cloud", "Continuous Integration", "Git Accounts", "API Builder"],
						"delete": ["Environment", "Templates", "Environment Databases", "Resources", "Custom Registry", "Environment Platforms", "Daemons", "HA Cloud", "Continuous Integration", "Git Accounts", "API Builder", "Secrets"]
					}],
				}
			},
			"_TTL": 21600000
		},
		{
			"code": "DSBRD_INTG",
			"name": "Integration Package",
			"locked": true,
			"description": "Integration Package is ideal to help you change SOAJS Configuration Programmatically via API.",
			"acl": {
				"dashboard": {
					"oauth": [
						{
							"version": "1",
							"post": [
								"Guest",
								"Tokenization"
							],
							"get": [
								"Guest"
							],
							"delete": [
								"Tokenization",
								"Cient Tokenization",
								"User Tokenization"
							]
						}
					],
					"multitenant": [
						{
							"version": "1",
							"get": [
								"Product",
								"Tenant",
								"Admin Tenant"
							],
							"post": [
								"Product",
								"Tenant",
								"Admin Tenant",
								"Tenant Access"
							],
							"delete": [
								"Product",
								"Tenant",
								"Tenant Access"
							],
							"put": [
								"Product",
								"Tenant",
								"Admin Tenant",
								"Tenant Access"
							]
						}
					]
				}
			},
			_TTL: 21600000
		}
	]
};

module.exports = doc;