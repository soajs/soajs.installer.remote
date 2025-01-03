"use strict";

module.exports = {
	"type": "service",
	"name": "urac",
	"metadata": {
		"tags": [
			"users",
			"registration",
			"groups",
			"membership",
			"join"
		],
		"attributes": {
			"authentication": [
				"multitenant",
				"roaming",
				"invitation"
			],
			"role": [
				"management",
				"acl"
			]
		},
		"program": [
			"soajs"
		]
	},
	"configuration": {
		"group": "Gateway",
		"subType": "soajs",
		"port": 4001,
		"requestTimeout": 30,
		"requestTimeoutRenewal": 5
	},
	"versions": [
		{
			"version": "3",
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
					"name": "oauth",
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
				"readme": "# soajs.urac\n[![Build Status](https://travis-ci.org/soajs/soajs.urac.svg?branch=master)](https://travis-ci.org/soajs/soajs.urac)\n[![Coverage Status](https://coveralls.io/repos/soajs/soajs.urac/badge.png)](https://coveralls.io/r/soajs/soajs.urac)\n[![Known Vulnerabilities](https://snyk.io/test/github/soajs/soajs.urac/badge.svg)](https://snyk.io/test/github/soajs/soajs.urac)\n\nSOAJS URAC is a service that manages all users accounts for all tenants.\n\nThis service is also equipped with an optional mail notification system that is configurable.\n\nThe URAC offers the ability to override the service access level as well as configuration for specific users.\n\nThe service is Multitenant and provides the:\n\n* ability for administrators to control user accounts, groups and access levels.\n* ability to update profile and preferences for logged in members.\n* ability to register and login for anonymous users.\n\n### Complete Documentation\nMore information is available on SOAJS website under the section for [URAC](https://soajsorg.atlassian.net/wiki/x/AQArVQ).\n\n\n### License\n*Copyright SOAJS All Rights Reserved.*\n\nUse of this source code is governed by an Apache license that can be found in the LICENSE file at the root of this repository.\n",
				"release": "# soajs release\n\nSOAJS follows the fish names as release names\n\nWe also push patches per release that are numbered like Kanuy 4, Kanuy 5, …\n\nEach release or patch might affect several repositories and each source code has its own semantic version and each microservice has its own version.\n\n### Complete Documentation\nMore information is available on SOAJS website under the section for [Release](https://soajsorg.atlassian.net/wiki/x/QYCmbw).\n\n### License\n*Copyright SOAJS All Rights Reserved.*\n\nUse of this source code is governed by an Apache license that can be found in the LICENSE file at the root of this repository.\n"
			},
			"apis": [
				{
					"l": "Forgot password by username as (username or email) - a code will be emailed",
					"v": "/password/forgot/code",
					"m": "get",
					"group": "My account guest"
				},
				{
					"l": "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
					"v": "/password/forgot",
					"m": "get",
					"group": "My account guest"
				},
				{
					"l": "To validate user account after joining",
					"v": "/validate/join/code",
					"m": "get",
					"group": "Guest join"
				},
				{
					"l": "To validate user account after joining",
					"v": "/validate/join",
					"m": "get",
					"group": "Guest join"
				},
				{
					"l": "Check if a username as (username or email) is available or taken",
					"v": "/checkUsername",
					"m": "get",
					"group": "Guest join"
				},
				{
					"l": "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
					"v": "/emailToken",
					"m": "get",
					"group": "My account guest"
				},
				{
					"l": "Check if user (username or email) status if pendingJoin and send a new token and new code",
					"v": "/resend/code",
					"m": "get",
					"group": "My account guest"
				},
				{
					"l": "To validate change email",
					"v": "/validate/changeEmail",
					"m": "get",
					"group": "My account guest"
				},
				{
					"l": "To validate change phone",
					"v": "/validate/changePhone",
					"m": "get",
					"group": "My account"
				},
				{
					"l": "Get user account information by username as (username or email)",
					"v": "/user",
					"m": "get",
					"group": "My account"
				},
				{
					"l": "Get logged in user tenants",
					"v": "/user/tenants",
					"m": "get",
					"group": "User administration"
				},
				{
					"l": "Get logged in user account information ",
					"v": "/user/me",
					"m": "get",
					"group": "My account"
				},
				{
					"l": "List users matching certain keywords",
					"v": "/users",
					"m": "get",
					"group": "User"
				},
				{
					"l": "Get user by id",
					"v": "/admin/user",
					"m": "get",
					"group": "User administration"
				},
				{
					"l": "List users matching certain keywords",
					"v": "/admin/users",
					"m": "get",
					"group": "User administration"
				},
				{
					"l": "Get users count matching certain keywords",
					"v": "/admin/users/count",
					"m": "get",
					"group": "User administration"
				},
				{
					"l": "List users matching certain keywords",
					"v": "/api-v2/admin/users",
					"m": "get",
					"group": "User administration"
				},
				{
					"l": "List all groups",
					"v": "/admin/groups",
					"m": "get",
					"group": "Group administration"
				},
				{
					"l": "List all groups",
					"v": "/admin/groups/tenant",
					"m": "get",
					"group": "Group administration"
				},
				{
					"l": "Get group by id or code",
					"v": "/admin/group",
					"m": "get",
					"group": "Group administration"
				},
				{
					"l": "Get all users and groups of a main tenant",
					"v": "/admin/all",
					"m": "get",
					"group": "Administration"
				},
				{
					"l": "Get tokens for a specific service",
					"v": "/admin/tokens",
					"m": "get",
					"group": "Administration"
				},
				{
					"l": "Send custom email",
					"v": "/email",
					"m": "post",
					"group": "Custom email"
				},
				{
					"l": "Invite to join - a link to join will be sent by email and a code will be sent by sms or email.",
					"v": "/invite",
					"m": "post",
					"group": "User administration"
				},
				{
					"l": "Join and create an account by invitation",
					"v": "/join/invite/phone",
					"m": "post",
					"group": "Guest join"
				},
				{
					"l": "Join and create an account by invitation",
					"v": "/join/invite",
					"m": "post",
					"group": "Guest join"
				},
				{
					"l": "Join and create an account",
					"v": "/join",
					"m": "post",
					"group": "Guest join"
				},
				{
					"l": "Join and create an account",
					"v": "/join/code",
					"m": "post",
					"group": "Guest join"
				},
				{
					"l": "Add user",
					"v": "/admin/user",
					"m": "post",
					"group": "User administration"
				},
				{
					"l": "Add user",
					"v": "/admin/user/tenant",
					"m": "post",
					"group": "User administration"
				},
				{
					"l": "List users by Id",
					"v": "/admin/users/ids",
					"m": "post",
					"group": "User administration"
				},
				{
					"l": "Add group",
					"v": "/admin/group",
					"m": "post",
					"group": "Group administration"
				},
				{
					"l": "Add groups",
					"v": "/admin/groups",
					"m": "post",
					"group": "Group administration"
				},
				{
					"l": "Delete group",
					"v": "/admin/group",
					"m": "delete",
					"group": "Group administration"
				},
				{
					"l": "Delete user",
					"v": "/admin/user",
					"m": "delete",
					"group": "User administration"
				},
				{
					"l": "Reset password",
					"v": "/password/reset",
					"m": "put",
					"group": "My account guest"
				},
				{
					"l": "Change account's password by id",
					"v": "/account/password",
					"m": "put",
					"group": "My account"
				},
				{
					"l": "Change account's email by id",
					"v": "/account/email",
					"m": "put",
					"group": "My account"
				},
				{
					"l": "Change account's phone by id",
					"v": "/account/phone",
					"m": "put",
					"group": "My account"
				},
				{
					"l": "Change account's email by id - a code will be emailed",
					"v": "/account/email/code",
					"m": "put",
					"group": "My account"
				},
				{
					"l": "Edit account's information by id",
					"v": "/account",
					"m": "put",
					"group": "My account"
				},
				{
					"l": "Change account's password by id",
					"v": "/admin/account/password",
					"m": "put",
					"group": "My account"
				},
				{
					"l": "Edit user by id",
					"v": "/admin/user",
					"m": "put",
					"group": "User administration"
				},
				{
					"l": "Edit user's groups by id, username, or email for an invited tenant",
					"v": "/admin/user/invited/groups",
					"m": "put",
					"group": "User administration"
				},
				{
					"l": "Edit user's groups by id, username, or email",
					"v": "/admin/user/groups",
					"m": "put",
					"group": "User administration"
				},
				{
					"l": "Edit, reset, or delete user's pin information by id, username, or email",
					"v": "/admin/user/pin",
					"m": "put",
					"group": "User administration"
				},
				{
					"l": "Change the status of a user by id",
					"v": "/admin/user/status",
					"m": "put",
					"group": "User administration"
				},
				{
					"l": "Edit group by id",
					"v": "/admin/group",
					"m": "put",
					"group": "Group administration"
				},
				{
					"l": "Update environment(s) of group(s) by code(s) or id(s)",
					"v": "/admin/groups/environments",
					"m": "put",
					"group": "Group administration"
				},
				{
					"l": "Update package(s) of group(s) by code(s) or id(s)",
					"v": "/admin/groups/packages",
					"m": "put",
					"group": "Group administration"
				},
				{
					"l": "Self Invite user by id or username as username or email",
					"v": "/admin/user/self/invite",
					"m": "put",
					"group": "User administration"
				},
				{
					"l": "Invite users by id, username or email",
					"v": "/admin/users/invite",
					"m": "put",
					"group": "User administration"
				},
				{
					"l": "Invite users by id, username or email",
					"v": "/admin/users/invite/tenant",
					"m": "put",
					"group": "User administration"
				},
				{
					"l": "un-Invite users by id, username or email",
					"v": "/admin/users/uninvite",
					"m": "put",
					"group": "User administration"
				},
				{
					"l": "un-Invite users by id, username or email",
					"v": "/admin/users/uninvite/tenant",
					"m": "put",
					"group": "User administration"
				}
			]
		}
	],
	"description": "User Registration and Access Control ( URAC ), is a SOAJS multi-tenant service to manage users accounts, groups and access levels for all tenants.",
	"settings": {
		"recipes": [
			"5df3ec10fa3912534948f008"
		]
	}
};
