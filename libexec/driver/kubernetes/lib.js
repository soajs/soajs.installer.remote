"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const async = require('async');
const wrapper = require('./wrapper.js');
const fs = require('fs');
const mkdirp = require("mkdirp");

//set the logger
const logger = require("../../utils/utils.js").getLogger();

let lib = {
	"printProgress": (message, counter) => {
		process.stdout.clearLine();
		process.stdout.write(showTimestamp() + ' - ' + message + ' ' + showDots() + '\r');
		
		function showDots() {
			let output = '';
			let numOfDots = counter % 5;
			for (let i = 0; i < numOfDots; i++) {
				output += '.';
			}
			return output;
		}
		
		function showTimestamp() {
			let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			let now = new Date();
			return '' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getHours() + ':' +
				((now.getMinutes().toString().length === 2) ? now.getMinutes() : '0' + now.getMinutes()) + ':' +
				((now.getSeconds().toString().length === 2) ? now.getSeconds() : '0' + now.getSeconds());
		}
	},
	
	"assureNamespace": (deployer, namespace, createIfNotExist, verbose, cb) => {
		//1. check if namespace already exists. if it does, return true
		//2. if namespace does not exist create it and return true
		if (verbose) {
			logger.info('Checking for namespace: ' + namespace + ' and creating if not there is [' + createIfNotExist + '] ...');
		}
		wrapper.namespace.get(deployer, {}, (error, namespacesList) => {
			if (error) {
				return cb(error, null);
			}
			async.detect(namespacesList.items, (oneNamespace, callback) => {
				return callback(null, oneNamespace.metadata.name === namespace);
			}, (error, foundNamespace) => {
				if (foundNamespace) {
					if (verbose) {
						logger.info('Found namespace: ' + foundNamespace.metadata.name + ' ...');
					}
					return cb(null, true);
				}
				if (createIfNotExist) {
					if (verbose) {
						logger.info('Creating a new namespace: ' + namespace + ' ...');
					}
					let recipe = {
						kind: 'Namespace',
						apiVersion: 'v1',
						metadata: {
							name: namespace,
							labels: {
								'soajs.content': 'true'
							}
						}
					};
					return wrapper.namespace.post(deployer, {body: recipe}, cb);
				}
				return cb(null, false);
			});
		});
	},
	
	"getServiceIPs": (deployer, serviceName, replicaCount, namespace, counter, cb) => {
		if (typeof (counter) === 'function') {
			cb = counter; //counter wasn't passed as param
			counter = 0;
		}
		let filter = {labelSelector: 'soajs.service.label=' + serviceName};
		wrapper.pod.get(deployer, {namespace: namespace, qs: filter}, (error, podList) => {
			if (error) {
				return cb(error);
			}
			let ips = [];
			if (podList && podList.items && Array.isArray(podList.items)) {
				podList.items.forEach((onePod) => {
					if (onePod.status.phase === 'Running' && onePod.metadata.namespace === namespace) {
						//check if pod is ready
						if (onePod.status.conditions && Array.isArray(onePod.status.conditions)) {
							for (let i = 0; i < onePod.status.conditions.length; i++) {
								let oneCond = onePod.status.conditions[i];
								if (oneCond.type === 'Ready' && oneCond.status === 'True') {
									ips.push({
										name: onePod.metadata.name,
										ip: onePod.status.podIP
									});
									break;
								}
							}
						}
					}
				});
			}
			if (ips.length < replicaCount) {
				//pod containers may not be ready yet
				lib.printProgress('Waiting for ' + serviceName + ' containers to become available', counter++);
				setTimeout(() => {
					return lib.getServiceIPs(deployer, serviceName, replicaCount, namespace, counter, cb);
				}, 5000);
			} else {
				wrapper.service.get(deployer, {
					namespace: namespace,
					name: serviceName + "-service"
				}, (error, service) => {
					if (service && service.spec && service.spec.clusterIP) {
						return cb(null, service.spec.clusterIP);
					}
					return cb(error, null);
				});
			}
		});
	},
	
	"createService": (deployer, service, namespace, cb) => {
		if (!service || !namespace) {
			return cb(null, true);
		}
		return wrapper.service.post(deployer, {namespace: namespace, body: service}, cb);
	},
	"createDeployment": (deployer, deployment, namespace, cb) => {
		if (!deployment || !namespace) {
			return cb(null, true);
		}
		let deploytype;
		if (deployment.kind === "DaemonSet") {
			deploytype = "daemonset";
		}
		else if (deployment.kind === "Deployment") {
			deploytype = "deployment";
		}
		return wrapper[deploytype].post(deployer, {
			namespace: namespace,
			body: deployment
		}, cb);
	},
	"createProfileSecret": (deployer, profile, namespace, cb) => {
		let content = '"use strict";\n';
		content += 'module.exports =';
		content += JSON.stringify(profile);
		content += ';';
		
		let secret = {
			kind: 'Secret',
			apiVersion: 'v1',
			type: 'Opaque',
			metadata: {
				name: 'soajsprofile',
				labels: {
					'soajs.secret.name': 'soajsprofile',
					'soajs.secret.type': 'Opaque'
				}
			},
			stringData: {
				'soajsprofile': content
			}
		};
		
		wrapper.secret.post(deployer, {namespace: namespace, body: secret}, (error) => {
			return cb(error);
		});
	},
	
	"createSecret": (deployer, contentPath, secretName, namespace, cb) => {
		fs.readFile(contentPath, 'utf8', (error, content) => {
			if (error) {
				return cb(error);
			} else if (!content) {
				return callback("Unable to read from: " + contentPath);
			}
			//Delete the secret before creating it
			wrapper.secret.delete(deployer, {namespace: namespace, name: secretName}, () => {
				let secret = {
					kind: 'Secret',
					apiVersion: 'v1',
					type: 'Opaque',
					metadata: {
						name: secretName,
						labels: {
							'soajs.secret.name': secretName,
							'soajs.secret.type': 'Opaque'
						}
					},
					stringData: {
						[secretName]: content
					}
				};
				
				wrapper.secret.post(deployer, {namespace: namespace, body: secret}, (error) => {
					return cb(error);
				});
			});
		});
	},
	
	"deleteDeployments": (deployer, options, namespace, cb) => {
		let filter = {labelSelector: 'soajs.content=true'};
		wrapper.deployment.get(deployer, {
			namespace: namespace,
			qs: filter
		}, (error, deploymentList) => {
			if (error) {
				return cb(error);
			}
			if (!deploymentList || !deploymentList.items || deploymentList.items.length === 0) {
				return cb();
			}
			let params = {gracePeriodSeconds: 0};
			async.each(deploymentList.items, (oneDeployment, callback) => {
				oneDeployment.spec.replicas = 0;
				wrapper.deployment.put(deployer, {
					namespace: namespace,
					name: oneDeployment.metadata.name,
					body: oneDeployment
				}, (error) => {
					if (error) return callback(error);
					
					setTimeout(() => {
						wrapper.deployment.delete(deployer, {
							namespace: namespace,
							name: oneDeployment.metadata.name,
							qs: params
						}, (error) => {
							if (error) {
								return callback(error);
							}
							//hpa objects have the same naming as their deployments
							if (deployer.autoscaling) {
								wrapper.autoscale.delete(deployer, {
									namespace: namespace,
									name: oneDeployment.metadata.name
								}, (error) => {
									if (error) {
										if (error.code === 404) {
											return callback();
										} else {
											return callback(error);
										}
									}
									
									
								});
							} else {
								return callback();
							}
						});
					}, 5000);
				});
			}, cb);
		});
	},
	"deleteDaemonsets": (deployer, options, namespace, cb) => {
		let filter = {labelSelector: 'soajs.content=true'};
		wrapper.daemonset.get(deployer, {
			namespace: namespace,
			qs: filter
		}, (error, daemonsetList) => {
			if (error) {
				return cb(error);
			}
			if (!daemonsetList || !daemonsetList.items || daemonsetList.items.length === 0) {
				return cb();
			}
			async.each(daemonsetList.items, (oneDaemonset, callback) => {
				wrapper.daemonset.delete(deployer, {
					namespace: namespace,
					name: oneDaemonset.metadata.name
				}, callback);
			}, cb);
		});
	},
	"deleteServices": (deployer, options, namespace, cb) => {
		let filter = {labelSelector: 'soajs.content=true', gracePeriodSeconds: 0};
		wrapper.service.get(deployer, {namespace: namespace, qs: filter}, (error, serviceList) => {
			if (error) {
				return cb(error);
			}
			if (!serviceList || !serviceList.items || serviceList.items.length === 0) {
				return cb();
			}
			async.each(serviceList.items, (oneService, callback) => {
				wrapper.service.delete(deployer, {
					namespace: namespace,
					name: oneService.metadata.name
				}, callback);
			}, cb);
		});
	},
	"deletePods": (deployer, options, namespace, cb) => {
		//force delete all pods for a better cleanup
		let filter = {labelSelector: 'soajs.content=true'};
		wrapper.pod.get(deployer, {namespace: namespace, qs: filter}, (error, podList) => {
			if (error) {
				return cb(error);
			}
			if (!podList || !podList.items || podList.items.length === 0) {
				return cb();
			}
			async.each(podList.items, (onePod, callback) => {
				wrapper.pod.delete(deployer, {
					namespace: namespace,
					name: onePod.metadata.name,
					qs: {gracePeriodSeconds: 0}
				}, callback);
			}, cb);
		});
	},
	"deleteSecrets": (deployer, options, namespace, cb) => {
		wrapper.secret.delete(deployer, {
			namespace: namespace,
			name: 'soajsprofile',
			qs: {gracePeriodSeconds: 0}
		}, cb)
	},
	"ensurePods": (deployer, options, namespace, counter, cb) => {
		if (typeof (counter) === 'function') {
			cb = counter; //counter wasn't passed as param
			counter = 0;
		}
		let filter = {labelSelector: 'soajs.content=true'};
		wrapper.pod.get(deployer, {namespace: namespace, qs: filter}, (error, podList) => {
			if (error) {
				return cb(error);
			}
			
			if (!podList || !podList.items || podList.items.length === 0) {
				return cb();
			}
			
			if (podList.items.length > 0) {
				lib.printProgress('Waiting for all previous pods to terminate', counter++);
				setTimeout(function () {
					return lib.ensurePods(deployer, options, counter, cb);
				}, 1000);
			}
		});
	},
	
	"updateServiceDeployment": (deployer, oneService, oneDeployment, namespace, cb) => {
		
		let mode = oneService.metadata.labels['soajs.service.mode'];
		
		delete oneService.status;
		delete oneService.metadata.uid;
		delete oneService.metadata.selfLink;
		delete oneService.metadata.creationTimestamp;
		
		delete oneDeployment.status;
		delete oneDeployment.metadata.uid;
		delete oneDeployment.metadata.selfLink;
		delete oneDeployment.metadata.creationTimestamp;
		delete oneDeployment.spec.template.metadata.creationTimestamp;
		
		lib.getService(deployer, oneService.metadata.labels['soajs.service.name'], namespace, (error, serviceRec) => {
			if (error) {
				return cb(error);
			}
			oneService.metadata.resourceVersion = serviceRec.metadata.resourceVersion;
			if (!oneService.spec.clusterIP) {
				oneService.spec.clusterIP = serviceRec.spec.clusterIP;
			}
			if (serviceRec.spec.healthCheckNodePort) {
				oneService.spec.healthCheckNodePort = serviceRec.spec.healthCheckNodePort;
			}
			
			lib.getDeployment(deployer, {
				"label": oneService.spec.selector['soajs.service.label'],
				"mode": mode
			}, namespace, (error, deploymentRec) => {
				if (error) {
					return cb(error);
				}
				oneDeployment.metadata.resourceVersion = deploymentRec.metadata.resourceVersion;
				
				wrapper.service.put(deployer, {
					namespace: namespace,
					body: oneService,
					name: oneService.metadata.name
				}, (error) => {
					if (error) {
						return cb(error);
					}
					wrapper[mode].put(deployer, {
						namespace: namespace,
						body: oneDeployment,
						name: oneDeployment.metadata.name
					}, (error) => {
						if (error) {
							return cb(error);
						}
						let imageInfo = {
							"changed": false,
							"style": "sem",
							"tag": null
						};
						if (deploymentRec.spec.template.spec.containers[0].image !== oneDeployment.spec.template.spec.containers[0].image) {
							let image = oneDeployment.spec.template.spec.containers[0].image;
							if (image.indexOf(".x") !== -1) {
								imageInfo.style = "major";
							}
							if (image.indexOf(":") !== -1) {
								imageInfo.tag = image.substr(image.indexOf(":") + 1);
							}
							imageInfo.changed = true
						}
						return cb(null, true, imageInfo);
					})
				});
			});
		});
	},
	"updateService": (deployer, options, namespace, cb) => {
		lib.getService(deployer, options.serviceName, namespace, (error, oneService) => {
			if (error) {
				return cb(error);
			}
			let oneServiceBackup = JSON.stringify(oneService);
			let mode = oneService.metadata.labels['soajs.service.mode'];
			lib.getDeployment(deployer, {
				"label": oneService.spec.selector['soajs.service.label'],
				"mode": mode
			}, namespace, (error, oneDeployment) => {
				if (error) {
					return cb(error);
				}
				let oneDeploymentBackup = JSON.stringify(oneDeployment);
				lib.getServiceInfo(deployer, oneService, namespace, (error, item) => {
					if (error) {
						return cb(error);
					}
					let type = "bin";
					let style = "sem";
					if (item.branch) {
						type = "src";
						if (item.branch.indexOf(".x") !== -1) {
							style = "major";
						}
					} else {
						if (item.image.indexOf(".x") !== -1) {
							style = "major";
						}
					}
					logger.debug(options.serviceName + " deployment has type [" + type + "] and style [" + style + "]");
					
					if (type === "bin") {
						if (style === "sem") {
							options.image[type] += options.version.semVer;
						} else {
							options.image[type] += options.version.ver;
						}
					}
					
					let mustUpdate = false;
					if (item.serviceVer !== ('' + (options.version.msVer || "1"))) {
						mustUpdate = true;
						logger.debug(options.serviceName + " serviceVer changed from [" + item.serviceVer + "] to [" + (options.version.msVer || "1") + "]");
						oneService.metadata.name = options.label + "-service";
						oneService.metadata.labels['soajs.service.version'] = '' + (options.version.msVer || "1");
						oneService.metadata.labels['soajs.service.label'] = options.label;
						oneService.spec.selector['soajs.service.label'] = options.label;
						
						oneDeployment.metadata.name = options.label + "-service";
						oneDeployment.metadata.labels['soajs.service.version'] = '' + (options.version.msVer || "1");
						oneDeployment.metadata.labels['soajs.service.label'] = options.label;
						oneDeployment.spec.selector.matchLabels['soajs.service.label'] = options.label;
						oneDeployment.spec.template.metadata.name = options.label + "-service";
						oneDeployment.spec.template.metadata.labels['soajs.service.version'] = '' + (options.version.msVer || "1");
						oneDeployment.spec.template.metadata.labels['soajs.service.label'] = options.label;
						
					}
					if (item.image !== options.image[type]) {
						mustUpdate = true;
						logger.debug(options.serviceName + " image changed from [" + item.image + "] to [" + options.image[type] + "]");
						
						oneDeployment.spec.template.spec.containers[0].image = options.image[type];
						
						let imageTs = new Date().getTime().toString();
						oneService.metadata.labels['service.image.ts'] = imageTs;
						oneDeployment.metadata.labels['service.image.ts'] = imageTs;
						oneDeployment.spec.template.metadata.labels['service.image.ts'] = imageTs;
					}
					if (item.branch) {
						let newBranch = null;
						if (style === "sem") {
							if (item.branch !== options.version.semVer) {
								newBranch = options.version.semVer;
								logger.debug(options.serviceName + " branch changed from [" + item.branch + "] to [" + newBranch + "]");
							}
						} else {
							if (item.branch !== ("release/v" + options.version.ver)) {
								newBranch = "release/v" + options.version.ver;
								logger.debug(options.serviceName + " branch changed from [" + item.branch + "] to [" + newBranch + "]");
							}
						}
						if (newBranch) {
							mustUpdate = true;
							oneService.metadata.labels['service.branch'] = newBranch;
							
							oneDeployment.metadata.labels['service.branch'] = newBranch;
							oneDeployment.spec.template.metadata.labels['service.branch'] = newBranch;
							
							for (let i = 0; i < oneDeployment.spec.template.spec.containers[0].env.length; i++) {
								let oneEnv = oneDeployment.spec.template.spec.containers[0].env[i];
								if (oneEnv.name === "SOAJS_GIT_BRANCH") {
									oneDeployment.spec.template.spec.containers[0].env[i].value = newBranch;
									break;
								}
							}
						}
					}
					
					if (mustUpdate) {
						let update = () => {
							lib.updateServiceDeployment(deployer, oneService, oneDeployment, namespace, (error, done, imageInfo) => {
								if (error) {
									return cb(error);
								}
								return cb(null, done, imageInfo);
								
							});
						};
						if (options.rollback && options.rollback.path) {
							let rollbackID = new Date().getTime().toString();
							let filePath = options.rollback.path + "/" + rollbackID + "/";
							logger.info("The rollback ID for this update is: " + rollbackID);
							mkdirp(filePath, (error) => {
								if (error) {
									logger.error(`An error occurred while writing rollback folder ${filePath}`);
									return cb(error);
								}
								fs.writeFile(filePath + "service.txt", oneServiceBackup, (error) => {
									if (error) {
										logger.error(`An error occurred while writing ${filePath}service.txt, skipping file ...`);
										return cb(error);
									}
									fs.writeFile(filePath + "deployment.txt", oneDeploymentBackup, (error) => {
										if (error) {
											logger.error(`An error occurred while writing ${filePath}deployment.txt, skipping file ...`);
											return cb(error);
										}
										update();
									});
								});
							});
						} else {
							logger.info("Unable to create rollback for this update ...");
							update();
						}
					} else {
						logger.debug(options.serviceName + " does not need updates.");
						return cb(null, false);
					}
				});
			});
		});
	},
	
	"backupService": (deployer, options, namespace, cb) => {
		lib.getService(deployer, options.serviceName, namespace, (error, oneService) => {
			if (error) {
				return cb(error);
			}
			let oneServiceBackup = JSON.stringify(oneService);
			
			let mode = oneService.metadata.labels['soajs.service.mode'];
			lib.getDeployment(deployer, {
				"label": oneService.spec.selector['soajs.service.label'],
				"mode": mode
			}, namespace, (error, oneDeployment) => {
				if (error) {
					return cb(error);
				}
				let oneDeploymentBackup = JSON.stringify(oneDeployment);
				
				if (options.backup && options.backup.path) {
					let filePath = options.backup.path + options.serviceName;
					mkdirp(filePath, (error) => {
						if (error) {
							logger.error(`An error occurred while writing to backup folder ${filePath}`);
							return cb(error);
						}
						fs.writeFile(filePath + "/service.txt", oneServiceBackup, (error) => {
							if (error) {
								logger.error(`An error occurred while writing ${filePath}oneservice.txt, skipping file ...`);
								return cb(error);
							}
							fs.writeFile(filePath + "/deployment.txt", oneDeploymentBackup, (error) => {
								if (error) {
									logger.error(`An error occurred while writing ${filePath}oneDeployment.txt, skipping file ...`);
									return cb(error);
								}
								return cb(null, true);
							});
						});
					});
				}
			});
		});
	},
	/**
	 * Return the complete service information at location 0
	 * @param deployer
	 * @param serviceName
	 * @param namespace
	 * @param cb
	 */
	"getService": (deployer, serviceName, namespace, cb) => {
		if (serviceName === 'ui') {
			serviceName = 'nginx';
		}
		if (serviceName === 'gateway') {
			serviceName = 'controller';
		}
		let filter = {labelSelector: 'soajs.service.name=' + serviceName, gracePeriodSeconds: 0};
		wrapper.service.get(deployer, {namespace: namespace, qs: filter}, (error, serviceList) => {
			if (error) {
				return cb(error);
			}
			if (!serviceList || !serviceList.items || serviceList.items.length === 0) {
				return cb(new Error("Unable to find service: " + serviceName));
			}
			return cb(null, serviceList.items[0]);
		});
	},
	/**
	 * Return the complete deployment/daemonset information at location 0
	 * @param deployer
	 * @param options
	 * @param namespace
	 * @param cb
	 */
	"getDeployment": (deployer, options, namespace, cb) => {
		let filter = {labelSelector: 'soajs.service.label=' + options.label};
		let mode = options.mode;
		wrapper[mode].get(deployer, {
			namespace: namespace,
			qs: filter
		}, (error, deployments) => {
			if (error) {
				return cb(error);
			}
			if (!deployments || !deployments.items || deployments.items.length === 0) {
				return cb(new Error("Unable to find a " + mode + " for " + options.label));
			}
			return cb(null, deployments.items[0]);
		});
	},
	/**
	 * Needs a complete service information and return a summary of the service and deployment/daemonset
	 * @param deployer
	 * @param oneService
	 * @param namespace
	 * @param cb
	 */
	"getServiceInfo": (deployer, oneService, namespace, cb) => {
		let item = {
			"serviceName": oneService.metadata.labels['soajs.service.name'],
			"name": oneService.metadata.name,
			"ip": oneService.spec.clusterIP,
			"serviceVer": oneService.metadata.labels['soajs.service.version'],
			"mode": oneService.metadata.labels['soajs.service.mode'],
			"label": oneService.spec.selector['soajs.service.label']
		};
		if (item.serviceName === 'nginx') {
			item.serviceName = 'ui';
		}
		if (item.serviceName === 'controller') {
			item.serviceName = 'gateway';
		}
		if (oneService.metadata.labels['service.branch']) {
			item.branch = oneService.metadata.labels['service.branch'];
		}
		lib.getDeployment(deployer, {"label": item.label, "mode": item.mode}, namespace, (error, oneDeployment) => {
			if (error) {
				return cb(error);
			}
			if (oneDeployment.spec && oneDeployment.spec.template && oneDeployment.spec.template.spec && oneDeployment.spec.template.spec.containers && oneDeployment.spec.template.spec.containers[0] && oneDeployment.spec.template.spec.containers[0].image) {
				item.image = oneDeployment.spec.template.spec.containers[0].image;
			}
			return cb(null, item);
		});
	},
	/**
	 * Return all services and deployment/daemonset summary information with soajs.content=true as label
	 * @param deployer
	 * @param options
	 * @param namespace
	 * @param cb
	 */
	"getServicesInfo": (deployer, options, namespace, cb) => {
		let filter = {labelSelector: 'soajs.content=true', gracePeriodSeconds: 0};
		wrapper.service.get(deployer, {namespace: namespace, qs: filter}, (error, serviceList) => {
			if (error) {
				return cb(error);
			}
			if (!serviceList || !serviceList.items || serviceList.items.length === 0) {
				let error = new Error("Unable to find any SOAJS services");
				return cb(error);
			}
			let servicesInfo = [];
			async.each(serviceList.items, (oneService, callback) => {
				lib.getServiceInfo(deployer, oneService, namespace, (error, item) => {
					if (error) {
						return callback(error);
					}
					servicesInfo.push(item);
					return callback();
				});
				
			}, (error) => {
				return cb(error, servicesInfo);
			});
		});
	}
};
module.exports = lib;