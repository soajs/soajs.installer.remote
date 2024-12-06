"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const soajs = require('soajs');
//set the logger
const utils = require("./utils/utils.js");
const logger = utils.getLogger();
const CoreProvisionModel = require("./model/core_provision.js");
const drivers = {
	"kubernetes": require("./driver/kubernetes/index.js")
};
const { v4: uuidv4 } = require('uuid');
const async = require('async');
const configurationSchema = require("./utils/configurationSchema");
const importer = require("./importer/index.js");

let soajsServicesArray = [];
let soajsService = {};

function handleImageInfo(options, imageInfo, serviceName, cb) {
	let profileImport = utils.getProfile(options);
	let cpModelObj = new CoreProvisionModel(profileImport);
	if (imageInfo && imageInfo.style) {
		options.deployment.style = imageInfo.style;
	}
	let semVer = null;
	if (imageInfo && imageInfo.tag) {
		semVer = imageInfo.tag;
	}
	cpModelObj.updateSettings({ "semVer": semVer, "serviceName": serviceName }, (error) => {
		if (error) {
			logger.warn("Unable to update release info for [" + serviceName + "] under Settings: " + error.message);
		}
		let catObjs = requireCatalog(options, serviceName);
		if (catObjs.length > 0) {
			async.eachSeries(catObjs, (oneCatObj, callback) => {
				if (imageInfo && imageInfo.tag) {
					oneCatObj.recipe.deployOptions.image.tag = imageInfo.tag;
				}
				cpModelObj.updateCatalog(oneCatObj, (error, response) => {
					if (error) {
						logger.warn("Unable to update Catalog [" + oneCatObj.name + "] image tag, error: " + error.message);
					}
					if (response) {
						logger.info("Catalog [" + oneCatObj.name + "] image tag was updated successfully");
					}
					return callback();
				});
			}, (error) => {
				return cb(error);
			});
		} else {
			return cb();
		}

	});
}

function generateKey(opts, cb) {
	//soajs encryption engine
	let module = soajs.core.key;
	let key = opts.key;

	let tenant = {
		id: opts.tenantId
	};
	let application = {
		"package": opts.package
	};
	let config = {
		algorithm: "aes256",
		password: opts.secret
	};

	module.generateExternalKey(key, tenant, application, config, (error, extKey) => {
		if (error) {
			return cb(error);
		}
		module.getInfo(extKey, config, (error, response) => {
			if (error) {
				return cb(error);
			}
			if (response.key === key) {
				return cb(null, extKey);
			} else {
				return cb(new Error("Generated Key is invalid."));
			}
		});
	});
}

function setImageTag(options, doc) {

	//console bin pvc
	if (doc._id === "5df3ec10fa3912534948f00d") {
		if (options.deployment.style === "sem") {
			if (options.versions.services.ui.semVer) {
				doc.recipe.deployOptions.image.tag = options.versions.services.ui.semVer;
			}
		} else if (options.versions.services.ui.ver) {
			doc.recipe.deployOptions.image.tag = options.versions.services.ui.ver;
		}
	}
	//console bin secret
	if (doc._id === "5df3ec10fa3912534948effe") {
		if (options.deployment.style === "sem") {
			if (options.versions.services.ui.semVer) {
				doc.recipe.deployOptions.image.tag = options.versions.services.ui.semVer;
			}
		} else if (options.versions.services.ui.ver) {
			doc.recipe.deployOptions.image.tag = options.versions.services.ui.ver;
		}
	}

	//gateway bin
	if (doc._id === "5df3ec10fa3912534948f000") {
		if (options.versions.services.gateway.semVer) {
			doc.recipe.deployOptions.image.tag = options.versions.services.gateway.semVer;
		}
	}

	for (let i = 0; i < soajsServicesArray.length; i++) {
		soajsService[soajsServicesArray[i]].setImageTag(options, doc);
	}
}

