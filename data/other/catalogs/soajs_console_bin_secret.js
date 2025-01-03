'use strict';

let doc = {
	"_id": "5df3ec10fa3912534948effe",
	"name": "SOAJS Console from bin with manual ssl as secret",
	"type": "soajs",
	"subtype": "ui",
	"description": "Deploy SOAJS console UI from binary with manual https certificate as secret",
	"locked": true,
	"recipe": {
		"deployOptions": {
			"image": {
				"prefix": "soajsorg",
				"name": "consoleui",
				"tag": "2.x",
				"pullPolicy": "Always",
				"repositoryType": "public",
				"binary": true,
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
			"settings": {},
			"cmd": {
				"deploy": {
					"command": [
						"bash"
					],
					"args": [
						"-c",
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