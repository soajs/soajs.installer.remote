"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const lib = {
	"namespace": "soajs",
	"mongo": {
		"port": 32017
	},
	
	"label": {
		"mongo": "dashboard-soajsdata",
		
		"gateway": "dashboard-controller-v",
		"dashboard": "dashboard-dashboard-v",
		"oauth": "dashboard-oauth-v",
		"urac": "dashboard-urac-v",
		"multitenant": "dashboard-multitenant-v",
		
		"ui": "dashboard-nginx"
	},
	
	"catalog": {
		"gateway": {
			"bin": "5df3ec10fa3912534948f000",
			"src": "5df3ec10fa3912534948f001"
		},
		"urac": {
			"bin": "5df3ec10fa3912534948f008",
			"src": "5df3ec10fa3912534948f007"
		},
		"oauth": {
			"bin": "5df3ec10fa3912534948f006",
			"src": "5df3ec10fa3912534948f007"
		},
		"dashboard": {
			"bin": "5df3ec10fa3912534948efff",
			"src": "5df3ec10fa3912534948f007"
		},
		"multitenant": {
			"bin": "5df3ec10fa3912534948f004",
			"src": "5df3ec10fa3912534948f007"
		},
		"ui": {
			"secret": {
				"bin": "5df3ec10fa3912534948effe",
				"src": "5df3ec10fa3912534948f00f"
			},
			"pvc": {
				"bin": "5df3ec10fa3912534948f00d",
				"src": "5df3ec10fa3912534948f00e"
			}
		},
		"mongo": "5df3ec10fa3912534948f003"
	},
	
	"images": {
		"gateway": {"src": "soajsorg/node:3.x", "bin": "soajsorg/gateway:"},
		"urac": {"src": "soajsorg/node:3.x", "bin": "soajsorg/urac:"},
		"oauth": {"src": "soajsorg/node:3.x", "bin": "soajsorg/oauth:"},
		"dashboard": {"src": "soajsorg/node:3.x", "bin": "soajsorg/dashboard:"},
		"multitenant": {"src": "soajsorg/node:3.x", "bin": "soajsorg/multitenant:"},
		"ui": {"src": "soajsorg/fe:3.x", "bin": "soajsorg/consoleui:"}
	},
};

module.exports = lib;