function requireCatalog(options, serviceName) {
	let catObjs = [];
	let dataPath = "../data/provision/catalogs/";

	if (serviceName === 'ui') {
		if (options.nginx.sslType === "demo") {
			let doc = require(dataPath + "soajs_console_bin_nossl.js");
			setImageTag(options, doc);
			catObjs.push(doc);
		} else {
			let doc = require(dataPath + "soajs_console_bin_pvc.js");
			setImageTag(options, doc);
			catObjs.push(doc);
			let doc2 = require(dataPath + "soajs_console_bin_secret.js");
			setImageTag(options, doc2);
			catObjs.push(doc2);
		}
	}

	if (serviceName === 'gateway') {
		let doc = require(dataPath + "soajs_gateway_bin.js");
		setImageTag(options, doc);
		catObjs.push(doc);
	}

	for (let i = 0; i < soajsServicesArray.length; i++) {
		let doc = soajsService[soajsServicesArray[i]].requireCatalog(options, serviceName, "../" + dataPath);
		if (doc) {
			catObjs.push(doc);
		}
	}

	return catObjs;
}

function importData(options, data, profileImport, cb) {

	let templates = importer(options, data, { "setImageTag": setImageTag });

	options.importer.runProfile(profileImport, options.dataPath, options.cleanDataBefore, templates, (error, msg) => {
		return cb(error, msg);
	}, options.versions.name || null);
}

function validateOptions(options, cb) {
	if (options) {
		let core = soajs.core;
		let validator = new core.validator.Validator();

		let check = validator.validate(options, configurationSchema);
		if (check && check.errors && Array.isArray(check.errors) && check.errors.length > 0) {
			logger.error("Configuration schema errors: ");
			for (let i = 0; i < check.errors.length; i++) {
				logger.error("\t" + check.errors[i]);
			}
		}
		if (check.valid) {
			if (!options.deployment) {
				options.deployment = {};
			}
			if (!options.deployment.type) {
				options.deployment.type = "bin";
			}
			if (!options.deployment.style) {
				options.deployment.style = "sem";
			}
			if (!options.kubernetes.namespace) {
				options.kubernetes.namespace = "soajs";
			}
			if (options.nginx.sslType === "secret") {
				if (!options.nginx.hasOwnProperty("sslSecret")) {
					return cb(new Error("The provided configuration is not healthy, please provide sslSecret information."));
				}
			}
			options.nginx.pvcClaimName = options.nginx.pvcClaimName || "nfs-pvc";
			options.nginx.sslRedirect = options.nginx.sslRedirect || false;

			if (options.versions.services) {
				soajsServicesArray = [];
				for (let s in options.versions.services) {
					if (options.versions.services.hasOwnProperty(s)) {
						if (s !== "gateway" && s !== "ui") {
							soajsServicesArray.push(s);
						}
					}
				}
			} else {
				soajsServicesArray = ["dashboard", "multitenant", "oauth", "urac"];
			}
			for (let i = 0; i < soajsServicesArray.length; i++) {
				soajsService[soajsServicesArray[i]] = require("./services/" + soajsServicesArray[i] + ".js");
			}

			return cb(null);
		}
		return cb(new Error("The provided configuration is not healthy"));
	}
	return cb(new Error("Empty configuration"));
}

let getConfig = {
	"gateway": (options, obj) => {
		return {
			"profileSecret": obj.profileSecret || null,
			"type": options.deployment.type,
			"style": options.deployment.style,
			"serviceVer": options.versions.services.gateway.msVer || 1,
			"repoVer": options.versions.services.gateway.ver,
			"semVer": options.versions.services.gateway.semVer,
			"namespace": options.kubernetes.namespace
		};
	},
	"nginx": (options, obj) => {
		return {
			"type": options.deployment.type,
			"style": options.deployment.style,
			"serviceVer": options.versions.services.ui.msVer || 1,
			"repoVer": options.versions.services.ui.ver,
			"semVer": options.versions.services.ui.semVer,

			"httpPort": options.nginx.httpPort,
			"httpsPort": options.nginx.httpsPort,

			"domain": options.nginx.domain,
			"sitePrefix": options.nginx.sitePrefix,
			"apiPrefix": options.nginx.apiPrefix,
			"deployType": options.nginx.deployType,
			"pvcClaimName": options.nginx.pvcClaimName,
			"sslRedirect": options.nginx.sslRedirect,
			"sslSecret": options.nginx.sslSecret,
			"sslType": options.nginx.sslType,

			"email": options.owner.email,
			"extKey": obj.extKey,

			"gatewayIP": obj.gatewayIP,
			"namespace": options.kubernetes.namespace
		};
	}
};

