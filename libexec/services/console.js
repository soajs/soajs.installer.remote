"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

let lib = {
	"setImageTag": (options, doc) => {
		//console bin
		if (doc._id === "5edf6bf536c77052b0a5e1f1") {
			if (options.deployment.style === "sem") {
				if (options.versions.services.console.semVer) {
					doc.recipe.deployOptions.image.tag = options.versions.services.console.semVer;
				}
			} else if (options.versions.services.console.ver) {
				doc.recipe.deployOptions.image.tag = options.versions.services.console.ver;
			}
		}
	},
	"requireCatalog": (options, serviceName, dataPath) => {
		let doc = null;
		if (serviceName === 'console') {
			doc = require(dataPath + "soajs_console_bin.js");
			lib.setImageTag(options, doc);
		}
		return (doc);
	},
	"getConfig": (options, obj) => {
		return {
			"type": options.deployment.type,
			"style": options.deployment.style,
			"serviceVer": options.versions.services.console.msVer || 3,
			"repoVer": options.versions.services.console.ver,
			"semVer": options.versions.services.console.semVer,
			"serviceName": "console",
			"gatewayIP": obj.gatewayIP,
			"namespace": options.kubernetes.namespace
		};
	},
	"echoResult": (obj, logger) => {
		logger.debug("\tConsole: ");
		logger.debug("\t\t IP: " + obj.deployments.console.ip);
		logger.debug("\t\t Image: " + obj.deployments.console.image);
		if (obj.deployments.console.branch) {
			logger.debug("\t\t Branch: " + obj.deployments.console.branch);
		}
	},
	"install": (obj, callback) => {
		let config = lib.getConfig(obj.options, obj);
		obj.driver.deploy.service(config, obj.deployer, (error, response) => {
			if (error) {
				return callback(error, obj);
			}
			obj.consoleIP = null;
			if (response) {
				obj.consoleIP = response.ip;
				obj.deployments.console = response;
			}
			return callback(null, obj);
		});
	},
	"upgrade": (obj, callback) => {
		let config = lib.getConfig(obj.options, obj);
		obj.driver.upgrade.service(config, obj.deployer, (error, done, imageInfo, response) => {
			if (error) {
				return callback(error, obj);
			}
			obj.consoleIP = null;
			if (response) {
				obj.consoleIP = response.ip;
				obj.deployments.console = response;
			}
			return callback(null, obj);
		});
	}
};

module.exports = lib;