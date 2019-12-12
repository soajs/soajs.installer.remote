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
const logger = require("./utils/utils.js").getLogger();

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
				logger.error("\t" + check.errors[i].property + ": " + check.errors[i].message);
			}
		}
		if (check.valid) {
			if (!options.type) {
				options.type = "bin";
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
				logger.error(error.message);
				return cb(new Error("Unable continue, please provide valid configuration!"));
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
					//clean up
					driver.cleanUp(deployer, (error) => {
						if (error) {
							return cb(error);
						}
						async.waterfall([
							(cb) => {
								return cb(null, {});
							},
							//Install mongo
							(obj, cb) => {
								if (options.mongo.external) {
									logger.info('External Mongo deployment detected, data containers will not be deployed ...');
									return cb(null, obj);
								} else {
									let config = {
										"port": options.mongo.port
									};
									driver.deploy.mongo(config, deployer, (error, response) => {
										if (error) {
											return cb(error, obj);
										}
										obj.mongoIP = null;
										if (response) {
											obj.mongoIP = response;
										}
										return cb(null, obj);
									})
								}
							},
							//Patch data
							(obj, cb) => {
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
												return cb(error, obj);
											}
											obj.extKey = extKey;
											importData(options, {
												"extKey": extKey,
												"keyPassword": opts.secret,
												"profileSecret": profileSecret
											}, profileImport, (error, msg) => {
												logger.debug(msg);
												obj.profileSecret = profileSecret;
												return cb(null, obj);
											});
										});
									}, 30000);
								} else {
									return cb(new Error("Mongo profile is not healthy, unable to continue"), obj);
								}
							},
							//Install gateway
							(obj, cb) => {
								let config = {
									"profileSecret": obj.profileSecret,
									"type": options.type,
									"serviceVer": "1",
									"repoVer": options.versions.services.gateway.ver
								};
								driver.deploy.gateway(config, deployer, (error, response) => {
									if (error) {
										return cb(error, obj);
									}
									obj.gatewayIP = null;
									if (response) {
										obj.gatewayIP = response;
									}
									return cb(null, obj);
								});
							},
							//Install nginx
							(obj, cb) => {
								let config = {
									"type": options.type,
									"repoVer": options.versions.services.ui.ver,
									
									"httpPort": options.nginx.httpPort,
									"httpsPort": options.nginx.httpsPort,
									
									"domain": options.nginx.domain,
									"sitePrefix": options.nginx.sitePrefix,
									"apiPrefix": options.nginx.apiPrefix,
									"deployType": options.nginx.deployType,
									"sslSecret": options.nginx.sslSecret,
									
									"email": options.owner.email,
									"extKey": obj.extKey,
									
									"gatewayIP": obj.gatewayIP
								};
								driver.deploy.nginx(config, deployer, (error, response) => {
									if (error) {
										return cb(error, obj);
									}
									obj.nginxIP = null;
									if (response) {
										obj.nginxIP = response;
									}
									return cb(null, obj);
								});
							},
							//Install dashboard service
							(obj, cb) => {
								let config = {
									"type": options.type,
									"serviceVer": "1",
									"repoVer": options.versions.services.dashboard.ver,
									"serviceName": "dashboard",
									"gatewayIP": obj.gatewayIP
								};
								driver.deploy.service(config, deployer, (error, response) => {
									if (error) {
										return cb(error, obj);
									}
									obj.dashboardIP = null;
									if (response) {
										obj.dashboardIP = response;
									}
									return cb(null, obj);
								});
							},
							//Install urac service
							(obj, cb) => {
								let config = {
									"type": options.type,
									"serviceVer": "3",
									"repoVer": options.versions.services.urac.ver,
									"serviceName": "urac",
									"gatewayIP": obj.gatewayIP
								};
								driver.deploy.service(config, deployer, (error, response) => {
									if (error) {
										return cb(error, obj);
									}
									obj.uracIP = null;
									if (response) {
										obj.uracIP = response;
									}
									return cb(null, obj);
								});
							},
							//Install oauth service
							(obj, cb) => {
								let config = {
									"type": options.type,
									"serviceVer": "1",
									"repoVer": options.versions.services.oauth.ver,
									"serviceName": "oauth",
									"gatewayIP": obj.gatewayIP
								};
								driver.deploy.service(config, deployer, (error, response) => {
									if (error) {
										return cb(error, obj);
									}
									obj.oauthIP = null;
									if (response) {
										obj.oauthIP = response;
									}
									return cb(null, obj);
								});
							},
							//Install multitenant service
							(obj, cb) => {
								let config = {
									"type": options.type,
									"serviceVer": "1",
									"repoVer": options.versions.services.multitenant.ver,
									"serviceName": "multitenant",
									"gatewayIP": obj.gatewayIP
								};
								driver.deploy.service(config, deployer, (error, response) => {
									if (error) {
										return cb(error, obj);
									}
									obj.multitenantIP = null;
									if (response) {
										obj.multitenantIP = response;
									}
									return cb(null, obj);
								});
							}
						], (error, obj) => {
							logger.debug("The extKey: " + obj.extKey);
							logger.debug("The Services IPS:");
							if (!options.mongo.external) {
								logger.debug("\tMongo: " + obj.mongoIP);
							}
							logger.debug("\tGateway: " + obj.gatewayIP);
							logger.debug("\tNginx: " + obj.nginxIP);
							logger.debug("\tDashboard: " + obj.dashboardIP);
							logger.debug("\tURAC: " + obj.uracIP);
							logger.debug("\toAuth: " + obj.oauthIP);
							logger.debug("\tMultitenant: " + obj.multitenantIP);
							
							return cb(error);
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
				return cb(new Error("Unable continue, please provide valid configuration!"));
			}
			let profileImport = null;
			if (options.mongo.external) {
				profileImport = {
					"name": "core_provision",
					"prefix": "",
					"servers": options.mongo.profile.servers,
					"credentials": options.mongo.profile.credentials,
					"streaming": {},
					"extraParam": {},
					"URLParam": options.mongo.profile.URLParam,
				};
			} else {
				profileImport = require("../data/soajs_profile.js");
				profileImport.servers[0].host = options.kubernetes.ip;
			}
			
			let strategyFunction = require("./migrate/" + strategy + ".js");
			
			return strategyFunction(profileImport, options.dataPath, cb);
		});
	}
};

module.exports = lib;