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
		"assureNamespace": (options, deployer, createIfNotExist, cb) => {
			lib.assureNamespace(deployer, options.namespace, createIfNotExist, (error, found) => {
				if (error) {
					return cb(error);
				}
				return cb(null, found);
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
		 *     "type": "bin"
		 *     "style": "sem"
		 *     "repoVer": "2.x"
		 *     "semVer": "2.0.1"
		 *     ...
		 * }
		 *
		 */
		"nginx": (options, deployer, cb) => {
			let type = options.type;
			let sslType = options.sslType;
			let config = {
				"label": gConfig.label.ui,
				"catId": gConfig.catalog.ui[sslType][type],
				"image": gConfig.images.ui[type] + options.semVer,
				
				"httpPort": options.httpPort,
				"httpsPort": options.httpsPort,
				"domain": options.domain,
				"sitePrefix": options.sitePrefix,
				"apiPrefix": options.apiPrefix,
				
				"extKey": options.extKey,
				
				"email": options.email,
				
				"deployType": options.deployType,
				//"sslSecret": options.sslSecret,
				"sslType": sslType,
				"gatewayIP": options.gatewayIP
			};
			if (options.style === "major") {
				config.image = gConfig.images.ui[type] + options.repoVer;
			}
			if (type === "src") {
				config.image = gConfig.images.ui[type];
				config.branch = options.semVer;
				if (options.style === "major") {
					config.branch = "release/v" + options.repoVer;
				}
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
						let deployment = {
							ip: response,
							image: config.image,
							branch: config.branch || null
						};
						return cb(error, deployment);
					});
				});
			});
		},
		/**
		 * @param options Object
		 * {
		 *     "secretProfile" : {},
		 *     "type": "bin"
		 *     "style": "sem"
		 *     "serviceVer": 1
		 *     "repoVer": "2.x"
		 *     "semVer": "2.0.1"
		 *     "namespace": "soajs
		 * }
		 *
		 */
		"gateway": (options, deployer, cb) => {
			lib.createProfileSecret(deployer, options.profileSecret, options.namespace, (error) => {
				if (error) {
					return cb(error);
				}
				let type = options.type;
				let config = {
					"label": gConfig.label.gateway + options.serviceVer,
					"catId": gConfig.catalog.gateway[type],
					"image": gConfig.images.gateway[type] + options.semVer
				};
				if (options.style === "major") {
					config.image = gConfig.images.gateway[type] + options.repoVer;
				}
				if (type === "src") {
					config.image = gConfig.images.gateway[type];
					config.branch = options.semVer;
					if (options.style === "major") {
						config.branch = "release/v" + options.repoVer;
					}
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
							let deployment = {
								ip: response,
								image: config.image,
								branch: config.branch || null
							};
							return cb(error, deployment);
						});
					});
				});
			});
		},
		/**
		 * @param options Object
		 * {
		 *      "type": "bin"
		 *      "style": "sem"
		 *      "serviceVer": 1
		 *      "repoVer": "2.x"
		 *      "semVer": "2.0.1"
		 *      "serviceName": "urac"
		 *      "gatewayIP": "IP"
		 *      "namespace": "soajs"
		 * }
		 *
		 */
		"service": (options, deployer, cb) => {
			let service = options.serviceName;
			let type = options.type;
			let config = {
				"label": gConfig.label[service] + options.serviceVer,
				"catId": gConfig.catalog[service][type],
				"image": gConfig.images[service][type] + options.semVer,
				"registryAPI": options.gatewayIP + ":5000"
			};
			if (options.style === "major") {
				config.image = gConfig.images[service][type] + options.repoVer;
			}
			if (type === "src") {
				config.image = gConfig.images[service][type];
				config.branch = options.semVer;
				if (options.style === "major") {
					config.branch = "release/v" + options.repoVer;
				}
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
						let deployment = {
							ip: response,
							image: config.image,
							branch: config.branch || null
						};
						return cb(error, deployment);
					});
				});
			});
		}
	},
	/**
	 * To update a service within the same release and patch number
	 * @param options
	 * @param deployer
	 * @param cb
	 */
	"updateService": (options, deployer, cb) => {
		options.label = gConfig.label[options.serviceName] + options.version.msVer;
		options.image = {
			"bin": gConfig.images[options.serviceName].bin,
			"src": gConfig.images[options.serviceName].src
		};
		lib.updateService(deployer, options, options.namespace, (error, done) => {
			return cb(error, done);
		});
	},
	/**
	 * Get the deployed version information
	 * @param options
	 * @param deployer
	 * @param cb
	 */
	"info": (options, deployer, cb) => {
		lib.getServicesInfo(deployer, {}, options.namespace, (error, servicesInfo) => {
			if (error) {
				return cb(error);
			}
			if (!servicesInfo || servicesInfo.length === 0) {
				let error = new Error("Unable to find any SOAJS service");
				return cb(error);
			}
			return cb(null, servicesInfo);
		})
	},
	
	"cleanUp": (options, deployer, cb) => {
		lib.deleteDeployments(deployer, {}, options.namespace, () => {
			lib.deleteDaemonsets(deployer, {}, options.namespace, () => {
				lib.deleteServices(deployer, {}, options.namespace, () => {
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