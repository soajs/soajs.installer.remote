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
			lib.checkNamespace(deployer, gConfig.namespace, (error) => {
				if (error) {
					return cb(error);
				}
				lib.createService(deployer, recipe.service, gConfig.namespace, (error) => {
					if (error) {
						return cb(error);
					}
					lib.createDeployment(deployer, recipe.deployment, gConfig.namespace, (error) => {
						if (error) {
							return cb(error);
						}
						let serviceName = gConfig.label.mongo;
						lib.getServiceIPs(deployer, serviceName, 1, gConfig.namespace, (error, response) => {
							return cb(error, response);
						});
					});
				});
			});
		},
		/**
		 * @param options Object
		 * {
		 *     type: "bin",
		 *     imageVer: "2.x"
		 *     ...
		 * }
		 *
		 */
		"nginx": (options, deployer, cb) => {
			let type = options.type;
			let ver = options.imageVer;
			let config = {
				"label": gConfig.label.ui,
				"catId": gConfig.catalog.ui,
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
			let recipe = require("./recipes/" + type + "/nginx/nginx.js")(config);
			lib.createService(deployer, recipe.service, gConfig.namespace, (error) => {
				if (error) {
					return cb(error);
				}
				lib.createDeployment(deployer, recipe.deployment, gConfig.namespace, (error) => {
					if (error) {
						return cb(error);
					}
					let serviceName = gConfig.label.gateway;
					lib.getServiceIPs(deployer, serviceName, 1, gConfig.namespace, (error, response) => {
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
		 *     imageVer: "2.x"
		 * }
		 *
		 */
		"gateway": (options, deployer, cb) => {
			lib.createProfileSecret(deployer, options.profileSecret, gConfig.namespace, (error) => {
				if (error) {
					return cb(error);
				}
				let type = options.type;
				let ver = options.imageVer;
				let config = {
					"label": gConfig.label.gateway,
					"catId": gConfig.catalog.gateway[type],
					"image": gConfig.images.gateway[type] + ver
				};
				let recipe = require("./recipes/" + type + "/gateway/controller.js")(config);
				
				lib.createService(deployer, recipe.service, gConfig.namespace, (error) => {
					if (error) {
						return cb(error);
					}
					lib.createDeployment(deployer, recipe.deployment, gConfig.namespace, (error) => {
						if (error) {
							return cb(error);
						}
						let serviceName = gConfig.label.gateway;
						lib.getServiceIPs(deployer, serviceName, 1, gConfig.namespace, (error, response) => {
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
		 *      imageVer: "2.x"
		 *      gatewayIP:
		 * }
		 *
		 */
		"service": (options, deployer, cb) => {
			let type = options.type;
			let service = options.serviceName;
			let ver = options.imageVer;
			let config = {
				"label": gConfig.label[service],
				"catId": gConfig.catalog[service][type],
				"image": gConfig.images[service][type] + ver,
				"registryAPI": options.gatewayIP + ":5000"
			};
			let recipe = require("./recipes/" + type + "/ms/" + service + ".js")(config);
			lib.createService(deployer, recipe.service, gConfig.namespace, (error) => {
				if (error) {
					return cb(error);
				}
				lib.createDeployment(deployer, recipe.deployment, gConfig.namespace, (error) => {
					if (error) {
						return cb(error);
					}
					let serviceName = gConfig.label[service];
					lib.getServiceIPs(deployer, serviceName, 1, gConfig.namespace, (error, response) => {
						return cb(error, response);
					});
				});
			});
		}
	},
	"cleanUp": (deployer, cb) => {
		lib.deleteDeployments(deployer, {}, gConfig.namespace, () => {
			lib.deleteDaemonsets(deployer, {}, gConfig.namespace, () => {
				lib.deleteKubeServices(deployer, {}, gConfig.namespace, () => {
					lib.deletePods(deployer, {}, gConfig.namespace, () => {
						lib.deleteSecrets(deployer, {}, gConfig.namespace, () => {
							lib.ensurePods(deployer, {}, gConfig.namespace, (error) => {
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