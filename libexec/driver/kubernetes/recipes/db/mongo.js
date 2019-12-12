'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */
function getrecipe(localConfig) {
	return {
		service: {
			"apiVersion": "v1",
			"kind": "Service",
			"metadata": {
				"name": localConfig._label + "-service",
				"labels": localConfig._labels
			},
			"spec": {
				"type": "NodePort",
				"selector": {
					"soajs.service.label": localConfig._label
				},
				"ports": [
					{
						"protocol": "TCP",
						"port": 27017,
						"targetPort": 27017,
						"nodePort": localConfig._mongoPort
					}
				]
			}
		},
		deployment: {
			"apiVersion": "apps/v1",
			"kind": "Deployment",
			"metadata": {
				"name": localConfig._label,
				"labels": localConfig._labels
			},
			"spec": {
				"revisionHistoryLimit": 2,
				"replicas": 1,
				"selector": {
					"matchLabels": {
						"soajs.service.label": localConfig._label
					}
				},
				"template": {
					"metadata": {
						"name": localConfig._label,
						"labels": localConfig._labels
					},
					"spec": {
						"containers": [
							{
								"name": localConfig._label,
								"image": "mongo:4.2.1",
								"imagePullPolicy": "Always",
								"command": ["mongod", "--bind_ip", "0.0.0.0"],
								"ports": [
									{
										"name": "mongoport",
										"containerPort": 27017
									}
								],
								"readinessProbe": {
									"exec": {
										"command": ["mongo"],
										"args": ["--eval \"db.adminCommand('ping')\""]
									},
									"initialDelaySeconds": 5,
									"timeoutSeconds": 2,
									"periodSeconds": 5,
									"successThreshold": 1,
									"failureThreshold": 3
								},
								"volumeMounts": [
									{
										"mountPath": "/var/data/db/",
										"name": localConfig._label
									}
								]
							}
						],
						"volumes": [
							{
								"name": localConfig._label,
								"hostPath": {
									"path": "/var/data/db/"
								}
							}
						]
					}
				}
			}
		}
	};
}

module.exports = function (_config) {
	let localConfig = {
		"_label": _config.label,
		"_mongoPort": _config.mongoPort,
		"_labels": {
			"service.image.ts": new Date().getTime().toString(),
			"soajs.service.replicas": "1",
			
			"soajs.catalog.id": _config.catId,
			"soajs.catalog.v": "1",
			
			"soajs.content": "true",
			"soajs.env.code": "dashboard",
			"soajs.resource.id": "5bed928f29f0041bf64bf989",
			"soajs.service.name": "soajsdata",
			"soajs.service.group": "soajs-db",
			"soajs.service.type": "cluster",
			
			"soajs.service.version": "1",
			"soajs.service.subtype": "mongo",
			"soajs.service.label": _config.label,
			"soajs.service.mode": "deployment"
		}
	};
	return getrecipe(localConfig);
};
