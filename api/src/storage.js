const {Storage} = require('@google-cloud/storage');
const {GOOGLE_APPLICATION_CREDENTIALS, DB_BUCKET_NAME, ID_PROJECT} =
	process.env;
const storage = new Storage({
	keyFilename: {
		type: process.env.type,
		project_id: process.env.project_id,
		private_key_id: process.env.private_key_id,
		private_key: process.env.private_key,
		client_email: process.env.client_email,
		client_id: process.env.client_id,
		auth_uri: process.env.auth_uri,
		token_uri: process.env.token_uri,
		auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
		client_x509_cert_url: process.env.client_x509_cert_url,
	},
	projectId: ID_PROJECT,
});

const bucket = storage.bucket(DB_BUCKET_NAME);

module.exports = bucket;
