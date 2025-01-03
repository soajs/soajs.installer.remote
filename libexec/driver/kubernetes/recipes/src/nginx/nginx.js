'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const lib = require('../../lib');

function getrecipe(localConfig) {
	let components = {
		
		
		service: {
			"apiVersion": "v1",
			"kind": "Service",
			"metadata": {
				"name": localConfig._label + "-service",
				"labels": localConfig._labels
			},
			"spec": {
				"type": "NodePort",
				"externalTrafficPolicy": "Local",
				"selector": {
					"soajs.service.label": localConfig._label
				},
				"ports": [
					{
						"name": "http",
						"protocol": "TCP",
						"port": 80,
						"targetPort": 80,
						"nodePort": localConfig._httpPort
					},
					{
						"name": "https",
						"protocol": "TCP",
						"port": 443,
						"targetPort": 443,
						"nodePort": localConfig._httpsPort
					}
				]
			}
		},
		deployment: {
			"apiVersion": "apps/v1",
			"kind": "DaemonSet",
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
				"updateStrategy": {
					"type": "RollingUpdate"
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
								"args": ["-c", "node index.js -T nginx -S deploy &&  node index.js -T nginx -S install && /opt/soajs/soajs.deployer/deployer/bin/nginx.sh"],
								"ports": [
									{
										"name": "http",
										"containerPort": 80
									},
									{
										"name": "https",
										"containerPort": 443
									}
								],
								"readinessProbe": {
									"httpGet": {
										"path": "/",
										"port": "http"
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
										"name": "SOAJS_EXTKEY",
										"value": localConfig.extKey
									},
									
									{
										"name": "SOAJS_NX_DOMAIN",
										"value": localConfig.domain
									},
									{
										"name": "SOAJS_NX_API_DOMAIN",
										"value": localConfig.apiPrefix + "." + localConfig.domain
									},
									{
										"name": "SOAJS_NX_SITE_DOMAIN",
										"value": localConfig.sitePrefix + "." + localConfig.domain
									},
									{
										"name": "SOAJS_NX_SITE_FOLDER",
										"value": "/build/"
									},
									{
										"name": "SOAJS_NX_CONTROLLER_PORT",
										"value": "4000"
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
										"value": "soajs.dashboard.ui"
									},
									{
										"name": "SOAJS_GIT_PROVIDER",
										"value": "github"
									},
									{
										"name": "SOAJS_GIT_DOMAIN",
										"value": "github.com"
									},
									
									{
										"name": "SOAJS_SSL_CONFIG",
										"value": '{"email":"' + localConfig.email + '" ,"redirect":"' + localConfig.sslRedirect + '"}'
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
	
	if (localConfig.sslType === "pvc") {
		components.deployment.spec.template.spec.containers[0].volumeMounts.push(
			{
				"mountPath": "/opt/soajs/certificates/",
				"name": "soajscert"
			}
		);
		components.deployment.spec.template.spec.volumes.push(
			{
				"name": "soajscert",
				"persistentVolumeClaim": {
					"claimName": localConfig.pvcClaimName
				}
			}
		);
	} else {
		components.deployment.spec.template.spec.containers[0].env.push(
			{
				"name": "SOAJS_SSL_SECRET",
				"value": 'true'
			}
		);
		
		components.deployment.spec.template.spec.containers[0].volumeMounts.push(
			{
				"mountPath": "/opt/soajs/certificates/secret/private_key/",
				"name": "private-key"
			}
		);
		components.deployment.spec.template.spec.volumes.push(
			{
				"name": "private-key",
				"secret": {
					"secretName": "private-key"
				}
			}
		);
		components.deployment.spec.template.spec.containers[0].volumeMounts.push(
			{
				"mountPath": "/opt/soajs/certificates/secret/fullchain_crt/",
				"name": "fullchain-crt"
			}
		);
		components.deployment.spec.template.spec.volumes.push(
			{
				"name": "fullchain-crt",
				"secret": {
					"secretName": "fullchain-crt"
				}
			}
		);
	}
	
	components.deployment.spec.template.spec.containers[0].env.push(
		{
			"name": "SOAJS_NX_CONTROLLER_IP",
			"value": localConfig.gatewayIP
		}
	);
	
	if (localConfig.deployType === 'LoadBalancer') {
		components.service.spec.ports.forEach((onePort) => {
			delete onePort.nodePort;
		});
		components.service.spec.type = 'LoadBalancer';
	}
	
	return components;
}

module.exports = function (_config) {
	let localConfig = {
		"_label": _config.label,
		"_image": _config.image,
		"_branch": _config.branch,
		"_httpPort": _config.httpPort,
		"_httpsPort": _config.httpsPort,
		"domain": _config.domain,
		"sitePrefix": _config.sitePrefix,
		"apiPrefix": _config.apiPrefix,
		"extKey": _config.extKey,
		"email": _config.email,
		"deployType": _config.deployType,
		"sslRedirect": _config.sslRedirect,
		"pvcClaimName": _config.pvcClaimName,
		"sslType": _config.sslType,
		"gatewayIP": _config.gatewayIP,
		"_labels": {
			"service.image.ts": new Date().getTime().toString(),
			
			"soajs.catalog.id": _config.catId,
			"soajs.catalog.v": "1",
			
			"soajs.content": "true",
			"soajs.env.code": "dashboard",
			"soajs.service.name": "ui",
			"soajs.service.group": "Console",
			"soajs.service.type": "static",
			
			"soajs.service.version": "1",
			"soajs.service.subtype": "soajs",
			"soajs.service.label": _config.label,
			"soajs.service.mode": "daemonset",
			
			"service.branch": lib.cleanLabel(_config.branch),
			"service.owner": "soajs",
			"service.repo": "soajs.dashboard.ui"
		}
	};
	return getrecipe(localConfig);
};