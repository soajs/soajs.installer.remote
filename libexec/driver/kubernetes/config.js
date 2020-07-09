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
		"console": "dashboard-console-v",
		"infra": "dashboard-infra-v",
		"marketplace": "dashboard-marketplace-v",
		"repositories": "dashboard-repositories-v",
		
		"ui": "dashboard-ui-v"
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
		"console": {
			"bin": "5edf6bf536c77052b0a5e1f1",
			"src": "5df3ec10fa3912534948f007"
		},
		"infra": {
			"bin": "5edf69dc36c77052b0a5e1f0",
			"src": "5df3ec10fa3912534948f007"
		},
		"marketplace": {
			"bin": "5edf6c1136c77052b0a5e1f2",
			"src": "5df3ec10fa3912534948f007"
		},
		"repositories": {
			"bin": "5edf6c1836c77052b0a5e1f3",
			"src": "5df3ec10fa3912534948f007"
		},
		"ui": {
			"demo": {
				"bin": "5df3ec10fa3912534948effe",
				"src": "5df3ec10fa3912534948f00f"
			},
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
		"console": {"src": "soajsorg/node:3.x", "bin": "soajsorg/console:"},
		"infra": {"src": "soajsorg/node:3.x", "bin": "soajsorg/infra:"},
		"marketplace": {"src": "soajsorg/node:3.x", "bin": "soajsorg/marketplace:"},
		"repositories": {"src": "soajsorg/node:3.x", "bin": "soajsorg/repositories:"},
		"ui": {"src": "soajsorg/fe:3.x", "bin": "soajsorg/consoleui:"}
	},
};

module.exports = lib;