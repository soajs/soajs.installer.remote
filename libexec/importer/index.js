"use strict";

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

const crypto = require("crypto");
const {v4: uuidv4} = require('uuid');
const soajs = require('soajs');

let release_specific = {
	"kanyu": require("./kanyu.js"),
	"stingray": require("./stingray.js")
};

module.exports = (options, data, extra) => {
	let catalogs = (doc) => {
		extra.setImageTag(options, doc);
	};
	let customRegistry = (doc) => {
		if (doc.name === "urac") {
			let url = options.nginx.sitePrefix + "." + options.nginx.domain;
			doc.value.link.addUser = doc.value.link.addUser.replace("%URL%", url);
			doc.value.link.changeEmail = doc.value.link.changeEmail.replace("%URL%", url);
			doc.value.link.forgotPassword = doc.value.link.forgotPassword.replace("%URL%", url);
			doc.value.link.join = doc.value.link.join.replace("%URL%", url);
		}
	};
	let environment = (doc) => {
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
	};
	
	let infra = release_specific[options.versions.name](options).infra;
	
	let resources = (doc) => {
		if (doc.name === "dash_cluster") {
			doc.config = {
				"servers": data.profileSecret.servers,
				"credentials": data.profileSecret.credentials,
				"streaming": data.profileSecret.streaming,
				"extraParam": data.profileSecret.extraParam,
				"URLParam": data.profileSecret.URLParam,
			};
		}
	};
	let settings = (doc) => {
		if (doc.type === "installer") {
			doc.releaseInfo = options.versions;
			doc.installerVersion = options.installerVersion;
		}
	};
	let tenants = (doc) => {
		if (doc.code === "DBTN") {
			doc.applications[0].keys[0].extKeys[0].extKey = data.extKey;
			if (options.deployment && options.deployment.config) {
				if (!doc.applications[0].keys[0].config.dashboard.commonFields) {
					doc.applications[0].keys[0].config.dashboard.commonFields = {};
				}
				if (options.deployment.config.hashIterations) {
					doc.applications[0].keys[0].config.dashboard.commonFields.hashIterations = options.deployment.config.hashIterations;
				}
				if (options.deployment.config.optionalAlgorithm) {
					doc.applications[0].keys[0].config.dashboard.commonFields.optionalAlgorithm = options.deployment.config.optionalAlgorithm;
				}
			}
		}
	};
	
	let users = (doc) => {
		let Hasher = soajs.hasher;
		
		let hasherConfig = {};
		let pwd = options.owner.password;
		if (options.deployment && options.deployment.config) {
			if (options.deployment.config.hashIterations) {
				hasherConfig.hashIterations = options.deployment.config.hashIterations;
			}
			if (options.deployment.config.optionalAlgorithm) {
				let hash = crypto.createHash(options.deployment.config.optionalAlgorithm);
				pwd = hash.update(pwd).digest('hex');
			}
		}
		Hasher.init(hasherConfig);
		
		let hashedPwd = Hasher.hash(pwd);
		
		doc.username = options.owner.username;
		doc.password = hashedPwd;
		doc.email = options.owner.email;
	};
	
	return {
		"catalogs": catalogs,
		"customRegistry": customRegistry,
		"environment": environment,
		"infra": infra,
		"resources": resources,
		"settings": settings,
		"tenants": tenants,
		"users": users
	};
};