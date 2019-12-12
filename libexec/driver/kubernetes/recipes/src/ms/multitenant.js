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
						"port": 4004,
						"targetPort": 4004
					},
					{
						"name": "maintenance-port",
						"protocol": "TCP",
						"port": 5004,
						"targetPort": 5004
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
								"workingDir": "/opt/soajs/soajs.deployer/deployer/",
								"command": ["bash"],
								"args": ["-c", "node . -T nodejs -S deploy && node . -T nodejs -S install && node . -T nodejs -S run"],
								"ports": [
									{
										"name": "service",
										"containerPort": 4004
									},
									{
										"name": "maintenance",
										"containerPort": 5004
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
										"value": "dashboard"
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
										"name": "SOAJS_BCRYPT",
										"value": "true"
									},
									{
										"name": "SOAJS_REGISTRY_API",
										"value": localConfig.registryAPI
									},
									
									{
										"name": "SOAJS_GIT_OWNER",
										"value": "soajs"
									},
									{
										"name": "SOAJS_GIT_BRANCH",
										"value": localConfig._branch
									},
									{
										"name": "SOAJS_GIT_REPO",
										"value": "soajs.multitenant"
									},
									{
										"name": "SOAJS_GIT_PROVIDER",
										"value": "github"
									},
									{
										"name": "SOAJS_GIT_DOMAIN",
										"value": "github.com"
									}
								],
								"volumeMounts": []
							}
						],
						"volumes": []
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
		"_branch": _config.branch,
		"registryAPI": _config.registryAPI,
		"_labels": {
			"service.image.name": "node",
			"service.image.prefix": "soajsorg",
			"service.image.tag": "3.x",
			
			"service.image.ts": new Date().getTime().toString(),
			
			"soajs.catalog.id": _config.catId,
			"soajs.catalog.v": "1",
			
			"soajs.service.replicas": "1",
			
			"soajs.content": "true",
			"soajs.env.code": "dashboard",
			"soajs.service.name": "multitenant",
			"soajs.service.group": "soajs-core-services",
			"soajs.service.type": "service",
			"soajs.service.subtype": "soajs",
			
			"soajs.service.version": "1",
			"soajs.service.label": _config.label,
			"soajs.service.mode": "deployment",
			"soajs.service.repo.name": "soajs_multitenant",
			
			"service.branch": _config.branch,
			"service.owner": "soajs",
			"service.repo": "soajs.multitenant"
		}
	};
	return getrecipe(localConfig);
};