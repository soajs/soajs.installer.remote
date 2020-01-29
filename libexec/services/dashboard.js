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
		//dashboard bin
		if (doc._id === "5df3ec10fa3912534948efff") {
			if (options.deployment.style === "sem") {
				if (options.versions.services.dashboard.semVer) {
					doc.recipe.deployOptions.image.tag = options.versions.services.dashboard.semVer;
				}
			} else if (options.versions.services.dashboard.ver) {
				doc.recipe.deployOptions.image.tag = options.versions.services.dashboard.ver;
			}
		}
	},
	"requireCatalog": (options, serviceName, dataPath) => {
		let doc = null;
		if (serviceName === 'dashboard') {
			let doc = require(dataPath + "soajs_dashboard_bin.js");
			lib.setImageTag(options, doc);
		}
		return (doc);
	},
	"getConfig": (options, obj) => {
		return {
			"type": options.deployment.type,
			"style": options.deployment.style,
			"serviceVer": options.versions.services.dashboard.msVer || 1,
			"repoVer": options.versions.services.dashboard.ver,
			"semVer": options.versions.services.dashboard.semVer,
			"serviceName": "dashboard",
			"gatewayIP": obj.gatewayIP,
			"namespace": options.kubernetes.namespace
		};
	},
	"echoResult": (obj, logger) => {
		logger.debug("\tDashboard: ");
		logger.debug("\t\t IP: " + obj.deployments.dashboard.ip);
		logger.debug("\t\t Image: " + obj.deployments.dashboard.image);
		if (obj.deployments.dashboard.branch) {
			logger.debug("\t\t Branch: " + obj.deployments.dashboard.branch);
		}
	},
	"install": (obj, callback) => {
		let config = lib.getConfig(obj.options, obj);
		obj.driver.deploy.service(config, obj.deployer, (error, response) => {
			if (error) {
				return callback(error, obj);
			}
			obj.multitenantIP = null;
			if (response) {
				obj.multitenantIP = response.ip;
				obj.deployments.dashboard = response;
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
			obj.multitenantIP = null;
			if (response) {
				obj.multitenantIP = response.ip;
				obj.deployments.dashboard = response;
			}
			return callback(null, obj);
		});
	}
};

module.exports = lib;