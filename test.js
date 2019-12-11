const remote = require('./libexec/index.js');

let options = {
	"driverName": "kubernetes",
	"dataPath": "/opt/soajs/node_modules/soajs.installer.remote/data/provision/",
	"importer": require('./../soajs.installer.local/libexec/custom/index.js'),
	"mongo": {
		"external": false
	},
	"kubernetes": {
		"ip": '192.168.64.3',
		"port": 8443,
		"token": 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ikt1alJoMlNpMm1vcEhpZkFqOWpfNWtsMlNQYWNyVlFOcWNvcDFXcUVjY3cifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJkZWZhdWx0Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6ImRlZmF1bHQtdG9rZW4tZjVtcm0iLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiZGVmYXVsdCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjE0YWFhMDVkLTRkNzgtNDc3Zi05MWZmLTkxMTU1OGY1ZDBhZiIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDpkZWZhdWx0OmRlZmF1bHQifQ.eytt7TbuszbGNx0GItCjYNAY3jpGVIMInluP_Yl4ABvQGhN0MwSum2RaBicgtJkGpF4KKgYENA0dhbDDp6ZN7Vvl6Z31gLxMYPkeSxP4HOfct-ERI-lb7NtEjAn65BHDz2gX_N4CA1ykwd7_2vqbiC67l3-OdBvJwdzgmzaNxRgabSheMgBpxhOVPgKtTk9Vahm01UmmTrBGIb-NZAv8LcG72q-njqV0ZS8WS4RMtTSS4sKjrDoPuUaOryXmW7OHUQKvoEGfZAoTHgY17gKZeACenIjoM-Qgk8_Wom2Ai9GGi_ElonpGnMm7l9qX1eBdEMhpsqbEfFqmFPekHsvVlQ'
	},
	"nginx": {
		"domain": "soajs.org",
		"apiPrefix": "dashboard-api",
		"sitePrefix": "dashboard",
		"deployType": "NodePort",
		"sslSecret": true,
		"httpPort": 30080,
		"httpsPort": 30443
	},
	"owner": {
		"email": "team@soajs.org",
		"username": "owner",
		"password": "password"
	}
};

remote.install(options, (error) => {
	if (error)
		console.log(error.message);
});