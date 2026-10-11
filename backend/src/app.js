const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const Res = require('./utils/Res');

const app = express();

app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: '10kb' }));

app.get('/health', (req, res) => Res.success(res, { uptime: process.uptime() }, 'OK'));
app.use('/api/auth', authRoutes);
app.use('/api/enquiries', enquiryRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
