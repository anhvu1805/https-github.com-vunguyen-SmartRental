const Room = require('../models/Room');

exports.index = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.store = async (req, res) => {
    try {
        const newRoom = await Room.create(req.body);
        res.status(201).json(newRoom);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.destroy = async (req, res) => {
    try {
        await Room.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};