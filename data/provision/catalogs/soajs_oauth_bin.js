'use strict';

let doc = {
	"_id": "5dc1f6dac6b8c459cdb3c3ad",
	"name": "SOAJS oAuth from bin",
	"type": "service",
	"subtype": "soajs",
	"soajs": true,
	"locked" : true,
	"description": "Deploy SOAJS oAuth from binary",
	"restriction": {
		"deployment": [
			"container"
		]
	},
	"recipe": {
		"deployOptions": {
			"image": {
				"prefix": "soajsorg",
				"name": "oauth",
				"tag": "2.x",
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
			"voluming": [],
			"restartPolicy": {
				"condition": "any",
				"maxAttempts": 5
			},
			"container": {
				"network": "soajsnet",
				"workingDir": "/opt/soajs/soajs.oauth/"
			},
			"allowExposeServicePort": false
		},
		"buildOptions": {
			"env": {
				"SOAJS_ENV": {
					"type": "computed",
					"value": "$SOAJS_ENV"
				},
				"SOAJS_DEPLOY_HA": {
					"type": "computed",
					"value": "$SOAJS_DEPLOY_HA"
				},
				"SOAJS_BCRYPT" : {
					"type" : "static",
					"value" : "true"
				},
				"SOAJS_REGISTRY_API": {
					"type": "computed",
					"value": "$SOAJS_REGISTRY_API"
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