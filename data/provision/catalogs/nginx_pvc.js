'use strict';

let doc = {
	"_id": "5df3ec10fa3912534948f00b",
	"name": "Nginx with automated ssl as pvc",
	"type": "frontend",
	"subtype": "nginx",
	"description": "Deploy Nginx with automated https certificate. This requires a ReadWriteMany pvc with claim name as nfs-pvc",
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
			"execCommands": {
				"reconfigure": "nginx -s reload",
				"sslrenew": "node . -T nginx -S certrenew",
				"ssldryrun": "node . -T nginx -S certdryrun",
				"sslinstall": "node . -T nginx -S certinstall"
			}
		},
		"buildOptions": {
			"env": {
				"SOAJS_ENV": {
					"type": "computed",
					"value": "$SOAJS_ENV"
				},
				"SOAJS_NX_SITE_DOMAINS": {
					"type": "userInput",
					"label": "Domains",
					"default": '["www.soajs.org" ,"soajs.org"]',
					"fieldMsg": "Add all the domains in an array"
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