function echoResult(options, obj) {
	logger.debug("The extKey: " + obj.extKey);
	logger.debug("The namespace: " + options.kubernetes.namespace);

	logger.debug("The Services Information:");

	if (!options.mongo.external && obj.deployments.mongo) {
		logger.debug("\tMongo: ");
		logger.debug("\t\t IP: " + obj.deployments.mongo.ip);
		if (obj.deployments.mongo.extIp) {
			logger.debug("\t\t extIp: " + obj.deployments.mongo.extIp);
			logger.debug("\t\t please add to the configuration file under mongo [\"deployIP\": \"" + obj.deployments.mongo.extIp + "\"]");
		}
	}

	logger.debug("\tGateway: ");
	logger.debug("\t\t IP: " + obj.deployments.gateway.ip);
	logger.debug("\t\t Image: " + obj.deployments.gateway.image);
	if (obj.deployments.gateway.branch) {
		logger.debug("\t\t Branch: " + obj.deployments.gateway.branch);
	}

	logger.debug("\tUI: ");
	logger.debug("\t\t IP: " + obj.deployments.ui.ip);
	logger.debug("\t\t Image: " + obj.deployments.ui.image);
	if (obj.deployments.ui.branch) {
		logger.debug("\t\t Branch: " + obj.deployments.ui.branch);
	}
	if (obj.deployments.ui.extIp) {
		logger.debug("\t\t extIp: " + obj.deployments.ui.extIp);
	}
	if (obj.deployments.ui.hostanme) {
		logger.debug("\t\t hostanme: " + obj.deployments.ui.hostanme);
	}

	for (let i = 0; i < soajsServicesArray.length; i++) {
		soajsService[soajsServicesArray[i]].echoResult(obj, logger);
	}
}

