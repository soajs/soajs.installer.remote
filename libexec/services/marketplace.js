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
		//marketplace bin
		if (doc._id === "5edf6c1136c77052b0a5e1f2") {
			if (options.deployment.style === "sem") {
				if (options.versions.services.marketplace.semVer) {
					doc.recipe.deployOptions.image.tag = options.versions.services.marketplace.semVer;
				}
			} else if (options.versions.services.marketplace.ver) {
				doc.recipe.deployOptions.image.tag = options.versions.services.marketplace.ver;
			}
		}
	},
	"requireCatalog": (options, serviceName, dataPath) => {
		let doc = null;
		if (serviceName === 'marketplace') {
			doc = require(dataPath + "soajs_marketplace_bin.js");
			lib.setImageTag(options, doc);
		}
		return (doc);
	},
	"getConfig": (options, obj) => {
		return {
			"type": options.deployment.type,
			"style": options.deployment.style,
			"serviceVer": options.versions.services.marketplace.msVer || 3,
			"repoVer": options.versions.services.marketplace.ver,
			"semVer": options.versions.services.marketplace.semVer,
			"serviceName": "marketplace",
			"gatewayIP": obj.gatewayIP,
			"namespace": options.kubernetes.namespace
		};
	},
	"echoResult": (obj, logger) => {
		logger.debug("\tMarketplace: ");
		logger.debug("\t\t IP: " + obj.deployments.marketplace.ip);
		logger.debug("\t\t Image: " + obj.deployments.marketplace.image);
		if (obj.deployments.marketplace.branch) {
			logger.debug("\t\t Branch: " + obj.deployments.marketplace.branch);
		}
	},
	"install": (obj, callback) => {
		let config = lib.getConfig(obj.options, obj);
		obj.driver.deploy.service(config, obj.deployer, (error, response) => {
			if (error) {
				return callback(error, obj);
			}
			obj.marketplaceIP = null;
			if (response) {
				obj.marketplaceIP = response.ip;
				obj.deployments.marketplace = response;
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
			obj.marketplaceIP = null;
			if (response) {
				obj.marketplaceIP = response.ip;
				obj.deployments.marketplace = response;
			}
			return callback(null, obj);
		});
	}
};

module.exports = lib;