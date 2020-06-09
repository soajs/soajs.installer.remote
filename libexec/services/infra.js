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
		//infra bin
		if (doc._id === "5edf69dc36c77052b0a5e1f0") {
			if (options.deployment.style === "sem") {
				if (options.versions.services.infra.semVer) {
					doc.recipe.deployOptions.image.tag = options.versions.services.infra.semVer;
				}
			} else if (options.versions.services.infra.ver) {
				doc.recipe.deployOptions.image.tag = options.versions.services.infra.ver;
			}
		}
	},
	"requireCatalog": (options, serviceName, dataPath) => {
		let doc = null;
		if (serviceName === 'infra') {
			doc = require(dataPath + "soajs_infra_bin.js");
			lib.setImageTag(options, doc);
		}
		return (doc);
	},
	"getConfig": (options, obj) => {
		return {
			"type": options.deployment.type,
			"style": options.deployment.style,
			"serviceVer": options.versions.services.infra.msVer || 3,
			"repoVer": options.versions.services.infra.ver,
			"semVer": options.versions.services.infra.semVer,
			"serviceName": "infra",
			"gatewayIP": obj.gatewayIP,
			"namespace": options.kubernetes.namespace
		};
	},
	"echoResult": (obj, logger) => {
		logger.debug("\tInfra: ");
		logger.debug("\t\t IP: " + obj.deployments.infra.ip);
		logger.debug("\t\t Image: " + obj.deployments.infra.image);
		if (obj.deployments.infra.branch) {
			logger.debug("\t\t Branch: " + obj.deployments.infra.branch);
		}
	},
	"install": (obj, callback) => {
		let config = lib.getConfig(obj.options, obj);
		obj.driver.deploy.service(config, obj.deployer, (error, response) => {
			if (error) {
				return callback(error, obj);
			}
			obj.infraIP = null;
			if (response) {
				obj.infraIP = response.ip;
				obj.deployments.infra = response;
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
			obj.infraIP = null;
			if (response) {
				obj.infraIP = response.ip;
				obj.deployments.infra = response;
			}
			return callback(null, obj);
		});
	}
};

module.exports = lib;