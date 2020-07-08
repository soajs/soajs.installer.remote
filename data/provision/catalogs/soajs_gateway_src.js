'use strict';

let doc = {
	"_id": "5df3ec10fa3912534948f001",
	"name": "SOAJS Gateway from src",
	"type": "soajs",
	"subtype": "gateway",
	"description": "Deploy SOAJS Gateway from source with soajsprofile as secret",
	"locked": true,
	"recipe": {
		"deployOptions": {
			"image": {
				"prefix": "soajsorg",
				"name": "node",
				"tag": "3.x",
				"pullPolicy": "Always",
				"repositoryType": "public",
				"override": true
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
				"workingDir": "/opt/soajs/soajs.deployer/deployer/"
			}
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
				"SOAJS_MONGO_CON_KEEPALIVE": {
					"type": "static",
					"value": "true"
				},
				"SOAJS_BCRYPT": {
					"type": "static",
					"value": "true"
				}
			},
			"settings": {},
			"cmd": {
				"deploy": {
					"command": [
						"bash"
					],
					"args": [
						"-c",
						"node . -T nodejs -S deploy",
						"node . -T nodejs -S install",
						"node . -T nodejs -S run"
					]
				}
			}
		}
	},
	"v": 1,
	"ts": new Date().getTime()
};
module.exports = doc;