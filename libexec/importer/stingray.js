"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

module.exports = (options) => {
	return {
		"infra": (doc) => {
			doc.configuration.url = options.kubernetes.ip;
			doc.configuration.token = options.kubernetes.token;
			doc.configuration.port = options.kubernetes.port;
		}
	};
};