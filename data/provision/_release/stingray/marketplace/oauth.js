"use strict";

module.exports = {
	"type": "service",
	"name": "oauth",
	"metadata": {
		"tags": ["authentication", "oauth2", "jwt", "multitenant"],
		"attributes": {
			"thirdparty": ["facebook", "google", "twitter", "github"],
			"active directory": ["LDAP", "Azure AD"]
		},
		"program": ["soajs"]
	},
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
			"documentation": {
				"readme": "# soajs.oauth\n[![Build Status](https://travis-ci.org/soajs/soajs.oauth.svg?branch=master)](https://travis-ci.org/soajs/soajs.oauth)\n[![Coverage Status](https://coveralls.io/repos/soajs/soajs.oauth/badge.png)](https://coveralls.io/r/soajs/soajs.oauth)\n[![Known Vulnerabilities](https://snyk.io/test/github/soajs/soajs.oauth/badge.svg)](https://snyk.io/test/github/soajs/soajs.oauth)\n\nSOAJS oAuth is a service that integrates with [oAuth 2.0](http://www.oauth.org).\nThe service simply validates, refreshes and kills access tokens generated via oAuth 2.0.\n\nSOAJS oAuth is used to protect other services from public access.\nProtected services are only accessible if the access_token generated by oAuth is provided as a parameter.\n\n\n### Complete Documentation\nMore information is available on SOAJS website under the section for [oAuth](https://soajsorg.atlassian.net/wiki/x/doApVQ).\n\n### License\n*Copyright SOAJS All Rights Reserved.*\n\nUse of this source code is governed by an Apache license that can be found in the LICENSE file at the root of this repository.\n",
				"release": "# soajs release\n\nSOAJS follows the fish names as release names\n\nWe also push patches per release that are numbered like Kanuy 4, Kanuy 5, …\n\nEach release or patch might affect several repositories and each source code has its own semantic version and each microservice has its own version.\n\n### Complete Documentation\nMore information is available on SOAJS website under the section for [Release](https://soajsorg.atlassian.net/wiki/x/QYCmbw).\n\n### License\n*Copyright SOAJS All Rights Reserved.*\n\nUse of this source code is governed by an Apache license that can be found in the LICENSE file at the root of this repository.\n"
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
					"l": "Create a verification code for that phone",
					"v": "/token/phone",
					"m": "post",
					"group": "Guest"
				},
				{
					"l": "Create an access token for that phone",
					"v": "/token/phone/code",
					"m": "post",
					"group": "Guest"
				},
				{
					"l": "Create an access token",
					"v": "/token/auto/:id",
					"m": "post",
					"group": "Internal"
				},
				{
					"l": "Create an access token",
					"v": "/token",
					"m": "post",
					"group": "Guest"
				},
				{
					"l": "Create an access token by email or username",
					"v": "/token/email",
					"m": "post",
					"group": "Guest"
				},
				{
					"l": "Refresh an access token",
					"v": "/refresh/token",
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
