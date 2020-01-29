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
		//multitenant bin
		if (doc._id === "5df3ec10fa3912534948f004") {
			if (options.deployment.style === "sem") {
				if (options.versions.services.multitenant.semVer) {
					doc.recipe.deployOptions.image.tag = options.versions.services.multitenant.semVer;
				}
			} else if (options.versions.services.multitenant.ver) {
				doc.recipe.deployOptions.image.tag = options.versions.services.multitenant.ver;
				
			}
		}
	},
	"requireCatalog": (options, serviceName, dataPath) => {
		let doc = null;
		if (serviceName === 'multitenant') {
			doc = require(dataPath + "soajs_multitenant_bin.js");
			lib.setImageTag(options, doc);
		}
		return (doc);
	},
	"getConfig": (options, obj) => {
		return {
			"type": options.deployment.type,
			"style": options.deployment.style,
			"serviceVer": options.versions.services.multitenant.msVer || 1,
			"repoVer": options.versions.services.multitenant.ver,
			"semVer": options.versions.services.multitenant.semVer,
			"serviceName": "multitenant",
			"gatewayIP": obj.gatewayIP,
			"namespace": options.kubernetes.namespace
		};
	},
	"echoResult": (obj, logger) => {
		logger.debug("\tMultitenant: ");
		logger.debug("\t\t IP: " + obj.deployments.multitenant.ip);
		logger.debug("\t\t Image: " + obj.deployments.multitenant.image);
		if (obj.deployments.multitenant.branch) {
			logger.debug("\t\t Branch: " + obj.deployments.multitenant.branch);
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
				obj.deployments.multitenant = response;
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
				obj.deployments.multitenant = response;
			}
			return callback(null, obj);
		});
	}
};

module.exports = lib;