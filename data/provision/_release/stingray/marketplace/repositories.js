"use strict";

module.exports = {
	type: "service",
	name: "repositories",
	description: "This service handles soajs integration with git providers.",
	subType: "soajs",
	configuration: {
		group: "Console",
		port: 4006,
		requestTimeout: 180,
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
			interConnect: [
				{
					name: "marketplace",
					version: "1"
				}
			],
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
					l: "Get accounts information and their organization(s)",
					v: "/git/accounts",
					m: "get",
					group: "Account information"
				},
				{
					l: "Get account information and its organization(s)",
					v: "/git/account",
					m: "get",
					group: "Account information"
				},
				{
					l: "Get repository information",
					v: "/git/repo",
					m: "get",
					group: "Repository information"
				},
				{
					l: "Get repository branches",
					v: "/git/branches",
					m: "get",
					group: "Repository information"
				},
				{
					l: "Get repository tags",
					v: "/git/tags",
					m: "get",
					group: "Repository information"
				},
				{
					l: "Get repository tags",
					v: "/git/tag",
					m: "get",
					group: "Repository information"
				},
				{
					l: "Get a file from repository",
					v: "/git/repo/file",
					m: "get",
					group: "Repository management"
				},
				{
					l: "Login and add account",
					v: "/git/account",
					m: "post",
					group: "Git Accounts"
				},
				{
					l: "Search and filter repository",
					v: "/git/repos",
					m: "post",
					group: "Repository information"
				},
				{
					l: "Sync account and all its repositories",
					v: "/git/sync/account",
					m: "put",
					group: "Git Accounts"
				},
				{
					l: "Upgrade account",
					v: "/git/account",
					m: "put",
					group: "Account management"
				},
				{
					l: "Activate repository and sync branches",
					v: "/git/repo/activate",
					m: "put",
					group: "Repository management"
				},
				{
					l: "Deactivate repository",
					v: "/git/repo/deactivate",
					m: "put",
					group: "Repository management"
				},
				{
					l: "Activate branch",
					v: "/git/branch/activate",
					m: "put",
					group: "Repository management"
				},
				{
					l: "Deactivate branch",
					v: "/git/branch/deactivate",
					m: "put",
					group: "Repository management"
				},
				{
					l: "Activate tag",
					v: "/git/tag/activate",
					m: "put",
					group: "Repository management"
				},
				{
					l: "Deactivate tag",
					v: "/git/tag/deactivate",
					m: "put",
					group: "Repository management"
				},
				{
					l: "Sync repository and all its branches",
					v: "/git/sync/repository",
					m: "put",
					group: "Repository management"
				},
				{
					l: "Sync branch and update the corresponding catalog",
					v: "/git/sync/branch",
					m: "put",
					group: "Repository management"
				},
				{
					l: "Logout and delete account",
					v: "/git/account",
					m: "delete",
					group: "Account management"
				},
				{
					l: "Delete Repository",
					v: "/git/repo",
					m: "delete",
					group: "Account management"
				},
				{
					l: "Delete Orphan Repositories",
					v: "/git/repositories",
					m: "delete",
					group: "Account management"
				}
			]
		}
	]
};