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
				"selector": {
					"soajs.service.label": localConfig._label
				},
				"ports": [
					{
						"name": "service-port",
						"protocol": "TCP",
						"port": 4000,
						"targetPort": 4000
					},
					{
						"name": "maintenance-port",
						"protocol": "TCP",
						"port": 5000,
						"targetPort": 5000
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
								"image": localConfig._image,
								"imagePullPolicy": "Always",
								"workingDir": "/opt/soajs/soajs.controller/",
								"command": ["bash"],
								"args": ["-c", "node ."],
								"ports": [
									{
										"name": "service",
										"containerPort": 4000
									},
									{
										"name": "maintenance",
										"containerPort": 5000
									}
								],
								"readinessProbe": {
									"httpGet": {
										"path": "/heartbeat",
										"port": "maintenance"
									},
									"initialDelaySeconds": 5,
									"timeoutSeconds": 2,
									"periodSeconds": 5,
									"successThreshold": 1,
									"failureThreshold": 3
								},
								"env": [
									{
										"name": "SOAJS_ENV",
										"value": "DASHBOARD"
									},
									{
										"name": "SOAJS_PROFILE",
										"value": "/opt/soajs/profile/soajsprofile"
									},
									{
										"name": "SOAJS_DEPLOY_HA",
										"value": "kubernetes"
									},
									{
										"name": "SOAJS_MONGO_CON_KEEPALIVE",
										"value": "true"
									},
									{
										"name": "SOAJS_BCRYPT",
										"value": "true"
									}
								],
								"volumeMounts": [
									{
										"mountPath": "/opt/soajs/profile",
										"name": "soajsprofile"
									}
								]
							}
						],
						"volumes": [
							{
								"name": "soajsprofile",
								"secret": {
									"secretName": "soajsprofile"
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
		"_image": _config.image,
		"_labels": {
			"service.image.ts": new Date().getTime().toString(),
			"soajs.service.replicas": "1",
			
			"soajs.catalog.id": _config.catId,
			"soajs.catalog.v": "1",
			
			"soajs.content": "true",
			"soajs.env.code": "dashboard",
			"soajs.service.name": "controller",
			"soajs.service.group": "soajs-core-services",
			"soajs.service.type": "service",
			"soajs.service.subtype": "soajs",
			
			"soajs.service.version": "1",
			"soajs.service.label": _config.label,
			"soajs.service.mode": "deployment"
		}
	};
	return getrecipe(localConfig);
};

