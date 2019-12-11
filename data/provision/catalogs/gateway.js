'use strict';

let doc = {
	"_id": "5db9f7ccc6b8c459cdb3c34b",
	"name": "Gateway",
	"type": "service",
	"subtype": "soajs",
	"soajs": true,
	"description": "This recipe allows you to deploy a SOAJS Gateway",
	"restriction": {
		"deployment": [
			"container"
		]
	},
	"recipe": {
		"deployOptions": {
			"image": {
				"prefix": "soajsorg",
				"name": "gateway",
				"tag": "3.x",
				"pullPolicy": "Always",
				"repositoryType": "public",
				"override": false
			},
			"sourceCode": {},
			"certificates": "none",
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
			"ports": [],
			"voluming": [
				{
					"docker": {},
					"kubernetes": {
						"volume": {
							"name": "soajsprofile",
							"secret": {
								"secretName": "soajsprofile"
							}
						},
						"volumeMount": {
							"mountPath": "/opt/soajs/profile/",
							"name": "soajsprofile"
						}
					}
				}
			],
			"restartPolicy": {
				"condition": "any",
				"maxAttempts": 5
			},
			"container": {
				"network": "soajsnet",
				"workingDir": "/opt/soajs/soajs.controller/"
			},
			"allowExposeServicePort": false
		},
		"buildOptions": {
			"env": {
				"SOAJS_ENV": {
					"type": "computed",
					"value": "$SOAJS_ENV"
				},
				"SOAJS_PROFILE": {
					"type": "static",
					"value": "/opt/soajs/profile/soajsprofile"
				},
				"SOAJS_DEPLOY_HA": {
					"type": "computed",
					"value": "$SOAJS_DEPLOY_HA"
				},
				"SOAJS_BCRYPT" : {
					"type" : "static",
					"value" : "true"
				}
			},
			"settings": {
				"accelerateDeployment": false
			},
			"cmd": {
				"deploy": {
					"command": [
						"bash"
					],
					"args": [
						"-c",
						"node ."
					]
				}
			}
		}
	},
	"v": 1,
	"ts": new Date().getTime()
};

module.exports = doc;