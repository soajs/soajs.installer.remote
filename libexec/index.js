"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const soajs = require('soajs');
const randomString = require("randomstring");

//set the logger
const utils = require("./utils/utils.js");
const logger = utils.getLogger();

const coreProvisionModel = require("./model/core_provision.js");
const drivers = {
	"kubernetes": require("./driver/kubernetes/index.js")
};

const uuidv4 = require('uuid/v4');
const async = require('async');
const configurationSchema = require("./utils/configurationSchema");


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
				return cb(new Error("Generated Key is invalid."))
			}
		});
	});
}

function importData(options, data, profileImport, cb) {
	let catalogs = (doc) => {
		if (doc.name === "Console UI SSL") {
			doc.recipe.buildOptions.env.SOAJS_SSL_CONFIG = {
				"type": "static",
				"value": '{"email":"' + options.owner.email + '" ,"redirect":false}'
			};
		}
	};
	let customRegistry = (doc) => {
		if (doc.name === "urac") {
			let url = options.nginx.sitePrefix + "." + options.nginx.domain;
			doc.value.link.addUser = doc.value.link.addUser.replace("%URL%", url);
			doc.value.link.changeEmail = doc.value.link.changeEmail.replace("%URL%", url);
			doc.value.link.forgotPassword = doc.value.link.forgotPassword.replace("%URL%", url);
			doc.value.link.join = doc.value.link.join.replace("%URL%", url);
		}
	};
	let environment = (doc) => {
		doc.domain = options.nginx.domain;
		doc.sitePrefix = options.nginx.sitePrefix;
		doc.apiPrefix = options.nginx.apiPrefix;
		doc.deployer.selected = "container.kubernetes.remote";
		doc.deployer.container.kubernetes.remote.namespace.default = options.kubernetes.namespace;
		doc.deployer.container.kubernetes.remote.nodes = options.kubernetes.ip;
		doc.deployer.container.kubernetes.remote.apiPort = options.kubernetes.port;
		doc.deployer.container.kubernetes.remote.auth.token = options.kubernetes.token;
		doc.services.config.key.password = data.keyPassword;
		doc.services.config.cookie.secret = uuidv4();
		doc.services.config.session.secret = uuidv4();
	};
	let infra = (doc) => {
		doc.api.ipaddress = options.kubernetes.ip;
		doc.api.token = options.kubernetes.token;
		doc.api.port = options.kubernetes.port;
		let name = "soajs" + "local" + randomString.generate({
			length: 13,
			charset: 'alphanumeric',
			capitalization: 'lowercase'
		});
		doc.deployments[0].name = name;
		doc.deployments[0].id = name;
	};
	let resources = (doc) => {
		if (doc.name === "dash_cluster") {
			doc.config = {
				"servers": data.profileSecret.servers,
				"credentials": data.profileSecret.credentials,
				"streaming": data.profileSecret.streaming,
				"extraParam": data.profileSecret.extraParam,
				"URLParam": data.profileSecret.URLParam,
			};
		}
	};
	let settings = (doc) => {
		if (doc.type === "installer") {
			doc.releaseInfo = options.versions;
			doc.installerVersion = options.installerVersion;
		}
	};
	let tenants = (doc) => {
		if (doc.code === "DBTN") {
			doc.applications[0].keys[0].extKeys[0].extKey = data.extKey;
		}
	};
	
	let users = (doc) => {
		let Hasher = soajs.hasher;
		Hasher.init({});
		let hashedPwd = Hasher.hash(options.owner.password);
		doc.username = options.owner.username;
		doc.password = hashedPwd;
		doc.email = options.owner.email;
	};
	
	let templates = {
		"catalogs": catalogs,
		"customRegistry": customRegistry,
		"environment": environment,
		"infra": infra,
		"resources": resources,
		"settings": settings,
		"tenants": tenants,
		"users": users
	};
	options.importer.runProfile(profileImport, options.dataPath, options.cleanDataBefore, templates, (error, msg) => {
		return cb(error, msg);
	});
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
			return cb(null);
		}
		return cb(new Error("The provided configuration is not healthy"));
	}
	return cb(new Error("Empty configuration"));
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
	 *          sslSecret: true
	 *     },
	 *     owner: {
	 *         email: "",
	 *         username: "",
	 *         password: "",
	 *     }
	 * }
	 *
	 */
	"install": (options, cb) => {
		validateOptions(options, (error) => {
			if (error) {
				logger.error(error);
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
					async.waterfall([
						(callback) => {
							return callback(null, {"deployments": {}});
						},
						
						//clean up if namespace is there
						(obj, callback) => {
							let config = {
								"namespace": options.kubernetes.namespace,
								"verbose": false
							};
							driver.deploy.assureNamespace(config, deployer, false, (error, found) => {
								if (found) {
									logger.info("namespace [" + config.namespace + "] cleaning previous installation");
									driver.cleanUp(config, deployer, (error) => {
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
							driver.deploy.assureNamespace(config, deployer, true, (error) => {
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
									"namespace": options.kubernetes.namespace
								};
								driver.deploy.mongo(config, deployer, (error, response) => {
									if (error) {
										return callback(error, obj);
									}
									obj.mongoIP = null;
									if (response) {
										obj.mongoIP = response;
									}
									return callback(null, obj);
								})
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
								profileSecret = JSON.parse(JSON.stringify(profileImport));
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
							let config = {
								"profileSecret": obj.profileSecret,
								"type": options.deployment.type,
								"style": options.deployment.style,
								"serviceVer": options.versions.services.gateway.msVer || 1,
								"repoVer": options.versions.services.gateway.ver,
								"semVer": options.versions.services.gateway.semVer,
								"namespace": options.kubernetes.namespace
							};
							driver.deploy.gateway(config, deployer, (error, response) => {
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
							let config = {
								"type": options.deployment.type,
								"style": options.deployment.style,
								"repoVer": options.versions.services.ui.ver,
								"semVer": options.versions.services.ui.semVer,
								
								"httpPort": options.nginx.httpPort,
								"httpsPort": options.nginx.httpsPort,
								
								"domain": options.nginx.domain,
								"sitePrefix": options.nginx.sitePrefix,
								"apiPrefix": options.nginx.apiPrefix,
								"deployType": options.nginx.deployType,
								"sslSecret": options.nginx.sslSecret,
								"sslType": options.nginx.sslType,
								
								"email": options.owner.email,
								"extKey": obj.extKey,
								
								"gatewayIP": obj.gatewayIP,
								"namespace": options.kubernetes.namespace
							};
							driver.deploy.nginx(config, deployer, (error, response) => {
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
						},
						//Install dashboard service
						(obj, callback) => {
							let config = {
								"type": options.deployment.type,
								"style": options.deployment.style,
								"serviceVer": options.versions.services.dashboard.msVer || 1,
								"repoVer": options.versions.services.dashboard.ver,
								"semVer": options.versions.services.dashboard.semVer,
								"serviceName": "dashboard",
								"gatewayIP": obj.gatewayIP,
								"namespace": options.kubernetes.namespace
							};
							driver.deploy.service(config, deployer, (error, response) => {
								if (error) {
									return callback(error, obj);
								}
								obj.dashboardIP = null;
								if (response) {
									obj.dashboardIP = response.ip;
									obj.deployments.dashboard = response;
								}
								return callback(null, obj);
							});
						},
						//Install urac service
						(obj, callback) => {
							let config = {
								"type": options.deployment.type,
								"style": options.deployment.style,
								"serviceVer": options.versions.services.urac.msVer || 3,
								"repoVer": options.versions.services.urac.ver,
								"semVer": options.versions.services.urac.semVer,
								"serviceName": "urac",
								"gatewayIP": obj.gatewayIP,
								"namespace": options.kubernetes.namespace
							};
							driver.deploy.service(config, deployer, (error, response) => {
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
						//Install oauth service
						(obj, callback) => {
							let config = {
								"type": options.deployment.type,
								"style": options.deployment.style,
								"serviceVer": options.versions.services.oauth.msVer || 1,
								"repoVer": options.versions.services.oauth.ver,
								"semVer": options.versions.services.oauth.semVer,
								"serviceName": "oauth",
								"gatewayIP": obj.gatewayIP,
								"namespace": options.kubernetes.namespace
							};
							driver.deploy.service(config, deployer, (error, response) => {
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
						//Install multitenant service
						(obj, callback) => {
							let config = {
								"type": options.deployment.type,
								"style": options.deployment.style,
								"serviceVer": options.versions.services.multitenant.msVer || 1,
								"repoVer": options.versions.services.multitenant.ver,
								"semVer": options.versions.services.multitenant.semVer,
								"serviceName": "multitenant",
								"gatewayIP": obj.gatewayIP,
								"namespace": options.kubernetes.namespace
							};
							driver.deploy.service(config, deployer, (error, response) => {
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
					], (error, obj) => {
						if (!error) {
							logger.debug("The extKey: " + obj.extKey);
							logger.debug("The namespace: " + options.kubernetes.namespace);
							
							logger.debug("The Services Information:");
							
							if (!options.mongo.external) {
								logger.debug("\tMongo: ");
								logger.debug("\t\t IP: " + obj.mongoIP);
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
							
							logger.debug("\tDashboard: ");
							logger.debug("\t\t IP: " + obj.deployments.dashboard.ip);
							logger.debug("\t\t Image: " + obj.deployments.dashboard.image);
							if (obj.deployments.dashboard.branch) {
								logger.debug("\t\t Branch: " + obj.deployments.dashboard.branch);
							}
							
							logger.debug("\tURAC: ");
							logger.debug("\t\t IP: " + obj.deployments.urac.ip);
							logger.debug("\t\t Image: " + obj.deployments.urac.image);
							if (obj.deployments.urac.branch) {
								logger.debug("\t\t Branch: " + obj.deployments.urac.branch);
							}
							
							logger.debug("\toAuth: ");
							logger.debug("\t\t IP: " + obj.deployments.oauth.ip);
							logger.debug("\t\t Image: " + obj.deployments.oauth.image);
							if (obj.deployments.oauth.branch) {
								logger.debug("\t\t Branch: " + obj.deployments.oauth.branch);
							}
							
							logger.debug("\tMultitenant: ");
							logger.debug("\t\t IP: " + obj.deployments.multitenant.ip);
							logger.debug("\t\t Image: " + obj.deployments.multitenant.image);
							if (obj.deployments.multitenant.branch) {
								logger.debug("\t\t Branch: " + obj.deployments.multitenant.branch);
							}
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
				logger.error(error.message);
				return cb(new Error("Unable to continue, please provide valid configuration!"));
			}
			let profileImport = utils.getProfile(options);
			let cpModelObj = new coreProvisionModel(profileImport);
			
			cpModelObj.getSettings((error, settings) => {
				return cb(error, settings);
			});
		});
	},
	
	"updateService": (options, serviceName, rollback, cb) => {
		validateOptions(options, (error) => {
			if (error) {
				logger.error(error);
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
							"rollback": rollback
						};
						driver.updateService(config2, deployer, (error, done) => {
							return cb(error, done);
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
				logger.error(error);
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
				logger.error(error);
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
						driver.restoreServiceDeployment(config2, deployer, (error, done) => {
							return cb(error, done);
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
				logger.error(error);
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
	
	"migrate": (options, strategy, cb) => {
		validateOptions(options, (error) => {
			if (error) {
				logger.error(error.message);
				return cb(new Error("Unable to continue, please provide valid configuration!"));
			}
			let profileImport = utils.getProfile(options);
			
			let strategyFunction = require("./migrate/" + strategy + ".js");
			
			return strategyFunction(profileImport, options.dataPath, cb);
		});
	}
};

module.exports = lib;