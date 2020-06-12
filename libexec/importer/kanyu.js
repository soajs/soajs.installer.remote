"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const {v4: uuidv4} = require('uuid');
const randomString = require("randomstring");

module.exports = (options, data) => {
	return {
		"environment": (doc) => {
			doc.domain = options.nginx.domain;
			doc.sitePrefix = options.nginx.sitePrefix;
			doc.apiPrefix = options.nginx.apiPrefix;
			doc.deployer.selected = "container.kubernetes.remote";
			doc.deployer.container.kubernetes.remote.namespace.default = options.kubernetes.namespace;
			doc.deployer.container.kubernetes.remote.nodes = options.kubernetes.ip;
			doc.deployer.container.kubernetes.remote.apiPort = options.kubernetes.port;
			doc.deployer.container.kubernetes.remote.auth.token = options.kubernetes.token;
			doc.services.config.key.password = data.keyPassword;
			doc.services.config.cookie.secret = uuidv4();
			doc.services.config.session.secret = uuidv4();
		},
		"infra": (doc) => {
			doc.api.ipaddress = options.kubernetes.ip;
			doc.api.token = options.kubernetes.token;
			doc.api.port = options.kubernetes.port;
			let name = "soajs" + "local" + randomString.generate({
				length: 13,
				charset: 'alphanumeric',
				capitalization: 'lowercase'
			});
			doc.deployments[0].name = name;
			doc.deployments[0].id = name;
		}
	};
};