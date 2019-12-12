"use strict";

const soajs = require('soajs');

module.exports = {
	"getLogger": () => {
		return soajs.core.getLogger("SOAJS Installer", {"formatter": {"levelInString": true, "outputMode": 'short'}, "level": "debug"});
	}
};