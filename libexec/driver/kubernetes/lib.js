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
	
	"checkNamespace": (deployer, namespace, createIfNotExist, cb) => {
		//1. check if namespace already exists. if it does, return true
		//2. if namespace does not exist create it and return true
		wrapper.namespace.get(deployer, {}, (error, namespacesList) => {
			if (error) {
				return cb(error, null);
			}
			async.detect(namespacesList.items, (oneNamespace, callback) => {
				return callback(null, oneNamespace.metadata.name === namespace);
			}, (error, foundNamespace) => {
				if (foundNamespace) {
					logger.info('Found namespace: ' + foundNamespace.metadata.name + ' ...');
					return cb(null, true);
				}
				if (createIfNotExist) {
					logger.info('Creating a new namespace: ' + namespace + ' ...');
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
								}
							}
						}
					}
				});
			}
			
			if (ips.length !== replicaCount) {
				//pod containers may not be ready yet
				lib.printProgress('Waiting for ' + serviceName + ' containers to become available', counter++);
				setTimeout(() => {
					return lib.getServiceIPs(deployer, serviceName, replicaCount, namespace, counter, cb);
				}, 1000);
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
		})
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
	
	"getServices": (deployer, options, namespace, cb) => {
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
				if (oneService.spec.selector['service.branch']) {
					item.branch = oneService.spec.selector['service.branch'];
				}
				let filter = {labelSelector: 'soajs.service.label=' + item.label};
				let mode = item.mode;
				wrapper[mode].get(deployer, {
					namespace: namespace,
					qs: filter
				}, (error, deployments) => {
					if (error) {
						return callback(error);
					}
					if (deployments && deployments.items && deployments.items.length === 1) {
						let oneDeployment = deployments.items[0];
						if (oneDeployment.spec && oneDeployment.spec.template && oneDeployment.spec.template.spec && oneDeployment.spec.template.spec.containers && oneDeployment.spec.template.spec.containers[0] && oneDeployment.spec.template.spec.containers[0].image) {
							item.image = oneDeployment.spec.template.spec.containers[0].image;
						}
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