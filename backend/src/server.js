const mongoose = require('mongoose');
const config = require('./config');
const connectDB = require('./config/db');
const app = require('./app');

async function start() {
  await connectDB(config.mongoUri);
  const server = app.listen(config.port, () => console.log(`Server running on port ${config.port}`));

  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down`);
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
