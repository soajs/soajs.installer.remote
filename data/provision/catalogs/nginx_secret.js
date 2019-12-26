'use strict';

let doc = {
	"_id": "5df3ec10fa3912534948f00c",
	"name": "Nginx with manual ssl as secret",
	"type": "server",
	"subtype": "nginx",
	"locked": true,
	"description": "Deploy Nginx with manual https certificate as secret",
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
				"override": true
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
					"docker": {},
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
			"allowExposeServicePort": false
		},
		"buildOptions": {
			"env": {
				"SOAJS_ENV": {
					"type": "computed",
					"value": "$SOAJS_ENV"
				},
				"SOAJS_NX_SITE_DOMAIN": {
					"type": "computed",
					"value": "$SOAJS_NX_SITE_DOMAIN"
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