"use strict";

module.exports = {
	"type": "service",
	"name": "oauth",
	"configuration": {
		"group": "Gateway",
		"subType": "soajs",
		"port": 4002,
		"requestTimeout": 30,
		"requestTimeoutRenewal": 5
	},
	"versions": [
		{
			"version": "1",
			"extKeyRequired": true,
			"urac": false,
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
						"label": "Reload Provision",
						"path": "/loadProvision",
						"icon": "fas fa-download"
					},
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
					"l": "Cross environment roaming, but requires IP whitelisting",
					"v": "/roaming",
					"m": "get",
					"group": "Tokenization user"
				},
				{
					"l": "Get information about what third party login is available",
					"v": "/available/login",
					"m": "get",
					"group": "Guest"
				},
				{
					"l": "Get the authorization token",
					"v": "/authorization",
					"m": "get",
					"group": "Guest"
				},
				{
					"l": "Passport login",
					"v": "/passport/login/:strategy",
					"m": "get",
					"group": "Third party login"
				},
				{
					"l": "Passport login validation",
					"v": "/passport/validate/:strategy",
					"m": "get",
					"group": "Third party login"
				},
				{
					"l": "OpenAM login",
					"v": "/openam/login",
					"m": "post",
					"group": "Third party login"
				},
				{
					"l": "Ldap login",
					"v": "/ldap/login",
					"m": "post",
					"group": "Third party login"
				},
				{
					"l": "Create an access token",
					"v": "/token",
					"m": "post",
					"group": "Guest"
				},
				{
					"l": "Create an access token with pin",
					"v": "/pin",
					"m": "post",
					"group": "Tokenization"
				},
				{
					"l": "Delete access token",
					"v": "/accessToken/:token",
					"m": "delete",
					"group": "Tokenization"
				},
				{
					"l": "Delete refresh token",
					"v": "/refreshToken/:token",
					"m": "delete",
					"group": "Tokenization"
				},
				{
					"l": "Delete all tokens for a given user",
					"v": "/tokens/user/:userId",
					"m": "delete",
					"group": "User Tokenization"
				},
				{
					"l": "Delete all tokens for this client (tenant)",
					"v": "/tokens/tenant/:clientId",
					"m": "delete",
					"group": "Cient Tokenization"
				}
			]
		}
	],
	"description": "SOAJS oAuth provides out of the box oAuth 2.0 functionality to validate, refresh and kill generated access tokens without the effort of writing any code.",
	"settings": {
		"recipes": [
			"5df3ec10fa3912534948f006"
		]
	}
};