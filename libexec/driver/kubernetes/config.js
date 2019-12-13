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
			"bin": "5db9f7ccc6b8c459cdb3c34b",
			"src": "5df0554dbe70f13a183a9c74"
		},
		"urac": {
			"bin": "5dc1f66fc6b8c459cdb3c3ac",
			"src": "5bed929029f0041bf64bf991"
		},
		"oauth": {
			"bin": "5dc1f6dac6b8c459cdb3c3ad",
			"src": "5bed929029f0041bf64bf991"
		},
		"dashboard": {
			"bin": "5dc5a8869253d2193d55552b",
			"src": "5bed929029f0041bf64bf991"
		},
		"multitenant": {
			"bin": "5dc96a639253d2193d55553d",
			"src": "5bed929029f0041bf64bf991"
		},
		"ui": {
			"bin": "5dea9e59be70f13a183a9c70",
			"src": "5bfd792ab72d8f49eaefe229"
		},
		"mongo": "5dead79e52e7046c7c0a4d53"
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