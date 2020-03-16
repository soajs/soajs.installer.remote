'use strict';

let doc = {
	"_id": "5df3ec10fa3912534948f005",
	"name": "Nodejs",
	"type": "service",
	"subtype": "nodejs",
	"locked" : true,
	"description": "Deploy Node.js service",
	"restriction": {
		"deployment": [
			"container"
		]
	},
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
					"port": "inherit"
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
				"workingDir": "/opt/soajs/soajs.deployer/deployer/"
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
				"SOAJS_MONGO_CON_KEEPALIVE" : {
					"type" : "static",
					"value" : "true"
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