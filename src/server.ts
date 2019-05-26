import Fastify from 'fastify';
'use strict';

// Instantiate Fastify with some config
const app = Fastify({
	// logger: true,
	pluginTimeout: 10000,
});

// Register your application as a normal plugin.
app.register(require('./index'));

// Start listening.
app.listen(4004, err => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
});
