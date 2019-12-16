"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const Client = require('kubernetes-client').Client;
const gConfig = require("./config.js");
const lib = require("./lib.js");
const swagger = require('./swagger/swagger.json');

let driver = {
	/**
	 * @param driverConfig Object
	 * {
	 *      ip : ""
	 *      port: 32323
	 *      token: ""
	 * }
	 *
	 */
	"init": (driverConfig, cb) => {
		if (!driverConfig.token) {
			return cb(new Error('No valid access token found for the kubernetes cluster'));
		}
		if (!driverConfig.ip) {
			return cb(new Error('No valid ip found for the kubernetes cluster'));
		}
		
		let config = {
			"url": 'https://' + driverConfig.ip + ':' + (parseInt(driverConfig.port) || 8443),
			"auth": {
				"bearer": driverConfig.token || ""
			},
			"insecureSkipTlsVerify": true
		};
		
		let kubeConfig = {
			config: config,
			spec: swagger
		};
		try {
			const client = new Client(kubeConfig);
			client.config = kubeConfig.config;
			return cb(null, client);
			
		} catch (e) {
			return cb(e);
		}
	},
	"deploy": {
		"checkNamespace": (options, deployer, cb) => {
			lib.checkNamespace(deployer, options.namespace, (error) => {
				if (error) {
					return cb(error);
				}
				return cb(null);
			});
		},
		/**
		 * @param options Object
		 * {
		 *     port : 2323
		 * }
		 *
		 */
		"mongo": (options, deployer, cb) => {
			let config = {
				"label": gConfig.label.mongo,
				"catId": gConfig.catalog.mongo,
				"mongoPort": options.port || gConfig.mongo.port
			};
			let recipe = require("./recipes/db/mongo.js")(config);
			
			lib.createService(deployer, recipe.service, options.namespace, (error) => {
				if (error) {
					return cb(error);
				}
				lib.createDeployment(deployer, recipe.deployment, options.namespace, (error) => {
					if (error) {
						return cb(error);
					}
					lib.getServiceIPs(deployer, config.label, 1, options.namespace, (error, response) => {
						return cb(error, response);
					});
				});
			});
		},
		/**
		 * @param options Object
		 * {
		 *     type: "bin",
		 *     repoVer: "2.x"
		 *     ...
		 * }
		 *
		 */
		"nginx": (options, deployer, cb) => {
			let type = options.type;
			let ver = options.repoVer;
			let config = {
				"label": gConfig.label.ui,
				"catId": gConfig.catalog.ui[type],
				"image": gConfig.images.ui[type] + ver,
				
				"httpPort": options.httpPort,
				"httpsPort": options.httpsPort,
				"domain": options.domain,
				"sitePrefix": options.sitePrefix,
				"apiPrefix": options.apiPrefix,
				
				"extKey": options.extKey,
				
				"email": options.email,
				
				"deployType": options.deployType,
				"sslSecret": options.sslSecret,
				"gatewayIP": options.gatewayIP
			};
			if (type === "src") {
				config.image = gConfig.images.ui[type];
				config.branch = "release/v" + ver;
			}
			let recipe = require("./recipes/" + type + "/nginx/nginx.js")(config);
			
			lib.createService(deployer, recipe.service, options.namespace, (error) => {
				if (error) {
					return cb(error);
				}
				lib.createDeployment(deployer, recipe.deployment, options.namespace, (error) => {
					if (error) {
						return cb(error);
					}
					lib.getServiceIPs(deployer, config.label, 1, options.namespace, (error, response) => {
						return cb(error, response);
					});
				});
			});
		},
		/**
		 * @param options Object
		 * {
		 *     secretProfile : {},
		 *     type: "bin"
		 *     repoVer: "2.x"
		 * }
		 *
		 */
		"gateway": (options, deployer, cb) => {
			lib.createProfileSecret(deployer, options.profileSecret, options.namespace, (error) => {
				if (error) {
					return cb(error);
				}
				let type = options.type;
				let ver = options.repoVer;
				let config = {
					"label": gConfig.label.gateway + options.serviceVer,
					"catId": gConfig.catalog.gateway[type],
					"image": gConfig.images.gateway[type] + ver
				};
				if (type === "src") {
					config.image = gConfig.images.gateway[type];
					config.branch = "release/v" + ver;
				}
				let recipe = require("./recipes/" + type + "/gateway/controller.js")(config);
				lib.createService(deployer, recipe.service, options.namespace, (error) => {
					if (error) {
						return cb(error);
					}
					lib.createDeployment(deployer, recipe.deployment, options.namespace, (error) => {
						if (error) {
							return cb(error);
						}
						lib.getServiceIPs(deployer, config.label, 1, options.namespace, (error, response) => {
							return cb(error, response);
						});
					});
				});
			});
		},
		/**
		 * @param options Object
		 * {
		 *      type: "bin"
		 *      repoVer: "2.x"
		 *      gatewayIP:
		 * }
		 *
		 */
		"service": (options, deployer, cb) => {
			let type = options.type;
			let service = options.serviceName;
			let ver = options.repoVer;
			let config = {
				"label": gConfig.label[service] + options.serviceVer,
				"catId": gConfig.catalog[service][type],
				"image": gConfig.images[service][type] + ver,
				"registryAPI": options.gatewayIP + ":5000"
			};
			if (type === "src") {
				config.image = gConfig.images[service][type];
				config.branch = "release/v" + ver;
			}
			let recipe = require("./recipes/" + type + "/ms/" + service + ".js")(config);
			
			lib.createService(deployer, recipe.service, options.namespace, (error) => {
				if (error) {
					return cb(error);
				}
				lib.createDeployment(deployer, recipe.deployment, options.namespace, (error) => {
					if (error) {
						return cb(error);
					}
					lib.getServiceIPs(deployer, config.label, 1, options.namespace, (error, response) => {
						return cb(error, response);
					});
				});
			});
		}
	},
	"cleanUp": (options, deployer, cb) => {
		lib.deleteDeployments(deployer, {}, options.namespace, () => {
			lib.deleteDaemonsets(deployer, {}, options.namespace, () => {
				lib.deleteKubeServices(deployer, {}, options.namespace, () => {
					lib.deletePods(deployer, {}, options.namespace, () => {
						lib.deleteSecrets(deployer, {}, options.namespace, () => {
							lib.ensurePods(deployer, {}, options.namespace, (error) => {
								return cb(error);
							});
						});
					});
				});
			});
		});
	}
};

module.exports = driver;