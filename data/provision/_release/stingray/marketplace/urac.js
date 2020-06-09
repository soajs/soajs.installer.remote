"use strict";

module.exports = {
	type: "service",
	name: "urac",
	description: "User Registration and Access Control ( URAC ), is a SOAJS multi-tenant service to manage users accounts, groups and access levels for all tenants.",
	configuration: {
		group: "Gateway",
		subType: "soajs",
		port: 4001,
		requestTimeout: 30,
		requestTimeoutRenewal: 5
	},
	versions: [
		{
			version: "3",
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
					l: "Forgot password by username as (username or email) - an email will be sent with a link to reset the password",
					v: "/password/forgot",
					m: "get",
					group: "My account guest"
				},
				{
					l: "To validate user account after joining",
					v: "/validate/join",
					m: "get",
					group: "Guest join"
				},
				{
					l: "Check if a username as (username or email) is available or taken",
					v: "/checkUsername",
					m: "get",
					group: "Guest join"
				},
				{
					l: "Check if user (username or email) status if pendingJoin or pendingNew and send a new token email",
					v: "/emailToken",
					m: "get",
					group: "My account guest"
				},
				{
					l: "To validate change email",
					v: "/validate/changeEmail",
					m: "get",
					group: "My account guest"
				},
				{
					l: "Get user account information by username as (username or email)",
					v: "/user",
					m: "get",
					group: "My account"
				},
				{
					l: "Get user by id",
					v: "/admin/user",
					m: "get",
					group: "User administration"
				},
				{
					l: "List users matching certain keywords",
					v: "/admin/users",
					m: "get",
					group: "User administration"
				},
				{
					l: "Get users count matching certain keywords",
					v: "/admin/users/count",
					m: "get",
					group: "User administration"
				},
				{
					l: "List all groups",
					v: "/admin/groups",
					m: "get",
					group: "Group administration"
				},
				{
					l: "Get group by id or code",
					v: "/admin/group",
					m: "get",
					group: "Group administration"
				},
				{
					l: "Get all users and groups of a main tenant",
					v: "/admin/all",
					m: "get",
					group: "Administration"
				},
				{
					l: "Send custom email",
					v: "/email",
					m: "post",
					group: "Custom email"
				},
				{
					l: "Join and create an account",
					v: "/join",
					m: "post",
					group: "Guest join"
				},
				{
					l: "Add user",
					v: "/admin/user",
					m: "post",
					group: "User administration"
				},
				{
					l: "List users by Id",
					v: "/admin/users/ids",
					m: "post",
					group: "User administration"
				},
				{
					l: "Add group",
					v: "/admin/group",
					m: "post",
					group: "Group administration"
				},
				{
					l: "Delete group",
					v: "/admin/group",
					m: "delete",
					group: "Group administration"
				},
				{
					l: "Reset password",
					v: "/password/reset",
					m: "put",
					group: "My account guest"
				},
				{
					l: "Change account's password by id",
					v: "/account/password",
					m: "put",
					group: "My account"
				},
				{
					l: "Change account's email by id",
					v: "/account/email",
					m: "put",
					group: "My account"
				},
				{
					l: "Edit account's information by id",
					v: "/account",
					m: "put",
					group: "My account"
				},
				{
					l: "Edit user by id",
					v: "/admin/user",
					m: "put",
					group: "User administration"
				},
				{
					l: "Edit user's groups by id, username, or email",
					v: "/admin/user/groups",
					m: "put",
					group: "User administration"
				},
				{
					l: "Edit, reset, or delete user's pin information by id, username, or email",
					v: "/admin/user/pin",
					m: "put",
					group: "User administration"
				},
				{
					l: "Change the status of a user by id",
					v: "/admin/user/status",
					m: "put",
					group: "User administration"
				},
				{
					l: "Edit group by id",
					v: "/admin/group",
					m: "put",
					group: "Group administration"
				},
				{
					l: "Update environment(s) of group(s) by code(s) or id(s)",
					v: "/admin/groups/environments",
					m: "put",
					group: "Group administration"
				},
				{
					l: "Update package(s) of group(s) by code(s) or id(s)",
					v: "/admin/groups/packages",
					m: "put",
					group: "Group administration"
				},
				{
					l: "Self Invite user by id or username as username or email",
					v: "/admin/user/self/invite",
					m: "put",
					group: "User administration"
				},
				{
					l: "Invite users by id, username or email",
					v: "/admin/users/invite",
					m: "put",
					group: "User administration"
				},
				{
					l: "un-Invite users by id, username or email",
					v: "/admin/users/uninvite",
					m: "put",
					group: "User administration"
				}
			]
		}
	]
};