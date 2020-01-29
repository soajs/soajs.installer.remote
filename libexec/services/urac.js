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
		//urac bin
		if (doc._id === "5df3ec10fa3912534948f008") {
			if (options.deployment.style === "sem") {
				if (options.versions.services.urac.semVer) {
					doc.recipe.deployOptions.image.tag = options.versions.services.urac.semVer;
				}
			} else if (options.versions.services.urac.ver) {
				doc.recipe.deployOptions.image.tag = options.versions.services.urac.ver;
			}
		}
	},
	"requireCatalog": (options, serviceName, dataPath) => {
		let doc = null;
		if (serviceName === 'urac') {
			doc = require(dataPath + "soajs_urac_bin.js");
			lib.setImageTag(options, doc);
		}
		return (doc);
	},
	"getConfig": (options, obj) => {
		return {
			"type": options.deployment.type,
			"style": options.deployment.style,
			"serviceVer": options.versions.services.urac.msVer || 3,
			"repoVer": options.versions.services.urac.ver,
			"semVer": options.versions.services.urac.semVer,
			"serviceName": "urac",
			"gatewayIP": obj.gatewayIP,
			"namespace": options.kubernetes.namespace
		};
	},
	"echoResult": (obj, logger) => {
		logger.debug("\tURAC: ");
		logger.debug("\t\t IP: " + obj.deployments.urac.ip);
		logger.debug("\t\t Image: " + obj.deployments.urac.image);
		if (obj.deployments.urac.branch) {
			logger.debug("\t\t Branch: " + obj.deployments.urac.branch);
		}
	},
	"install": (obj, callback) => {
		let config = lib.getConfig(obj.options, obj);
		obj.driver.deploy.service(config, obj.deployer, (error, response) => {
			if (error) {
				return callback(error, obj);
			}
			obj.uracIP = null;
			if (response) {
				obj.uracIP = response.ip;
				obj.deployments.urac = response;
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
			obj.uracIP = null;
			if (response) {
				obj.uracIP = response.ip;
				obj.deployments.urac = response;
			}
			return callback(null, obj);
		});
	}
};

module.exports = lib;