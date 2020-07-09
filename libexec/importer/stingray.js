"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const {v4: uuidv4} = require('uuid');

module.exports = (options, data) => {
	return {
		"environment": (doc) => {
			doc.domain = options.nginx.domain;
			doc.sitePrefix = options.nginx.sitePrefix;
			doc.apiPrefix = options.nginx.apiPrefix;
			doc.deployer.selected = "container.kubernetes";
			doc.deployer.container.kubernetes.namespace = options.kubernetes.namespace;
			doc.services.config.key.password = data.keyPassword;
			doc.services.config.cookie.secret = uuidv4();
			doc.services.config.session.secret = uuidv4();
			
			if (options.nginx.sslType === "demo") {
				doc.port = options.nginx.httpPort;
				doc.protocol = "http";
			} else {
				doc.port = options.nginx.httpsPort;
				doc.protocol = "https";
			}
		},
		"infra": (doc) => {
			doc.configuration.url = options.kubernetes.ip;
			doc.configuration.token = options.kubernetes.token;
			doc.configuration.port = options.kubernetes.port;
		}
	};
};