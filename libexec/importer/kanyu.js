"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const randomString = require("randomstring");

module.exports = (options) => {
	return {
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