const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const connectDB = require('./src/configs/db');

const roomRoutes = require('./src/routes/roomRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const userRoutes = require('./src/routes/userRoutes');
const contractRoutes = require('./src/routes/contractRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'SmartRental backend running' });
});

app.get('/api', (req, res) => {
    res.json({ status: 'ok', message: 'SmartRental API is reachable' });
});

app.use('/api/rooms', roomRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
    });
};

startServer().catch((err) => {
    console.error('❌ Không thể khởi động server:', err.message);
    process.exit(1);
});