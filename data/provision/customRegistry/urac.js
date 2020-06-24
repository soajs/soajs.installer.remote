'use strict';
let doc = {
	"_id": "5d7f8e8bedf21900fed08cf6",
	"name": "urac",
	"plugged": true,
	"shared": false,
	"value": {
		"link": {
			"addUser": "https://%URL%/#/setNewPassword",
			"changeEmail": "https://%URL%/#/changeEmail/validate",
			"forgotPassword": "https://%URL%/#/resetPassword",
			"join": "https://%URL%/#/join/validate"
		},
		"mail": {
			"join": {
				"subject": "Welcome to SOAJS",
				"path": "/opt/soajs/node_modules/soajs.urac/mail/urac/join.tmpl"
			},
			"forgotPassword": {
				"subject": "Reset Your Password at SOAJS",
				"path": "/opt/soajs/node_modules/soajs.urac/mail/urac/forgotPassword.tmpl"
			},
			"addUser": {
				"subject": "Account Created at SOAJS",
				"path": "/opt/soajs/node_modules/soajs.urac/mail/urac/addUser.tmpl"
			},
			"changeUserStatus": {
				"subject": "Account Status changed at SOAJS",
				"path": "/opt/soajs/node_modules/soajs.urac/mail/urac/changeUserStatus.tmpl"
			},
			"changeEmail": {
				"subject": "Change Account Email at SOAJS",
				"path": "/opt/soajs/node_modules/soajs.urac/mail/urac/changeEmail.tmpl"
			},
			"pinCode": {
				"subject": "Pin Code at SOAJS",
				"path": "/opt/soajs/node_modules/soajs.urac/mail/urac/pinCode.tmpl"
			},
			"invitePin": {
				"subject": "Pin Code Created at SOAJS",
				"path": "/opt/soajs/node_modules/soajs.urac/mail/urac/inviteCode.tmpl"
			},
			"resetPin": {
				"subject": "Pin Code Reset at SOAJS",
				"path": "/opt/soajs/node_modules/soajs.urac/mail/urac/resetPin.tmpl"
			}
		}
	},
	"created": "DASHBOARD"
};

module.exports = doc;