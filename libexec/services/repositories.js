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
		//repositories bin
		if (doc._id === "5edf6c1836c77052b0a5e1f3") {
			if (options.deployment.style === "sem") {
				if (options.versions.services.repositories.semVer) {
					doc.recipe.deployOptions.image.tag = options.versions.services.repositories.semVer;
				}
			} else if (options.versions.services.repositories.ver) {
				doc.recipe.deployOptions.image.tag = options.versions.services.repositories.ver;
			}
		}
	},
	"requireCatalog": (options, serviceName, dataPath) => {
		let doc = null;
		if (serviceName === 'repositories') {
			doc = require(dataPath + "soajs_repositories_bin.js");
			lib.setImageTag(options, doc);
		}
		return (doc);
	},
	"getConfig": (options, obj) => {
		return {
			"type": options.deployment.type,
			"style": options.deployment.style,
			"serviceVer": options.versions.services.repositories.msVer || 3,
			"repoVer": options.versions.services.repositories.ver,
			"semVer": options.versions.services.repositories.semVer,
			"serviceName": "repositories",
			"gatewayIP": obj.gatewayIP,
			"namespace": options.kubernetes.namespace
		};
	},
	"echoResult": (obj, logger) => {
		logger.debug("\tRepositories: ");
		logger.debug("\t\t IP: " + obj.deployments.repositories.ip);
		logger.debug("\t\t Image: " + obj.deployments.repositories.image);
		if (obj.deployments.repositories.branch) {
			logger.debug("\t\t Branch: " + obj.deployments.repositories.branch);
		}
	},
	"install": (obj, callback) => {
		let config = lib.getConfig(obj.options, obj);
		obj.driver.deploy.service(config, obj.deployer, (error, response) => {
			if (error) {
				return callback(error, obj);
			}
			obj.repositoriesIP = null;
			if (response) {
				obj.repositoriesIP = response.ip;
				obj.deployments.repositories = response;
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
			obj.repositoriesIP = null;
			if (response) {
				obj.repositoriesIP = response.ip;
				obj.deployments.repositories = response;
			}
			return callback(null, obj);
		});
	}
};

module.exports = lib;