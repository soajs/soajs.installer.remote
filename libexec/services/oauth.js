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
		//oauth bin
		if (doc._id === "5df3ec10fa3912534948f006") {
			if (options.deployment.style === "sem") {
				if (options.versions.services.oauth.semVer) {
					doc.recipe.deployOptions.image.tag = options.versions.services.oauth.semVer;
				}
			} else if (options.versions.services.oauth.ver) {
				doc.recipe.deployOptions.image.tag = options.versions.services.oauth.ver;
			}
		}
	},
	"requireCatalog": (options, serviceName, dataPath) => {
		let doc = null;
		if (serviceName === 'oauth') {
			let doc = require(dataPath + "soajs_oauth_bin.js");
			lib.setImageTag(options, doc);
		}
		return (doc);
	},
	"getConfig": (options, obj) => {
		return {
			"type": options.deployment.type,
			"style": options.deployment.style,
			"serviceVer": options.versions.services.oauth.msVer || 1,
			"repoVer": options.versions.services.oauth.ver,
			"semVer": options.versions.services.oauth.semVer,
			"serviceName": "oauth",
			"gatewayIP": obj.gatewayIP,
			"namespace": options.kubernetes.namespace
		};
	},
	"echoResult": (obj, logger) => {
		logger.debug("\toAuth: ");
		logger.debug("\t\t IP: " + obj.deployments.oauth.ip);
		logger.debug("\t\t Image: " + obj.deployments.oauth.image);
		if (obj.deployments.oauth.branch) {
			logger.debug("\t\t Branch: " + obj.deployments.oauth.branch);
		}
	},
	"install": (obj, callback) => {
		let config = lib.getConfig(obj.options, obj);
		obj.driver.deploy.service(config, obj.deployer, (error, response) => {
			if (error) {
				return callback(error, obj);
			}
			obj.oauthIP = null;
			if (response) {
				obj.oauthIP = response.ip;
				obj.deployments.oauth = response;
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
			obj.oauthIP = null;
			if (response) {
				obj.oauthIP = response.ip;
				obj.deployments.oauth = response;
			}
			return callback(null, obj);
		});
	}
};

module.exports = lib;