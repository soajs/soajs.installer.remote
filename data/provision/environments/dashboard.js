'use strict';
let doc = {
	"_id": '55128442e603d7e01ab1688c',
	"code": "DASHBOARD",
	"domain": "%domain%",
	"sitePrefix": "%site%",
	"apiPrefix": "%api%",
	"locked": true,
	"port": 80,
	"protocol": "http",
	"deployer": {
		"type": "container",
		"selected": "%deployDriver%",
		"manual": {
			"nodes": "",
		},
		"container": {
			"docker": {
				"local": {
					"nodes": "",
					"socketPath": "/var/run/docker.sock",
				},
				"remote": {
					"apiPort": "",
					"nodes": "",
					"apiProtocol": "",
					"auth": {
						"token": ""
					}
				}
			},
			"kubernetes": {
				"local": {
					"nodes": "",
					"apiPort": "",
					"namespace": {
						"default": "",
						"perService": false
					},
					"auth": {
						"token": ""
					}
				},
				"remote": {
					"nodes": "%containerNode%",
					"apiPort": "%kubernetesRemotePort%",
					"namespace": {
						"default": "%namespace%",
						"perService": false
					},
					"auth": {
						"token": "%kubetoken%"
					}
				}
			}
		}
	},
	"description": "SOAJS Console Environment",
	"dbs": {
		"config": {
			"prefix": ""
		},
		"databases": {
			"urac": {
				"cluster": "dash_cluster",
				"tenantSpecific": true
			}
		}
	},
	"services": {
		"controller": {
			"maxPoolSize": 100,
			"authorization": true,
			"requestTimeout": 30,
			"requestTimeoutRenewal": 0
		},
		"config": {
			"awareness": {
				"cacheTTL": 1000 * 60 * 60, // 1 hr
				"healthCheckInterval": 1000 * 5, // 5 seconds
				"autoRelaodRegistry": 1000 * 60 * 60 * 24, // 24 hr
				"maxLogCount": 5,
				"autoRegisterService": true
			},
			"key": {
				"algorithm": 'aes256',
				"password": '%keySecret%'
			},
			"logger": {
				"src": false,
				"level": "error",
				"formatter": {
					"levelInString": false,
					"outputMode": "short"
				}
			},
			"cors": {
				"enabled": true,
				"origin": '*',
				"credentials": 'true',
				"methods": 'GET,HEAD,PUT,PATCH,POST,DELETE',
				"headers": 'key,soajsauth,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization,__env',
				"maxage": 1728000
			},
			"oauth": {
				"grants": ['password', 'refresh_token'],
				"debug": false,
				"getUserFromToken": true,
				"accessTokenLifetime": 7200,
				"refreshTokenLifetime": 1209600
			},
			"ports": {
				"controller": 4000,
				"maintenanceInc": 1000,
				"randomInc": 100
			},
			"cookie": {
				"secret": "%cookieSecret%"
			},
			"session": {
				"name": "soajsID",
				"secret": "%sessionSecret%",
				"cookie": {
					"path": '/',
					"httpOnly": true,
					"secure": false,
					"maxAge": null
				},
				"resave": false,
				"saveUninitialized": false,
				"rolling": false,
				"unset": "keep"
			}
		}
	}
};

module.exports = doc;
