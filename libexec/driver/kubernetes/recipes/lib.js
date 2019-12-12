"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */


let lib = {
	cleanLabel: (label) => {
		if (!label) {
			return '';
		}
		return label.replace(/\//g, "__slash__");
	}
};
module.exports = lib;