let lib = {
	/**
	 * @param options Object
	 * {
	 *     driverName : "kubernetes",
	 *     dataPath: "",
	 *     mongo: {
	 *         port: "",
	 *         external: false,
	 *         profile: {
	 *              servers: [
	 *                  {
	 *                      host: ""
	 *                      port: ""
	 *                  }
	 *                  ...
	 *              ],
	 *              credentials: {
	 *                  username: "",
	 *                  password: ""
	 *              },
	 *              URLParam: {}
	 *         }
	 *     },
	 *     kubernetes: {
	 *         ip: ""
	 *         port: 5343
	 *         token: ""
	 *     },
	 *     nginx: {
	 *          httpPort: 333,
	 *          httpsPort: 555,
	 *          domain: "",
	 *          sitePrefix: "",
	 *          apiPrefix: "",
	 *          deployType: "",
	 *          pvcClaimName: "",
	 *          sslRedirect: false,
	 *          sslSecret: true
	 *     },
	 *     owner: {
	 *         email: "",
	 *         username: "",
	 *         password: "",
	 *     }
	 * }
	 * @param cb
	 */
	"install": (options, cb) => {
		validateOptions(options, (error) => {
			if (error) {
				if (error.message) {
					logger.error(error.message);
				} else {
					logger.error(error);
				}
				return cb(new Error("Unable to continue, please provide valid configuration!"));
			}
			if (drivers[options.driverName]) {
				let driver = drivers[options.driverName];
				let driverConfig = {
					"ip": options.kubernetes.ip,
					"port": options.kubernetes.port,
					"token": options.kubernetes.token
				};
				driver.init(driverConfig, (error, deployer) => {
					if (error) {
						return cb(error);
					}
					let waterfallArray = [
						(callback) => {
							return callback(null, {
								"deployments": {},
								"driver": driver,
								"deployer": deployer,
								"options": options
							});
						},

						//clean up if namespace is there
						(obj, callback) => {
							let config = {
								"namespace": options.kubernetes.namespace,
								"verbose": false
							};
							obj.driver.deploy.assureNamespace(config, obj.deployer, false, (error, found) => {
								if (found) {
									logger.info("namespace [" + config.namespace + "] cleaning previous installation");
									driver.cleanUp(config, obj.deployer, (error) => {
										if (error) {
											return callback(error);
										}
										return callback(null, obj);
									});
								} else {
									return callback(null, obj);
								}
							});
						},
						//Assure namespace
						(obj, callback) => {
							let config = {
								"namespace": options.kubernetes.namespace,
								"verbose": true
							};
							obj.driver.deploy.assureNamespace(config, obj.deployer, true, (error) => {
								if (error) {
									return callback(error, obj);
								}
								return callback(null, obj);
							});
						},
						//Install mongo
						(obj, callback) => {
							if (options.mongo.external) {
								logger.info('External Mongo deployment detected, data containers will not be deployed ...');
								return callback(null, obj);
							} else {
								let config = {
									"port": options.mongo.port,
									"deployType": options.mongo.deployType,
									"namespace": options.kubernetes.namespace
								};
								obj.driver.deploy.mongo(config, obj.deployer, (error, response) => {
									if (error) {
										return callback(error, obj);
									}
									obj.mongoIP = null;
									if (response) {
										obj.mongoIP = response.ip;
										obj.deployments.mongo = response;
										if (response.extIp) {
											obj.mongoExtIp = response.extIp;
										}
									}
									return callback(null, obj);
								});
							}
						},
						//Patch data
						(obj, callback) => {
							let profileImport = null;
							let profileSecret = null;
							if (obj.mongoIP) {
								profileImport = require("../data/soajs_profile.js");
								profileSecret = JSON.parse(JSON.stringify(profileImport));
								profileImport.servers[0].host = options.kubernetes.ip;
								if (options.mongo.deployType === "LoadBalancer") {
									profileImport.servers[0].port = 27017;
									profileImport.servers[0].host = obj.mongoExtIp;
								}
								profileSecret.servers[0].host = obj.mongoIP;
								profileSecret.servers[0].port = 27017;
							} else {
								profileImport = {
									"name": "core_provision",
									"prefix": "",
									"servers": options.mongo.profile.servers,
									"credentials": options.mongo.profile.credentials,
									"streaming": {},
									"extraParam": {},
									"URLParam": options.mongo.profile.URLParam,
								};
								if (options.mongo.profile.protocol) {
									profileImport.protocol = options.mongo.profile.protocol;
								}
								profileSecret = JSON.parse(JSON.stringify(profileImport));
								if (options.mongo.vpc) {
									if (options.mongo.vpc.servers) {
										profileSecret.servers = options.mongo.vpc.servers;
									}
									if (options.mongo.vpc.credentials) {
										profileSecret.credentials = options.mongo.vpc.credentials;
									}
									if (options.mongo.vpc.URLParam) {
										profileSecret.URLParam = options.mongo.vpc.URLParam;
									}
									if (options.mongo.vpc.protocol) {
										profileSecret.protocol = options.mongo.vpc.protocol;
									}
								}
							}
							if (profileImport && profileImport.servers && Array.isArray(profileImport.servers) && profileImport.servers[0] && profileImport.servers[0].host) {
								logger.info("Importing data this might take some time ... ");
								setTimeout(() => {
									let guestTenant = require(options.dataPath + "tenants/guest.js");
									let opts = {
										"key": guestTenant.applications[0].keys[0].key,
										"tenantId": guestTenant._id,
										"package": guestTenant.applications[0].package,
										"secret": uuidv4()
									};
									generateKey(opts, (error, extKey) => {
										if (error) {
											return callback(error, obj);
										}
										obj.extKey = extKey;
										importData(options, {
											"extKey": extKey,
											"keyPassword": opts.secret,
											"profileSecret": profileSecret
										}, profileImport, (error, msg) => {
											logger.debug(msg);
											obj.profileSecret = profileSecret;
											return callback(null, obj);
										});
									});
								}, 30000);
							} else {
								return callback(new Error("Mongo profile is not healthy, unable to continue"), obj);
							}
						},
						//Install gateway
						(obj, callback) => {
							let config = getConfig.gateway(options, obj);
							obj.driver.deploy.gateway(config, obj.deployer, (error, response) => {
								if (error) {
									return callback(error, obj);
								}
								obj.gatewayIP = null;
								if (response) {
									obj.gatewayIP = response.ip;
									obj.deployments.gateway = response;
								}
								return callback(null, obj);
							});
						},
						//Install nginx
						(obj, callback) => {
							let config = getConfig.nginx(options, obj);
							obj.driver.deploy.nginx(config, obj.deployer, (error, response) => {
								if (error) {
									return callback(error, obj);
								}
								obj.nginxIP = null;
								if (response) {
									obj.nginxIP = response.ip;
									obj.deployments.ui = response;
								}
								return callback(null, obj);
							});
						}
					];
					for (let i = 0; i < soajsServicesArray.length; i++) {
						waterfallArray.push(soajsService[soajsServicesArray[i]].install);
					}
					async.waterfall(waterfallArray, (error, obj) => {
						if (!error) {
							echoResult(options, obj);
						}
						return cb(error);
					});
				});
			} else {
				return cb(new Error("Unable to find driver [" + options.driverName + "] in configuration"));
			}
		});
	},

	/**
	 * Get saved setting in settings collection
	 * @param options
	 * @param cb
	 */
	"getSettings": (options, cb) => {
		validateOptions(options, (error) => {
			if (error) {
				if (error.message) {
					logger.error(error.message);
				} else {
					logger.error(error);
				}
				return cb(new Error("Unable to continue, please provide valid configuration!"));
			}
			let profileImport = utils.getProfile(options);
			let cpModelObj = new CoreProvisionModel(profileImport);

			cpModelObj.getSettings((error, settings) => {
				return cb(error, settings);
			});
		});
	},

	"updateService": (options, serviceName, rollback, cb) => {
		validateOptions(options, (error) => {
			if (error) {
				if (error.message) {
					logger.error(error.message);
				} else {
					logger.error(error);
				}
				return cb(new Error("Unable to continue, please provide valid configuration!"));
			}
			if (drivers[options.driverName]) {
				let driver = drivers[options.driverName];
				let config = {
					"ip": options.kubernetes.ip,
					"port": options.kubernetes.port,
					"token": options.kubernetes.token
				};
				driver.init(config, (error, deployer) => {
					if (error) {
						return cb(error);
					}
					let config = {
						"namespace": options.kubernetes.namespace,
						"verbose": false
					};
					driver.deploy.assureNamespace(config, deployer, false, (error, found) => {
						if (error) {
							return cb(error);
						}
						if (!found) {
							let error = new Error("Unable to find namespace: " + config.namespace);
							return cb(error);
						}
						let config2 = {
							"namespace": options.kubernetes.namespace,
							"serviceName": serviceName,
							"version": options.versions.services[serviceName],
							"rollback": rollback,
							"nginx": {
								"sslType": options.nginx.sslType
							}
						};
						driver.updateService(config2, deployer, (error, done, imageInfo) => {
							if (!error && done && imageInfo.changed) {
								handleImageInfo(options, imageInfo, serviceName, (newError) => {
									return cb(newError, done);
								});
							} else {
								return cb(error, done);
							}
						});
					});
				});
			} else {
				return cb(new Error("Unable to find driver [" + options.driverName + "] in configuration"));
			}
		});
	},

	"backupService": (options, serviceName, backup, cb) => {
		validateOptions(options, (error) => {
			if (error) {
				if (error.message) {
					logger.error(error.message);
				} else {
					logger.error(error);
				}
				return cb(new Error("Unable to continue, please provide valid configuration!"));
			}
			if (drivers[options.driverName]) {
				let driver = drivers[options.driverName];
				let config = {
					"ip": options.kubernetes.ip,
					"port": options.kubernetes.port,
					"token": options.kubernetes.token
				};
				driver.init(config, (error, deployer) => {
					if (error) {
						return cb(error);
					}

					let config = {
						"namespace": options.kubernetes.namespace,
						"verbose": false
					};
					driver.deploy.assureNamespace(config, deployer, false, (error, found) => {
						if (error) {
							return cb(error);
						}
						if (!found) {
							let error = new Error("Unable to find namespace: " + config.namespace);
							return cb(error);
						}

						let config2 = {
							"namespace": options.kubernetes.namespace,
							"serviceName": serviceName,
							"backup": backup
						};
						driver.backupService(config2, deployer, (error, done) => {
							return cb(error, done);
						});
					});
				});
			} else {
				return cb(new Error("Unable to find driver [" + options.driverName + "] in configuration"));
			}
		});
	},

	"restoreOne": (options, oneService, oneDeployment, cb) => {
		validateOptions(options, (error) => {
			if (error) {
				if (error.message) {
					logger.error(error.message);
				} else {
					logger.error(error);
				}
				return cb(new Error("Unable to continue, please provide valid configuration!"));
			}
			if (drivers[options.driverName]) {
				let driver = drivers[options.driverName];
				let config = {
					"ip": options.kubernetes.ip,
					"port": options.kubernetes.port,
					"token": options.kubernetes.token
				};
				driver.init(config, (error, deployer) => {
					if (error) {
						return cb(error);
					}

					let config = {
						"namespace": options.kubernetes.namespace,
						"verbose": false
					};
					driver.deploy.assureNamespace(config, deployer, false, (error, found) => {
						if (error) {
							return cb(error);
						}
						if (!found) {
							let error = new Error("Unable to find namespace: " + config.namespace);
							return cb(error);
						}

						let config2 = {
							"namespace": options.kubernetes.namespace,
							"oneService": oneService,
							"oneDeployment": oneDeployment
						};
						driver.restoreServiceDeployment(config2, deployer, (error, done, imageInfo) => {
							if (!error && done && imageInfo.changed) {

								let serviceName = oneService.metadata.labels['soajs.service.name'];
								if (serviceName === "nginx") {
									serviceName = 'ui';
								}
								if (serviceName === 'controller') {
									serviceName = 'gateway';
								}
								handleImageInfo(options, imageInfo, serviceName, (newError) => {
									return cb(newError, done);
								});
							} else {
								return cb(error, done);
							}
						});
					});
				});
			} else {
				return cb(new Error("Unable to find driver [" + options.driverName + "] in configuration"));
			}
		});
	},

	"patch": (options, serviceName, cb) => {
		validateOptions(options, (error) => {
			if (error) {
				if (error.message) {
					logger.error(error.message);
				} else {
					logger.error(error);
				}
				return cb(new Error("Unable to continue, please provide valid configuration!"));
			}
			if (!soajsService[serviceName]) {
				return cb(new Error("Service [" + serviceName + "] cannot be recognized as a SOAJS service"));
			}
			if (drivers[options.driverName]) {
				let driver = drivers[options.driverName];
				let config = {
					"ip": options.kubernetes.ip,
					"port": options.kubernetes.port,
					"token": options.kubernetes.token
				};
				driver.init(config, (error, deployer) => {
					if (error) {
						return cb(error);
					}

					let config = {
						"namespace": options.kubernetes.namespace,
						"verbose": false
					};
					driver.deploy.assureNamespace(config, deployer, false, (error, found) => {
						if (error) {
							return cb(error);
						}
						if (!found) {
							let error = new Error("Unable to find namespace: " + config.namespace);
							return cb(error);
						}
						let gatewayOptions = getConfig.gateway(options, {});
						let serviceOptions = soajsService[serviceName].getConfig(options, {});
						driver.patch(serviceOptions, gatewayOptions, deployer, (error, done, imageInfo, deployment) => {
							if (deployment) {
								logger.debug("Service " + serviceName + ": patched");
								let obj = { "deployments": { [serviceName]: deployment } };
								soajsService[serviceName].echoResult(obj, logger);
							}
							if (!error && done && imageInfo && imageInfo.changed) {
								handleImageInfo(options, imageInfo, serviceName, (newError) => {
									return cb(newError, done);
								});
							} else {
								return cb(error, done);
							}
						});
					});
				});
			} else {
				return cb(new Error("Unable to find driver [" + options.driverName + "] in configuration"));
			}
		});
	},

	"getInfo": (options, cb) => {
		validateOptions(options, (error) => {
			if (error) {
				if (error.message) {
					logger.error(error.message);
				} else {
					logger.error(error);
				}
				return cb(new Error("Unable to continue, please provide valid configuration!"));
			}
			if (drivers[options.driverName]) {
				let driver = drivers[options.driverName];
				let config = {
					"ip": options.kubernetes.ip,
					"port": options.kubernetes.port,
					"token": options.kubernetes.token
				};
				driver.init(config, (error, deployer) => {
					if (error) {
						return cb(error);
					}
					let config = {
						"namespace": options.kubernetes.namespace,
						"verbose": false
					};
					driver.deploy.assureNamespace(config, deployer, false, (error, found) => {
						if (error) {
							return cb(error);
						}
						if (!found) {
							let error = new Error("Unable to find namespace: " + config.namespace);
							return cb(error);
						}
						driver.info(config, deployer, (error, services) => {
							let response = {
								"info": {
									"type": options.deployment.type,
									"style": options.deployment.style
								},
								"services": services
							};
							return cb(error, response);
						});
					});
				});
			} else {
				return cb(new Error("Unable to find driver [" + options.driverName + "] in configuration"));
			}
		});
	},

	"migrate": (options, strategy, release, cb) => {
		validateOptions(options, (error) => {
			if (error) {
				if (error.message) {
					logger.error(error.message);
				} else {
					logger.error(error);
				}
				return cb(new Error("Unable to continue, please provide valid configuration!"));
			}
			let profileImport = utils.getProfile(options);

			let strategyFunction = require("./migrate/" + strategy + ".js");

			return strategyFunction(profileImport, options.dataPath, release, cb);
		});
	},

	"upgrade": (options, cb) => {
		validateOptions(options, (error) => {
			if (error) {
				if (error.message) {
					logger.error(error.message);
				} else {
					logger.error(error);
				}
				return cb(new Error("Unable to continue, please provide valid configuration!"));
			}
			if (drivers[options.driverName]) {
				let driver = drivers[options.driverName];
				let driverConfig = {
					"ip": options.kubernetes.ip,
					"port": options.kubernetes.port,
					"token": options.kubernetes.token
				};
				driver.init(driverConfig, (error, deployer) => {
					if (error) {
						return cb(error);
					}
					let waterfallArray = [
						(callback) => {
							return callback(null, {
								"deployments": {},
								"driver": driver,
								"deployer": deployer,
								"options": options
							});
						},

						//Assure namespace
						(obj, callback) => {
							let config = {
								"namespace": options.kubernetes.namespace,
								"verbose": false
							};
							obj.driver.deploy.assureNamespace(config, obj.deployer, false, (error, found) => {
								if (error) {
									return callback(error, obj);
								}
								if (!found) {
									let error = new Error("Unable to find namespace: " + config.namespace);
									return callback(error);
								}
								return callback(null, obj);
							});
						},
						//get extKey
						(obj, callback) => {

							let profileImport = utils.getProfile(options);
							let cpModelObj = new CoreProvisionModel(profileImport);

							cpModelObj.getExtKey((error, extKey) => {
								obj.profileImport = profileImport;
								if (extKey) {
									obj.extKey = extKey;
								}
								return callback(error, obj);
							});
						},
						//Gateway
						(obj, callback) => {
							let config = getConfig.gateway(options, obj);
							obj.driver.upgrade.gateway(config, obj.deployer, (error, done, imageInfo, response) => {
								if (error) {
									return callback(error, obj);
								}
								obj.gatewayIP = null;
								if (response) {
									obj.gatewayIP = response.ip;
									obj.deployments.gateway = response;
								}
								return callback(null, obj);
							});
						},
						//nginx
						(obj, callback) => {
							let config = getConfig.nginx(options, obj);
							obj.driver.upgrade.nginx(config, obj.deployer, (error, done, imageInfo, response) => {
								if (error) {
									return callback(error, obj);
								}
								obj.nginxIP = null;
								if (response) {
									obj.nginxIP = response;
									obj.deployments.ui = response;
								}
								return callback(null, obj);
							});
						}
					];

					for (let i = 0; i < soajsServicesArray.length; i++) {
						waterfallArray.push(soajsService[soajsServicesArray[i]].upgrade);
					}

					waterfallArray.push(
						//update data (catalogs & settings
						(obj, callback) => {
							let catalogs = (doc) => {
								setImageTag(options, doc);
							};
							let templates = {
								"catalogs": catalogs
							};
							options.importer.runFor.catalogs(obj.profileImport, options.dataPath, false, templates, () => {
								let settings = (doc) => {
									if (doc.type === "installer") {
										doc.releaseInfo = options.versions;
										doc.installerVersion = options.installerVersion;
									}
								};
								let templates = {
									"settings": settings
								};
								options.importer.runFor.settings(obj.profileImport, options.dataPath, false, templates, () => {

									return callback(null, obj);
								});
							});
						}
					);

					async.waterfall(waterfallArray, (error, obj) => {
						if (!error) {
							echoResult(options, obj);
						}
						return cb(error);
					});
				});
			} else {
				return cb(new Error("Unable to find driver [" + options.driverName + "] in configuration"));
			}
		});
	}
};

module.exports = lib;