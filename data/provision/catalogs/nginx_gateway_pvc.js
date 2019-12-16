'use strict';

let doc = {
	"_id": "5df3ec10fa3912534948f009",
	"name": "Nginx and gateway with automated ssl as pvc",
	"type": "server",
	"subtype": "nginx",
	"soajs": true,
	"locked": true,
	"description": "Deploy Nginx in front of SOAJS Gateway with automated https certificate. This requires a ReadWriteMany pvc with claim name as nfs-pvc",
	"restriction": {
		"deployment": [
			"container"
		]
	},
	"recipe": {
		"deployOptions": {
			"image": {
				"prefix": "soajsorg",
				"name": "fe",
				"tag": "3.x",
				"pullPolicy": "Always",
				"repositoryType": "public",
				"override": false
			},
			"sourceCode": {
				"custom": {
					"label": "Attach Custom UI",
					"type": "static",
					"repo": "",
					"branch": "",
					"required": false
				}
			},
			"certificates": "none",
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
			"ports": [
				{
					"name": "http",
					"target": 80,
					"isPublished": true,
					"preserveClientIP": true
				},
				{
					"name": "https",
					"target": 443,
					"isPublished": true,
					"preserveClientIP": true
				}
			],
			"voluming": [
				{
					"docker": {},
					"kubernetes": {
						"volume": {
							"name": "soajscert",
							"persistentVolumeClaim": {
								"claimName": "nfs-pvc"
							}
						},
						"volumeMount": {
							"mountPath": "/opt/soajs/certificates/",
							"name": "soajscert"
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
			},
			"allowExposeServicePort": false
		},
		"buildOptions": {
			"env": {
				"SOAJS_ENV": {
					"type": "computed",
					"value": "$SOAJS_ENV"
				},
				"SOAJS_NX_DOMAIN": {
					"type": "computed",
					"value": "$SOAJS_NX_DOMAIN"
				},
				"SOAJS_NX_API_DOMAIN": {
					"type": "computed",
					"value": "$SOAJS_NX_API_DOMAIN"
				},
				"SOAJS_NX_SITE_DOMAIN": {
					"type": "computed",
					"value": "$SOAJS_NX_SITE_DOMAIN"
				},
				"SOAJS_NX_CONTROLLER_NB": {
					"type": "computed",
					"value": "$SOAJS_NX_CONTROLLER_NB"
				},
				"SOAJS_NX_CONTROLLER_IP": {
					"type": "computed",
					"value": "$SOAJS_NX_CONTROLLER_IP_N"
				},
				"SOAJS_NX_CONTROLLER_PORT": {
					"type": "computed",
					"value": "$SOAJS_NX_CONTROLLER_PORT"
				},
				
				"SOAJS_SSL_SECRET": {
					"type": "static",
					"value": "true"
				},
				"SOAJS_SSL_CONFIG": {
					"type": "userInput",
					"label": "SSL information",
					"default": '{"email":"me@email.com" ,"redirect":"false"}',
					"fieldMsg": "Add the SSL certificate email owner and set if you want to redirect http to https"
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
						"node index.js -T nginx -S deploy",
						"node index.js -T nginx -S install",
						"/opt/soajs/soajs.deployer/deployer/bin/nginx.sh"
					]
				}
			}
		}
	},
	"v": 1,
	"ts": new Date().getTime()
};

module.exports = doc;