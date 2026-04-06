const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const upload = require('../middlewares/uploadMiddleware');
const verifyToken = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

function normalizeServicesInput(services) {
    if (!services) return [];
    if (Array.isArray(services)) return services.map(String).filter(Boolean);
    if (typeof services === 'object') return Object.values(services).map(String).filter(Boolean);
    if (typeof services === 'string') {
        try {
            const parsed = JSON.parse(services);
            if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
        } catch (err) {
            return services.split(',').map(item => item.trim()).filter(Boolean);
        }
    }
    return [];
}

router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng' });
        res.json(room);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', verifyToken, adminMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { roomNumber, price, status } = req.body;
        const services = req.body.services || req.body['services[]'];
        const serviceList = normalizeServicesInput(services);
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        const newRoom = new Room({ roomNumber, price, status, services: serviceList, image });
        await newRoom.save();
        res.status(201).json(newRoom);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/:id', verifyToken, adminMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { roomNumber, price, status } = req.body;
        const services = req.body.services || req.body['services[]'];
        const serviceList = normalizeServicesInput(services);
        const updateData = { roomNumber, price, status, services: serviceList };
        if (req.file) updateData.image = `/uploads/${req.file.filename}`;

        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedRoom) return res.status(404).json({ message: 'Không tìm thấy phòng' });
        res.json(updatedRoom);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng' });
        res.json({ message: 'Xóa phòng thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;