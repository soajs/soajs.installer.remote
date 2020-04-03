/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

let schema = {
	"type": "object",
	"required": true,
	"additionalProperties": false,
	"properties": {
		"versions": {
			"type": "object",
			"required": true,
			"properties": {
				"services": {
					"type": "object",
					"required": true,
					"properties": {
						"gateway": {
							"type": "object",
							"required": true,
							"properties": {
								"ver": {
									"type": "string",
									"required": true
								},
								"msVer": {
									"type": "integer",
									"required": true
								}
							}
						},
						"urac": {
							"type": "object",
							"required": true,
							"properties": {
								"ver": {
									"type": "string",
									"required": true
								},
								"msVer": {
									"type": "integer",
									"required": true
								}
							}
						},
						"oauth": {
							"type": "object",
							"required": true,
							"properties": {
								"ver": {
									"type": "string",
									"required": true
								},
								"msVer": {
									"type": "integer",
									"required": true
								}
							}
						},
						"multitenant": {
							"type": "object",
							"required": true,
							"properties": {
								"ver": {
									"type": "string",
									"required": true
								},
								"msVer": {
									"type": "integer",
									"required": true
								}
							}
						},
						"dashboard": {
							"type": "object",
							"required": true,
							"properties": {
								"ver": {
									"type": "string",
									"required": true
								},
								"msVer": {
									"type": "integer",
									"required": true
								}
							}
						},
						"ui": {
							"type": "object",
							"required": true,
							"properties": {
								"ver": {
									"type": "string",
									"required": true
								}
							}
						}
					}
				}
			}
		},
		"installerVersion": {
			"type": "object",
			"required": true
		},
		"cleanDataBefore": {
			"type": "boolean",
			"required": true
		},
		"driverName": {
			"type": "string",
			"enum": ['kubernetes'],
			"required": true
		},
		"dataPath": {
			"type": "string",
			"required": true
		},
		"importer": {
			"type": "object",
			"required": true
		},
		
		"mongo": {
			"type": "object",
			"required": true,
			"additionalProperties": false,
			"properties": {
				"deployType": {
					"type": "string",
					"enum": ['NodePort', 'LoadBalancer'],
					"default": "NodePort",
					"required": false
				},
				"deployIP": {
					"type": "string",
					"required": false
				},
				"port": {
					"type": "integer",
					"required": false
				},
				"external": {
					"type": "boolean",
					"required": true
				},
				"profile": {
					"type": "object",
					"required": false,
					"additionalProperties": false,
					"properties": {
						"servers": {
							"type": "array",
							"required": true,
							"items": {
								"type": "object",
								"minItems": 1,
								"additionalProperties": false,
								"properties": {
									"host": {
										"type": "string",
										"required": true
									},
									"port": {
										"type": "integer",
										"required": true
									}
								}
							}
						},
						"credentials": {
							"type": "object",
							"required": false,
							"additionalProperties": false,
							"properties": {
								"username": {
									"type": "string",
									"required": true
								},
								"password": {
									"type": "string",
									"required": true
								}
							}
						},
						"URLParam": {
							"type": "object",
							"required": false
						}
					}
				}
			}
		},
		"kubernetes": {
			"type": "object",
			"required": true,
			"additionalProperties": false,
			"properties": {
				"ip": {
					"type": "string",
					"required": true
				},
				"port": {
					"type": "integer",
					"required": true
				},
				"token": {
					"type": "string",
					"required": true
				},
				"namespace": {
					"type": "string",
					"required": false
				}
			}
		},
		"nginx": {
			"type": "object",
			"required": true,
			"additionalProperties": false,
			"properties": {
				"domain": {
					"type": "string",
					"required": true
				},
				"apiPrefix": {
					"type": "string",
					"required": true
				},
				"sitePrefix": {
					"type": "string",
					"required": true
				},
				"deployType": {
					"type": "string",
					"enum": ['NodePort', 'LoadBalancer'],
					"required": true
				},
				
				"sslSecret": {
					"type": "object",
					"required": false,
					"additionalProperties": false,
					"properties": {
						"private_key": {
							"type": "string",
							"required": true
						},
						"fullchain_crt": {
							"type": "string",
							"required": true
						}
					}
				},
				
				"httpPort": {
					"type": "integer",
					"required": true
				},
				"httpsPort": {
					"type": "integer",
					"required": true
				},
				"sslType": {
					"type": "string",
					"enum": ['pvc', 'secret', 'demo'],
					"required": true
				},
				"pvcClaimName": {
					"type": "string",
					"required": false
				},
				"sslRedirect": {
					"type": "boolean",
					"required": false
				}
			}
		},
		"owner": {
			"type": "object",
			"required": true,
			"additionalProperties": false,
			"properties": {
				"username": {
					"type": "string",
					"required": true,
					"minLength": 5,
					"maxLength": 50,
					"pattern": /^[a-zA-Z0-9_-]+$/
				},
				"password": {
					"type": "string",
					"required": true
				},
				"email": {
					"type": "string",
					"required": true,
					"format": "email"
				}
			}
		},
		
		"deployment": {
			"type": "object",
			"required": false,
			"additionalProperties": false,
			"properties": {
				"type": {
					"type": "string",
					"enum": ['bin', 'src'],
					"required": false
				},
				"style": {
					"type": "string",
					"enum": ['sem', 'major'],
					"required": false
				},
				"config": {
					"type": "object",
					"required": false,
					"additionalProperties": false,
					"properties": {
						"hashIterations": {
							"type": "integer",
							"required": false,
							"minimum": 12,
							"maximum": 32
						},
						"optionalAlgorithm": {
							"type": "string",
							"required": false
						}
					}
				}
			}
		}
	}
};

module.exports = schema;