'use strict';

let services = [
	{
		_id: "5db1f85be9253564357b303c",
		name: "controller",
		program: [
			"soajs"
		],
		port: 4000,
		src: {
			provider: "github",
			owner: "soajs",
			repo: "soajs.controller"
		},
		maintenance: {
			port: {
				type: "maintenance"
			},
			readiness: "/heartbeat",
			commands: [
				{
					label: "Releoad Registry",
					path: "/reloadRegistry",
					icon: "registry"
				},
				{
					label: "Statistics Info",
					path: "/awarenessStat",
					icon: "awareness"
				},
				{
					label: "Releoad Provision Info",
					path: "/loadProvision",
					icon: "provision"
				}
			]
		}
	},
	{
		_id: "5db1f85be9253564357b303e",
		name: "urac",
		group: "SOAJS Core Services",
		program: [
			"soajs"
		],
		port: 4001,
		requestTimeout: 30,
		requestTimeoutRenewal: 5,
		swagger: false,
		src: {
			provider: "github",
			owner: "soajs",
			repo: "soajs.urac"
		},
		maintenance: {
			port: {
				type: "maintenance"
			},
			readiness: "/heartbeat",
			commands: [
				{
					label: "Releoad Registry",
					path: "/reloadRegistry",
					icon: "registry"
				},
				{
					label: "Resource Info",
					path: "/resourceInfo",
					icon: "info"
				}
			]
		},
		versions: {
			"2": {
				apis: [
					{
						l: "Login Through Passport",
						v: "/passport/login/:strategy",
						m: "get",
						group: "Guest Login(s)"
					},
					{
						l: "Login Through Passport Callback",
						v: "/passport/validate/:strategy",
						m: "get",
						group: "Guest Login(s)"
					},
					{
						l: "Validate registered account",
						v: "/join/validate",
						m: "get",
						group: "Guest Join"
					},
					{
						l: "Forgot Password",
						v: "/forgotPassword",
						m: "get",
						group: "Guest Password Settings"
					},
					{
						l: "Check If Username Exists",
						v: "/checkUsername",
						m: "get",
						group: "Guest Check Username"
					},
					{
						l: "Validate change email address",
						v: "/changeEmail/validate",
						m: "get",
						group: "Guest Email Validation"
					},
					{
						l: "Get User Info by username",
						v: "/account/getUser",
						m: "get",
						group: "My Account",
						groupMain: true
					},
					{
						l: "Change user status",
						v: "/admin/changeUserStatus",
						m: "get",
						group: "Administration"
					},
					{
						l: "List users",
						v: "/admin/listUsers",
						m: "get",
						group: "Administration",
						groupMain: true
					},
					{
						l: "List users by Id",
						v: "/admin/listUsers/uId",
						m: "get",
						group: "Administration",
						groupMain: true
					},
					{
						l: "Total users count",
						v: "/admin/users/count",
						m: "get",
						group: "Administration"
					},
					{
						l: "Get user record by _id",
						v: "/admin/getUser",
						m: "get",
						group: "Administration"
					},
					{
						l: "List groups",
						v: "/admin/group/list",
						m: "get",
						group: "Administration"
					},
					{
						l: "Get group record by _id",
						v: "/admin/group",
						m: "get",
						group: "Administration"
					},
					{
						l: "Get all users & groups",
						v: "/admin/all",
						m: "get",
						group: "Administration"
					},
					{
						l: "Recover Pin Information",
						v: "/admin/recoverPinCode",
						m: "get",
						group: "Administration"
					},
					{
						l: "List Products",
						v: "/product/list",
						m: "get",
						group: "Product",
						groupMain: true
					},
					{
						l: "List Console Products",
						v: "/product/console/list",
						m: "get",
						group: "Console Product"
					},
					{
						l: "Get Product",
						v: "/product",
						m: "get",
						group: "Product"
					},
					{
						l: "Purge Product",
						v: "/product/purge",
						m: "get",
						group: "Product"
					},
					{
						l: "List Product Packages",
						v: "/product/packages/list",
						m: "get",
						group: "Product"
					},
					{
						l: "Get Product Package",
						v: "/product/package",
						m: "get",
						group: "Product"
					},
					{
						l: "List Tenants",
						v: "/tenant/list",
						m: "get",
						group: "Tenant"
					},
					{
						l: "Get Current Tenant Access Level",
						v: "/tenant/acl",
						m: "get",
						group: "Private Tenant ACL"
					},
					{
						l: "List Console Tenants",
						v: "/console/tenant/list",
						m: "get",
						group: "Console Tenant"
					},
					{
						l: "Get Tenant",
						v: "/tenant",
						m: "get",
						group: "Tenant"
					},
					{
						l: "Get Tenant oAuth Configuration",
						v: "/tenant/oauth/list",
						m: "get",
						group: "Tenant oAuth"
					},
					{
						l: "List Tenant oAuth Users",
						v: "/tenant/oauth/users/list",
						m: "get",
						group: "Tenant oAuth"
					},
					{
						l: "List Tenant Applications",
						v: "/tenant/application/list",
						m: "get",
						group: "Tenant Application"
					},
					{
						l: "List Tenant Application Keys",
						v: "/tenant/application/key/list",
						m: "get",
						group: "Tenant Application"
					},
					{
						l: "List Tenant Application External Keys",
						v: "/tenant/application/key/ext/list",
						m: "get",
						group: "Tenant Application"
					},
					{
						l: "List Tenant Application Key Configuration",
						v: "/tenant/application/key/config/list",
						m: "get",
						group: "Tenant Application"
					},
					{
						l: "List Dashboard Tenant Keys",
						v: "/tenant/db/keys/list",
						m: "get",
						group: "Dashboard Tenants"
					},
					{
						l: "Get Tenant",
						v: "/tenant/settings",
						m: "get",
						group: "Tenant Settings"
					},
					{
						l: "Get Tenant oAuth Configuration",
						v: "/tenant/settings/oauth/list",
						m: "get",
						group: "Tenant Settings"
					},
					{
						l: "List Tenant oAuth Users",
						v: "/tenant/settings/oauth/users/list",
						m: "get",
						group: "Tenant Settings"
					},
					{
						l: "List Tenant Applications",
						v: "/tenant/settings/application/list",
						m: "get",
						group: "Tenant Settings"
					},
					{
						l: "List Tenant Application Keys",
						v: "/tenant/settings/application/key/list",
						m: "get",
						group: "Tenant Settings"
					},
					{
						l: "List Tenant Application External Keys",
						v: "/tenant/settings/application/key/ext/list",
						m: "get",
						group: "Tenant Settings"
					},
					{
						l: "List Tenant Application Key Configuration",
						v: "/tenant/settings/application/key/config/list",
						m: "get",
						group: "Tenant Settings"
					},
					{
						l: "OpenAM Login",
						v: "/openam/login",
						m: "post",
						group: "Guest Login(s)"
					},
					{
						l: "Ldap Login",
						v: "/ldap/login",
						m: "post",
						group: "Guest Login(s)"
					},
					{
						l: "Register",
						v: "/join",
						m: "post",
						group: "Guest Join"
					},
					{
						l: "Reset Password",
						v: "/resetPassword",
						m: "post",
						group: "Guest Password Settings"
					},
					{
						l: "Change Password",
						v: "/account/changePassword",
						m: "post",
						group: "My Account"
					},
					{
						l: "Change Email",
						v: "/account/changeEmail",
						m: "post",
						group: "My Account"
					},
					{
						l: "Edit Profile",
						v: "/account/editProfile",
						m: "post",
						group: "My Account"
					},
					{
						l: "List users by Id",
						v: "/admin/listUsers/uId",
						m: "post",
						group: "Administration",
						groupMain: true
					},
					{
						l: "Add new User",
						v: "/admin/addUser",
						m: "post",
						group: "Administration"
					},
					{
						l: "Edit User Record",
						v: "/admin/editUser",
						m: "post",
						group: "Administration"
					},
					{
						l: "Edit User Config",
						v: "/admin/editUserConfig",
						m: "post",
						group: "Administration"
					},
					{
						l: "Add new Group",
						v: "/admin/group/add",
						m: "post",
						group: "Administration"
					},
					{
						l: "Edit Group",
						v: "/admin/group/edit",
						m: "post",
						group: "Administration"
					},
					{
						l: "Add Users to Group",
						v: "/admin/group/addUsers",
						m: "post",
						group: "Administration"
					},
					{
						l: "Add Allowed Environment to Group",
						v: "/admin/group/addEnvironment",
						m: "post",
						group: "Administration"
					},
					{
						l: "Invite User",
						v: "/admin/inviteUser",
						m: "post",
						group: "Administration"
					},
					{
						l: "Invite Users",
						v: "/admin/inviteUsers",
						m: "post",
						group: "Administration"
					},
					{
						l: "Invite User by uId",
						v: "/admin/inviteUser/uId",
						m: "post",
						group: "Administration"
					},
					{
						l: "Add Pin Information",
						v: "/admin/userTenantConfig",
						m: "post",
						group: "Administration"
					},
					{
						l: "Add Product",
						v: "/product",
						m: "post",
						group: "Product"
					},
					{
						l: "Add Product Package",
						v: "/product/package",
						m: "post",
						group: "Product"
					},
					{
						l: "Add Product Package",
						v: "/product/console/package",
						m: "post",
						group: "Product"
					},
					{
						l: "Add Tenant",
						v: "/tenant",
						m: "post",
						group: "Tenant"
					},
					{
						l: "Add Tenant oAuth Configuration",
						v: "/tenant/oauth",
						m: "post",
						group: "Tenant oAuth"
					},
					{
						l: "Add Tenant oAuth User",
						v: "/tenant/oauth/users",
						m: "post",
						group: "Tenant oAuth"
					},
					{
						l: "Add Tenant Application",
						v: "/tenant/application",
						m: "post",
						group: "Tenant Application"
					},
					{
						l: "Add Tenant Application Key",
						v: "/tenant/application/key",
						m: "post",
						group: "Tenant Application"
					},
					{
						l: "Add Tenant Application External Key",
						v: "/tenant/application/key/ext",
						m: "post",
						group: "Tenant Application"
					},
					{
						l: "Add Tenant oAuth Configuration",
						v: "/tenant/settings/oauth",
						m: "post",
						group: "Tenant Settings"
					},
					{
						l: "Add Tenant oAuth User",
						v: "/tenant/settings/oauth/users",
						m: "post",
						group: "Tenant Settings"
					},
					{
						l: "Add Tenant Application Key",
						v: "/tenant/settings/application/key",
						m: "post",
						group: "Tenant Settings"
					},
					{
						l: "Add Tenant Application External Key",
						v: "/tenant/settings/application/key/ext",
						m: "post",
						group: "Tenant Settings"
					},
					{
						l: "Add Pin Information",
						v: "/admin/userTenantConfig",
						m: "put",
						group: "Administration"
					},
					{
						l: "Un-Invite User",
						v: "/admin/unInviteUsers",
						m: "put",
						group: "Administration"
					},
					{
						l: "Un-Invite User by Ids",
						v: "/admin/unInviteUser/uId",
						m: "put",
						group: "Administration"
					},
					{
						l: "Update Product",
						v: "/product",
						m: "put",
						group: "Product"
					},
					{
						l: "Update Product Package",
						v: "/product/package",
						m: "put",
						group: "Product"
					},
					{
						l: "Update Product Package",
						v: "/product/scope",
						m: "put",
						group: "Product"
					},
					{
						l: "Update Tenant",
						v: "/tenant",
						m: "put",
						group: "Tenant"
					},
					{
						l: "Update Tenant oAuth Configuration",
						v: "/tenant/oauth",
						m: "put",
						group: "Tenant oAuth"
					},
					{
						l: "Update Tenant oAuth User",
						v: "/tenant/oauth/users",
						m: "put",
						group: "Tenant oAuth"
					},
					{
						l: "Update Tenant Application",
						v: "/tenant/application",
						m: "put",
						group: "Tenant Application"
					},
					{
						l: "Update Tenant Application External Key",
						v: "/tenant/application/key/ext",
						m: "put",
						group: "Tenant Application"
					},
					{
						l: "Update Tenant Application Key Configuration",
						v: "/tenant/application/key/config",
						m: "put",
						group: "Tenant Application"
					},
					{
						l: "Update Tenant",
						v: "/tenant/settings",
						m: "put",
						group: "Tenant Settings"
					},
					{
						l: "Update Tenant oAuth Configuration",
						v: "/tenant/settings/oauth",
						m: "put",
						group: "Tenant Settings"
					},
					{
						l: "Update Tenant oAuth User",
						v: "/tenant/settings/oauth/users",
						m: "put",
						group: "Tenant Settings"
					},
					{
						l: "Update Tenant Application External Key",
						v: "/tenant/settings/application/key/ext",
						m: "put",
						group: "Tenant Settings"
					},
					{
						l: "Update Tenant Application Key Configuration",
						v: "/tenant/settings/application/key/config",
						m: "put",
						group: "Tenant Settings"
					},
					{
						l: "Delete User",
						v: "/admin/user/delete",
						m: "delete",
						group: "Administration"
					},
					{
						l: "Delete Group",
						v: "/admin/group/delete",
						m: "delete",
						group: "Administration"
					},
					{
						l: "Remove Pin",
						v: "/admin/pinConfig",
						m: "delete",
						group: "Administration"
					},
					{
						l: "Delete Product",
						v: "/product",
						m: "delete",
						group: "Product"
					},
					{
						l: "Delete Product Package",
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
						l: "Delete Tenant oAuth Configuration",
						v: "/tenant/oauth",
						m: "delete",
						group: "Tenant oAuth"
					},
					{
						l: "Delete Tenant oAuth User",
						v: "/tenant/oauth/users",
						m: "delete",
						group: "Tenant oAuth"
					},
					{
						l: "Delete Tenant Application",
						v: "/tenant/application",
						m: "delete",
						group: "Tenant Application"
					},
					{
						l: "Delete Tenant Application Key",
						v: "/tenant/application/key",
						m: "delete",
						group: "Tenant Application"
					},
					{
						l: "Delete Tenant Application External Key",
						v: "/tenant/application/key/ext",
						m: "delete",
						group: "Tenant Application"
					},
					{
						l: "Delete Tenant oAuth Configuration",
						v: "/tenant/settings/oauth",
						m: "delete",
						group: "Tenant Settings"
					},
					{
						l: "Delete Tenant oAuth User",
						v: "/tenant/settings/oauth/users",
						m: "delete",
						group: "Tenant Settings"
					},
					{
						l: "Delete Tenant Application Key",
						v: "/tenant/settings/application/key",
						m: "delete",
						group: "Tenant Settings"
					},
					{
						l: "Delete Tenant Application External Key",
						v: "/tenant/settings/application/key/ext",
						m: "delete",
						group: "Tenant Settings"
					}
				],
				"extKeyRequired": true,
				"oauth": true,
				"provision_ACL": false,
				"tenant_Profile": false,
				"urac": false,
				"urac_ACL": false,
				"urac_Config": false,
				"urac_GroupConfig": false,
				"urac_Profile": false
			},
			"3": {
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
						group: "My account",
						groupMain: true
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
						group: "User administration",
						groupMain: true
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
						group: "User administration",
						groupMain: true
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
				],
				"extKeyRequired": true,
				"oauth": true,
				"provision_ACL": false,
				"tenant_Profile": false,
				"urac": true,
				"urac_ACL": false,
				"urac_Config": false,
				"urac_GroupConfig": false,
				"urac_Profile": false
			}
		}
	},
	{
		_id: "5db1f85be9253564357b3040",
		name: "dashboard",
		group: "SOAJS Core Services",
		program: [
			"soajs"
		],
		port: 4003,
		requestTimeout: 60,
		requestTimeoutRenewal: 5,
		swagger: false,
		src: {
			provider: "github",
			owner: "soajs",
			repo: "soajs.dashboard"
		},
		maintenance: {
			port: {
				type: "maintenance"
			},
			readiness: "/heartbeat",
			commands: [
				{
					label: "Releoad Registry",
					path: "/reloadRegistry",
					icon: "registry"
				},
				{
					label: "Resource Info",
					path: "/resourceInfo",
					icon: "info"
				}
			]
		},
		versions: {
			"1": {
				apis: [
					{
						l: "Lists the ledgers of a specific environment",
						v: "/cd/ledger",
						m: "get",
						group: "Continuous Delivery"
					},
					{
						l: "Get Environment",
						v: "/environment",
						m: "get",
						group: "Environment"
					},
					{
						l: "Get Templates",
						v: "/templates",
						m: "get",
						group: "Templates"
					},
					{
						l: "Upgrade Old Templates",
						v: "/templates/upgrade",
						m: "get",
						group: "Templates"
					},
					{
						l: "Get/Set Environment Deployment Status",
						v: "/environment/status",
						m: "get",
						group: "Environment"
					},
					{
						l: "List Environments",
						v: "/environment/list",
						m: "get",
						group: "Environment",
						groupMain: true
					},
					{
						l: "Get Profile",
						v: "/environment/profile",
						m: "get",
						group: "Environment"
					},
					{
						l: "List Environment Databases",
						v: "/environment/dbs/list",
						m: "get",
						group: "Environment Databases"
					},
					{
						l: "List Available Resources",
						v: "/resources",
						m: "get",
						group: "Resources",
						groupMain: true
					},
					{
						l: "Get One Resource",
						v: "/resources/get",
						m: "get",
						group: "Resources"
					},
					{
						l: "Upgrade Resources to latest version",
						v: "/resources/upgrade",
						m: "get",
						group: "Resources",
						groupMain: true
					},
					{
						l: "Get Resources Deploy Configuration",
						v: "/resources/config",
						m: "get",
						group: "Resources"
					},
					{
						l: "List Custom Registry Entries",
						v: "/customRegistry/list",
						m: "get",
						group: "Custom Registry",
						groupMain: true
					},
					{
						l: "Get Custom Registry Entry",
						v: "/customRegistry/get",
						m: "get",
						group: "Custom Registry"
					},
					{
						l: "List Environment Platforms",
						v: "/environment/platforms/list",
						m: "get",
						group: "Environment Platforms"
					},
					{
						l: "List Products",
						v: "/product/list",
						m: "get",
						group: "Product",
						groupMain: true
					},
					{
						l: "List Console Products",
						v: "/console/product/list",
						m: "get",
						group: "Console Product"
					},
					{
						l: "Get Product",
						v: "/product/get",
						m: "get",
						group: "Product"
					},
					{
						l: "Purge Product",
						v: "/product/purge",
						m: "get",
						group: "Product"
					},
					{
						l: "List Product Packages",
						v: "/product/packages/list",
						m: "get",
						group: "Product"
					},
					{
						l: "Get Product Package",
						v: "/product/packages/get",
						m: "get",
						group: "Product"
					},
					{
						l: "List Tenants",
						v: "/tenant/list",
						m: "get",
						group: "Tenant"
					},
					{
						l: "List Console Tenants",
						v: "/console/tenant/list",
						m: "get",
						group: "Console Tenant"
					},
					{
						l: "Get Tenant",
						v: "/tenant/get",
						m: "get",
						group: "Tenant"
					},
					{
						l: "Get Tenant oAuth Configuration",
						v: "/tenant/oauth/list",
						m: "get",
						group: "Tenant oAuth"
					},
					{
						l: "List Tenant oAuth Users",
						v: "/tenant/oauth/users/list",
						m: "get",
						group: "Tenant oAuth"
					},
					{
						l: "List Tenant Applications",
						v: "/tenant/application/list",
						m: "get",
						group: "Tenant Application"
					},
					{
						l: "List Tenant Application Keys",
						v: "/tenant/application/key/list",
						m: "get",
						group: "Tenant Application"
					},
					{
						l: "List Tenant Application External Keys",
						v: "/tenant/application/key/ext/list",
						m: "get",
						group: "Tenant Application"
					},
					{
						l: "List Tenant Application Key Configuration",
						v: "/tenant/application/key/config/list",
						m: "get",
						group: "Tenant Application"
					},
					{
						l: "List Dashboard Tenant Keys",
						v: "/tenant/db/keys/list",
						m: "get",
						group: "Dashboard Tenants"
					},
					{
						l: "Get Tenant",
						v: "/settings/tenant/get",
						m: "get",
						group: "Tenant Settings"
					},
					{
						l: "Get Tenant oAuth Configuration",
						v: "/settings/tenant/oauth/list",
						m: "get",
						group: "Tenant Settings"
					},
					{
						l: "List Tenant oAuth Users",
						v: "/settings/tenant/oauth/users/list",
						m: "get",
						group: "Tenant Settings"
					},
					{
						l: "List Tenant Applications",
						v: "/settings/tenant/application/list",
						m: "get",
						group: "Tenant Settings"
					},
					{
						l: "List Tenant Application Keys",
						v: "/settings/tenant/application/key/list",
						m: "get",
						group: "Tenant Settings"
					},
					{
						l: "List Tenant Application External Keys",
						v: "/settings/tenant/application/key/ext/list",
						m: "get",
						group: "Tenant Settings"
					},
					{
						l: "List Tenant Application Key Configuration",
						v: "/settings/tenant/application/key/config/list",
						m: "get",
						group: "Tenant Settings"
					},
					{
						l: "List The Environment Where A Service Is Deployed",
						v: "/services/env/list",
						m: "get",
						group: "Services"
					},
					{
						l: "List Favorites",
						v: "/favorite",
						m: "get",
						group: "Services"
					},
					{
						l: "List Service Configuration",
						v: "/daemons/groupConfig/serviceConfig/list",
						m: "get",
						group: "Daemons"
					},
					{
						l: "List Job's External Keys",
						v: "/daemons/groupConfig/tenantExtKeys/list",
						m: "get",
						group: "Daemons"
					},
					{
						l: "List Hosts",
						v: "/hosts/list",
						m: "get",
						group: "Hosts",
						groupMain: true
					},
					{
						l: "Get Controller Hosts",
						v: "/hosts/awareness",
						m: "get",
						group: "Hosts"
					},
					{
						l: "Execute Maintenance Operation on Hosts",
						v: "/hosts/maintenance",
						m: "get",
						group: "Hosts"
					},
					{
						l: "List Cloud Services",
						v: "/cloud/services/list",
						m: "get",
						group: "HA Cloud"
					},
					{
						l: "List HA Cloud Nodes",
						v: "/cloud/nodes/list",
						m: "get",
						group: "HA Cloud"
					},
					{
						l: "Get Service Container Logs",
						v: "/cloud/services/instances/logs",
						m: "get",
						group: "HA Cloud"
					},
					{
						l: "List Available Namespaces",
						v: "/cloud/namespaces/list",
						m: "get",
						group: "HA Cloud"
					},
					{
						l: "Check if resource is Deployed",
						v: "/cloud/resource",
						m: "get",
						group: "HA Cloud"
					},
					{
						l: "List Cloud Virtual Machines",
						v: "/cloud/vm/list",
						m: "get",
						group: "Services"
					},
					{
						l: "List Cloud Virtual Machines",
						v: "/cloud/vm/layer/status",
						m: "get",
						group: "Services"
					},
					{
						l: "List Services Metrics",
						v: "/cloud/metrics/services",
						m: "get",
						group: "HA Cloud"
					},
					{
						l: "List Nodes Metrics",
						v: "/cloud/metrics/nodes",
						m: "get",
						group: "HA Cloud"
					},
					{
						l: "List Catalog Recipes",
						v: "/catalog/recipes/list",
						m: "get",
						group: "Catalog"
					},
					{
						l: "Get a Catalog",
						v: "/catalog/recipes/get",
						m: "get",
						group: "Catalog"
					},
					{
						l: "Upgrade Catalog Recipes to latest Version",
						v: "/catalog/recipes/upgrade",
						m: "get",
						group: "Catalog"
					},
					{
						l: "Get CD Configuration",
						v: "/cd",
						m: "get",
						group: "Continuous Delivery"
					},
					{
						l: "Get Update Notification Ledger",
						v: "/cd/updates",
						m: "get",
						group: "Continuous Delivery"
					},
					{
						l: "Get CI Accounts",
						v: "/ci",
						m: "get",
						group: "Continuous Integration"
					},
					{
						l: "Get CI Providers",
						v: "/ci/providers",
						m: "get",
						group: "Continuous Integration"
					},
					{
						l: "Download CI Recipe",
						v: "/ci/recipe/download",
						m: "get",
						group: "Continuous Integration"
					},
					{
						l: "Download CI Script",
						v: "/ci/script/download",
						m: "get",
						group: "Continuous Integration"
					},
					{
						l: "Turn On/Off Repository CI",
						v: "/ci/status",
						m: "get",
						group: "Continuous Integration"
					},
					{
						l: "Get CI Repository Settings & Environment Variables",
						v: "/ci/settings",
						m: "get",
						group: "Continuous Integration"
					},
					{
						l: "Get the CI configuration file of the repository from provider",
						v: "/ci/repo/remote/config",
						m: "get",
						group: "Continuous Integration"
					},
					{
						l: "Get the CI Latest Repository Build Per Branch",
						v: "/ci/repo/builds",
						m: "get",
						group: "Continuous Integration"
					},
					{
						l: "List Git Accounts",
						v: "/gitAccounts/accounts/list",
						m: "get",
						group: "Git Accounts"
					},
					{
						l: "Get Repositories",
						v: "/gitAccounts/getRepos",
						m: "get",
						group: "Git Accounts"
					},
					{
						l: "Get Repository Branches",
						v: "/gitAccounts/getBranches",
						m: "get",
						group: "Git Accounts"
					},
					{
						l: "Get Yaml file",
						v: "/gitAccounts/getYaml",
						m: "get",
						group: "Git Accounts"
					},
					{
						l: "Get Any file",
						v: "/gitAccounts/getAnyFile",
						m: "get",
						group: "Git Accounts"
					},
					{
						l: "List Endpoints",
						v: "/apiBuilder/list",
						m: "get",
						group: "API Builder"
					},
					{
						l: "Get Endpoint",
						v: "/apiBuilder/get",
						m: "get",
						group: "API Builder"
					},
					{
						l: "Publish endpoint apis",
						v: "/apiBuilder/publish",
						m: "get",
						group: "API Builder"
					},
					{
						l: "Get Resources",
						v: "/apiBuilder/getResources",
						m: "get",
						group: "API Builder"
					},
					{
						l: "List Available Secrets",
						v: "/secrets/list",
						m: "get",
						group: "Secrets"
					},
					{
						l: "Get One Secret",
						v: "/secrets/get",
						m: "get",
						group: "Secrets"
					},
					{
						l: "Get Infra Provider",
						v: "/infra",
						m: "get",
						group: "Infra Providers"
					},
					{
						l: "Get Cluster From Infra Provider",
						v: "/infra/cluster",
						m: "get",
						group: "Infra Providers"
					},
					{
						l: "Download Infra as Code Template",
						v: "/infra/template/download",
						m: "get",
						group: "Infra Providers"
					},
					{
						l: "Get Extra Compnents From An Infra Provider",
						v: "/infra/extras",
						m: "get",
						group: "Infra Providers"
					},
					{
						l: "Get Console Version",
						v: "/version",
						m: "get",
						group: "Console Version"
					},
					{
						l: "Check Console Version",
						v: "/version/check",
						m: "get",
						group: "Console Version"
					},
					{
						l: "List Persistent Volume Claim",
						v: "/volume/claims",
						m: "get",
						group: "Persistent Volume Claim"
					},
					{
						l: "Get one  Persistent Volume Claim",
						v: "/volume/claim",
						m: "get",
						group: "Persistent Volume Claim"
					},
					{
						l: "Start Service Hosts",
						v: "/hosts/start",
						m: "post",
						group: "Hosts"
					},
					{
						l: "Stop Service Hosts",
						v: "/hosts/stop",
						m: "post",
						group: "Hosts"
					},
					{
						l: "Import Templates",
						v: "/templates/import",
						m: "post",
						group: "Templates"
					},
					{
						l: "Export Templates",
						v: "/templates/export",
						m: "post",
						group: "Templates"
					},
					{
						l: "List Services",
						v: "/services/list",
						m: "post",
						group: "Services"
					},
					{
						l: "Add Environment",
						v: "/environment/add",
						m: "post",
						group: "Environment"
					},
					{
						l: "Add Environment Database",
						v: "/environment/dbs/add",
						m: "post",
						group: "Environment Databases"
					},
					{
						l: "Attach Container Technology",
						v: "/environment/platforms/attach",
						m: "post",
						group: "Environment Platforms"
					},
					{
						l: "Lock an environment to a Cloud Provider",
						v: "/environment/infra/lock",
						m: "post",
						group: "Environment"
					},
					{
						l: "Add / Edit Resource",
						v: "/resources",
						m: "post",
						group: "Resources"
					},
					{
						l: "Add New Custom Registry Entry",
						v: "/customRegistry/add",
						m: "post",
						group: "Custom Registry"
					},
					{
						l: "Add Product",
						v: "/product/add",
						m: "post",
						group: "Product"
					},
					{
						l: "Add Product Package",
						v: "/product/packages/add",
						m: "post",
						group: "Product"
					},
					{
						l: "Add Tenant",
						v: "/tenant/add",
						m: "post",
						group: "Tenant"
					},
					{
						l: "Add Tenant oAuth Configuration",
						v: "/tenant/oauth/add",
						m: "post",
						group: "Tenant oAuth"
					},
					{
						l: "Add Tenant oAuth User",
						v: "/tenant/oauth/users/add",
						m: "post",
						group: "Tenant oAuth"
					},
					{
						l: "Add Tenant Application",
						v: "/tenant/application/add",
						m: "post",
						group: "Tenant Application"
					},
					{
						l: "Add Tenant Application Key",
						v: "/tenant/application/key/add",
						m: "post",
						group: "Tenant Application"
					},
					{
						l: "Add Tenant Application External Key",
						v: "/tenant/application/key/ext/add",
						m: "post",
						group: "Tenant Application"
					},
					{
						l: "Delete Tenant Application External Key",
						v: "/tenant/application/key/ext/delete",
						m: "post",
						group: "Tenant Application"
					},
					{
						l: "Get Current Tenant Access Level",
						v: "/tenant/acl/get",
						m: "post",
						group: "Private Tenant ACL"
					},
					{
						l: "Add Tenant oAuth Configuration",
						v: "/settings/tenant/oauth/add",
						m: "post",
						group: "Tenant Settings"
					},
					{
						l: "Add Tenant oAuth User",
						v: "/settings/tenant/oauth/users/add",
						m: "post",
						group: "Tenant Settings"
					},
					{
						l: "Add Tenant Application Key",
						v: "/settings/tenant/application/key/add",
						m: "post",
						group: "Tenant Settings"
					},
					{
						l: "Add Tenant Application External Key",
						v: "/settings/tenant/application/key/ext/add",
						m: "post",
						group: "Tenant Settings"
					},
					{
						l: "Delete Tenant Application External Key",
						v: "/settings/tenant/application/key/ext/delete",
						m: "post",
						group: "Tenant Settings"
					},
					{
						l: "List Daemon Group Configuration",
						v: "/daemons/groupConfig/list",
						m: "post",
						group: "Daemons"
					},
					{
						l: "Add Daemon Group Configuration",
						v: "/daemons/groupConfig/add",
						m: "post",
						group: "Daemons"
					},
					{
						l: "List Daemons",
						v: "/daemons/list",
						m: "post",
						group: "Daemons"
					},
					{
						l: "Deploy A New SOAJS Service",
						v: "/cloud/services/soajs/deploy",
						m: "post",
						group: "HA Cloud"
					},
					{
						l: "Deploy A Custom Resource",
						v: "/cloud/plugins/deploy",
						m: "post",
						group: "HA Cloud"
					},
					{
						l: "Add HA Cloud Node",
						v: "/cloud/nodes/add",
						m: "post",
						group: "HA Cloud"
					},
					{
						l: "Perform A Maintenance Operation on a Deployed Service",
						v: "/cloud/services/maintenance",
						m: "post",
						group: "HA Cloud"
					},
					{
						l: "Perform A Maintenance Operation on a Virtual Machine",
						v: "/cloud/vm/maintenance",
						m: "post",
						group: "HA Cloud"
					},
					{
						l: "Add Virtual Machine Layer",
						v: "/cloud/vm",
						m: "post",
						group: "HA Cloud"
					},
					{
						l: "On-board Virtual Machine Layer",
						v: "/cloud/vm/onboard",
						m: "post",
						group: "HA Cloud"
					},
					{
						l: "Get Service Container Logs",
						v: "/cloud/vm/logs",
						m: "post",
						group: "HA Cloud"
					},
					{
						l: "Add New Catalog",
						v: "/catalog/recipes/add",
						m: "post",
						group: "Catalog"
					},
					{
						l: "Activate CI Provider",
						v: "/ci/provider",
						m: "post",
						group: "Continuous Integration"
					},
					{
						l: "Add New CI Recipe",
						v: "/ci/recipe",
						m: "post",
						group: "Continuous Integration"
					},
					{
						l: "Save CD Configuration for a specific Service",
						v: "/cd",
						m: "post",
						group: "Continuous Delivery"
					},
					{
						l: "Pause CD Configuration",
						v: "/cd/pause",
						m: "post",
						group: "Continuous Delivery"
					},
					{
						l: "Trigger CD Deployment",
						v: "/cd/deploy",
						m: "post",
						group: "Continuous Delivery Deployment"
					},
					{
						l: "Github Login",
						v: "/gitAccounts/login",
						m: "post",
						group: "Git Accounts"
					},
					{
						l: "Activate Repository",
						v: "/gitAccounts/repo/activate",
						m: "post",
						group: "Git Accounts"
					},
					{
						l: "Api simulation service",
						v: "/swagger/simulate",
						m: "post",
						group: "Simulate",
						groupMain: true
					},
					{
						l: "Generate Service via Swagger",
						v: "/swagger/generate",
						m: "post",
						group: "swagger",
						groupMain: true
					},
					{
						l: "Regenerate Service via Swagger",
						v: "/swagger/generateExistingService",
						m: "post",
						group: "swagger",
						groupMain: true
					},
					{
						l: "Add Endpoint",
						v: "/apiBuilder/add",
						m: "post",
						group: "API Builder"
					},
					{
						l: "Update Route Authentication Method",
						v: "/apiBuilder/authentication/update",
						m: "post",
						group: "API Builder"
					},
					{
						l: "Convert Swagger String To an IMFV Soajs Object",
						v: "/apiBuilder/convertSwaggerToImfv",
						m: "post",
						group: "API Builder"
					},
					{
						l: "Convert IMFV Soajs Object to a Swagger String",
						v: "/apiBuilder/convertImfvToSwagger",
						m: "post",
						group: "API Builder"
					},
					{
						l: "Add Secret",
						v: "/secrets/add",
						m: "post",
						group: "Secrets"
					},
					{
						l: "Add Persistent Volume Claim",
						v: "/volume/claim",
						m: "post",
						group: "Persistent Volume Claim"
					},
					{
						l: "Connect Infra Providers",
						v: "/infra",
						m: "post",
						group: "Infra Providers"
					},
					{
						l: "Add Infra as Code Template",
						v: "/infra/template",
						m: "post",
						group: "Infra Providers"
					},
					{
						l: "Update Infra as Code Template",
						v: "/infra/template/upload",
						m: "post",
						group: "Infra Providers"
					},
					{
						l: "Scale Cluster at Infra Provider",
						v: "/infra/cluster/scale",
						m: "post",
						group: "Infra Providers"
					},
					{
						l: "Create Infra component",
						v: "/infra/extras",
						m: "post",
						group: "HA Cloud"
					},
					{
						l: "List Analytic Services",
						v: "/services/dashboard/services",
						m: "post",
						group: "Services"
					},
					{
						l: "List Analytic Services",
						v: "/services/dashboard/apiRoutes",
						m: "post",
						group: "Services"
					},
					{
						l: "Add to Favorites",
						v: "/favorite",
						m: "post",
						group: "Services"
					},
					{
						l: "Updates Service Settings",
						v: "/services/settings/update",
						m: "put",
						group: "Services"
					},
					{
						l: "Mark as read",
						v: "/cd/ledger/read",
						m: "put",
						group: "Continuous Delivery"
					},
					{
						l: "Take Action",
						v: "/cd/action",
						m: "put",
						group: "Continuous Delivery"
					},
					{
						l: "Update Environment",
						v: "/environment/update",
						m: "put",
						group: "Environment"
					},
					{
						l: "Update Environment Tenant Key Security",
						v: "/environment/key/update",
						m: "put",
						group: "Environment"
					},
					{
						l: "Update Environment Database",
						v: "/environment/dbs/update",
						m: "put",
						group: "Environment Databases"
					},
					{
						l: "Update Environment Databases Prefix",
						v: "/environment/dbs/updatePrefix",
						m: "put",
						group: "Environment Databases"
					},
					{
						l: "Update Resource",
						v: "/resources/update",
						m: "put",
						group: "Resources"
					},
					{
						l: "Set Resource Deploy Configuration",
						v: "/resources/config/update",
						m: "put",
						group: "Resources"
					},
					{
						l: "Update Custom Registry Entry",
						v: "/customRegistry/update",
						m: "put",
						group: "Custom Registry"
					},
					{
						l: "Upgrade To New Custom Registry",
						v: "/customRegistry/upgrade",
						m: "put",
						group: "Custom Registry"
					},
					{
						l: "Change Deployer Type",
						v: "/environment/platforms/deployer/update",
						m: "put",
						group: "Environment Platforms"
					},
					{
						l: "Update Product",
						v: "/product/update",
						m: "put",
						group: "Product"
					},
					{
						l: "Update Product Package",
						v: "/product/packages/update",
						m: "put",
						group: "Product"
					},
					{
						l: "Update Product Package",
						v: "/product/scope/update",
						m: "put",
						group: "Product"
					},
					{
						l: "Update Tenant",
						v: "/tenant/update",
						m: "put",
						group: "Tenant"
					},
					{
						l: "Update Tenant oAuth Configuration",
						v: "/tenant/oauth/update",
						m: "put",
						group: "Tenant oAuth"
					},
					{
						l: "Update Tenant oAuth User",
						v: "/tenant/oauth/users/update",
						m: "put",
						group: "Tenant oAuth"
					},
					{
						l: "Update Tenant Application",
						v: "/tenant/application/update",
						m: "put",
						group: "Tenant Application"
					},
					{
						l: "Update Tenant Application External Key",
						v: "/tenant/application/key/ext/update",
						m: "put",
						group: "Tenant Application"
					},
					{
						l: "Update Tenant Application Key Configuration",
						v: "/tenant/application/key/config/update",
						m: "put",
						group: "Tenant Application"
					},
					{
						l: "Update Tenant",
						v: "/settings/tenant/update",
						m: "put",
						group: "Tenant Settings"
					},
					{
						l: "Update Tenant oAuth Configuration",
						v: "/settings/tenant/oauth/update",
						m: "put",
						group: "Tenant Settings"
					},
					{
						l: "Update Tenant oAuth User",
						v: "/settings/tenant/oauth/users/update",
						m: "put",
						group: "Tenant Settings"
					},
					{
						l: "Update Tenant Application External Key",
						v: "/settings/tenant/application/key/ext/update",
						m: "put",
						group: "Tenant Settings"
					},
					{
						l: "Update Tenant Application Key Configuration",
						v: "/settings/tenant/application/key/config/update",
						m: "put",
						group: "Tenant Settings"
					},
					{
						l: "Update Daemon Group Configuration",
						v: "/daemons/groupConfig/update",
						m: "put",
						group: "Daemons"
					},
					{
						l: "Update Service Configuration",
						v: "/daemons/groupConfig/serviceConfig/update",
						m: "put",
						group: "Daemons"
					},
					{
						l: "Update Job's External Keys",
						v: "/daemons/groupConfig/tenantExtKeys/update",
						m: "put",
						group: "Daemons"
					},
					{
						l: "Update HA Cloud Node",
						v: "/cloud/nodes/update",
						m: "put",
						group: "HA Cloud"
					},
					{
						l: "Scale HA Service",
						v: "/cloud/services/scale",
						m: "put",
						group: "HA Cloud"
					},
					{
						l: "Redeploy HA Service",
						v: "/cloud/services/redeploy",
						m: "put",
						group: "HA Cloud"
					},
					{
						l: "Autoscale Services",
						v: "/cloud/services/autoscale",
						m: "put",
						group: "HA Cloud"
					},
					{
						l: "Configure Environment Autoscaling",
						v: "/cloud/services/autoscale/config",
						m: "put",
						group: "HA Cloud"
					},
					{
						l: "Update Catalog",
						v: "/catalog/recipes/update",
						m: "put",
						group: "Catalog"
					},
					{
						l: "Sync Repository",
						v: "/gitAccounts/repo/sync",
						m: "put",
						group: "Git Accounts"
					},
					{
						l: "Sync Repository Branches",
						v: "/gitAccounts/repo/sync/branches",
						m: "put",
						group: "Git Accounts"
					},
					{
						l: "Deactivate CI Provider",
						v: "/ci/provider",
						m: "put",
						group: "Continuous Integration"
					},
					{
						l: "Edit CI Recipe",
						v: "/ci/recipe",
						m: "put",
						group: "Continuous Integration"
					},
					{
						l: "Update CI Repository Settings",
						v: "/ci/settings",
						m: "put",
						group: "Continuous Integration"
					},
					{
						l: "Deactivate Repository",
						v: "/gitAccounts/repo/deactivate",
						m: "put",
						group: "Git Accounts"
					},
					{
						l: "Edit Endpoint",
						v: "/apiBuilder/edit",
						m: "put",
						group: "API Builder"
					},
					{
						l: "Update Endpoint's Schemas",
						v: "/apiBuilder/updateSchemas",
						m: "put",
						group: "API Builder"
					},
					{
						l: "Modify Infra Providers Connection",
						v: "/infra",
						m: "put",
						group: "Infra Providers"
					},
					{
						l: "Update Infra as Code Template",
						v: "/infra/template",
						m: "put",
						group: "Infra Providers"
					},
					{
						l: "Modify Virtual Machine Layer",
						v: "/cloud/vm",
						m: "put",
						group: "Owner HA Cloud"
					},
					{
						l: "Update Infra component",
						v: "/infra/extras",
						m: "put",
						group: "Owner HA Cloud"
					},
					{
						l: "Delete Template",
						v: "/templates",
						m: "delete",
						group: "Templates"
					},
					{
						l: "Delete Environment",
						v: "/environment/delete",
						m: "delete",
						group: "Environment"
					},
					{
						l: "Delete Environment Database",
						v: "/environment/dbs/delete",
						m: "delete",
						group: "Environment Databases"
					},
					{
						l: "Detach Container Technology",
						v: "/environment/platforms/detach",
						m: "delete",
						group: "Environment Platforms"
					},
					{
						l: "Unlock an environment from a Cloud Provider",
						v: "/environment/infra/lock",
						m: "delete",
						group: "Environment"
					},
					{
						l: "Delete a resource",
						v: "/resources",
						m: "delete",
						group: "Resources"
					},
					{
						l: "Delete A Custom Registry Entry",
						v: "/customRegistry/delete",
						m: "delete",
						group: "Custom Registry"
					},
					{
						l: "Delete Product",
						v: "/product/delete",
						m: "delete",
						group: "Product"
					},
					{
						l: "Delete Product Package",
						v: "/product/packages/delete",
						m: "delete",
						group: "Product"
					},
					{
						l: "Delete Tenant",
						v: "/tenant/delete",
						m: "delete",
						group: "Tenant"
					},
					{
						l: "Delete Tenant oAuth Configuration",
						v: "/tenant/oauth/delete",
						m: "delete",
						group: "Tenant oAuth"
					},
					{
						l: "Delete Tenant oAuth User",
						v: "/tenant/oauth/users/delete",
						m: "delete",
						group: "Tenant oAuth"
					},
					{
						l: "Delete Tenant Application",
						v: "/tenant/application/delete",
						m: "delete",
						group: "Tenant Application"
					},
					{
						l: "Delete Tenant Application Key",
						v: "/tenant/application/key/delete",
						m: "delete",
						group: "Tenant Application"
					},
					{
						l: "Delete Tenant oAuth Configuration",
						v: "/settings/tenant/oauth/delete",
						m: "delete",
						group: "Tenant Settings"
					},
					{
						l: "Delete Tenant oAuth User",
						v: "/settings/tenant/oauth/users/delete",
						m: "delete",
						group: "Tenant Settings"
					},
					{
						l: "Delete Tenant Application Key",
						v: "/settings/tenant/application/key/delete",
						m: "delete",
						group: "Tenant Settings"
					},
					{
						l: "Delete Daemon Group Configuration",
						v: "/daemons/groupConfig/delete",
						m: "delete",
						group: "Daemons"
					},
					{
						l: "Remove HA Cloud Node",
						v: "/cloud/nodes/remove",
						m: "delete",
						group: "HA Cloud"
					},
					{
						l: "Delete HA Service",
						v: "/cloud/services/delete",
						m: "delete",
						group: "HA Cloud"
					},
					{
						l: "Delete Virtual Machine",
						v: "/cloud/vm/instance",
						m: "delete",
						group: "HA Cloud"
					},
					{
						l: "Delete Virtual Machine Layer",
						v: "/cloud/vm",
						m: "delete",
						group: "HA Cloud"
					},
					{
						l: "Delete a Namespace",
						v: "/cloud/namespaces/delete",
						m: "delete",
						group: "HA Cloud"
					},
					{
						l: "Delete a Catalog",
						v: "/catalog/recipes/delete",
						m: "delete",
						group: "Catalog"
					},
					{
						l: "Delete CI Recipe",
						v: "/ci/recipe",
						m: "delete",
						group: "Continuous Integration"
					},
					{
						l: "Github Logout",
						v: "/gitAccounts/logout",
						m: "delete",
						group: "Git Accounts"
					},
					{
						l: "Delete Endpoint",
						v: "/apiBuilder/delete",
						m: "delete",
						group: "API Builder"
					},
					{
						l: "Delete Secret",
						v: "/secrets/delete",
						m: "delete",
						group: "Secrets"
					},
					{
						l: "Delete Persistent Volume Claim",
						v: "/volume/claim",
						m: "delete",
						group: "Persistent Volume Claim"
					},
					{
						l: "Deactivate Infra Provider",
						v: "/infra",
						m: "delete",
						group: "Infra Providers"
					},
					{
						l: "Remove Infra Provider Deployment",
						v: "/infra/deployment",
						m: "delete",
						group: "Infra Providers"
					},
					{
						l: "Remove Template from Infra Providers",
						v: "/infra/template",
						m: "delete",
						group: "Infra Providers"
					},
					{
						l: "Delete Infra component",
						v: "/infra/extras",
						m: "delete",
						group: "HA Cloud"
					},
					{
						l: "Delete from Favorites",
						v: "/favorite",
						m: "delete",
						group: "Services"
					}
				],
				"extKeyRequired": true,
				"oauth": true,
				"provision_ACL": true,
				"tenant_Profile": false,
				"urac": true,
				"urac_ACL": true,
				"urac_Config": false,
				"urac_GroupConfig": true,
				"urac_Profile": true
			}
		}
	},
	{
		_id: "5db1f85be9253564357b303d",
		name: "oauth",
		group: "SOAJS Core Services",
		program: [
			"soajs"
		],
		port: 4002,
		requestTimeout: 30,
		requestTimeoutRenewal: 5,
		swagger: false,
		src: {
			provider: "github",
			owner: "soajs",
			repo: "soajs.oauth"
		},
		maintenance: {
			commands: [
				{
					label: "Releoad Provision",
					path: "/loadProvision",
					icon: "provision"
				},
				{
					label: "Releoad Registry",
					path: "/reloadRegistry",
					icon: "registry"
				},
				{
					label: "Resource Info",
					path: "/resourceInfo",
					icon: "info"
				}
			],
			port: {
				type: "maintenance"
			},
			readiness: "/heartbeat"
		},
		versions: {
			"1": {
				apis: [
					{
						l: "Cross environment roaming, but requires IP whitelisting",
						v: "/roaming",
						m: "get",
						group: "Tokenization user"
					},
					{
						l: "Get information about what third party login is available",
						v: "/available/login",
						m: "get",
						group: "Guest"
					},
					{
						l: "Get the authorization token",
						v: "/authorization",
						m: "get",
						group: "Guest"
					},
					{
						l: "Passport login",
						v: "/passport/login/:strategy",
						m: "get",
						group: "Third party login"
					},
					{
						l: "Passport login validation",
						v: "/passport/validate/:strategy",
						m: "get",
						group: "Third party login"
					},
					{
						l: "OpenAM login",
						v: "/openam/login",
						m: "post",
						group: "Third party login"
					},
					{
						l: "Ldap login",
						v: "/ldap/login",
						m: "post",
						group: "Third party login"
					},
					{
						l: "Create an access token",
						v: "/token",
						m: "post",
						group: "Guest"
					},
					{
						l: "Create an access token with pin",
						v: "/pin",
						m: "post",
						group: "Tokenization"
					},
					{
						l: "Delete access token",
						v: "/accessToken/:token",
						m: "delete",
						group: "Tokenization"
					},
					{
						l: "Delete refresh token",
						v: "/refreshToken/:token",
						m: "delete",
						group: "Tokenization"
					},
					{
						l: "Delete all tokens for a given user",
						v: "/tokens/user/:userId",
						m: "delete",
						group: "User Tokenization"
					},
					{
						l: "Delete all tokens for this client (tenant)",
						v: "/tokens/tenant/:clientId",
						m: "delete",
						group: "Cient Tokenization"
					}
				],
				"extKeyRequired": true,
				"oauth": true,
				"provision_ACL": false,
				"tenant_Profile": false,
				"urac": false,
				"urac_ACL": false,
				"urac_Config": false,
				"urac_GroupConfig": false,
				"urac_Profile": false
			}
		}
	},
	{
		_id: "5db1f85be9253564357b303f",
		name: "multitenant",
		group: "SOAJS Core Services",
		program: [
			"soajs"
		],
		port: 4004,
		requestTimeout: 30,
		requestTimeoutRenewal: 5,
		swagger: false,
		src: {
			provider: "github",
			owner: "soajs",
			repo: "soajs.multitenant"
		},
		maintenance: {
			port: {
				type: "maintenance"
			},
			readiness: "/heartbeat",
			commands: [
				{
					label: "Releoad Registry",
					path: "/reloadRegistry",
					icon: "registry"
				},
				{
					label: "Resource Info",
					path: "/resourceInfo",
					icon: "info"
				}
			]
		},
		versions: {
			"1": {
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
						l: "Update product package",
						v: "/product/package",
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
				],
				"extKeyRequired": true,
				"oauth": true,
				"provision_ACL": false,
				"tenant_Profile": false,
				"urac": false,
				"urac_ACL": false,
				"urac_Config": false,
				"urac_GroupConfig": false,
				"urac_Profile": false
			}
		}
	}
];

module.exports = services;