'use strict';

let doc = {
	"_id": "5df3ec10fa3912534948f00f",
	"name": "SOAJS UI Console from src with manual ssl as secret",
	"type": "soajs",
	"subtype": "ui",
	"description": "Deploy SOAJS console UI from source with manual https certificate as secret",
	"locked": true,
	"recipe": {
		"deployOptions": {
			"image": {
				"prefix": "soajsorg",
				"name": "fe",
				"tag": "3.x",
				"pullPolicy": "Always",
				"repositoryType": "public",
				"override": true
			},
			"sourceCode": {},
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
					"kubernetes": {
						"volume": {
							"name": "private-key",
							"secret": {
								"secretName": "private-key"
							}
						},
						"volumeMount": {
							"mountPath": "/opt/soajs/certificates/secret/private_key/",
							"name": "private-key"
						}
					}
				},
				{
					"kubernetes": {
						"volume": {
							"name": "fullchain-crt",
							"secret": {
								"secretName": "fullchain-crt"
							}
						},
						"volumeMount": {
							"mountPath": "/opt/soajs/certificates/secret/fullchain_crt/",
							"name": "fullchain-crt"
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
			"execCommands": {
				"reconfigure": "nginx -s reload"
			}
		},
		"buildOptions": {
			"env": {
				"SOAJS_ENV": {
					"type": "computed",
					"value": "$SOAJS_ENV"
				},
				
				"SOAJS_EXTKEY": {
					"type": "computed",
					"value": "$SOAJS_EXTKEY"
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
				"SOAJS_NX_SITE_FOLDER": {
					"type": "static",
					"value": "/build/"
				},
				"SOAJS_NX_CONTROLLER_IP": {
					"type": "computed",
					"value": "$SOAJS_NX_CONTROLLER_IP"
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
			"settings": {},
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