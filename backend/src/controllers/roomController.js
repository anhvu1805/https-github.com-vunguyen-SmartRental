const Room = require('../models/Room');

function normalizeServicesInput(services) {
    if (!services) return [];
    if (Array.isArray(services)) return services;
    if (typeof services === 'object') {
        return Object.values(services).map(String).filter(Boolean);
    }
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

exports.index = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Hàm lưu phòng mới (có xử lý ảnh)
exports.store = async (req, res) => {
    try {
        const { roomNumber, price, status } = req.body;
        const services = req.body.services || req.body['services[]'];
        const image = req.file ? `/uploads/${req.file.filename}` : null;
        const serviceList = normalizeServicesInput(services);

        const newRoom = new Room({ 
            roomNumber, 
            price, 
            status, 
            image,
            services: serviceList
        });
        await newRoom.save();
        res.status(201).json(newRoom);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { roomNumber, price, status } = req.body;
        const services = req.body.services || req.body['services[]'];
        const serviceList = normalizeServicesInput(services);

        const updateData = {
            roomNumber,
            price,
            status,
            services: serviceList
        };

        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedRoom) {
            return res.status(404).json({ message: 'Không tìm thấy phòng' });
        }

        res.json(updatedRoom);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.show = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Không tìm thấy phòng' });
        }
        res.json(room);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.destroy = async (req, res) => {
    try {
        await Room.findByIdAndDelete(req.params.id);
        res.json({ message: "Xóa thành công" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};