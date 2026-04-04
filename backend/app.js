const express = require('express');
const cors = require('cors');
const connectDB = require('./src/configs/db');
const roomRoutes = require('./src/routes/roomRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/rooms', roomRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 REST API running at: http://localhost:${PORT}`);
});