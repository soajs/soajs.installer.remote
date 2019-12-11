/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

"use strict";

let addUserSchema = {
	"type": "object",
	"required": true,
	"additionalProperties": false,
	"properties": {
		"versions": {
			"type": "object",
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
					"required": true,
					"format": "ipv4"
				},
				"port": {
					"type": "integer",
					"required": true
				},
				"token": {
					"type": "string",
					"required": true
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
					"type": "boolean",
					"required": true
				},
				"httpPort": {
					"type": "integer",
					"required": true
				},
				"httpsPort": {
					"type": "integer",
					"required": true
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
		}
	}
};

module.exports = addUserSchema;